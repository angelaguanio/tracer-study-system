<?php

use App\Models\User;
use App\Models\Employment;

/**
 * Test suite for Admin Dashboard Employment Distribution (Task 2.5)
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

test('admin dashboard returns employment distribution data', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('employment_distribution')
            ->has('employment_distribution.employed')
            ->has('employment_distribution.unemployed')
            ->has('employment_distribution.self_employed')
            ->has('employment_distribution.no_data')
            ->has('employment_distribution.employed_percentage')
            ->has('employment_distribution.unemployed_percentage')
            ->has('employment_distribution.self_employed_percentage')
            ->has('employment_distribution.no_data_percentage')
    );
});

test('admin dashboard calculates employment distribution counts correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 10 employed alumni
    $employedAlumni = User::factory()->count(10)->alumna()->create();
    foreach ($employedAlumni as $alumna) {
        Employment::factory()->employed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // Create 5 unemployed alumni
    $unemployedAlumni = User::factory()->count(5)->alumna()->create();
    foreach ($unemployedAlumni as $alumna) {
        Employment::factory()->unemployed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // Create 3 self-employed alumni
    $selfEmployedAlumni = User::factory()->count(3)->alumna()->create();
    foreach ($selfEmployedAlumni as $alumna) {
        Employment::factory()->selfEmployed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // Create 2 alumni with no employment data
    User::factory()->count(2)->alumna()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('employment_distribution.employed', 10)
            ->where('employment_distribution.unemployed', 5)
            ->where('employment_distribution.self_employed', 3)
            ->where('employment_distribution.no_data', 2)
    );
});

test('admin dashboard calculates employment distribution percentages correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 20 total alumni
    // 10 employed (50%)
    $employedAlumni = User::factory()->count(10)->alumna()->create();
    foreach ($employedAlumni as $alumna) {
        Employment::factory()->employed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // 5 unemployed (25%)
    $unemployedAlumni = User::factory()->count(5)->alumna()->create();
    foreach ($unemployedAlumni as $alumna) {
        Employment::factory()->unemployed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // 3 self-employed (15%)
    $selfEmployedAlumni = User::factory()->count(3)->alumna()->create();
    foreach ($selfEmployedAlumni as $alumna) {
        Employment::factory()->selfEmployed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // 2 no data (10%)
    User::factory()->count(2)->alumna()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('employment_distribution.employed_percentage', 50)
            ->where('employment_distribution.unemployed_percentage', 25)
            ->where('employment_distribution.self_employed_percentage', 15)
            ->where('employment_distribution.no_data_percentage', 10)
    );
});

test('admin dashboard handles zero alumni correctly for employment distribution', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('employment_distribution.employed', 0)
            ->where('employment_distribution.unemployed', 0)
            ->where('employment_distribution.self_employed', 0)
            ->where('employment_distribution.no_data', 0)
            ->where('employment_distribution.employed_percentage', 0)
            ->where('employment_distribution.unemployed_percentage', 0)
            ->where('employment_distribution.self_employed_percentage', 0)
            ->where('employment_distribution.no_data_percentage', 0)
    );
});

test('admin dashboard calculates no_data count correctly when all alumni have employment data', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 10 alumni, all with employment data
    $alumni = User::factory()->count(10)->alumna()->create();
    foreach ($alumni as $alumna) {
        Employment::factory()->employed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('employment_distribution.no_data', 0)
            ->where('employment_distribution.no_data_percentage', 0)
    );
});

test('admin dashboard calculates no_data count correctly when no alumni have employment data', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 5 alumni with no employment data
    User::factory()->count(5)->alumna()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('employment_distribution.employed', 0)
            ->where('employment_distribution.unemployed', 0)
            ->where('employment_distribution.self_employed', 0)
            ->where('employment_distribution.no_data', 5)
            ->where('employment_distribution.no_data_percentage', 100)
    );
});

test('admin dashboard rounds percentages to 2 decimal places', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 3 total alumni to get non-round percentages
    // 1 employed (33.33%)
    $employedAlumna = User::factory()->alumna()->create();
    Employment::factory()->employed()->create([
        'user_id' => $employedAlumna->id,
    ]);
    
    // 1 unemployed (33.33%)
    $unemployedAlumna = User::factory()->alumna()->create();
    Employment::factory()->unemployed()->create([
        'user_id' => $unemployedAlumna->id,
    ]);
    
    // 1 no data (33.33%)
    User::factory()->alumna()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('employment_distribution.employed_percentage', 33.33)
            ->where('employment_distribution.unemployed_percentage', 33.33)
            ->where('employment_distribution.self_employed_percentage', 0)
            ->where('employment_distribution.no_data_percentage', 33.33)
    );
});
