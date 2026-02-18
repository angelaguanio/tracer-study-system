<?php

use App\Http\Controllers\Auth\AlumnaAuthController;
use App\Http\Controllers\Auth\CoordinatorAuthController;
use App\Http\Controllers\AlumnaHomeController;
use App\Http\Controllers\CoordinatorDashboardController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// TEMPORARY - Preview About page without login
Route::get('/preview-about', function () {
    return Inertia::render('Alumna/AlumnaAbout');
});

//render login to coord or student
Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Auth/Login');
    })->name('role.select');
    
    // Add fallback login route
    Route::get('/login', function () {
        return redirect()->route('alumna.login');
    })->name('login');
});

//=============ALUMNA ROUTES=======================
Route::prefix('alumna')->name('alumna.')->group(function () {

    Route::middleware('guest')->group(function () {
        //signup
        Route::get('/signup', [AlumnaAuthController::class, 'roles'])->name('signup');
        Route::post('/signup', [AlumnaAuthController::class, 'signupAlumna']);
        //login
        Route::get('/login', [AlumnaAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AlumnaAuthController::class, 'loginAlumna']);
    });

    Route::middleware('auth')->group(function () {
        //home page
        Route::get('/home', AlumnaHomeController::class)->name('home');
        
        //logout
        Route::get('/logout', [AlumnaAuthController::class, 'logoutAlumna'])->name('logout');
    });
    
    // About page - NO AUTH REQUIRED (temporarily for preview)
    Route::get('/about', function () {
        return Inertia::render('Alumna/AlumnaAbout');
    })->name('about');
});

//==============COORD ROUTES============================
Route::prefix('coordinator')->name('coordinator.')->group(function () {
    
    Route::middleware('guest')->group(function () {
        //login
        Route::get('/login',[CoordinatorAuthController::class, 'showLogin'])->name('login');
        Route::post('/login',[CoordinatorAuthController::class, 'loginCoordinator']);
    });

    Route::middleware('auth')->group(function () {
        //dashboard page
        Route::get('/dashboard', CoordinatorDashboardController::class)->name('dashboard');
        //logout
        Route::get('/logout', [CoordinatorAuthController::class, 'logoutCoordinator'])->name('logout');
    });
});