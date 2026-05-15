<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\Response;
use App\Models\Section;
use App\Models\Survey;
use App\Models\SurveyDraft;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * End-to-end integration tests for subheading feature
 * Feature: survey-subheading-feature
 * Validates: All requirements - complete workflow testing
 */
class SubheadingFeatureIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $alumna;
    protected $survey;
    protected $section;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->alumna = User::factory()->create(['role' => 'alumna']);
        
        $this->survey = Survey::create([
            'title' => 'Integration Test Survey',
            'status' => 'active',
        ]);
        
        $this->section = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Integration Test Section',
            'display_order' => 1,
        ]);
    }

    /**
     * Test complete subheading creation workflow
     */
    public function test_complete_subheading_creation_workflow()
    {
        $this->actingAs($this->admin);

        // 1. Create a subheading via API
        $subheadingData = [
            'label' => 'Personal Information Section',
            'type' => 'subheading',
            'is_required' => false,
            'options' => null,
        ];

        $response = $this->post(route('admin.questions.store', $this->section->id), $subheadingData);
        $response->assertRedirect();

        // 2. Verify subheading was created correctly
        $subheading = Question::where('section_id', $this->section->id)
            ->where('type', 'subheading')
            ->first();

        $this->assertNotNull($subheading, 'Subheading should be created');
        $this->assertEquals('Personal Information Section', $subheading->label);
        $this->assertEquals('subheading', $subheading->type);
        $this->assertEquals(false, $subheading->is_required);
        $this->assertNull($subheading->options);
        $this->assertEquals(1, $subheading->display_order);

        // 3. Create a regular question after the subheading
        $questionData = [
            'label' => 'What is your name?',
            'type' => 'text',
            'is_required' => true,
            'options' => null,
        ];

        $response = $this->post(route('admin.questions.store', $this->section->id), $questionData);
        $response->assertRedirect();

        // 4. Verify question was created with correct display order
        $question = Question::where('section_id', $this->section->id)
            ->where('type', 'text')
            ->first();

        $this->assertNotNull($question, 'Question should be created');
        $this->assertEquals(2, $question->display_order, 'Question should have display_order 2');

        // 5. Verify both items exist in correct order
        $allItems = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(2, $allItems);
        $this->assertEquals('subheading', $allItems[0]->type);
        $this->assertEquals('text', $allItems[1]->type);
    }

    /**
     * Test complete survey submission workflow with mixed content
     */
    public function test_complete_survey_submission_workflow_with_mixed_content()
    {
        // 1. Create mixed survey content
        $subheading1 = Question::create([
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
            'label' => 'Your full name?',
            'type' => 'text',
            'display_order' => 2,
            'is_required' => true,
        ]);

        $selectQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q2',
            'label' => 'Your age range?',
            'type' => 'select',
            'display_order' => 3,
            'is_required' => true,
            'options' => ['18-25', '26-35', '36-45', '46+'],
        ]);

        $subheading2 = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH2',
            'label' => 'Additional Information',
            'type' => 'subheading',
            'display_order' => 4,
            'is_required' => false,
        ]);

        $textareaQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q3',
            'label' => 'Any comments?',
            'type' => 'textarea',
            'display_order' => 5,
            'is_required' => false,
        ]);

        // 2. Alumna views the survey
        $this->actingAs($this->alumna);
        
        $response = $this->get(route('alumna.surveys.show', $this->survey->id));
        $response->assertOk();

        // 3. Create draft with mixed answers (including subheading responses)
        $draftData = [
            'answers' => [
                $subheading1->id => 'This should be filtered out',
                $textQuestion->id => 'John Doe',
                $selectQuestion->id => '26-35',
                $subheading2->id => 'This should also be filtered out',
                $textareaQuestion->id => 'Great survey!',
            ],
            'section_id' => $this->section->id,
        ];

        $response = $this->post(route('alumna.surveys.saveSection', $this->survey->id), $draftData);
        $response->assertRedirect();

        // 4. Verify draft was created with all answers (including subheadings)
        $draft = SurveyDraft::where('user_id', $this->alumna->id)
            ->where('survey_id', $this->survey->id)
            ->first();

        $this->assertNotNull($draft, 'Draft should be created');
        $this->assertCount(5, $draft->answers, 'Draft should contain all answers including subheadings');

        // 5. Submit the survey
        $response = $this->post(route('alumna.surveys.submit', $this->survey->id), []);
        $response->assertRedirect();

        // 6. Verify only input question responses were created (subheadings filtered out)
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        $this->assertCount(3, $responses, 'Should create responses only for input questions');

        // 7. Verify no responses for subheadings
        $subheadingResponses = $responses->whereIn('question_id', [$subheading1->id, $subheading2->id]);
        $this->assertCount(0, $subheadingResponses, 'No responses should exist for subheadings');

        // 8. Verify responses for input questions
        $textResponse = $responses->where('question_id', $textQuestion->id)->first();
        $this->assertNotNull($textResponse, 'Text question response should exist');
        $this->assertEquals('John Doe', $textResponse->answer_value);

        $selectResponse = $responses->where('question_id', $selectQuestion->id)->first();
        $this->assertNotNull($selectResponse, 'Select question response should exist');
        $this->assertEquals('26-35', $selectResponse->answer_value);

        $textareaResponse = $responses->where('question_id', $textareaQuestion->id)->first();
        $this->assertNotNull($textareaResponse, 'Textarea question response should exist');
        $this->assertEquals('Great survey!', $textareaResponse->answer_value);

        // 9. Verify draft was cleaned up
        $this->assertDatabaseMissing('survey_drafts', [
            'user_id' => $this->alumna->id,
            'survey_id' => $this->survey->id,
        ]);
    }

    /**
     * Test data flow from creation to submission with reordering
     */
    public function test_data_flow_with_reordering()
    {
        $this->actingAs($this->admin);

        // 1. Create initial items
        $items = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 1,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH1',
                'label' => 'Section Header',
                'type' => 'subheading',
                'display_order' => 2,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q2',
                'label' => 'Question 2',
                'type' => 'text',
                'display_order' => 3,
                'is_required' => true,
            ]),
        ];

        // 2. Reorder items: move subheading to first position
        $reorderData = [
            'questions' => [
                ['id' => $items[1]->id, 'display_order' => 1], // SH1 to position 1
                ['id' => $items[0]->id, 'display_order' => 2], // Q1 to position 2
                ['id' => $items[2]->id, 'display_order' => 3], // Q2 to position 3
            ],
        ];

        $response = $this->post(route('admin.questions.reorder', $this->section->id), $reorderData);
        $response->assertRedirect();

        // 3. Verify reordering worked
        $reorderedItems = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertEquals('SH1', $reorderedItems[0]->question_identifier);
        $this->assertEquals('Q1', $reorderedItems[1]->question_identifier);
        $this->assertEquals('Q2', $reorderedItems[2]->question_identifier);

        // 4. Alumna submits survey with reordered content
        $this->actingAs($this->alumna);

        $submissionData = [
            'answers' => [
                $items[1]->id => 'Subheading content to filter',
                $items[0]->id => 'Answer to Q1',
                $items[2]->id => 'Answer to Q2',
            ],
        ];

        // Create draft first
        $this->post(route('alumna.surveys.saveSection', $this->survey->id), [
            'answers' => $submissionData['answers'],
            'section_id' => $this->section->id,
        ]);

        // Submit survey
        $response = $this->post(route('alumna.surveys.submit', $this->survey->id), []);
        $response->assertRedirect();

        // 5. Verify submission filtering worked correctly
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        $this->assertCount(2, $responses, 'Should create responses only for input questions');

        // Verify responses exist for questions but not subheading
        $q1Response = $responses->where('question_id', $items[0]->id)->first();
        $this->assertNotNull($q1Response);
        $this->assertEquals('Answer to Q1', $q1Response->answer_value);

        $q2Response = $responses->where('question_id', $items[2]->id)->first();
        $this->assertNotNull($q2Response);
        $this->assertEquals('Answer to Q2', $q2Response->answer_value);

        $subheadingResponse = $responses->where('question_id', $items[1]->id)->first();
        $this->assertNull($subheadingResponse, 'No response should exist for subheading');
    }

    /**
     * Test validation workflow with mixed content
     */
    public function test_validation_workflow_with_mixed_content()
    {
        // 1. Create mixed content with required and optional items
        $subheading = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH1',
            'label' => 'Required Information',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => true, // This should be ignored in validation
        ]);

        $requiredQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Required question',
            'type' => 'text',
            'display_order' => 2,
            'is_required' => true,
        ]);

        $optionalQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q2',
            'label' => 'Optional question',
            'type' => 'text',
            'display_order' => 3,
            'is_required' => false,
        ]);

        $this->actingAs($this->alumna);

        // 2. Try to submit with missing required question (but include subheading response)
        $invalidSubmissionData = [
            'answers' => [
                $subheading->id => 'Subheading content',
                // Missing required question
                $optionalQuestion->id => 'Optional answer',
            ],
        ];

        // Create draft
        $this->post(route('alumna.surveys.saveSection', $this->survey->id), [
            'answers' => $invalidSubmissionData['answers'],
            'section_id' => $this->section->id,
        ]);

        // Try to submit - should fail validation
        $response = $this->post(route('alumna.surveys.submit', $this->survey->id), []);
        
        // Should redirect back with validation errors (not proceed to success page)
        $response->assertRedirect();
        $response->assertSessionHasErrors();

        // 3. Submit with valid data (including subheading response)
        $validSubmissionData = [
            'answers' => [
                $subheading->id => 'Subheading content to filter',
                $requiredQuestion->id => 'Required answer',
                $optionalQuestion->id => 'Optional answer',
            ],
        ];

        // Update draft
        $this->post(route('alumna.surveys.saveSection', $this->survey->id), [
            'answers' => $validSubmissionData['answers'],
            'section_id' => $this->section->id,
        ]);

        // Submit - should succeed
        $response = $this->post(route('alumna.surveys.submit', $this->survey->id), []);
        $response->assertRedirect(route('alumna.questionnaire'));

        // 4. Verify only input questions were saved
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        $this->assertCount(2, $responses, 'Should save responses for input questions only');

        // Verify subheading response was filtered out
        $subheadingResponse = $responses->where('question_id', $subheading->id)->first();
        $this->assertNull($subheadingResponse, 'Subheading response should be filtered out');
    }

    /**
     * Test complex workflow with multiple sections and mixed content
     */
    public function test_complex_multi_section_workflow()
    {
        // 1. Create second section
        $section2 = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Second Section',
            'display_order' => 2,
        ]);

        // 2. Create mixed content in both sections
        $section1Items = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'S1_SH1',
                'label' => 'Section 1 Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'S1_Q1',
                'label' => 'Section 1 Question',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
        ];

        $section2Items = [
            Question::create([
                'section_id' => $section2->id,
                'question_identifier' => 'S2_SH1',
                'label' => 'Section 2 Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $section2->id,
                'question_identifier' => 'S2_Q1',
                'label' => 'Section 2 Question',
                'type' => 'select',
                'display_order' => 2,
                'is_required' => true,
                'options' => ['Option A', 'Option B', 'Option C'],
            ]),
        ];

        $this->actingAs($this->admin);

        // 3. Move a question between sections
        $moveData = ['section_id' => $section2->id];
        $response = $this->post(route('admin.questions.move', $section1Items[1]->id), $moveData);
        $response->assertRedirect();

        // 4. Verify move worked and display orders were updated
        $section1Items[1]->refresh();
        $this->assertEquals($section2->id, $section1Items[1]->section_id);
        $this->assertEquals(3, $section1Items[1]->display_order); // Should be appended

        // 5. Alumna completes survey
        $this->actingAs($this->alumna);

        $submissionData = [
            'answers' => [
                $section1Items[0]->id => 'Section 1 subheading content',
                $section1Items[1]->id => 'Moved question answer',
                $section2Items[0]->id => 'Section 2 subheading content',
                $section2Items[1]->id => 'Option B',
            ],
        ];

        // Create draft and submit
        $this->post(route('alumna.surveys.saveSection', $this->survey->id), [
            'answers' => $submissionData['answers'],
            'section_id' => $this->section->id,
        ]);

        $response = $this->post(route('alumna.surveys.submit', $this->survey->id), []);
        $response->assertRedirect();

        // 6. Verify responses were created correctly
        $responses = Response::where('survey_id', $this->survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        $this->assertCount(2, $responses, 'Should create responses for input questions only');

        // Verify no subheading responses
        $subheadingIds = [$section1Items[0]->id, $section2Items[0]->id];
        $subheadingResponses = $responses->whereIn('question_id', $subheadingIds);
        $this->assertCount(0, $subheadingResponses, 'No subheading responses should be created');

        // Verify input question responses
        $inputResponses = $responses->whereIn('question_id', [$section1Items[1]->id, $section2Items[1]->id]);
        $this->assertCount(2, $inputResponses, 'Both input question responses should be created');
    }
}