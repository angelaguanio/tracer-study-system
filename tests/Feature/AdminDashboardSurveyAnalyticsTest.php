<?php

use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use App\Models\Section;
use App\Models\Question;
use App\Models\SurveyDraft;

/**
 * Test suite for Admin Dashboard Survey Analytics (Task 2.3)
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

test('admin dashboard returns survey analytics data', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('survey_analytics')
    );
});

test('survey analytics includes all active surveys', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 3 active surveys
    Survey::factory()->count(3)->active()->create();
    
    // Create 2 inactive surveys (should not be included)
    Survey::factory()->count(2)->inactive()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('survey_analytics', 3)
    );
});

test('survey analytics calculates completed responses correctly', function () {
    $admin = User::factory()->admin()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    // Create 5 alumni
    $alumni = User::factory()->count(5)->alumna()->create();
    
    // 3 alumni completed the survey
    foreach ($alumni->take(3) as $alumna) {
        Response::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'question_id' => $question->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('survey_analytics.0.completed_responses', 3)
    );
});

test('survey analytics calculates in-progress responses correctly', function () {
    $admin = User::factory()->admin()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    // Create 5 alumni
    $alumni = User::factory()->count(5)->alumna()->create();
    
    // 2 alumni have drafts but no submission
    foreach ($alumni->take(2) as $alumna) {
        SurveyDraft::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'answers' => ['test' => 'data'],
            'last_section_id' => $section->id,
            'updated_at' => now(),
        ]);
    }
    
    // 1 alumna completed the survey (should not count as in-progress)
    Response::create([
        'survey_id' => $survey->id,
        'user_id' => $alumni->get(2)->id,
        'question_id' => $question->id,
        'answer_value' => 'Test answer',
        'submitted_at' => now(),
    ]);
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('survey_analytics.0.in_progress_responses', 2)
    );
});

test('survey analytics calculates completion rate correctly', function () {
    $admin = User::factory()->admin()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    // Create 10 alumni
    $alumni = User::factory()->count(10)->alumna()->create();
    
    // 4 alumni completed the survey
    foreach ($alumni->take(4) as $alumna) {
        Response::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'question_id' => $question->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    // Expected completion rate: (4 / 10) * 100 = 40.0
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('survey_analytics.0.completion_rate', 40)
    );
});

test('survey analytics returns zero completion rate when no alumni exist', function () {
    $admin = User::factory()->admin()->create();
    
    $survey = Survey::factory()->active()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('survey_analytics.0.completion_rate', 0)
    );
});

test('survey analytics includes survey details', function () {
    $admin = User::factory()->admin()->create();
    
    $survey = Survey::factory()->active()->create([
        'title' => 'Test Survey 2024',
    ]);
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('survey_analytics.0.survey_id', $survey->id)
            ->where('survey_analytics.0.survey_title', 'Test Survey 2024')
            ->has('survey_analytics.0.total_responses')
            ->has('survey_analytics.0.completed_responses')
            ->has('survey_analytics.0.in_progress_responses')
            ->has('survey_analytics.0.completion_rate')
    );
});

test('survey analytics returns empty array when no active surveys exist', function () {
    $admin = User::factory()->admin()->create();
    
    // Create only inactive surveys
    Survey::factory()->count(2)->inactive()->create();
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('survey_analytics', [])
    );
});

test('survey analytics handles multiple surveys correctly', function () {
    $admin = User::factory()->admin()->create();
    
    // Create 2 active surveys
    $survey1 = Survey::factory()->active()->create(['title' => 'Survey 1']);
    $survey2 = Survey::factory()->active()->create(['title' => 'Survey 2']);
    
    $section1 = Section::factory()->create(['survey_id' => $survey1->id]);
    $section2 = Section::factory()->create(['survey_id' => $survey2->id]);
    $question1 = Question::factory()->create(['section_id' => $section1->id]);
    $question2 = Question::factory()->create(['section_id' => $section2->id]);
    
    // Create 10 alumni
    $alumni = User::factory()->count(10)->alumna()->create();
    
    // 3 alumni completed survey 1
    foreach ($alumni->take(3) as $alumna) {
        Response::create([
            'survey_id' => $survey1->id,
            'user_id' => $alumna->id,
            'question_id' => $question1->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    // 5 alumni completed survey 2
    foreach ($alumni->take(5) as $alumna) {
        Response::create([
            'survey_id' => $survey2->id,
            'user_id' => $alumna->id,
            'question_id' => $question2->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('survey_analytics', 2)
            ->where('survey_analytics.0.completed_responses', 3)
            ->where('survey_analytics.0.completion_rate', 30)
            ->where('survey_analytics.1.completed_responses', 5)
            ->where('survey_analytics.1.completion_rate', 50)
    );
});
