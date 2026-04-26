<?php

namespace Tests\Unit;

use App\Http\Controllers\SurveyResponseController;
use App\Http\Requests\SubmitSurveyRequest;
use App\Models\Question;
use App\Models\Response;
use App\Models\Section;
use App\Models\Survey;
use App\Models\SurveyDraft;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Unit tests for SurveyResponseController submission handler
 * Feature: survey-subheading-feature
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 */
class SurveyResponseControllerSubmissionTest extends TestCase
{
    use RefreshDatabase;

    protected $controller;
    protected $user;
    protected $survey;
    protected $section;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->controller = new SurveyResponseController();
        $this->user = User::factory()->create();
        
        $this->survey = Survey::create([
            'title' => 'Test Survey',
            'status' => 'active',
        ]);
        
        $this->section = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        Auth::login($this->user);
    }

    /**
     * Test that submission excludes subheading responses from Response creation
     */
    public function test_submit_excludes_subheading_responses()
    {
        // Create mixed questions
        $subheadingQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH1',
            'label' => 'Personal Information',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => false,
        ]);

        $textQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Your name?',
            'type' => 'text',
            'display_order' => 2,
            'is_required' => true,
        ]);

        $selectQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q2',
            'label' => 'Your age?',
            'type' => 'select',
            'display_order' => 3,
            'is_required' => true,
            'options' => ['18-25', '26-35', '36-45'],
        ]);

        // Create draft with mixed answers
        $draft = SurveyDraft::create([
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
            'answers' => [
                $subheadingQuestion->id => 'This should be filtered out',
                $textQuestion->id => 'John Doe',
                $selectQuestion->id => '26-35',
            ],
            'last_section_id' => $this->section->id,
        ]);

        // Mock the request
        $request = \Mockery::mock(SubmitSurveyRequest::class);
        $request->shouldReceive('validated')->andReturn([]);

        // Call the submit method
        $response = $this->controller->submit($request, $this->survey);

        // Verify redirect response
        $this->assertInstanceOf(RedirectResponse::class, $response);

        // Verify only input question responses were created
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->user->id)
            ->get();

        $this->assertCount(2, $responses, 'Should create responses only for input questions');

        // Verify no response for subheading
        $subheadingResponse = $responses->where('question_id', $subheadingQuestion->id)->first();
        $this->assertNull($subheadingResponse, 'Should not create response for subheading');

        // Verify responses for input questions
        $textResponse = $responses->where('question_id', $textQuestion->id)->first();
        $this->assertNotNull($textResponse, 'Should create response for text question');
        $this->assertEquals('John Doe', $textResponse->answer_value);

        $selectResponse = $responses->where('question_id', $selectQuestion->id)->first();
        $this->assertNotNull($selectResponse, 'Should create response for select question');
        $this->assertEquals('26-35', $selectResponse->answer_value);

        // Verify draft was deleted
        $this->assertDatabaseMissing('survey_drafts', [
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
        ]);
    }

    /**
     * Test submission with array values (checkbox questions)
     */
    public function test_submit_handles_array_values_correctly()
    {
        $checkboxQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Select all that apply',
            'type' => 'checkbox',
            'display_order' => 1,
            'is_required' => true,
            'options' => ['Option 1', 'Option 2', 'Option 3'],
        ]);

        $subheadingQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH1',
            'label' => 'Section Header',
            'type' => 'subheading',
            'display_order' => 2,
            'is_required' => false,
        ]);

        // Create draft with array answer and subheading
        $draft = SurveyDraft::create([
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
            'answers' => [
                $checkboxQuestion->id => ['Option 1', 'Option 3'],
                $subheadingQuestion->id => 'Subheading content',
            ],
            'last_section_id' => $this->section->id,
        ]);

        $request = \Mockery::mock(SubmitSurveyRequest::class);
        $request->shouldReceive('validated')->andReturn([]);

        $response = $this->controller->submit($request, $this->survey);

        // Verify only checkbox response was created
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->user->id)
            ->get();

        $this->assertCount(1, $responses, 'Should create response only for checkbox question');

        $checkboxResponse = $responses->first();
        $this->assertEquals($checkboxQuestion->id, $checkboxResponse->question_id);
        $this->assertEquals('["Option 1","Option 3"]', $checkboxResponse->answer_value,
            'Array values should be JSON encoded');
    }

    /**
     * Test submission with only subheading questions creates no responses
     */
    public function test_submit_with_only_subheadings_creates_no_responses()
    {
        // Create only subheading questions
        $subheading1 = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH1',
            'label' => 'First Section',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => false,
        ]);

        $subheading2 = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH2',
            'label' => 'Second Section',
            'type' => 'subheading',
            'display_order' => 2,
            'is_required' => false,
        ]);

        // Create draft with only subheading answers
        $draft = SurveyDraft::create([
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
            'answers' => [
                $subheading1->id => 'First subheading content',
                $subheading2->id => 'Second subheading content',
            ],
            'last_section_id' => $this->section->id,
        ]);

        $request = \Mockery::mock(SubmitSurveyRequest::class);
        $request->shouldReceive('validated')->andReturn([]);

        $response = $this->controller->submit($request, $this->survey);

        // Verify no responses were created
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->user->id)
            ->get();

        $this->assertCount(0, $responses, 'Should create no responses for subheading-only submission');

        // Verify draft was still deleted
        $this->assertDatabaseMissing('survey_drafts', [
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
        ]);
    }

    /**
     * Test data integrity with complex question types
     */
    public function test_submit_maintains_data_integrity_with_complex_types()
    {
        // Create various question types
        $questions = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH1',
                'label' => 'Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q1',
                'label' => 'Text with special chars',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q2',
                'label' => 'Textarea',
                'type' => 'textarea',
                'display_order' => 3,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q3',
                'label' => 'Number',
                'type' => 'number',
                'display_order' => 4,
                'is_required' => false,
            ]),
        ];

        // Create draft with complex data
        $draft = SurveyDraft::create([
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
            'answers' => [
                $questions[0]->id => 'Subheading to filter',
                $questions[1]->id => 'Text with @#$% special chars & unicode: 你好',
                $questions[2]->id => "Multi-line\ntext with\ttabs and\r\ncarriage returns",
                $questions[3]->id => '42.5',
            ],
            'last_section_id' => $this->section->id,
        ]);

        $request = \Mockery::mock(SubmitSurveyRequest::class);
        $request->shouldReceive('validated')->andReturn([]);

        $response = $this->controller->submit($request, $this->survey);

        // Verify correct number of responses
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->user->id)
            ->get();

        $this->assertCount(3, $responses, 'Should create responses for 3 input questions');

        // Verify data integrity for each response
        $textResponse = $responses->where('question_id', $questions[1]->id)->first();
        $this->assertEquals('Text with @#$% special chars & unicode: 你好', $textResponse->answer_value,
            'Special characters and unicode should be preserved');

        $textareaResponse = $responses->where('question_id', $questions[2]->id)->first();
        $this->assertEquals("Multi-line\ntext with\ttabs and\r\ncarriage returns", $textareaResponse->answer_value,
            'Multi-line text with special whitespace should be preserved');

        $numberResponse = $responses->where('question_id', $questions[3]->id)->first();
        $this->assertEquals('42.5', $numberResponse->answer_value,
            'Decimal numbers should be preserved as strings');
    }

    /**
     * Test transaction rollback on error
     */
    public function test_submit_transaction_rollback_on_error()
    {
        $textQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Text question',
            'type' => 'text',
            'display_order' => 1,
            'is_required' => true,
        ]);

        $draft = SurveyDraft::create([
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
            'answers' => [
                $textQuestion->id => 'Test answer',
            ],
            'last_section_id' => $this->section->id,
        ]);

        // Mock DB transaction to simulate error
        DB::shouldReceive('transaction')
            ->once()
            ->andThrow(new \Exception('Database error'));

        $request = \Mockery::mock(SubmitSurveyRequest::class);
        $request->shouldReceive('validated')->andReturn([]);

        // Expect exception to be thrown
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Database error');

        $this->controller->submit($request, $this->survey);

        // Verify no responses were created due to rollback
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->user->id)
            ->get();

        $this->assertCount(0, $responses, 'No responses should be created on transaction failure');

        // Verify draft still exists due to rollback
        $this->assertDatabaseHas('survey_drafts', [
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
        ]);
    }

    /**
     * Test draft cleanup after successful submission
     */
    public function test_submit_cleans_up_draft_after_success()
    {
        $textQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Text question',
            'type' => 'text',
            'display_order' => 1,
            'is_required' => true,
        ]);

        $draft = SurveyDraft::create([
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
            'answers' => [
                $textQuestion->id => 'Test answer',
            ],
            'last_section_id' => $this->section->id,
        ]);

        $request = \Mockery::mock(SubmitSurveyRequest::class);
        $request->shouldReceive('validated')->andReturn([]);

        $response = $this->controller->submit($request, $this->survey);

        // Verify response was created
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->user->id)
            ->get();

        $this->assertCount(1, $responses, 'Response should be created');

        // Verify draft was deleted
        $this->assertDatabaseMissing('survey_drafts', [
            'user_id' => $this->user->id,
            'survey_id' => $this->survey->id,
        ]);

        // Verify redirect response
        $this->assertInstanceOf(RedirectResponse::class, $response);
    }

    protected function tearDown(): void
    {
        \Mockery::close();
        parent::tearDown();
    }
}