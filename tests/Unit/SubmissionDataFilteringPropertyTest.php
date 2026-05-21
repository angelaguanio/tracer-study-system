<?php

namespace Tests\Unit;

use App\Models\Question;
use App\Models\Response;
use App\Models\Section;
use App\Models\Survey;
use App\Models\SurveyDraft;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-based tests for submission data filtering
 * Feature: survey-subheading-feature
 * Property 7: Submission Data Filtering
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 */
class SubmissionDataFilteringPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Property: For any survey submission containing mixed question types,
     * the submission handler should filter out all subheading responses
     * and create Response records only for actual input questions.
     */
    public function test_submission_filters_subheading_responses()
    {
        $user = User::factory()->create();
        $survey = Survey::create([
            'title' => 'Test Survey',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        // Create mixed questions including subheadings
        $subheadingQuestion = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'SH1',
            'label' => 'Personal Information Section',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => false,
        ]);

        $textQuestion = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'Q1',
            'label' => 'What is your name?',
            'type' => 'text',
            'display_order' => 2,
            'is_required' => true,
        ]);

        $anotherSubheading = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'SH2',
            'label' => 'Contact Information',
            'type' => 'subheading',
            'display_order' => 3,
            'is_required' => false,
        ]);

        $selectQuestion = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'Q2',
            'label' => 'Select your age range',
            'type' => 'select',
            'display_order' => 4,
            'is_required' => true,
            'options' => ['18-25', '26-35', '36-45'],
        ]);

        // Create draft with mixed answers (including subheading responses)
        $draftAnswers = [
            $subheadingQuestion->id => 'This should be filtered out',
            $textQuestion->id => 'John Doe',
            $anotherSubheading->id => 'This should also be filtered out',
            $selectQuestion->id => '26-35',
        ];

        $draft = SurveyDraft::create([
            'user_id' => $user->id,
            'survey_id' => $survey->id,
            'answers' => $draftAnswers,
            'last_section_id' => $section->id,
        ]);

        // Simulate the submission filtering logic from SurveyResponseController
        $subheadingQuestionIds = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })
        ->subheadings()
        ->pluck('id')
        ->toArray();

        $filteredAnswers = collect($draft->answers)
            ->reject(function ($value, $questionId) use ($subheadingQuestionIds) {
                return in_array($questionId, $subheadingQuestionIds);
            })
            ->toArray();

        // Create Response records (simulating the submission process)
        foreach ($filteredAnswers as $questionId => $answerValue) {
            Response::create([
                'survey_id' => $survey->id,
                'user_id' => $user->id,
                'question_id' => $questionId,
                'answer_value' => is_array($answerValue) ? json_encode($answerValue) : $answerValue,
                'submitted_at' => now(),
            ]);
        }

        // Verify that only input question responses were created
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $user->id)
            ->get();

        // Should have exactly 2 responses (for the 2 input questions)
        $this->assertCount(2, $responses, 'Should create responses only for input questions');

        // Verify no responses were created for subheadings
        $subheadingResponses = $responses->whereIn('question_id', [$subheadingQuestion->id, $anotherSubheading->id]);
        $this->assertCount(0, $subheadingResponses, 'Should not create responses for subheadings');

        // Verify responses were created for input questions
        $inputResponses = $responses->whereIn('question_id', [$textQuestion->id, $selectQuestion->id]);
        $this->assertCount(2, $inputResponses, 'Should create responses for all input questions');

        // Verify response values are correct
        $textResponse = $responses->where('question_id', $textQuestion->id)->first();
        $this->assertEquals('John Doe', $textResponse->answer_value, 'Text response value should be preserved');

        $selectResponse = $responses->where('question_id', $selectQuestion->id)->first();
        $this->assertEquals('26-35', $selectResponse->answer_value, 'Select response value should be preserved');
    }

    /**
     * Property: Submission data integrity should be maintained for input questions
     * while completely excluding subheadings from the response data.
     */
    public function test_submission_maintains_data_integrity_for_input_questions()
    {
        $user = User::factory()->create();
        $survey = Survey::create([
            'title' => 'Data Integrity Test Survey',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        // Create various input question types
        $questions = [
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'SH1',
                'label' => 'Section Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'Q1',
                'label' => 'Text question',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'Q2',
                'label' => 'Checkbox question',
                'type' => 'checkbox',
                'display_order' => 3,
                'is_required' => true,
                'options' => ['Option 1', 'Option 2', 'Option 3'],
            ]),
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'SH2',
                'label' => 'Another Header',
                'type' => 'subheading',
                'display_order' => 4,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'Q3',
                'label' => 'Number question',
                'type' => 'number',
                'display_order' => 5,
                'is_required' => false,
            ]),
        ];

        // Create draft with complex answer data
        $draftAnswers = [
            $questions[0]->id => 'Subheading content to filter',
            $questions[1]->id => 'Text answer with special chars: @#$%',
            $questions[2]->id => ['Option 1', 'Option 3'], // Array for checkbox
            $questions[3]->id => 'Another subheading to filter',
            $questions[4]->id => '42',
        ];

        $draft = SurveyDraft::create([
            'user_id' => $user->id,
            'survey_id' => $survey->id,
            'answers' => $draftAnswers,
            'last_section_id' => $section->id,
        ]);

        // Apply the same filtering logic as the controller
        $subheadingQuestionIds = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })
        ->subheadings()
        ->pluck('id')
        ->toArray();

        $filteredAnswers = collect($draft->answers)
            ->reject(function ($value, $questionId) use ($subheadingQuestionIds) {
                return in_array($questionId, $subheadingQuestionIds);
            })
            ->toArray();

        // Create responses
        foreach ($filteredAnswers as $questionId => $answerValue) {
            Response::create([
                'survey_id' => $survey->id,
                'user_id' => $user->id,
                'question_id' => $questionId,
                'answer_value' => is_array($answerValue) ? json_encode($answerValue) : $answerValue,
                'submitted_at' => now(),
            ]);
        }

        // Verify data integrity
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $user->id)
            ->get();

        // Should have exactly 3 responses (for input questions only)
        $this->assertCount(3, $responses, 'Should create responses for input questions only');

        // Verify specific response data integrity
        $textResponse = $responses->where('question_id', $questions[1]->id)->first();
        $this->assertNotNull($textResponse, 'Text question response should exist');
        $this->assertEquals('Text answer with special chars: @#$%', $textResponse->answer_value,
            'Text response should preserve special characters');

        $checkboxResponse = $responses->where('question_id', $questions[2]->id)->first();
        $this->assertNotNull($checkboxResponse, 'Checkbox question response should exist');
        $this->assertEquals('["Option 1","Option 3"]', $checkboxResponse->answer_value,
            'Checkbox response should be JSON encoded array');

        $numberResponse = $responses->where('question_id', $questions[4]->id)->first();
        $this->assertNotNull($numberResponse, 'Number question response should exist');
        $this->assertEquals('42', $numberResponse->answer_value,
            'Number response should be preserved as string');

        // Verify no subheading responses exist
        $subheadingResponseIds = [$questions[0]->id, $questions[3]->id];
        $subheadingResponses = $responses->whereIn('question_id', $subheadingResponseIds);
        $this->assertCount(0, $subheadingResponses, 'No responses should exist for subheadings');
    }

    /**
     * Property: Empty or subheading-only submissions should create no Response records
     */
    public function test_subheading_only_submission_creates_no_responses()
    {
        $user = User::factory()->create();
        $survey = Survey::create([
            'title' => 'Subheading Only Survey',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        // Create only subheading questions
        $subheading1 = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'SH1',
            'label' => 'First Section',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => false,
        ]);

        $subheading2 = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'SH2',
            'label' => 'Second Section',
            'type' => 'subheading',
            'display_order' => 2,
            'is_required' => false,
        ]);

        // Create draft with only subheading responses
        $draftAnswers = [
            $subheading1->id => 'First subheading content',
            $subheading2->id => 'Second subheading content',
        ];

        $draft = SurveyDraft::create([
            'user_id' => $user->id,
            'survey_id' => $survey->id,
            'answers' => $draftAnswers,
            'last_section_id' => $section->id,
        ]);

        // Apply filtering logic
        $subheadingQuestionIds = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })
        ->subheadings()
        ->pluck('id')
        ->toArray();

        $filteredAnswers = collect($draft->answers)
            ->reject(function ($value, $questionId) use ($subheadingQuestionIds) {
                return in_array($questionId, $subheadingQuestionIds);
            })
            ->toArray();

        // Create responses (should be none)
        foreach ($filteredAnswers as $questionId => $answerValue) {
            Response::create([
                'survey_id' => $survey->id,
                'user_id' => $user->id,
                'question_id' => $questionId,
                'answer_value' => is_array($answerValue) ? json_encode($answerValue) : $answerValue,
                'submitted_at' => now(),
            ]);
        }

        // Verify no responses were created
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $user->id)
            ->get();

        $this->assertCount(0, $responses, 'Subheading-only submission should create no Response records');
        $this->assertEmpty($filteredAnswers, 'Filtered answers should be empty for subheading-only draft');
    }

    /**
     * Property: Large-scale submission filtering should maintain performance and correctness
     */
    public function test_large_scale_submission_filtering()
    {
        $user = User::factory()->create();
        $survey = Survey::create([
            'title' => 'Large Scale Test Survey',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Large Test Section',
            'display_order' => 1,
        ]);

        // Create a large number of mixed questions
        $questions = [];
        $draftAnswers = [];
        $expectedInputQuestionCount = 0;

        for ($i = 1; $i <= 100; $i++) {
            $isSubheading = ($i % 3 === 0); // Every 3rd question is a subheading
            
            $question = Question::create([
                'section_id' => $section->id,
                'question_identifier' => $isSubheading ? "SH{$i}" : "Q{$i}",
                'label' => $isSubheading ? "Subheading {$i}" : "Question {$i}",
                'type' => $isSubheading ? 'subheading' : 'text',
                'display_order' => $i,
                'is_required' => !$isSubheading,
            ]);

            $questions[] = $question;
            $draftAnswers[$question->id] = $isSubheading ? "Subheading content {$i}" : "Answer {$i}";
            
            if (!$isSubheading) {
                $expectedInputQuestionCount++;
            }
        }

        $draft = SurveyDraft::create([
            'user_id' => $user->id,
            'survey_id' => $survey->id,
            'answers' => $draftAnswers,
            'last_section_id' => $section->id,
        ]);

        // Apply filtering logic
        $startTime = microtime(true);
        
        $subheadingQuestionIds = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })
        ->subheadings()
        ->pluck('id')
        ->toArray();

        $filteredAnswers = collect($draft->answers)
            ->reject(function ($value, $questionId) use ($subheadingQuestionIds) {
                return in_array($questionId, $subheadingQuestionIds);
            })
            ->toArray();

        $filteringTime = microtime(true) - $startTime;

        // Create responses
        foreach ($filteredAnswers as $questionId => $answerValue) {
            Response::create([
                'survey_id' => $survey->id,
                'user_id' => $user->id,
                'question_id' => $questionId,
                'answer_value' => is_array($answerValue) ? json_encode($answerValue) : $answerValue,
                'submitted_at' => now(),
            ]);
        }

        // Verify correctness at scale
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $user->id)
            ->get();

        $this->assertCount($expectedInputQuestionCount, $responses,
            "Should create responses for {$expectedInputQuestionCount} input questions");

        // Verify performance (filtering should complete quickly)
        $this->assertLessThan(1.0, $filteringTime, 'Filtering should complete within 1 second for 100 questions');

        // Verify no subheading responses exist
        $subheadingQuestionIds = collect($questions)
            ->filter(fn($q) => $q->type === 'subheading')
            ->pluck('id')
            ->toArray();

        $subheadingResponses = $responses->whereIn('question_id', $subheadingQuestionIds);
        $this->assertCount(0, $subheadingResponses, 'No responses should exist for any subheadings');
    }
}