<?php

use App\Models\User;

/**
 * Test suite for Coordinator Dashboard Alumni Distribution (Task 4.7)
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */

test('coordinator dashboard returns alumni distribution data', function () {
    $coordinator = User::factory()->create(['user_role' => 'coordinator']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_year')
            ->has('alumni_by_course')
    );
});

test('coordinator dashboard groups alumni by graduation year correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    $currentYear = (int) date('Y');
    
    // Create alumni with different graduation years
    User::factory()->count(3)->alumna()->create(['year_graduated' => $currentYear]);
    User::factory()->count(2)->alumna()->create(['year_graduated' => $currentYear - 1]);
    User::factory()->count(4)->alumna()->create(['year_graduated' => $currentYear - 2]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_year', 3)
            ->where('alumni_by_year.0.year', $currentYear - 2)
            ->where('alumni_by_year.0.count', 4)
            ->where('alumni_by_year.1.year', $currentYear - 1)
            ->where('alumni_by_year.1.count', 2)
            ->where('alumni_by_year.2.year', $currentYear)
            ->where('alumni_by_year.2.count', 3)
    );
});

test('coordinator dashboard filters alumni by year to last 5 years', function () {
    $coordinator = User::factory()->coordinator()->create();
    $currentYear = (int) date('Y');
    
    // Create alumni within last 5 years
    User::factory()->count(2)->alumna()->create(['year_graduated' => $currentYear]);
    User::factory()->count(3)->alumna()->create(['year_graduated' => $currentYear - 4]);
    
    // Create alumni older than 5 years (should not be included)
    User::factory()->count(5)->alumna()->create(['year_graduated' => $currentYear - 5]);
    User::factory()->count(4)->alumna()->create(['year_graduated' => $currentYear - 10]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_year', 2) // Only 2 years should be included
    );
});

test('coordinator dashboard excludes alumni with null graduation year', function () {
    $coordinator = User::factory()->coordinator()->create();
    $currentYear = (int) date('Y');
    
    // Create alumni with graduation years
    User::factory()->count(3)->alumna()->create(['year_graduated' => $currentYear]);
    
    // Create alumni with null graduation year (should not be included)
    User::factory()->count(2)->alumna()->create(['year_graduated' => null]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_year', 1)
            ->where('alumni_by_year.0.count', 3)
    );
});

test('coordinator dashboard groups alumni by course correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create alumni with different courses
    User::factory()->count(5)->alumna()->create(['courses' => 'Computer Science']);
    User::factory()->count(3)->alumna()->create(['courses' => 'Information Technology']);
    User::factory()->count(2)->alumna()->create(['courses' => 'Business Administration']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_course', 3)
            // Should be ordered by count descending
            ->where('alumni_by_course.0.course', 'Computer Science')
            ->where('alumni_by_course.0.count', 5)
            ->where('alumni_by_course.1.course', 'Information Technology')
            ->where('alumni_by_course.1.count', 3)
            ->where('alumni_by_course.2.course', 'Business Administration')
            ->where('alumni_by_course.2.count', 2)
    );
});

test('coordinator dashboard excludes alumni with null or empty course', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create alumni with courses
    User::factory()->count(4)->alumna()->create(['courses' => 'Computer Science']);
    
    // Create alumni with null or empty course (should not be included)
    User::factory()->count(2)->alumna()->create(['courses' => null]);
    User::factory()->count(1)->alumna()->create(['courses' => '']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_course', 1)
            ->where('alumni_by_course.0.count', 4)
    );
});

test('coordinator dashboard returns empty arrays when no alumni exist', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('alumni_by_year', [])
            ->where('alumni_by_course', [])
    );
});

test('coordinator dashboard alumni by year returns correct data structure', function () {
    $coordinator = User::factory()->coordinator()->create();
    $currentYear = (int) date('Y');
    
    User::factory()->count(2)->alumna()->create(['year_graduated' => $currentYear]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_year.0', fn ($item) => 
                $item->has('year')
                    ->has('count')
                    ->where('year', $currentYear)
                    ->where('count', 2)
            )
    );
});

test('coordinator dashboard alumni by course returns correct data structure', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    User::factory()->count(3)->alumna()->create(['courses' => 'Engineering']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_course.0', fn ($item) => 
                $item->has('course')
                    ->has('count')
                    ->where('course', 'Engineering')
                    ->where('count', 3)
            )
    );
});

test('coordinator dashboard handles multiple courses with same count', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create alumni with same count for different courses
    User::factory()->count(3)->alumna()->create(['courses' => 'Computer Science']);
    User::factory()->count(3)->alumna()->create(['courses' => 'Engineering']);
    User::factory()->count(3)->alumna()->create(['courses' => 'Business']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_course', 3)
            ->where('alumni_by_course.0.count', 3)
            ->where('alumni_by_course.1.count', 3)
            ->where('alumni_by_course.2.count', 3)
    );
});

test('coordinator dashboard alumni by year is ordered chronologically', function () {
    $coordinator = User::factory()->coordinator()->create();
    $currentYear = (int) date('Y');
    
    // Create alumni in random order
    User::factory()->count(1)->alumna()->create(['year_graduated' => $currentYear - 2]);
    User::factory()->count(2)->alumna()->create(['year_graduated' => $currentYear]);
    User::factory()->count(3)->alumna()->create(['year_graduated' => $currentYear - 1]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_year', 3)
            // Should be ordered by year ascending
            ->where('alumni_by_year.0.year', $currentYear - 2)
            ->where('alumni_by_year.1.year', $currentYear - 1)
            ->where('alumni_by_year.2.year', $currentYear)
    );
});

test('coordinator dashboard alumni by course is ordered by count descending', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create alumni with different counts
    User::factory()->count(2)->alumna()->create(['courses' => 'Business']);
    User::factory()->count(5)->alumna()->create(['courses' => 'Engineering']);
    User::factory()->count(3)->alumna()->create(['courses' => 'Computer Science']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('alumni_by_course', 3)
            // Should be ordered by count descending
            ->where('alumni_by_course.0.course', 'Engineering')
            ->where('alumni_by_course.0.count', 5)
            ->where('alumni_by_course.1.course', 'Computer Science')
            ->where('alumni_by_course.1.count', 3)
            ->where('alumni_by_course.2.course', 'Business')
            ->where('alumni_by_course.2.count', 2)
    );
});
