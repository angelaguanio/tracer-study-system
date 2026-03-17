<?php

use App\Http\Controllers\Auth\AlumnaAuthController;
use App\Http\Controllers\Auth\CoordinatorAuthController;
use App\Http\Controllers\AlumnaHomeController;
use App\Http\Controllers\CoordinatorDashboardController;
use App\Http\Controllers\QuestionnaireController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Render login selection page (guest)
Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Auth/Login');
    })->name('role.select');
    
    // Add fallback login route
    Route::get('/login', function () {
        return redirect()->route('alumna.login');
    })->name('login');
});

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
        
        // about page 
        Route::get('/about', function () {
            return Inertia::render('Alumna/AlumnaAbout');
        })->name('about');
        
        // announcements
        Route::get('/announcements', function () {
            return Inertia::render('Alumna/AlumnaAnnouncements');
        })->name('announcements');
        
        // logout
        Route::get('/logout', [AlumnaAuthController::class, 'logoutAlumna'])->name('logout');
    });
});

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
    });
});