<?php

use App\Models\User;
use App\Models\Survey;
use App\Models\Response;
use App\Models\Section;
use App\Models\Question;
use App\Models\SurveyDraft;

/**
 * Test suite for Coordinator Dashboard Survey Overview (Task 4.3)
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

test('coordinator dashboard returns survey overview', function () {
    $coordinator = User::factory()->create(['user_role' => 'coordinator']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('survey_overview')
    );
});

test('coordinator dashboard calculates survey overview for active surveys', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create 2 active surveys
    $survey1 = Survey::factory()->active()->create(['title' => 'Survey 1']);
    $survey2 = Survey::factory()->active()->create(['title' => 'Survey 2']);
    
    // Create 1 inactive survey (should not be included)
    Survey::factory()->inactive()->create(['title' => 'Inactive Survey']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('survey_overview', 2)
            ->where('survey_overview.0.survey_id', $survey1->id)
            ->where('survey_overview.0.survey_title', 'Survey 1')
            ->where('survey_overview.1.survey_id', $survey2->id)
            ->where('survey_overview.1.survey_title', 'Survey 2')
    );
});

test('coordinator dashboard calculates completed responses per survey', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    // Create 3 alumni with completed responses
    for ($i = 0; $i < 3; $i++) {
        $alumna = User::factory()->alumna()->create();
        Response::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'question_id' => $question->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('survey_overview.0.completed_responses', 3)
    );
});

test('coordinator dashboard calculates in-progress responses per survey', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    
    // Create 2 alumni with drafts but no submission
    for ($i = 0; $i < 2; $i++) {
        $alumna = User::factory()->alumna()->create();
        SurveyDraft::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'answers' => json_encode(['test' => 'data']),
            'last_section_id' => $section->id,
        ]);
    }
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('survey_overview.0.in_progress_responses', 2)
    );
});

test('coordinator dashboard calculates completion rate correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create 10 alumni
    User::factory()->count(10)->alumna()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    // Create 4 completed responses (40% completion rate)
    $alumni = User::where('user_role', 'alumna')->take(4)->get();
    foreach ($alumni as $alumna) {
        Response::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'question_id' => $question->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('survey_overview.0.completion_rate', 40)
    );
});

test('coordinator dashboard shows zero completion rate when no alumni exist', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $survey = Survey::factory()->active()->create();
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('survey_overview.0.completion_rate', 0)
    );
});

test('coordinator dashboard returns empty array when no active surveys exist', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create only inactive surveys
    Survey::factory()->count(2)->inactive()->create();
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('survey_overview', [])
    );
});

test('coordinator dashboard calculates total responses correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    // Create 3 completed responses
    for ($i = 0; $i < 3; $i++) {
        $alumna = User::factory()->alumna()->create();
        Response::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'question_id' => $question->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now(),
        ]);
    }
    
    // Create 2 in-progress responses (drafts)
    for ($i = 0; $i < 2; $i++) {
        $alumna = User::factory()->alumna()->create();
        SurveyDraft::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'answers' => json_encode(['test' => 'data']),
            'last_section_id' => $section->id,
        ]);
    }
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('survey_overview.0.total_responses', 5)
            ->where('survey_overview.0.completed_responses', 3)
            ->where('survey_overview.0.in_progress_responses', 2)
    );
});
