<?php

namespace Tests\Unit;

use App\Http\Requests\SubmitSurveyRequest;
use App\Models\Question;
use App\Models\Section;
use App\Models\Survey;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-based tests for validation exclusion
 * Feature: survey-subheading-feature
 * Property 6: Validation Exclusion
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 */
class ValidationExclusionPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Run all migrations to set up the database properly
        $this->artisan('migrate:fresh');
    }

    /**
     * Property: For any form containing subheadings, the Validation_System should exclude
     * all subheading elements from required field checks and validation rule processing,
     * while maintaining all existing validation rules for input questions.
     */
    public function test_validation_excludes_subheadings_from_required_checks()
    {
        $survey = Survey::create([
            'title' => 'Test Survey',
            'description' => 'Test Description',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        // Create mixed questions including subheadings
        $questions = [
            // Required subheading (should be excluded from validation)
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'SH1',
                'label' => 'Personal Information Section',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => true, // This should be ignored in validation
            ]),
            
            // Required text question (should be validated)
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'Q1',
                'label' => 'What is your name?',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            
            // Another subheading (should be excluded)
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'SH2',
                'label' => 'Contact Information',
                'type' => 'subheading',
                'display_order' => 3,
                'is_required' => false,
            ]),
            
            // Required select question (should be validated)
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'Q2',
                'label' => 'Select your age range',
                'type' => 'select',
                'display_order' => 4,
                'is_required' => true,
                'options' => ['18-25', '26-35', '36-45'],
            ]),
        ];

        // Create a mock request
        $request = new SubmitSurveyRequest();
        $request->setRouteResolver(function () use ($survey) {
            $route = \Mockery::mock();
            $route->shouldReceive('parameter')->with('survey')->andReturn($survey);
            return $route;
        });

        // Get validation rules
        $rules = $request->rules();

        // Verify that subheadings are excluded from validation rules
        $subheadingQuestionIds = [1, 3]; // SH1 and SH2
        $inputQuestionIds = [2, 4]; // Q1 and Q2

        foreach ($subheadingQuestionIds as $questionId) {
            $fieldKey = "answers.{$questionId}";
            $this->assertArrayNotHasKey($fieldKey, $rules, 
                "Subheading question {$questionId} should not have validation rules");
        }

        // Verify that required input questions have validation rules
        foreach ($inputQuestionIds as $questionId) {
            $fieldKey = "answers.{$questionId}";
            $this->assertArrayHasKey($fieldKey, $rules, 
                "Required input question {$questionId} should have validation rules");
        }

        // Verify the total number of validation rules
        $expectedRuleCount = 2; // Only for the 2 required input questions
        $this->assertCount($expectedRuleCount, $rules, 
            'Should only have validation rules for required input questions');
    }

    /**
     * Property: Validation data filtering should remove subheading responses
     */
    public function test_validation_data_filters_subheading_responses()
    {
        $survey = Survey::create([
            'title' => 'Test Survey',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        // Create questions
        $subheadingQuestion = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'SH1',
            'label' => 'Section Header',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => false,
        ]);

        $textQuestion = Question::create([
            'section_id' => $section->id,
            'question_identifier' => 'Q1',
            'label' => 'Your name?',
            'type' => 'text',
            'display_order' => 2,
            'is_required' => true,
        ]);

        // Create request with mixed answers
        $requestData = [
            'answers' => [
                $subheadingQuestion->id => 'This should be filtered out',
                $textQuestion->id => 'John Doe',
            ],
        ];

        $request = new SubmitSurveyRequest();
        $request->replace($requestData);
        $request->setRouteResolver(function () use ($survey) {
            $route = \Mockery::mock();
            $route->shouldReceive('parameter')->with('survey')->andReturn($survey);
            return $route;
        });

        // Get filtered validation data
        $validationData = $request->validationData();

        // Verify subheading response is filtered out
        $this->assertArrayNotHasKey($subheadingQuestion->id, $validationData['answers'],
            'Subheading response should be filtered from validation data');

        // Verify input question response is preserved
        $this->assertArrayHasKey($textQuestion->id, $validationData['answers'],
            'Input question response should be preserved in validation data');
        $this->assertEquals('John Doe', $validationData['answers'][$textQuestion->id],
            'Input question response value should be preserved');
    }

    /**
     * Property: Validation rules should handle different question types correctly
     */
    public function test_validation_rules_handle_different_question_types()
    {
        $survey = Survey::create([
            'title' => 'Test Survey',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        // Create different types of required questions
        $questionTypes = [
            ['type' => 'text', 'label' => 'Text question?'],
            ['type' => 'textarea', 'label' => 'Textarea question?'],
            ['type' => 'number', 'label' => 'Number question?'],
            ['type' => 'select', 'label' => 'Select question?', 'options' => ['A', 'B', 'C']],
            ['type' => 'radio', 'label' => 'Radio question?', 'options' => ['Yes', 'No']],
            ['type' => 'checkbox', 'label' => 'Checkbox question?', 'options' => ['1', '2', '3']],
            ['type' => 'likert', 'label' => 'Likert question?', 'options' => ['1', '2', '3', '4', '5']],
            ['type' => 'subheading', 'label' => 'This is a subheading'], // Should be excluded
        ];

        $createdQuestions = [];
        foreach ($questionTypes as $index => $questionData) {
            $question = Question::create([
                'section_id' => $section->id,
                'question_identifier' => $questionData['type'] === 'subheading' ? 'SH1' : "Q{$index}",
                'label' => $questionData['label'],
                'type' => $questionData['type'],
                'display_order' => $index + 1,
                'is_required' => true, // All marked as required
                'options' => $questionData['options'] ?? null,
            ]);
            $createdQuestions[] = $question;
        }

        $request = new SubmitSurveyRequest();
        $request->setRouteResolver(function () use ($survey) {
            $route = \Mockery::mock();
            $route->shouldReceive('parameter')->with('survey')->andReturn($survey);
            return $route;
        });

        $rules = $request->rules();

        // Verify each question type has appropriate validation rules (except subheading)
        foreach ($createdQuestions as $question) {
            $fieldKey = "answers.{$question->id}";
            
            if ($question->type === 'subheading') {
                $this->assertArrayNotHasKey($fieldKey, $rules,
                    "Subheading should not have validation rules");
            } else {
                $this->assertArrayHasKey($fieldKey, $rules,
                    "{$question->type} question should have validation rules");
                
                // Verify rule structure based on question type
                $questionRules = $rules[$fieldKey];
                $this->assertContains('required', $questionRules,
                    "{$question->type} question should be required");
                
                if ($question->type === 'checkbox') {
                    $this->assertContains('array', $questionRules,
                        "Checkbox question should have array validation");
                } else {
                    $this->assertContains('string', $questionRules,
                        "{$question->type} question should have string validation");
                }
            }
        }

        // Verify total rule count (7 input questions, 1 subheading excluded)
        $expectedInputQuestions = 7;
        $this->assertCount($expectedInputQuestions, $rules,
            'Should have validation rules for all input questions but not subheadings');
    }

    /**
     * Property: Non-required questions should not have validation rules
     */
    public function test_non_required_questions_excluded_from_validation()
    {
        $survey = Survey::create([
            'title' => 'Test Survey',
            'status' => 'active',
        ]);
        
        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Test Section',
            'display_order' => 1,
        ]);

        // Create mix of required and non-required questions
        $questions = [
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'Q1',
                'label' => 'Required question?',
                'type' => 'text',
                'display_order' => 1,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'Q2',
                'label' => 'Optional question?',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $section->id,
                'question_identifier' => 'SH1',
                'label' => 'Subheading (always non-required)',
                'type' => 'subheading',
                'display_order' => 3,
                'is_required' => false,
            ]),
        ];

        $request = new SubmitSurveyRequest();
        $request->setRouteResolver(function () use ($survey) {
            $route = \Mockery::mock();
            $route->shouldReceive('parameter')->with('survey')->andReturn($survey);
            return $route;
        });

        $rules = $request->rules();

        // Only the required input question should have validation rules
        $this->assertArrayHasKey("answers.{$questions[0]->id}", $rules,
            'Required input question should have validation rules');
        $this->assertArrayNotHasKey("answers.{$questions[1]->id}", $rules,
            'Optional input question should not have validation rules');
        $this->assertArrayNotHasKey("answers.{$questions[2]->id}", $rules,
            'Subheading should not have validation rules');

        $this->assertCount(1, $rules, 'Should only have rules for required input questions');
    }

    /**
     * Property: Empty survey should have no validation rules
     */
    public function test_empty_survey_has_no_validation_rules()
    {
        $survey = Survey::create([
            'title' => 'Empty Survey',
            'status' => 'active',
        ]);

        $request = new SubmitSurveyRequest();
        $request->setRouteResolver(function () use ($survey) {
            $route = \Mockery::mock();
            $route->shouldReceive('parameter')->with('survey')->andReturn($survey);
            return $route;
        });

        $rules = $request->rules();

        $this->assertEmpty($rules, 'Empty survey should have no validation rules');
    }

    protected function tearDown(): void
    {
        \Mockery::close();
        parent::tearDown();
    }
}