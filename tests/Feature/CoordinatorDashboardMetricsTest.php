<?php

use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use App\Models\Announcement;

/**
 * Test suite for Coordinator Dashboard Metrics (Task 4.1)
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

test('coordinator dashboard returns all metrics', function () {
    $coordinator = User::factory()->create(['user_role' => 'coordinator']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('metrics')
            ->has('metrics.total_alumni')
            ->has('metrics.active_surveys')
            ->has('metrics.my_pending_announcements')
            ->has('metrics.my_approved_announcements')
            ->has('metrics.my_rejected_announcements')
            ->has('metrics.completed_responses')
    );
});

test('coordinator dashboard calculates total alumni count correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create 7 alumni users
    User::factory()->count(7)->alumna()->create();
    
    // Create some non-alumni users (should not be counted)
    User::factory()->count(2)->admin()->create();
    User::factory()->count(3)->coordinator()->create();
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.total_alumni', 7)
    );
});

test('coordinator dashboard calculates active surveys count correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create 4 active surveys
    Survey::factory()->count(4)->active()->create();
    
    // Create some inactive surveys (should not be counted)
    Survey::factory()->count(3)->inactive()->create();
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.active_surveys', 4)
    );
});

test('coordinator dashboard calculates my pending announcements correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    $otherCoordinator = User::factory()->coordinator()->create();
    
    // Create 3 pending announcements for this coordinator
    Announcement::factory()->count(3)->pending()->create(['user_id' => $coordinator->id]);
    
    // Create pending announcements for other coordinator (should not be counted)
    Announcement::factory()->count(2)->pending()->create(['user_id' => $otherCoordinator->id]);
    
    // Create approved/rejected announcements for this coordinator (should not be counted)
    Announcement::factory()->count(1)->approved()->create(['user_id' => $coordinator->id]);
    Announcement::factory()->count(1)->rejected()->create(['user_id' => $coordinator->id]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.my_pending_announcements', 3)
    );
});

test('coordinator dashboard calculates my approved announcements correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    $otherCoordinator = User::factory()->coordinator()->create();
    
    // Create 5 approved announcements for this coordinator
    Announcement::factory()->count(5)->approved()->create(['user_id' => $coordinator->id]);
    
    // Create approved announcements for other coordinator (should not be counted)
    Announcement::factory()->count(3)->approved()->create(['user_id' => $otherCoordinator->id]);
    
    // Create pending/rejected announcements for this coordinator (should not be counted)
    Announcement::factory()->count(2)->pending()->create(['user_id' => $coordinator->id]);
    Announcement::factory()->count(1)->rejected()->create(['user_id' => $coordinator->id]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.my_approved_announcements', 5)
    );
});

test('coordinator dashboard calculates my rejected announcements correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    $otherCoordinator = User::factory()->coordinator()->create();
    
    // Create 2 rejected announcements for this coordinator
    Announcement::factory()->count(2)->rejected()->create(['user_id' => $coordinator->id]);
    
    // Create rejected announcements for other coordinator (should not be counted)
    Announcement::factory()->count(4)->rejected()->create(['user_id' => $otherCoordinator->id]);
    
    // Create pending/approved announcements for this coordinator (should not be counted)
    Announcement::factory()->count(1)->pending()->create(['user_id' => $coordinator->id]);
    Announcement::factory()->count(3)->approved()->create(['user_id' => $coordinator->id]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.my_rejected_announcements', 2)
    );
});

test('coordinator dashboard calculates completed responses count correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    
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
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.completed_responses', 4)
    );
});

test('coordinator dashboard returns zero for all metrics when no data exists', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.total_alumni', 0)
            ->where('metrics.active_surveys', 0)
            ->where('metrics.my_pending_announcements', 0)
            ->where('metrics.my_approved_announcements', 0)
            ->where('metrics.my_rejected_announcements', 0)
            ->where('metrics.completed_responses', 0)
    );
});

test('coordinator only sees their own announcements in metrics', function () {
    $coordinator1 = User::factory()->coordinator()->create();
    $coordinator2 = User::factory()->coordinator()->create();
    
    // Create announcements for coordinator1
    Announcement::factory()->count(2)->pending()->create(['user_id' => $coordinator1->id]);
    Announcement::factory()->count(3)->approved()->create(['user_id' => $coordinator1->id]);
    Announcement::factory()->count(1)->rejected()->create(['user_id' => $coordinator1->id]);
    
    // Create announcements for coordinator2
    Announcement::factory()->count(5)->pending()->create(['user_id' => $coordinator2->id]);
    Announcement::factory()->count(4)->approved()->create(['user_id' => $coordinator2->id]);
    Announcement::factory()->count(2)->rejected()->create(['user_id' => $coordinator2->id]);
    
    // Test coordinator1's dashboard
    $response1 = $this->actingAs($coordinator1)->get('/coordinator/dashboard');
    $response1->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.my_pending_announcements', 2)
            ->where('metrics.my_approved_announcements', 3)
            ->where('metrics.my_rejected_announcements', 1)
    );
    
    // Test coordinator2's dashboard
    $response2 = $this->actingAs($coordinator2)->get('/coordinator/dashboard');
    $response2->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('metrics.my_pending_announcements', 5)
            ->where('metrics.my_approved_announcements', 4)
            ->where('metrics.my_rejected_announcements', 2)
    );
});
