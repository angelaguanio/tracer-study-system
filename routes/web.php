<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\Auth\AlumnaAuthController;
use App\Http\Controllers\Auth\CoordinatorAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\AlumnaHomeController;
use App\Http\Controllers\Coordinator\CoordinatorDashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\SurveyAnalyticsController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SubheadingController;
use App\Http\Controllers\SurveyResponseController;
use App\Http\Controllers\Admin\AdminAlumniController;
use App\Http\Controllers\Admin\AdminOfSurveyResponseController;
use App\Http\Controllers\Coordinator\CoordinatorOfSurveyResponseController;
use App\Http\Controllers\Admin\AdminAlumniCoordinatorController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\InquiriesController;
use App\Http\Controllers\Coordinator\CoordinatorAlumniController;
use App\Http\Controllers\Coordinator\CoordinatorProfileController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Broadcasting auth route is registered via withBroadcasting() in bootstrap/app.php
// with ['middleware' => ['web', 'auth']] to ensure unauthenticated requests are rejected.

// Session keep-alive endpoint
Route::get('/api/keep-alive', function () {
    return response()->json(['status' => 'ok']);
})->middleware('web');

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

        //forgot & reset pass routes
        Route::get('/forgot-password', function () {
            return \Inertia\Inertia::render('Auth/ForgotPassword');
        })->name('forgot-password');
        Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');
        Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
        Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');
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
        Route::get('/about', fn() => Inertia::render('Alumna/AlumnaAbout'))->name('about');

        //contact us page
        Route::get('/contact', [InquiriesController::class, 'alumniIndex'])->name('contact');
        Route::post('/contact', [InquiriesController::class, 'store'])->name('contact.store');

        // Student profile
        Route::get('/profile/history/{id}', [StudentProfileController::class, 'showHistory'])->name('history.show');
        Route::get('/profile', [StudentProfileController::class, 'show'])->name('profile');
        Route::get('/profile/edit', [StudentProfileController::class, 'edit'])->name('profile.edit');
        Route::match(['put', 'post'], '/profile/edit', [StudentProfileController::class, 'update'])->name('profile.update');

        //inquiries
        Route::get('/inquiries', [InquiriesController::class, 'alumniInquiriesList'])->name('inquiries.index');
        Route::get('/inquiries/{id}', [InquiriesController::class, 'alumniShow'])->name('inquiries.show');
        Route::post('/inquiries/{id}/reply', [InquiriesController::class, 'reply'])->name('inquiries.reply');

        Route::match(['get', 'post'], '/logout', [AlumnaAuthController::class, 'logoutAlumna'])->name('logout');
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

    //guest onlyy
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'loginAdmin']);

    });

    //AUTH ADMIN
    Route::middleware('auth')->group(function () {

        Route::get('/dashboard', AdminDashboardController::class)
            ->name('dashboard');

        Route::match(['get', 'post'], '/logout', [AdminAuthController::class, 'logoutAdmin'])
            ->name('logout');

        // ANNOUNCEMENT CRUD
        Route::get('/announcement', [AnnouncementController::class, 'index'])
            ->name('announcement.index');

        Route::get('/announcement/create', [AnnouncementController::class, 'create'])
            ->name('announcement.create');

        Route::post('/announcement', [AnnouncementController::class, 'store'])
            ->name('announcement.store');

        Route::get('/announcement/{announcement}', [AnnouncementController::class, 'show'])
            ->name('announcement.show');

        Route::get('/announcement/{announcement}/edit', [AnnouncementController::class, 'edit'])
            ->name('announcement.edit');

        Route::put('/announcement/{announcement}', [AnnouncementController::class, 'update'])
            ->name('announcement.update');

        Route::delete('/announcement/{announcement}', [AnnouncementController::class, 'destroy'])
            ->name('announcement.destroy');

        // APPROVAL SYSTEM
        Route::put('/announcement/{announcement}/approve', [AnnouncementController::class, 'approve'])
            ->name('announcement.approve');

        Route::put('/announcement/{announcement}/reject', [AnnouncementController::class, 'reject'])
            ->name('announcement.reject');

        //AdminAlumni
        Route::get('/alumni', [AdminAlumniController::class, 'index']) ->name('alumni.index');

        Route::get('/alumni/{id}', [AdminAlumniController::class, 'show']) ->name('alumni.show');

        Route::get('/admin/alumni', [AdminAlumniController::class, 'index'])
            ->name('admin.alumni.index');

        Route::get('/admin/alumni/{id}/profile', [AdminAlumniController::class, 'show'])
            ->name('admin.alumni.show');

        Route::get('/alumni/{id}', [AdminAlumniController::class, 'show'])
            ->name('alumni.show');

            //Send email (individual — handled via modal, route kept for controller compatibility)
        Route::post('/alumni/{id}/email', [AdminAlumniController::class, 'sendEmail'])
            ->name('alumni.email.send');

            // Bulk email (selected IDs or all alumni)
        Route::post('/alumni/email/bulk', [AdminAlumniController::class, 'sendBulkEmail'])
            ->name('alumni.email.bulk');

        //AdminSurveyResponse
        Route::get('/survey-response', [AdminOfSurveyResponseController::class, 'index'])
            ->name('admin.survey-response.index');

        Route::get('/survey-response/{id}', [AdminOfSurveyResponseController::class, 'show'])
            ->name('admin.survey-response.show');

        // Route para sa COMPLETED response
        Route::get('/survey-response/{surveyId}/{userId}', [AdminOfSurveyResponseController::class, 'viewUserResponse'])
            ->name('admin.survey-response.view');

        // Route para sa NOT COMPLETED response
        Route::get('/survey-response/{surveyId}/{userId}/not-complete', [AdminOfSurveyResponseController::class, 'notComplete'])
            ->name('admin.survey-response.not-complete');

        Route::delete('/survey-response/{surveyId}/{userId}', [AdminOfSurveyResponseController::class, 'destroy'])
            ->name('survey-response.destroy');

 
        // Alumni
        Route::get('/alumni', [AdminAlumniController::class, 'index'])->name('alumni.index');
        Route::get('/alumni/{id}', [AdminAlumniController::class, 'show'])->name('alumni.show');

        // Individual email (modal-based, no GET form page needed)
        Route::post('/alumni/{id}/email', [AdminAlumniController::class, 'sendEmail'])->name('alumni.email.send');

        // Bulk email
        Route::post('/alumni/email/bulk', [AdminAlumniController::class, 'sendBulkEmail'])->name('alumni.email.bulk');
  
        //Inquiries
        Route::get('/inquiries', [InquiriesController::class, 'adminIndex'])->name('inquiries.index');
        Route::patch('/inquiries/{id}', [InquiriesController::class, 'update'])->name('inquiries.update');
        Route::post('/inquiries/{id}/reply', [InquiriesController::class, 'reply'])->name('inquiries.reply');

        // Alumni Coordinators            
        Route::get('/alumni-coordinators', [AdminAlumniCoordinatorController::class, 'index']);
        Route::post('/alumni-coordinators', [AdminAlumniCoordinatorController::class, 'store']);
        Route::get('/alumni-coordinators/{alumni_coordinator}', [AdminAlumniCoordinatorController::class, 'show']);
        Route::put('/alumni-coordinators/{alumni_coordinator}', [AdminAlumniCoordinatorController::class, 'update']);
        Route::delete('/alumni-coordinators/{alumni_coordinator}', [AdminAlumniCoordinatorController::class, 'destroy']);

          // Analytics
       Route::get('/analytics', function () {
        // Only admins can access analytics
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Only admins can access survey analytics.');
        }

        $surveys = \App\Models\Survey::withCount('sections')
            ->orderBy('created_at', 'desc')
            ->paginate(5)
            ->through(fn ($s) => [
                'id'              => $s->id,
                'title'           => $s->title,
                'status'          => $s->status,
                'sections_count'  => $s->sections_count,
                'is_tracer_study' => (bool) $s->is_tracer_study,
            ])
            ->withQueryString();

        return Inertia::render('Admin/AnalyticsIndex', [
            'surveys' => $surveys,
        ]);
    })->name('analytics');

        Route::get('/analytics/employment-location', [SurveyAnalyticsController::class, 'employmentLocationAnalytics'])
            ->name('analytics.employment-location');

            
        Route::get('/analytics/{survey}', [SurveyAnalyticsController::class, 'show'])->name('analytics.show');
        Route::get('/analytics/{survey}/download', [SurveyAnalyticsController::class, 'downloadAnalytics'])->name('analytics.download');
        Route::get('/analytics/{survey}/cect', [\App\Http\Controllers\CectSurveyAnalyticsController::class, 'show'])->name('analytics.cect-show');
        Route::get('/analytics/{survey}/cect/download', [\App\Http\Controllers\CectSurveyAnalyticsController::class, 'download'])->name('analytics.cect-download');
        // Employment location analytics
        Route::get('/analytics/employment-location', [SurveyAnalyticsController::class, 'employmentLocationAnalytics'])
            ->name('analytics.employment-location');
        });

        Route::get('/surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::post('/surveys', [SurveyController::class, 'store'])->name('surveys.store');
        Route::put('/surveys/{survey}', [SurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/surveys/{survey}', [SurveyController::class, 'destroy'])->name('surveys.destroy');
        Route::patch('/surveys/{survey}/archive', [SurveyController::class, 'archive'])->name('surveys.archive');
        Route::patch('/surveys/{survey}/unarchive', [SurveyController::class, 'unarchive'])->name('surveys.unarchive');
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

        // Subheadings
        Route::post('/sections/{section}/subheadings', [SubheadingController::class, 'store'])->name('subheadings.store');
        Route::put('/sections/{section}/subheadings/reorder', [SubheadingController::class, 'reorder'])->name('subheadings.reorder');
        Route::put('/subheadings/{subheading}', [SubheadingController::class, 'update'])->name('subheadings.update');
        Route::delete('/subheadings/{subheading}', [SubheadingController::class, 'destroy'])->name('subheadings.destroy');


    });



//============== COORDINATOR ROUTES =========================
Route::prefix('coordinator')->name('coordinator.')->group(function () {

    Route::middleware('guest')->group(function () {
        Route::get('/login', [CoordinatorAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [CoordinatorAuthController::class, 'loginCoordinator']);
    });

    Route::middleware('auth')->group(function () {
        Route::post('/change-password', [CoordinatorAuthController::class, 'changePassword'])->name('change-password');
        Route::get('/change-password', [CoordinatorAuthController::class, 'showChangePassword'])->name('show-change-password');
        
        Route::get('/dashboard', CoordinatorDashboardController::class)->name('dashboard');
        Route::get('/profile', [CoordinatorProfileController::class, 'show'])->name('profile');
        Route::get('/alumni', [CoordinatorAlumniController::class, 'index'])->name('alumni.index');
        Route::get('/alumni/{id}', [CoordinatorAlumniController::class, 'show'])->name('alumni.show');
        Route::match(['get', 'post'], '/logout', [CoordinatorAuthController::class, 'logoutCoordinator'])->name('logout');

        // Coordinator Analytics Index
        Route::get('/analytics', function () {
            $user = auth()->user();
            $surveys = \App\Models\Survey::withCount(['sections', 'responses'])
                ->where('created_by', $user->id)
                ->whereNull('archived_at')
                ->whereHas('responses')
                ->orderBy('created_at', 'desc')
                ->paginate(5)
                ->withQueryString();
            return \Inertia\Inertia::render('Coordinator/CoordinatorAnalyticsIndex', [
                'surveys' => $surveys,
            ]);
        })->name('analytics');
        
        Route::get('/analytics/{survey}/cect', [\App\Http\Controllers\CectSurveyAnalyticsController::class, 'show'])
            ->name('analytics.cect-show');
        Route::get('/analytics/{survey}/cect/download', [\App\Http\Controllers\CectSurveyAnalyticsController::class, 'download'])
            ->name('analytics.cect-download');

        // Survey Response (Coordinator)
        Route::get('/survey-response', [CoordinatorOfSurveyResponseController::class, 'index'])
            ->name('survey-response.index');

        Route::get('/survey-response/{id}', [CoordinatorOfSurveyResponseController::class, 'show'])
            ->name('survey-response.show');

        // Completed response
        Route::get('/survey-response/{surveyId}/{userId}', [CoordinatorOfSurveyResponseController::class, 'viewUserResponse'])
            ->name('survey-response.view');

        // Not completed response
        Route::get('/survey-response/{surveyId}/{userId}/not-complete', [CoordinatorOfSurveyResponseController::class, 'notComplete'])
            ->name('survey-response.not-complete');

        Route::delete('/survey-response/{surveyId}/{userId}', [CoordinatorOfSurveyResponseController::class, 'destroy'])
            ->name('survey-response.destroy');

        // ANNOUNCEMENT CRUD ONLY

        // LIST
        Route::get('/announcement', [AnnouncementController::class, 'coordinatorIndex'])
            ->name('announcement.index');

        // CREATE
        Route::get('/announcement/create', [AnnouncementController::class, 'create'])   
            ->name('announcement.create');

        // STORE (pending)
        Route::post('/announcement', [AnnouncementController::class, 'store'])
            ->name('announcement.store');

        //  VIEW SINGLE ANNOUNCEMENT
        Route::get('/announcement/{announcement}', [AnnouncementController::class, 'show'])
            ->name('announcement.show');

        // EDIT
        Route::get('/announcement/{announcement}/edit', [AnnouncementController::class, 'edit'])
            ->name('announcement.edit');

        // UPDATE
        Route::put('/announcement/{announcement}', [AnnouncementController::class, 'update'])
            ->name('announcement.update');

        // DELETE
        Route::delete('/announcement/{announcement}', [AnnouncementController::class, 'destroy'])
            ->name('announcement.destroy');

        //inquiries
        Route::get('/inquiries', [InquiriesController::class, 'coordIndex'])->name('inquiries.index');
        Route::patch('/inquiries/{id}', [InquiriesController::class, 'update'])->name('inquiries.update');
        Route::post('/inquiries/{id}/reply', [InquiriesController::class, 'reply'])->name('inquiries.reply');

        // Survey Builder for Coordinators
        Route::get('/surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::post('/surveys', [SurveyController::class, 'store'])->name('surveys.store');
        Route::put('/surveys/{survey}', [SurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/surveys/{survey}', [SurveyController::class, 'destroy'])->name('surveys.destroy');
        Route::patch('/surveys/{survey}/archive', [SurveyController::class, 'archive'])->name('surveys.archive');
        Route::patch('/surveys/{survey}/unarchive', [SurveyController::class, 'unarchive'])->name('surveys.unarchive');
        Route::get('/surveys/{survey}/builder', [SurveyController::class, 'builder'])->name('surveys.builder');
        

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

        // Subheadings
        Route::post('/sections/{section}/subheadings', [SubheadingController::class, 'store'])->name('subheadings.store');
        Route::put('/sections/{section}/subheadings/reorder', [SubheadingController::class, 'reorder'])->name('subheadings.reorder');
        Route::put('/subheadings/{subheading}', [SubheadingController::class, 'update'])->name('subheadings.update');
        Route::delete('/subheadings/{subheading}', [SubheadingController::class, 'destroy'])->name('subheadings.destroy');
    });
});


//============== CHAT ROUTES =========================
Route::middleware(['auth', 'chat.participant'])->group(function () {
    Route::get('/chat/conversations', [ChatController::class, 'index']);
    Route::get('/chat/conversations/{conversation}/messages', [ChatController::class, 'messages']);
    Route::post('/chat/messages', [ChatController::class, 'store']);
    Route::post('/chat/conversations/{conversation}/read', [ChatController::class, 'markRead']);
});

// routes/web.php (Inertia uses web routes)
Route::middleware(['auth'])->prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);         // paginated list
    Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/read-all', [NotificationController::class, 'markAllRead']);
});