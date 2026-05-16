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
 * Integration property tests for subheading feature
 * Feature: survey-subheading-feature
 * Validates: End-to-end data integrity and system behavior
 */
class SubheadingIntegrationPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $alumna;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->alumna = User::factory()->create(['role' => 'alumna']);
    }

    /**
     * Property: End-to-end data integrity should be maintained across all components
     * for any survey containing mixed question types and subheadings.
     */
    public function test_end_to_end_data_integrity_across_all_components()
    {
        // Create survey with complex mixed content
        $survey = Survey::create([
            'title' => 'Complex Integration Survey',
            'status' => 'active',
        ]);

        $sections = [];
        $allQuestions = [];
        $expectedInputQuestions = [];

        // Create 3 sections with mixed content
        for ($sectionNum = 1; $sectionNum <= 3; $sectionNum++) {
            $section = Section::create([
                'survey_id' => $survey->id,
                'title' => "Section {$sectionNum}",
                'display_order' => $sectionNum,
            ]);
            $sections[] = $section;

            // Create mixed items in each section
            $sectionQuestions = [];
            for ($itemNum = 1; $itemNum <= 5; $itemNum++) {
                $isSubheading = ($itemNum % 2 === 0); // Every 2nd item is a subheading
                
                $question = Question::create([
                    'section_id' => $section->id,
                    'question_identifier' => $isSubheading ? "S{$sectionNum}_SH{$itemNum}" : "S{$sectionNum}_Q{$itemNum}",
                    'label' => $isSubheading ? "Section {$sectionNum} Header {$itemNum}" : "Section {$sectionNum} Question {$itemNum}",
                    'type' => $isSubheading ? 'subheading' : 'text',
                    'display_order' => $itemNum,
                    'is_required' => !$isSubheading,
                    'options' => null,
                ]);

                $sectionQuestions[] = $question;
                $allQuestions[] = $question;
                
                if (!$isSubheading) {
                    $expectedInputQuestions[] = $question;
                }
            }
        }

        // Verify initial data integrity
        $this->assertCount(15, $allQuestions, 'Should have 15 total items (5 per section × 3 sections)');
        $this->assertCount(9, $expectedInputQuestions, 'Should have 9 input questions (3 per section × 3 sections)');

        // Admin performs reordering operations
        $this->actingAs($this->admin);

        // Reorder items in first section
        $section1Questions = Question::where('section_id', $sections[0]->id)->get();
        $reorderData = [
            'questions' => $section1Questions->map(function ($q, $index) {
                return ['id' => $q->id, 'display_order' => 6 - $q->display_order]; // Reverse order
            })->toArray(),
        ];

        $response = $this->post(route('admin.questions.reorder', $sections[0]->id), $reorderData);
        $response->assertRedirect();

        // Move a question between sections
        $questionToMove = $section1Questions->where('type', 'text')->first();
        $moveData = ['section_id' => $sections[1]->id];
        $response = $this->post(route('admin.questions.move', $questionToMove->id), $moveData);
        $response->assertRedirect();

        // Alumna completes the survey
        $this->actingAs($this->alumna);

        // Create comprehensive submission data
        $submissionAnswers = [];
        foreach ($allQuestions as $question) {
            if ($question->type === 'subheading') {
                $submissionAnswers[$question->id] = "Subheading content for {$question->question_identifier}";
            } else {
                $submissionAnswers[$question->id] = "Answer for {$question->question_identifier}";
            }
        }

        // Save draft
        $this->post(route('alumna.surveys.saveSection', $survey->id), [
            'answers' => $submissionAnswers,
            'section_id' => $sections[0]->id,
        ]);

        // Verify draft contains all answers
        $draft = SurveyDraft::where('user_id', $this->alumna->id)
            ->where('survey_id', $survey->id)
            ->first();

        $this->assertNotNull($draft, 'Draft should be created');
        $this->assertCount(15, $draft->answers, 'Draft should contain all answers including subheadings');

        // Submit survey
        $response = $this->post(route('alumna.surveys.submit', $survey->id), []);
        $response->assertRedirect();

        // Verify end-to-end data integrity
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        // Should have responses only for input questions (after move operation)
        $currentInputQuestions = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })->where('type', '!=', 'subheading')->get();

        $this->assertCount($currentInputQuestions->count(), $responses, 
            'Should have responses for all current input questions');

        // Verify no subheading responses
        $subheadingQuestions = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })->where('type', 'subheading')->get();

        $subheadingResponses = $responses->whereIn('question_id', $subheadingQuestions->pluck('id'));
        $this->assertCount(0, $subheadingResponses, 'No responses should exist for subheadings');

        // Verify all input question responses exist and have correct data
        foreach ($currentInputQuestions as $question) {
            $response = $responses->where('question_id', $question->id)->first();
            $this->assertNotNull($response, "Response should exist for question {$question->question_identifier}");
            $this->assertEquals("Answer for {$question->question_identifier}", $response->answer_value,
                "Response value should be preserved for {$question->question_identifier}");
        }

        // Verify draft was cleaned up
        $this->assertDatabaseMissing('survey_drafts', [
            'user_id' => $this->alumna->id,
            'survey_id' => $survey->id,
        ]);
    }

    /**
     * Property: System should handle large numbers of subheadings efficiently
     * without performance degradation or data corruption.
     */
    public function test_system_behavior_with_large_numbers_of_subheadings()
    {
        $survey = Survey::create([
            'title' => 'Large Scale Survey',
            'status' => 'active',
        ]);

        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Large Scale Section',
            'display_order' => 1,
        ]);

        // Create large number of mixed items (100 total: 50 subheadings, 50 questions)
        $allItems = [];
        $subheadings = [];
        $inputQuestions = [];

        $startTime = microtime(true);

        for ($i = 1; $i <= 100; $i++) {
            $isSubheading = ($i % 2 === 0); // Every 2nd item is a subheading
            
            $item = Question::create([
                'section_id' => $section->id,
                'question_identifier' => $isSubheading ? "SH{$i}" : "Q{$i}",
                'label' => $isSubheading ? "Large Scale Header {$i}" : "Large Scale Question {$i}",
                'type' => $isSubheading ? 'subheading' : 'text',
                'display_order' => $i,
                'is_required' => !$isSubheading,
            ]);

            $allItems[] = $item;
            if ($isSubheading) {
                $subheadings[] = $item;
            } else {
                $inputQuestions[] = $item;
            }
        }

        $creationTime = microtime(true) - $startTime;

        // Verify creation performance
        $this->assertLessThan(5.0, $creationTime, 'Creating 100 mixed items should complete within 5 seconds');
        $this->assertCount(100, $allItems, 'Should have 100 total items');
        $this->assertCount(50, $subheadings, 'Should have 50 subheadings');
        $this->assertCount(50, $inputQuestions, 'Should have 50 input questions');

        // Perform large-scale reordering
        $this->actingAs($this->admin);

        $startTime = microtime(true);

        $reorderData = [
            'questions' => collect($allItems)->map(function ($item, $index) {
                return ['id' => $item->id, 'display_order' => 101 - $item->display_order]; // Reverse order
            })->toArray(),
        ];

        $response = $this->post(route('admin.questions.reorder', $section->id), $reorderData);
        $response->assertRedirect();

        $reorderTime = microtime(true) - $startTime;

        // Verify reordering performance
        $this->assertLessThan(3.0, $reorderTime, 'Reordering 100 items should complete within 3 seconds');

        // Alumna submits large survey
        $this->actingAs($this->alumna);

        $submissionAnswers = [];
        foreach ($allItems as $item) {
            if ($item->type === 'subheading') {
                $submissionAnswers[$item->id] = "Large scale subheading content {$item->id}";
            } else {
                $submissionAnswers[$item->id] = "Large scale answer {$item->id}";
            }
        }

        // Create draft
        $startTime = microtime(true);

        $this->post(route('alumna.surveys.saveSection', $survey->id), [
            'answers' => $submissionAnswers,
            'section_id' => $section->id,
        ]);

        $draftTime = microtime(true) - $startTime;

        // Submit survey
        $startTime = microtime(true);

        $response = $this->post(route('alumna.surveys.submit', $survey->id), []);
        $response->assertRedirect();

        $submissionTime = microtime(true) - $startTime;

        // Verify submission performance
        $this->assertLessThan(2.0, $draftTime, 'Creating draft with 100 answers should complete within 2 seconds');
        $this->assertLessThan(3.0, $submissionTime, 'Submitting survey with 100 items should complete within 3 seconds');

        // Verify data integrity at scale
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        $this->assertCount(50, $responses, 'Should create responses for 50 input questions only');

        // Verify no subheading responses
        $subheadingIds = collect($subheadings)->pluck('id')->toArray();
        $subheadingResponses = $responses->whereIn('question_id', $subheadingIds);
        $this->assertCount(0, $subheadingResponses, 'No responses should exist for any of the 50 subheadings');

        // Verify all input question responses exist
        $inputQuestionIds = collect($inputQuestions)->pluck('id')->toArray();
        $inputResponses = $responses->whereIn('question_id', $inputQuestionIds);
        $this->assertCount(50, $inputResponses, 'All 50 input questions should have responses');

        // Verify response data integrity
        foreach ($inputQuestions as $question) {
            $response = $responses->where('question_id', $question->id)->first();
            $this->assertNotNull($response, "Response should exist for question {$question->id}");
            $this->assertEquals("Large scale answer {$question->id}", $response->answer_value,
                "Response value should be preserved for question {$question->id}");
        }
    }

    /**
     * Property: Concurrent operations should maintain data consistency
     * across all system components.
     */
    public function test_concurrent_operations_maintain_data_consistency()
    {
        $survey = Survey::create([
            'title' => 'Concurrent Operations Survey',
            'status' => 'active',
        ]);

        $section = Section::create([
            'survey_id' => $survey->id,
            'title' => 'Concurrent Test Section',
            'display_order' => 1,
        ]);

        // Create initial mixed content
        $items = [];
        for ($i = 1; $i <= 10; $i++) {
            $isSubheading = ($i % 3 === 0); // Every 3rd item is a subheading
            
            $item = Question::create([
                'section_id' => $section->id,
                'question_identifier' => $isSubheading ? "SH{$i}" : "Q{$i}",
                'label' => $isSubheading ? "Concurrent Header {$i}" : "Concurrent Question {$i}",
                'type' => $isSubheading ? 'subheading' : 'text',
                'display_order' => $i,
                'is_required' => !$isSubheading,
            ]);
            $items[] = $item;
        }

        $this->actingAs($this->admin);

        // Simulate concurrent admin operations
        
        // 1. Reorder items
        $reorderData = [
            'questions' => collect($items)->map(function ($item, $index) {
                return ['id' => $item->id, 'display_order' => ($index % 2 === 0) ? $item->display_order : 11 - $item->display_order];
            })->toArray(),
        ];

        $this->post(route('admin.questions.reorder', $section->id), $reorderData);

        // 2. Add new items
        $newSubheading = [
            'label' => 'New Concurrent Subheading',
            'type' => 'subheading',
            'is_required' => false,
            'options' => null,
        ];

        $this->post(route('admin.questions.store', $section->id), $newSubheading);

        $newQuestion = [
            'label' => 'New Concurrent Question',
            'type' => 'text',
            'is_required' => true,
            'options' => null,
        ];

        $this->post(route('admin.questions.store', $section->id), $newQuestion);

        // 3. Delete an item
        $itemToDelete = $items[2]; // Delete a subheading
        $this->delete(route('admin.questions.destroy', $itemToDelete->id));

        // Verify system consistency after concurrent operations
        $finalItems = Question::where('section_id', $section->id)
            ->orderBy('display_order')
            ->get();

        // Verify display order integrity
        $displayOrders = $finalItems->pluck('display_order')->toArray();
        $expectedSequence = range(1, count($finalItems));
        $this->assertEquals($expectedSequence, $displayOrders,
            'Display orders should form continuous sequence after concurrent operations');

        // Verify no duplicates
        $this->assertEquals(count($displayOrders), count(array_unique($displayOrders)),
            'All display_order values should be unique after concurrent operations');

        // Now simulate concurrent user submission
        $this->actingAs($this->alumna);

        // Create submission data for all current items
        $submissionAnswers = [];
        foreach ($finalItems as $item) {
            if ($item->type === 'subheading') {
                $submissionAnswers[$item->id] = "Concurrent subheading content {$item->id}";
            } else {
                $submissionAnswers[$item->id] = "Concurrent answer {$item->id}";
            }
        }

        // Create draft and submit
        $this->post(route('alumna.surveys.saveSection', $survey->id), [
            'answers' => $submissionAnswers,
            'section_id' => $section->id,
        ]);

        $response = $this->post(route('alumna.surveys.submit', $survey->id), []);
        $response->assertRedirect();

        // Verify final data consistency
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        $inputQuestions = $finalItems->where('type', '!=', 'subheading');
        $subheadings = $finalItems->where('type', 'subheading');

        $this->assertCount($inputQuestions->count(), $responses,
            'Should have responses for all input questions after concurrent operations');

        // Verify no subheading responses
        $subheadingResponses = $responses->whereIn('question_id', $subheadings->pluck('id'));
        $this->assertCount(0, $subheadingResponses,
            'No responses should exist for subheadings after concurrent operations');

        // Verify all input question responses exist with correct data
        foreach ($inputQuestions as $question) {
            $response = $responses->where('question_id', $question->id)->first();
            $this->assertNotNull($response, "Response should exist for question {$question->id}");
            $this->assertEquals("Concurrent answer {$question->id}", $response->answer_value,
                "Response value should be preserved for question {$question->id}");
        }
    }

    /**
     * Property: Cross-section data integrity should be maintained
     * when subheadings are moved between sections.
     */
    public function test_cross_section_data_integrity_with_subheading_moves()
    {
        $survey = Survey::create([
            'title' => 'Cross-Section Survey',
            'status' => 'active',
        ]);

        // Create multiple sections
        $sections = [];
        for ($i = 1; $i <= 3; $i++) {
            $sections[] = Section::create([
                'survey_id' => $survey->id,
                'title' => "Cross-Section {$i}",
                'display_order' => $i,
            ]);
        }

        // Create mixed content in each section
        $allItems = [];
        foreach ($sections as $sectionIndex => $section) {
            for ($itemNum = 1; $itemNum <= 4; $itemNum++) {
                $isSubheading = ($itemNum % 2 === 0);
                
                $item = Question::create([
                    'section_id' => $section->id,
                    'question_identifier' => $isSubheading ? "S{$sectionIndex}_SH{$itemNum}" : "S{$sectionIndex}_Q{$itemNum}",
                    'label' => $isSubheading ? "Section {$sectionIndex} Header {$itemNum}" : "Section {$sectionIndex} Question {$itemNum}",
                    'type' => $isSubheading ? 'subheading' : 'text',
                    'display_order' => $itemNum,
                    'is_required' => !$isSubheading,
                ]);
                $allItems[] = $item;
            }
        }

        $this->actingAs($this->admin);

        // Move subheadings between sections
        $subheadingsToMove = collect($allItems)->filter(fn($item) => $item->type === 'subheading');
        
        // Move first subheading from section 1 to section 2
        $firstSubheading = $subheadingsToMove->where('section_id', $sections[0]->id)->first();
        $this->post(route('admin.questions.move', $firstSubheading->id), [
            'section_id' => $sections[1]->id,
        ]);

        // Move a subheading from section 2 to section 3
        $secondSubheading = $subheadingsToMove->where('section_id', $sections[1]->id)->first();
        $this->post(route('admin.questions.move', $secondSubheading->id), [
            'section_id' => $sections[2]->id,
        ]);

        // Verify cross-section integrity
        foreach ($sections as $section) {
            $sectionItems = Question::where('section_id', $section->id)
                ->orderBy('display_order')
                ->get();

            // Verify continuous display order in each section
            $displayOrders = $sectionItems->pluck('display_order')->toArray();
            $expectedSequence = range(1, count($sectionItems));
            $this->assertEquals($expectedSequence, $displayOrders,
                "Section {$section->id} should have continuous display order sequence");
        }

        // Alumna submits survey with moved subheadings
        $this->actingAs($this->alumna);

        // Get current state of all items
        $currentItems = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })->get();

        $submissionAnswers = [];
        foreach ($currentItems as $item) {
            if ($item->type === 'subheading') {
                $submissionAnswers[$item->id] = "Moved subheading content {$item->id}";
            } else {
                $submissionAnswers[$item->id] = "Cross-section answer {$item->id}";
            }
        }

        // Submit survey
        $this->post(route('alumna.surveys.saveSection', $survey->id), [
            'answers' => $submissionAnswers,
            'section_id' => $sections[0]->id,
        ]);

        $response = $this->post(route('alumna.surveys.submit', $survey->id), []);
        $response->assertRedirect();

        // Verify cross-section data integrity
        $responses = Response::where('survey_id', $survey->id)
            ->where('user_id', $this->alumna->id)
            ->get();

        $inputQuestions = $currentItems->where('type', '!=', 'subheading');
        $subheadings = $currentItems->where('type', 'subheading');

        $this->assertCount($inputQuestions->count(), $responses,
            'Should have responses for all input questions across all sections');

        // Verify no subheading responses (including moved ones)
        $subheadingResponses = $responses->whereIn('question_id', $subheadings->pluck('id'));
        $this->assertCount(0, $subheadingResponses,
            'No responses should exist for subheadings, including moved ones');

        // Verify responses exist for questions in all sections
        foreach ($sections as $section) {
            $sectionInputQuestions = $inputQuestions->where('section_id', $section->id);
            $sectionResponses = $responses->whereIn('question_id', $sectionInputQuestions->pluck('id'));
            
            $this->assertCount($sectionInputQuestions->count(), $sectionResponses,
                "Section {$section->id} should have responses for all its input questions");
        }
    }
}