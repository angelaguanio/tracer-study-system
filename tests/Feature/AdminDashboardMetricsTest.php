<?php

use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use App\Models\Inquiries;
use App\Models\Announcement;
use App\Models\Employment;

/**
 * Test suite for Admin Dashboard Overview Metrics (Task 2.1)
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */

test('admin dashboard returns all overview metrics', function () {
    $admin = User::factory()->create(['user_role' => 'admin']);
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('metrics')
            ->has('metrics.total_alumni')
            ->has('metrics.active_surveys')
            ->has('metrics.completed_responses')
            ->has('metrics.pending_inquiries')
            ->has('metrics.pending_announcements')
            ->has('metrics.employed_alumni')
            ->has('metrics.unemployed_alumni')
    );
});

test('admin dashboard calculates total alumni count correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 5 alumni users
    User::factory()->count(5)->alumna()->create();
    
    // Create some non-alumni users (should not be counted)
    User::factory()->count(3)->coordinator()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.total_alumni', 5)
    );
});

test('admin dashboard calculates active surveys count correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 3 active surveys
    Survey::factory()->count(3)->active()->create();
    
    // Create some inactive surveys (should not be counted)
    Survey::factory()->count(2)->inactive()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.active_surveys', 3)
    );
});

test('admin dashboard calculates completed responses count correctly', function () {
    $admin = User::factory()->admin()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = \App\Models\Section::factory()->create(['survey_id' => $survey->id]);
    $question = \App\Models\Question::factory()->create(['section_id' => $section->id]);
    
    // Create 3 alumni with completed responses
    for ($i = 0; $i < 3; $i++) {
        $alumna = User::factory()->alumna()->create();
        \App\Models\Response::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'question_id' => $question->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    // Create 1 alumna with incomplete response (should not be counted)
    $alumnaIncomplete = User::factory()->alumna()->create();
    \App\Models\Response::create([
        'survey_id' => $survey->id,
        'user_id' => $alumnaIncomplete->id,
        'question_id' => $question->id,
        'answer_value' => 'Test answer',
        'submitted_at' => null,
    ]);
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.completed_responses', 4)
    );
});

test('admin dashboard calculates pending inquiries count correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 2 pending and 1 open inquiry
    Inquiries::factory()->count(2)->pending()->create();
    Inquiries::factory()->count(1)->open()->create();
    
    // Create closed inquiries (should not be counted)
    Inquiries::factory()->count(3)->closed()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.pending_inquiries', 3)
    );
});

test('admin dashboard calculates pending announcements count correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 4 pending announcements
    Announcement::factory()->count(4)->pending()->create();
    
    // Create approved/rejected announcements (should not be counted)
    Announcement::factory()->count(2)->approved()->create();
    Announcement::factory()->count(1)->rejected()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.pending_announcements', 4)
    );
});

test('admin dashboard calculates employed alumni count correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 6 employed alumni
    $employedAlumni = User::factory()->count(6)->alumna()->create();
    foreach ($employedAlumni as $alumna) {
        Employment::factory()->employed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // Create unemployed alumni (should not be counted)
    $unemployedAlumni = User::factory()->count(2)->alumna()->create();
    foreach ($unemployedAlumni as $alumna) {
        Employment::factory()->unemployed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.employed_alumni', 6)
    );
});

test('admin dashboard calculates unemployed alumni count correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 3 unemployed alumni
    $unemployedAlumni = User::factory()->count(3)->alumna()->create();
    foreach ($unemployedAlumni as $alumna) {
        Employment::factory()->unemployed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    // Create employed alumni (should not be counted)
    $employedAlumni = User::factory()->count(5)->alumna()->create();
    foreach ($employedAlumni as $alumna) {
        Employment::factory()->employed()->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.unemployed_alumni', 3)
    );
});

test('admin dashboard returns zero for all metrics when no data exists', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('metrics.total_alumni', 0)
            ->where('metrics.active_surveys', 0)
            ->where('metrics.completed_responses', 0)
            ->where('metrics.pending_inquiries', 0)
            ->where('metrics.pending_announcements', 0)
            ->where('metrics.employed_alumni', 0)
            ->where('metrics.unemployed_alumni', 0)
    );
});
