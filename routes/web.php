<?php

use App\Http\Controllers\Auth\AlumnaAuthController;
use App\Http\Controllers\Auth\CoordinatorAuthController;
use App\Http\Controllers\AlumnaHomeController;
use App\Http\Controllers\CoordinatorDashboardController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Render login selection page (guest)
Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Auth/Login');
    })->name('role.select');
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

        // logout
        Route::get('/logout', [AlumnaAuthController::class, 'logoutAlumna'])->name('logout');
        //announcement
        Route::get('/announcements', function () {return Inertia::render('Alumna/AlumnaAnnouncements'); })->name('announcements');


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
