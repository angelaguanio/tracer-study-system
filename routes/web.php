<?php

use App\Http\Controllers\Auth\AlumnaAuthController;
use App\Http\Controllers\Auth\CoordinatorAuthController;
use App\Http\Controllers\AlumnaHomeController;
use App\Http\Controllers\CoordinatorDashboardController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\SurveyAnalyticsController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SurveyResponseController;

use App\Http\Controllers\AnnouncementController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Render login selection page (guest)
Route::get('/', function () {
    if (auth()->check()) {
        $role = auth()->user()->user_role;
        if ($role === 'coordinator') return redirect()->route('coordinator.dashboard');
        if ($role === 'alumna') return redirect()->route('alumna.home');
    }
    return Inertia::render('Auth/Login');
})->name('role.select');

//============= ALUMNA ROUTES =======================
Route::prefix('alumna')->name('alumna.')->group(function () {

    // Guest-only routes
    Route::middleware('guest')->group(function () {
        // signup
        Route::get('/signup', [AlumnaAuthController::class, 'roles'])->name('signup');
        Route::post('/signup', [AlumnaAuthController::class, 'signupAlumna']);

        // login
        Route::get('/login', [AlumnaAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AlumnaAuthController::class, 'loginAlumna']);
    });

    // Authenticated-only routes
    Route::middleware('auth')->group(function () {

        // home page
        Route::get('/home', AlumnaHomeController::class)->name('home');

        // questionnaire page
        Route::get('/questionnaire', [QuestionnaireController::class, 'showQuestionnaire'])->name('questionnaire');

        // questionnaire btn
        Route::get('/questionnaire/start-survey', [QuestionnaireController::class, 'btnStartSurvey'])->name('start-survey');

        //store the survey answers
        Route::post('/survey', [QuestionnaireController::class, 'store'])->name('survey.store');

        //announcement
        Route::get('/announcements', function () {return Inertia::render('Alumna/AlumnaAnnouncements'); })->name('announcements');

        //association
        Route::get('/association', function () { return Inertia::render('Alumna/AlumnaAssociation'); })->name('association');

        //office
        Route::get('/office', function () { return Inertia::render('Alumna/AlumnaOffice'); })->name('office');

        //contact us
        Route::get('/contact', function () {return Inertia::render('Alumna/ContactUs'); })->name('contact');

         // about page 
        Route::get('/about', function () { return Inertia::render('Alumna/AlumnaAbout'); })->name('about');
        
        // logout
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

// Public Alumna announcements
    Route::get('/alumna/announcements', [AnnouncementController::class, 'alumna']) ->name('alumna.announcements');

//============== COORDINATOR ROUTES =========================
Route::prefix('coordinator')->name('coordinator.')->group(function () {
    // Guest-only routes
    Route::middleware('guest')->group(function () {
        Route::get('/login', [CoordinatorAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [CoordinatorAuthController::class, 'loginCoordinator']);
    });

    // Authenticated-only routes
    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', CoordinatorDashboardController::class)->name('dashboard');
        Route::get('/logout', [CoordinatorAuthController::class, 'logoutCoordinator'])->name('logout');
        Route::post('/logout', [CoordinatorAuthController::class, 'logoutCoordinator'])->name('logout');

      //announcement
        Route::get('/announcement/create', function () { return Inertia::render('Coordinator/CoordinatorAnnouncementCreate'); })->name('announcement/create');
        Route::get('/announcement/view', function () { return Inertia::render('Coordinator/CoordinatorAnnouncementView'); })->name('announcement/view');
        Route::get('announcement/edit', function () { return Inertia::render('Coordinator/CoordinatorAnnouncementEdit'); })->name('announcement/edit');
        Route::get('/announcement', function () { return Inertia::render('Coordinator/CoordinatorAnnouncement'); })->name('announcement');

        //mga inadd ko (reygie)
        // INDEX
        Route::get('/announcement', [AnnouncementController::class, 'index']) ->name('announcement.index'); 
        // CREATE 
        Route::get('/announcement/create', [AnnouncementController::class, 'create']) ->name('announcement.create'); 
        // STORE 
        Route::post('/announcement', [AnnouncementController::class, 'store']) ->name('announcement.store'); 
        // VIEW
        Route::get('/announcement/{announcement}', [AnnouncementController::class, 'show']) ->name('coordinator.announcement.show');
        //EDIT
        Route::get('/announcement/{announcement}/edit', [AnnouncementController::class, 'edit']) ->name('announcement.edit');
        // UPDATE
        Route::put('/announcement/{announcement}', [AnnouncementController::class, 'update'])->name('announcement.update');        
        // DELETE
        Route::delete('/announcement/{announcement}', [AnnouncementController::class, 'destroy']) ->name('announcement.destroy');

        // Analytics index — list of surveys to pick from
        Route::get('/analytics', function () {
            $surveys = \App\Models\Survey::withCount('sections')->orderBy('created_at', 'desc')->get();
            return Inertia::render('Coordinator/AnalyticsIndex', ['surveys' => $surveys]);
        })->name('analytics');

        // Survey analytics (legacy route kept for compatibility)
        Route::get('/surveys/{survey}/analytics', [SurveyAnalyticsController::class, 'show'])->name('surveys.analytics');
    });

    // Survey management routes — auth + coordinator middleware
    Route::middleware(['auth', 'coordinator'])->group(function () {
        // Survey CRUD
        Route::get('/surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::post('/surveys', [SurveyController::class, 'store'])->name('surveys.store');
        Route::put('/surveys/{survey}', [SurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/surveys/{survey}', [SurveyController::class, 'destroy'])->name('surveys.destroy');

        // Survey Builder (Inertia page)
        Route::get('/surveys/{survey}/builder', [SurveyController::class, 'builder'])->name('surveys.builder');

        // Analytics
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
