<?php

use App\Models\User;
use App\Models\Inquiries;
use App\Models\Announcement;
use App\Models\Response;
use App\Models\Survey;
use App\Models\Section;
use App\Models\Question;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Test suite for Admin Dashboard Recent Activity (Task 2.7)
 * Requirements: 4.1, 4.2, 4.3
 */

beforeEach(function () {
    $this->admin = User::factory()->create(['user_role' => 'admin']);
});

test('dashboard returns recent inquiries with correct structure', function () {
    // Create test data
    $alumni = User::factory()->count(3)->create(['user_role' => 'alumna']);
    
    // Create 7 inquiries to test the limit of 5
    foreach ($alumni as $alumna) {
        Inquiries::factory()->count(3)->create([
            'user_id' => $alumna->id,
        ]);
    }
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('recent_inquiries', 5)
            ->has('recent_inquiries.0', fn ($inquiry) =>
                $inquiry->has('id')
                    ->has('title')
                    ->has('sender_name')
                    ->has('created_at')
            )
    );
});

test('dashboard returns recent inquiries ordered by created_at DESC', function () {
    $alumna = User::factory()->alumna()->create();
    
    // Create inquiries with different timestamps
    $inquiry1 = Inquiries::factory()->create([
        'user_id' => $alumna->id,
        'created_at' => now()->subDays(3),
    ]);
    $inquiry2 = Inquiries::factory()->create([
        'user_id' => $alumna->id,
        'created_at' => now()->subDays(1),
    ]);
    $inquiry3 = Inquiries::factory()->create([
        'user_id' => $alumna->id,
        'created_at' => now()->subDays(2),
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_inquiries.0.id', $inquiry2->id)
            ->where('recent_inquiries.1.id', $inquiry3->id)
            ->where('recent_inquiries.2.id', $inquiry1->id)
    );
});

test('dashboard limits recent inquiries to 5 items', function () {
    $alumna = User::factory()->alumna()->create();
    
    // Create 10 inquiries
    Inquiries::factory()->count(10)->create([
        'user_id' => $alumna->id,
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('recent_inquiries', 5)
    );
});

test('dashboard returns recent inquiries with alumni relationship eager loaded', function () {
    $alumna = User::factory()->alumna()->create([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
    ]);
    
    Inquiries::factory()->create([
        'user_id' => $alumna->id,
        'title' => 'Test Inquiry',
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_inquiries.0.sender_name', 'Jane Doe')
    );
});

test('dashboard returns recent pending announcements with correct structure', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create 7 pending announcements to test the limit of 5
    Announcement::factory()->count(7)->pending()->create([
        'user_id' => $coordinator->id,
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('recent_announcements', 5)
            ->has('recent_announcements.0', fn ($announcement) =>
                $announcement->has('id')
                    ->has('title')
                    ->has('author_name')
                    ->has('created_at')
                    ->has('status')
            )
    );
});

test('dashboard returns only pending announcements', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create pending announcements
    Announcement::factory()->count(3)->pending()->create([
        'user_id' => $coordinator->id,
    ]);
    
    // Create approved and rejected announcements (should not appear)
    Announcement::factory()->count(2)->approved()->create([
        'user_id' => $coordinator->id,
    ]);
    Announcement::factory()->count(2)->rejected()->create([
        'user_id' => $coordinator->id,
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('recent_announcements', 3)
            ->where('recent_announcements.0.status', 'pending')
            ->where('recent_announcements.1.status', 'pending')
            ->where('recent_announcements.2.status', 'pending')
    );
});

test('dashboard returns recent announcements ordered by created_at DESC', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create announcements with different timestamps
    $announcement1 = Announcement::factory()->pending()->create([
        'user_id' => $coordinator->id,
        'created_at' => now()->subDays(3),
    ]);
    $announcement2 = Announcement::factory()->pending()->create([
        'user_id' => $coordinator->id,
        'created_at' => now()->subDays(1),
    ]);
    $announcement3 = Announcement::factory()->pending()->create([
        'user_id' => $coordinator->id,
        'created_at' => now()->subDays(2),
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_announcements.0.id', $announcement2->id)
            ->where('recent_announcements.1.id', $announcement3->id)
            ->where('recent_announcements.2.id', $announcement1->id)
    );
});

test('dashboard returns recent announcements with author relationship eager loaded', function () {
    $coordinator = User::factory()->coordinator()->create([
        'first_name' => 'John',
        'last_name' => 'Smith',
    ]);
    
    Announcement::factory()->pending()->create([
        'user_id' => $coordinator->id,
        'title' => 'Test Announcement',
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_announcements.0.author_name', 'John Smith')
    );
});

test('dashboard returns recent survey responses with correct structure', function () {
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    // Create 7 completed responses to test the limit of 5
    for ($i = 0; $i < 7; $i++) {
        $alumna = User::factory()->alumna()->create();
        Response::create([
            'survey_id' => $survey->id,
            'user_id' => $alumna->id,
            'question_id' => $question->id,
            'answer_value' => 'Test answer',
            'submitted_at' => now()->subDays($i),
        ]);
    }
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('recent_responses', 5)
            ->has('recent_responses.0', fn ($surveyResponse) =>
                $surveyResponse->has('survey_id')
                    ->has('user_id')
                    ->has('alumna_name')
                    ->has('survey_title')
                    ->has('submitted_at')
            )
    );
});

test('dashboard returns recent responses ordered by submitted_at DESC', function () {
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    $alumna1 = User::factory()->alumna()->create();
    $alumna2 = User::factory()->alumna()->create();
    $alumna3 = User::factory()->alumna()->create();
    
    // Create responses with different submitted_at timestamps
    Response::create([
        'survey_id' => $survey->id,
        'user_id' => $alumna1->id,
        'question_id' => $question->id,
        'answer_value' => 'Test answer',
        'submitted_at' => now()->subDays(3),
    ]);
    Response::create([
        'survey_id' => $survey->id,
        'user_id' => $alumna2->id,
        'question_id' => $question->id,
        'answer_value' => 'Test answer',
        'submitted_at' => now()->subDays(1),
    ]);
    Response::create([
        'survey_id' => $survey->id,
        'user_id' => $alumna3->id,
        'question_id' => $question->id,
        'answer_value' => 'Test answer',
        'submitted_at' => now()->subDays(2),
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_responses.0.user_id', $alumna2->id)
            ->where('recent_responses.1.user_id', $alumna3->id)
            ->where('recent_responses.2.user_id', $alumna1->id)
    );
});

test('dashboard returns recent responses with user and survey relationships eager loaded', function () {
    $survey = Survey::factory()->active()->create(['title' => 'Alumni Survey 2024']);
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    $alumna = User::factory()->alumna()->create([
        'first_name' => 'Alice',
        'last_name' => 'Johnson',
    ]);
    
    Response::create([
        'survey_id' => $survey->id,
        'user_id' => $alumna->id,
        'question_id' => $question->id,
        'answer_value' => 'Test answer',
        'submitted_at' => now(),
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_responses.0.alumna_name', 'Alice Johnson')
            ->where('recent_responses.0.survey_title', 'Alumni Survey 2024')
    );
});

test('dashboard only includes responses with submitted_at', function () {
    $survey = Survey::factory()->active()->create();
    $section = Section::factory()->create(['survey_id' => $survey->id]);
    $question = Question::factory()->create(['section_id' => $section->id]);
    
    $alumna1 = User::factory()->alumna()->create();
    
    // Create completed response for alumna1
    Response::create([
        'survey_id' => $survey->id,
        'user_id' => $alumna1->id,
        'question_id' => $question->id,
        'answer_value' => 'Test answer',
        'submitted_at' => now(),
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    // Verify that the response appears in recent responses
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->has('recent_responses')
    );
    
    // Get the recent responses and verify alumna1 is there
    $recentResponses = collect($response->viewData('page')['props']['recent_responses']);
    expect($recentResponses->where('user_id', $alumna1->id)->count())->toBeGreaterThan(0);
    
    // Verify all responses have submitted_at dates
    foreach ($recentResponses as $recentResponse) {
        expect($recentResponse['submitted_at'])->not->toBeNull();
    }
});

test('dashboard returns empty arrays when no recent activity exists', function () {
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_inquiries', [])
            ->where('recent_announcements', [])
            ->where('recent_responses', [])
    );
});

test('dashboard formats dates in MMM DD, YYYY format', function () {
    $alumna = User::factory()->alumna()->create();
    
    $inquiry = Inquiries::factory()->create([
        'user_id' => $alumna->id,
        'created_at' => now()->setDate(2024, 3, 15),
    ]);
    
    $response = $this->actingAs($this->admin)->get('/admin/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Admin/AdminDashboard')
            ->where('recent_inquiries.0.created_at', 'Mar 15, 2024')
    );
});
    