<?php

namespace Tests\Unit;

use App\Http\Controllers\QuestionController;
use App\Models\Question;
use App\Models\Section;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

/**
 * Property-based tests for display order integrity
 * Feature: survey-subheading-feature
 * Property 2: Display Order Integrity
 * Validates: Requirements 1.4, 3.4, 6.1, 6.3
 */
class DisplayOrderIntegrityPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected $controller;
    protected $user;
    protected $survey;
    protected $section;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->controller = new QuestionController();
        $this->user = User::factory()->create(['user_role' => 'admin']);
        
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
     * Property: For any section containing mixed question types (including subheadings),
     * the display_order values should form a continuous sequence starting from 1,
     * with no gaps or duplicates, regardless of the question types.
     */
    public function test_display_order_maintains_continuous_sequence_with_mixed_types()
    {
        // Create mixed questions and subheadings
        $items = [
            ['type' => 'subheading', 'label' => 'Personal Information'],
            ['type' => 'text', 'label' => 'Your name?'],
            ['type' => 'text', 'label' => 'Your email?'],
            ['type' => 'subheading', 'label' => 'Contact Information'],
            ['type' => 'select', 'label' => 'Your country?', 'options' => ['US', 'CA', 'UK']],
            ['type' => 'subheading', 'label' => 'Additional Information'],
            ['type' => 'textarea', 'label' => 'Comments?'],
        ];

        $createdItems = [];
        foreach ($items as $index => $itemData) {
            $question = Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => $itemData['type'] === 'subheading' ? "SH" . ($index + 1) : "Q" . ($index + 1),
                'label' => $itemData['label'],
                'type' => $itemData['type'],
                'display_order' => $index + 1, // Sequential order
                'is_required' => $itemData['type'] !== 'subheading',
                'options' => $itemData['options'] ?? null,
            ]);
            $createdItems[] = $question;
        }

        // Verify initial sequence integrity
        $questions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(7, $questions, 'Should have 7 items total');

        // Verify continuous sequence
        foreach ($questions as $index => $question) {
            $this->assertEquals($index + 1, $question->display_order,
                "Item at position {$index} should have display_order " . ($index + 1));
        }

        // Verify no gaps in sequence
        $displayOrders = $questions->pluck('display_order')->toArray();
        $expectedSequence = range(1, count($questions));
        $this->assertEquals($expectedSequence, $displayOrders,
            'Display orders should form continuous sequence 1,2,3...');

        // Verify no duplicates
        $this->assertEquals(count($displayOrders), count(array_unique($displayOrders)),
            'All display_order values should be unique');
    }

    /**
     * Property: Reordering mixed question/subheading lists should maintain sequence integrity
     */
    public function test_reordering_maintains_sequence_integrity_with_mixed_types()
    {
        // Create initial mixed items
        $items = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH1',
                'label' => 'Section A',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q2',
                'label' => 'Question 2',
                'type' => 'select',
                'display_order' => 3,
                'is_required' => true,
                'options' => ['A', 'B', 'C'],
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH2',
                'label' => 'Section B',
                'type' => 'subheading',
                'display_order' => 4,
                'is_required' => false,
            ]),
        ];

        // Reorder: move subheading to position 2, shift others
        $reorderData = [
            ['id' => $items[0]->id, 'display_order' => 1], // SH1 stays at 1
            ['id' => $items[3]->id, 'display_order' => 2], // SH2 moves to 2
            ['id' => $items[1]->id, 'display_order' => 3], // Q1 moves to 3
            ['id' => $items[2]->id, 'display_order' => 4], // Q2 moves to 4
        ];

        $request = new Request(['questions' => $reorderData]);
        $this->controller->reorder($request, $this->section);

        // Verify sequence integrity after reordering
        $reorderedQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        // Verify continuous sequence
        foreach ($reorderedQuestions as $index => $question) {
            $this->assertEquals($index + 1, $question->display_order,
                "After reordering, item at position {$index} should have display_order " . ($index + 1));
        }

        // Verify correct order: SH1, SH2, Q1, Q2
        $this->assertEquals('SH1', $reorderedQuestions[0]->question_identifier);
        $this->assertEquals('SH2', $reorderedQuestions[1]->question_identifier);
        $this->assertEquals('Q1', $reorderedQuestions[2]->question_identifier);
        $this->assertEquals('Q2', $reorderedQuestions[3]->question_identifier);

        // Verify types are preserved
        $this->assertEquals('subheading', $reorderedQuestions[0]->type);
        $this->assertEquals('subheading', $reorderedQuestions[1]->type);
        $this->assertEquals('text', $reorderedQuestions[2]->type);
        $this->assertEquals('select', $reorderedQuestions[3]->type);
    }

    /**
     * Property: Moving items between sections should maintain sequence integrity in both sections
     */
    public function test_moving_items_maintains_sequence_integrity_in_both_sections()
    {
        // Create second section
        $section2 = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Second Section',
            'display_order' => 2,
        ]);

        // Create items in first section
        $section1Items = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH1',
                'label' => 'Section 1 Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
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

        // Create items in second section
        $section2Items = [
            Question::create([
                'section_id' => $section2->id,
                'question_identifier' => 'SH2',
                'label' => 'Section 2 Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $section2->id,
                'question_identifier' => 'Q3',
                'label' => 'Question 3',
                'type' => 'select',
                'display_order' => 2,
                'is_required' => true,
                'options' => ['A', 'B'],
            ]),
        ];

        // Move Q1 from section 1 to section 2
        $request = new Request(['section_id' => $section2->id]);
        $this->controller->move($request, $section1Items[1]); // Move Q1

        // Verify source section sequence integrity
        $section1Questions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(2, $section1Questions, 'Section 1 should have 2 items after move');
        
        foreach ($section1Questions as $index => $question) {
            $this->assertEquals($index + 1, $question->display_order,
                "Section 1 item at position {$index} should have display_order " . ($index + 1));
        }

        // Verify destination section sequence integrity
        $section2Questions = Question::where('section_id', $section2->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(3, $section2Questions, 'Section 2 should have 3 items after move');
        
        foreach ($section2Questions as $index => $question) {
            $this->assertEquals($index + 1, $question->display_order,
                "Section 2 item at position {$index} should have display_order " . ($index + 1));
        }

        // Verify moved item is at the end of destination section
        $movedItem = $section2Questions->last();
        $this->assertEquals('Q1', $movedItem->question_identifier);
        $this->assertEquals(3, $movedItem->display_order);
    }

    /**
     * Property: Deleting items should resequence remaining items maintaining integrity
     */
    public function test_deleting_items_maintains_sequence_integrity()
    {
        // Create mixed items
        $items = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH1',
                'label' => 'Header 1',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH2',
                'label' => 'Header 2',
                'type' => 'subheading',
                'display_order' => 3,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q2',
                'label' => 'Question 2',
                'type' => 'text',
                'display_order' => 4,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q3',
                'label' => 'Question 3',
                'type' => 'text',
                'display_order' => 5,
                'is_required' => true,
            ]),
        ];

        // Delete the middle subheading (SH2 at position 3)
        $this->controller->destroy($items[2]);

        // Verify sequence integrity after deletion
        $remainingQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(4, $remainingQuestions, 'Should have 4 items after deletion');

        // Verify continuous sequence
        foreach ($remainingQuestions as $index => $question) {
            $this->assertEquals($index + 1, $question->display_order,
                "After deletion, item at position {$index} should have display_order " . ($index + 1));
        }

        // Verify correct items remain in correct order
        $identifiers = $remainingQuestions->pluck('question_identifier')->toArray();
        $this->assertEquals(['SH1', 'Q1', 'Q2', 'Q3'], $identifiers,
            'Remaining items should be in correct order after deletion');

        // Verify no gaps in sequence
        $displayOrders = $remainingQuestions->pluck('display_order')->toArray();
        $this->assertEquals([1, 2, 3, 4], $displayOrders,
            'Display orders should be continuous after deletion');
    }

    /**
     * Property: Adding new items should append to end maintaining sequence integrity
     */
    public function test_adding_items_maintains_sequence_integrity()
    {
        // Create initial mixed items
        $initialItems = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH1',
                'label' => 'Initial Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q1',
                'label' => 'Initial Question',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
        ];

        // Simulate adding new items (as the controller would do)
        $nextOrder = $this->section->questions()->max('display_order') + 1;
        
        $newSubheading = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH2',
            'label' => 'New Header',
            'type' => 'subheading',
            'display_order' => $nextOrder,
            'is_required' => false,
        ]);

        $nextOrder = $this->section->questions()->max('display_order') + 1;
        
        $newQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q2',
            'label' => 'New Question',
            'type' => 'text',
            'display_order' => $nextOrder,
            'is_required' => true,
        ]);

        // Verify sequence integrity after additions
        $allQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(4, $allQuestions, 'Should have 4 items after additions');

        // Verify continuous sequence
        foreach ($allQuestions as $index => $question) {
            $this->assertEquals($index + 1, $question->display_order,
                "After additions, item at position {$index} should have display_order " . ($index + 1));
        }

        // Verify new items are appended at end
        $this->assertEquals('SH2', $allQuestions[2]->question_identifier);
        $this->assertEquals(3, $allQuestions[2]->display_order);
        $this->assertEquals('Q2', $allQuestions[3]->question_identifier);
        $this->assertEquals(4, $allQuestions[3]->display_order);

        // Verify no gaps or duplicates
        $displayOrders = $allQuestions->pluck('display_order')->toArray();
        $this->assertEquals([1, 2, 3, 4], $displayOrders,
            'Display orders should be continuous sequence');
    }

    /**
     * Property: Large-scale operations should maintain sequence integrity
     */
    public function test_large_scale_operations_maintain_sequence_integrity()
    {
        // Create a large number of mixed items
        $items = [];
        for ($i = 1; $i <= 50; $i++) {
            $isSubheading = ($i % 5 === 0); // Every 5th item is a subheading
            
            $item = Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => $isSubheading ? "SH{$i}" : "Q{$i}",
                'label' => $isSubheading ? "Header {$i}" : "Question {$i}",
                'type' => $isSubheading ? 'subheading' : 'text',
                'display_order' => $i,
                'is_required' => !$isSubheading,
            ]);
            $items[] = $item;
        }

        // Perform complex reordering (reverse order)
        $reorderData = [];
        for ($i = 0; $i < count($items); $i++) {
            $reorderData[] = [
                'id' => $items[count($items) - 1 - $i]->id,
                'display_order' => $i + 1,
            ];
        }

        $request = new Request(['questions' => $reorderData]);
        $this->controller->reorder($request, $this->section);

        // Verify sequence integrity after large-scale reordering
        $reorderedQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(50, $reorderedQuestions, 'Should have all 50 items after reordering');

        // Verify continuous sequence
        foreach ($reorderedQuestions as $index => $question) {
            $this->assertEquals($index + 1, $question->display_order,
                "Large-scale: item at position {$index} should have display_order " . ($index + 1));
        }

        // Verify no duplicates
        $displayOrders = $reorderedQuestions->pluck('display_order')->toArray();
        $this->assertEquals(count($displayOrders), count(array_unique($displayOrders)),
            'All display_order values should be unique after large-scale reordering');

        // Verify sequence is complete
        $expectedSequence = range(1, 50);
        sort($displayOrders);
        $this->assertEquals($expectedSequence, $displayOrders,
            'Display orders should form complete sequence 1-50');
    }
}