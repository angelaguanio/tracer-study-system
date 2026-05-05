<?php

use App\Http\Controllers\Auth\AlumnaAuthController;
use App\Http\Controllers\Auth\CoordinatorAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\AlumnaHomeController;
use App\Http\Controllers\CoordinatorDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\SurveyAnalyticsController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SurveyResponseController;
use App\Http\Controllers\AdminAlumniController;
use App\Http\Controllers\AnnouncementController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('role.select');


//============= ALUMNA ROUTES =======================
Route::prefix('alumna')->name('alumna.')->group(function () {

    // Guest-only routes
    Route::middleware('guest')->group(function () {
        Route::get('/signup', [AlumnaAuthController::class, 'roles'])->name('signup');
        // Standardized to English logic
        Route::post('/signup', [AlumnaAuthController::class, 'signupAlumna']);
        Route::get('/login', [AlumnaAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AlumnaAuthController::class, 'loginAlumna']);
    });

    // Authenticated-only routes
    Route::middleware('auth')->group(function () {
        Route::get('/home', AlumnaHomeController::class)->name('home');
        Route::get('/questionnaire', [QuestionnaireController::class, 'showQuestionnaire'])->name('questionnaire');
        Route::get('/questionnaire/start-survey', [QuestionnaireController::class, 'btnStartSurvey'])->name('start-survey');
        Route::post('/survey', [QuestionnaireController::class, 'store'])->name('survey.store');
        
        // Announcements
        Route::get('/announcements', [AnnouncementController::class, 'alumna'])->name('announcements');
        Route::get('/announcement/{id}', [AnnouncementController::class, 'showAlumna'])->name('announcement.view');

        // Static Pages
        Route::get('/association', function () { return Inertia::render('Alumna/AlumnaAssociation'); })->name('association');
        Route::get('/office', function () { return Inertia::render('Alumna/AlumnaOffice'); })->name('office');
        Route::get('/contact', function () { return Inertia::render('Alumna/ContactUs'); })->name('contact');
        Route::get('/about', function () { return Inertia::render('Alumna/AlumnaAbout'); })->name('about');

        // Student Profile
        Route::get('/profile/history/{id}', [StudentProfileController::class, 'showHistory'])->name('history.show');
        Route::get('/profile', [StudentProfileController::class, 'show'])->name('profile');
        Route::get('/profile/edit', [StudentProfileController::class, 'edit'])->name('profile.edit');
        
        Route::match(['put', 'post'], '/profile/edit', [StudentProfileController::class, 'update'])->name('profile.update');

        Route::post('/logout', [AlumnaAuthController::class, 'logoutAlumna'])->name('logout');
    });

    // Survey routes
    Route::middleware(['auth', 'alumna'])->group(function () {
        Route::get('/surveys', [SurveyResponseController::class, 'index'])->name('surveys.index');
        Route::get('/surveys/{survey}', [SurveyResponseController::class, 'show'])->name('surveys.show');
        Route::post('/surveys/{survey}/draft', [SurveyResponseController::class, 'saveSection'])->name('surveys.draft');
        Route::post('/surveys/{survey}/submit', [SurveyResponseController::class, 'submit'])->name('surveys.submit');
    });
});


//============== ADMIN ROUTES =========================
Route::prefix('admin')->name('admin.')->group(function () {
    
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'loginAdmin']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
        Route::get('/alumni', [AdminAlumniController::class, 'index'])->name('alumni.index');
        Route::get('/alumni/{id}', [AdminAlumniController::class, 'show'])->name('alumni.show');
        Route::post('/logout', [AdminAuthController::class, 'logoutAdmin'])->name('logout');

        // Announcement CRUD
        Route::get('/announcement', [AnnouncementController::class, 'index'])->name('announcement.index'); 
        Route::get('/announcement/create', [AnnouncementController::class, 'create'])->name('announcement.create'); 
        Route::post('/announcement', [AnnouncementController::class, 'store'])->name('announcement.store'); 
        Route::get('/announcement/{announcement}', [AnnouncementController::class, 'show'])->name('announcement.show');
        Route::get('/announcement/{announcement}/edit', [AnnouncementController::class, 'edit'])->name('announcement.edit');
        Route::put('/announcement/{announcement}', [AnnouncementController::class, 'update'])->name('announcement.update');        
        Route::delete('/announcement/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcement.destroy');

        // Analytics
        Route::get('/analytics', function () {
            $surveys = \App\Models\Survey::withCount('sections')->orderBy('created_at', 'desc')->get();
            return Inertia::render('Admin/AnalyticsIndex', ['surveys' => $surveys]);
        })->name('analytics');

        Route::get('/surveys/{survey}/analytics', [SurveyAnalyticsController::class, 'show'])->name('surveys.analytics');
    });

    // Survey Management
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::post('/surveys', [SurveyController::class, 'store'])->name('surveys.store');
        Route::put('/surveys/{survey}', [SurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/surveys/{survey}', [SurveyController::class, 'destroy'])->name('surveys.destroy');
        Route::get('/surveys/{survey}/builder', [SurveyController::class, 'builder'])->name('surveys.builder');
        // FIXED: Consistent analytics data route
        Route::get('/surveys/{survey}/analytics/data', [SurveyAnalyticsController::class, 'show'])->name('surveys.analytics.data');

        // Sections & Questions
        Route::post('/surveys/{survey}/sections', [SectionController::class, 'store'])->name('sections.store');
        Route::put('/surveys/{survey}/sections/reorder', [SectionController::class, 'reorder'])->name('sections.reorder');
        Route::put('/sections/{section}', [SectionController::class, 'update'])->name('sections.update');
        Route::delete('/sections/{section}', [SectionController::class, 'destroy'])->name('sections.destroy');
        Route::post('/sections/{section}/questions', [QuestionController::class, 'store'])->name('questions.store');
        Route::put('/sections/{section}/questions/reorder', [QuestionController::class, 'reorder'])->name('questions.reorder');
        // Standardized English naming
        Route::put('/questions/{question}', [QuestionController::class, 'update'])->name('questions.update');
        Route::put('/questions/{question}/move', [QuestionController::class, 'move'])->name('questions.move');
        Route::delete('/questions/{question}', [QuestionController::class, 'destroy'])->name('questions.destroy');
    });
});


//============== COORDINATOR ROUTES =========================
Route::prefix('coordinator')->name('coordinator.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [CoordinatorAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [CoordinatorAuthController::class, 'loginCoordinator']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', CoordinatorDashboardController::class)->name('dashboard');
        Route::get('/alumni', [AdminAlumniController::class, 'index'])->name('alumni.index');
        Route::get('/alumni/{id}', [AdminAlumniController::class, 'show'])->name('alumni.show');
        Route::get('/surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::get('/analytics', [SurveyAnalyticsController::class, 'index'])->name('analytics.index');
        Route::post('/logout', [CoordinatorAuthController::class, 'logoutCoordinator'])->name('logout');
    });
});