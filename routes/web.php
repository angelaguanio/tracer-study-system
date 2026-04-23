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
use App\Http\Controllers\Admin\AdminOfSurveyResponseController;

use App\Http\Controllers\AnnouncementController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Role-select / root — redirect authenticated users to their dashboard
Route::get('/', function () {
    if (auth()->check()) {
        $role = auth()->user()->user_role;
        if ($role === 'admin') return redirect()->route('admin.dashboard');
        if ($role === 'coordinator') return redirect()->route('coordinator.dashboard');
        if ($role === 'alumna') return redirect()->route('alumna.home');
    }
    return Inertia::render('Auth/Login');
})->name('role.select');


//============= ALUMNA ROUTES =======================
Route::prefix('alumna')->name('alumna.')->group(function () {

    Route::middleware('guest')->group(function () {
        Route::get('/signup', [AlumnaAuthController::class, 'roles'])->name('signup');
        Route::post('/signup', [AlumnaAuthController::class, 'signupAlumna']);
        Route::get('/login', [AlumnaAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AlumnaAuthController::class, 'loginAlumna']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/home', AlumnaHomeController::class)->name('home');
        Route::get('/questionnaire', [QuestionnaireController::class, 'showQuestionnaire'])->name('questionnaire');
        Route::get('/questionnaire/start-survey', [QuestionnaireController::class, 'btnStartSurvey'])->name('start-survey');
        Route::post('/survey', [QuestionnaireController::class, 'store'])->name('survey.store');

        // Announcements
        Route::get('/announcements', [AnnouncementController::class, 'alumna'])->name('announcements');
        Route::get('/announcement/{id}', [AnnouncementController::class, 'showAlumna'])->name('announcement.view');

        // Static pages
        Route::get('/association', fn() => Inertia::render('Alumna/AlumnaAssociation'))->name('association');
        Route::get('/office', fn() => Inertia::render('Alumna/AlumnaOffice'))->name('office');
        Route::get('/contact', fn() => Inertia::render('Alumna/ContactUs'))->name('contact');
        Route::get('/about', fn() => Inertia::render('Alumna/AlumnaAbout'))->name('about');

        // Student profile
        Route::get('/profile/history/{id}', [StudentProfileController::class, 'showHistory'])->name('history.show');
        Route::get('/profile', [StudentProfileController::class, 'show'])->name('profile');
        Route::get('/profile/edit', [StudentProfileController::class, 'edit'])->name('profile.edit');
        Route::match(['put', 'post'], '/profile/edit', [StudentProfileController::class, 'update'])->name('profile.update');

        Route::post('/logout', [AlumnaAuthController::class, 'logoutAlumna'])->name('logout');
    });

    // Survey routes — auth + alumna middleware
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

    //AdminAlumni
    Route::get('/alumni', [AdminAlumniController::class, 'index']) ->name('alumni.index');

    Route::get('/alumni/{id}', [AdminAlumniController::class, 'show']) ->name('alumni.show');


    //AdminSurveyResponse

        Route::get('/survey-response', [AdminOfSurveyResponseController::class, 'index'])
            ->name('survey-response.index');

        Route::get('/survey-response/{id}', [AdminOfSurveyResponseController::class, 'show'])
            ->name('survey-response.show');
        
        Route::get('/survey-response/{id}/not-complete', [AdminOfSurveyResponseController::class, 'notComplete'])
       ->name('survey-response.not-complete');

        Route::delete('/survey-response/{id}', [AdminOfSurveyResponseController::class, 'destroy'])
            ->name('survey-response.destroy');

        Route::get('/logout', [AdminAuthController::class, 'logoutAdmin'])->name('logout');
        // Route::get('/logout', [AdminAuthController::class, 'logoutAdmin'])->name('logout');
        Route::post('/logout', [AdminAuthController::class, 'logoutAdmin'])->name('logout');

        // Alumni
        Route::get('/alumni', [AdminAlumniController::class, 'index'])->name('alumni.index');
        Route::get('/alumni/{id}', [AdminAlumniController::class, 'show'])->name('alumni.show');

        // Individual email (modal-based, no GET form page needed)
        Route::post('/alumni/{id}/email', [AdminAlumniController::class, 'sendEmail'])->name('alumni.email.send');

        // Bulk email
        Route::post('/alumni/email/bulk', [AdminAlumniController::class, 'sendBulkEmail'])->name('alumni.email.bulk');

        // Announcements
        Route::get('/announcement', [AnnouncementController::class, 'index'])->name('announcement.index');
        Route::get('/announcement/create', [AnnouncementController::class, 'create'])->name('announcement.create');
        Route::post('/announcement', [AnnouncementController::class, 'store'])->name('announcement.store');
        Route::get('/announcement/{announcement}', [AnnouncementController::class, 'show'])->name('admin.announcement.show');
        Route::get('/announcement/{announcement}/edit', [AnnouncementController::class, 'edit'])->name('announcement.edit');
        Route::put('/announcement/{announcement}', [AnnouncementController::class, 'update'])->name('announcement.update');
        Route::delete('/announcement/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcement.destroy');

        // Analytics
        Route::get('/analytics', function () {
            $surveys = \App\Models\Survey::withCount('sections')->orderBy('created_at', 'desc')->get();
            return Inertia::render('Admin/AnalyticsIndex', ['surveys' => $surveys]);
        })->name('analytics');

        Route::get('/analytics/employment-location', [SurveyAnalyticsController::class, 'employmentLocationAnalytics'])
            ->name('analytics.employment-location');

        Route::get('/surveys/{survey}/analytics', [SurveyAnalyticsController::class, 'show'])->name('surveys.analytics');

        // Employment location analytics
        Route::get('/analytics/employment-location', [SurveyAnalyticsController::class, 'employmentLocationAnalytics'])
            ->name('analytics.employment-location');
    });

    // Survey management — auth + admin middleware
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::post('/surveys', [SurveyController::class, 'store'])->name('surveys.store');
        Route::put('/surveys/{survey}', [SurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/surveys/{survey}', [SurveyController::class, 'destroy'])->name('surveys.destroy');
        Route::get('/surveys/{survey}/builder', [SurveyController::class, 'builder'])->name('surveys.builder');
        Route::get('/surveys/{survey}/analytics/data', [SurveyAnalyticsController::class, 'show'])->name('surveys.analytics.data');

        // Sections
        Route::post('/surveys/{survey}/sections', [SectionController::class, 'store'])->name('sections.store');
        Route::put('/surveys/{survey}/sections/reorder', [SectionController::class, 'reorder'])->name('sections.reorder');
        Route::put('/sections/{section}', [SectionController::class, 'update'])->name('sections.update');
        Route::delete('/sections/{section}', [SectionController::class, 'destroy'])->name('sections.destroy');

        // Questions
        Route::post('/sections/{section}/questions', [QuestionController::class, 'store'])->name('questions.store');
        Route::put('/sections/{section}/questions/reorder', [QuestionController::class, 'reorder'])->name('questions.reorder');
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
        Route::post('/logout', [CoordinatorAuthController::class, 'logoutCoordinator'])->name('logout');
    });
});
