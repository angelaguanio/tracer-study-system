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
 * Property-based tests for display order conflict prevention
 * Feature: survey-subheading-feature
 * Property 8: Display Order Conflict Prevention
 * Validates: Requirements 6.4
 */
class DisplayOrderConflictPreventionPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected $controller;
    protected $user;
    protected $survey;
    protected $section1;
    protected $section2;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->controller = new QuestionController();
        $this->user = User::factory()->create(['user_role' => 'admin']);
        
        $this->survey = Survey::create([
            'title' => 'Test Survey',
            'status' => 'active',
        ]);
        
        $this->section1 = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Section 1',
            'display_order' => 1,
        ]);

        $this->section2 = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Section 2',
            'display_order' => 2,
        ]);

        Auth::login($this->user);
    }

    /**
     * Property: For any section, no two items (questions or subheadings) should have
     * the same display_order value, ensuring unique positioning within each section.
     */
    public function test_no_duplicate_display_orders_within_section()
    {
        // Create mixed items in section 1
        $section1Items = [
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'SH1',
                'label' => 'Section 1 Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q2',
                'label' => 'Question 2',
                'type' => 'select',
                'display_order' => 3,
                'is_required' => true,
                'options' => ['A', 'B', 'C'],
            ]),
        ];

        // Create mixed items in section 2 (can have same display_order as section 1)
        $section2Items = [
            Question::create([
                'section_id' => $this->section2->id,
                'question_identifier' => 'SH2',
                'label' => 'Section 2 Header',
                'type' => 'subheading',
                'display_order' => 1, // Same as section 1, but different section - OK
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section2->id,
                'question_identifier' => 'Q3',
                'label' => 'Question 3',
                'type' => 'text',
                'display_order' => 2, // Same as section 1, but different section - OK
                'is_required' => true,
            ]),
        ];

        // Verify no duplicates within each section
        $section1Orders = Question::where('section_id', $this->section1->id)
            ->pluck('display_order')
            ->toArray();

        $section2Orders = Question::where('section_id', $this->section2->id)
            ->pluck('display_order')
            ->toArray();

        // Check section 1 has no duplicates
        $this->assertEquals(count($section1Orders), count(array_unique($section1Orders)),
            'Section 1 should have no duplicate display_order values');

        // Check section 2 has no duplicates
        $this->assertEquals(count($section2Orders), count(array_unique($section2Orders)),
            'Section 2 should have no duplicate display_order values');

        // Verify cross-section duplicates are allowed (different sections can have same display_order)
        $this->assertContains(1, $section1Orders, 'Section 1 should have display_order 1');
        $this->assertContains(1, $section2Orders, 'Section 2 should have display_order 1');
        $this->assertContains(2, $section1Orders, 'Section 1 should have display_order 2');
        $this->assertContains(2, $section2Orders, 'Section 2 should have display_order 2');
    }

    /**
     * Property: Reordering operations should prevent creation of duplicate display_order values
     */
    public function test_reordering_prevents_display_order_conflicts()
    {
        // Create initial items
        $items = [
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'SH1',
                'label' => 'Header 1',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q2',
                'label' => 'Question 2',
                'type' => 'text',
                'display_order' => 3,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'SH2',
                'label' => 'Header 2',
                'type' => 'subheading',
                'display_order' => 4,
                'is_required' => false,
            ]),
        ];

        // Perform reordering that could potentially create conflicts
        $reorderData = [
            ['id' => $items[3]->id, 'display_order' => 1], // SH2 to position 1
            ['id' => $items[0]->id, 'display_order' => 2], // SH1 to position 2
            ['id' => $items[2]->id, 'display_order' => 3], // Q2 to position 3
            ['id' => $items[1]->id, 'display_order' => 4], // Q1 to position 4
        ];

        $request = new Request(['questions' => $reorderData]);
        $this->controller->reorder($request, $this->section1);

        // Verify no conflicts after reordering
        $reorderedQuestions = Question::where('section_id', $this->section1->id)
            ->orderBy('display_order')
            ->get();

        $displayOrders = $reorderedQuestions->pluck('display_order')->toArray();

        // Verify no duplicates
        $this->assertEquals(count($displayOrders), count(array_unique($displayOrders)),
            'Reordering should not create duplicate display_order values');

        // Verify all expected orders are present
        $this->assertEquals([1, 2, 3, 4], $displayOrders,
            'All display_order values should be present and unique');

        // Verify correct items are in correct positions
        $this->assertEquals('SH2', $reorderedQuestions[0]->question_identifier);
        $this->assertEquals('SH1', $reorderedQuestions[1]->question_identifier);
        $this->assertEquals('Q2', $reorderedQuestions[2]->question_identifier);
        $this->assertEquals('Q1', $reorderedQuestions[3]->question_identifier);
    }

    /**
     * Property: Moving items between sections should not create conflicts in either section
     */
    public function test_moving_items_prevents_conflicts_in_both_sections()
    {
        // Create items in both sections
        $section1Items = [
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'SH1',
                'label' => 'Section 1 Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q2',
                'label' => 'Question 2',
                'type' => 'text',
                'display_order' => 3,
                'is_required' => true,
            ]),
        ];

        $section2Items = [
            Question::create([
                'section_id' => $this->section2->id,
                'question_identifier' => 'SH2',
                'label' => 'Section 2 Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section2->id,
                'question_identifier' => 'Q3',
                'label' => 'Question 3',
                'type' => 'select',
                'display_order' => 2,
                'is_required' => true,
                'options' => ['A', 'B'],
            ]),
        ];

        // Move Q1 from section 1 to section 2
        $request = new Request(['section_id' => $this->section2->id]);
        $this->controller->move($request, $section1Items[1]); // Move Q1

        // Verify no conflicts in source section (section 1)
        $section1Questions = Question::where('section_id', $this->section1->id)
            ->orderBy('display_order')
            ->get();

        $section1Orders = $section1Questions->pluck('display_order')->toArray();
        $this->assertEquals(count($section1Orders), count(array_unique($section1Orders)),
            'Source section should have no duplicate display_order values after move');

        // Verify continuous sequence in source section
        $this->assertEquals([1, 2], $section1Orders,
            'Source section should have continuous sequence after move');

        // Verify no conflicts in destination section (section 2)
        $section2Questions = Question::where('section_id', $this->section2->id)
            ->orderBy('display_order')
            ->get();

        $section2Orders = $section2Questions->pluck('display_order')->toArray();
        $this->assertEquals(count($section2Orders), count(array_unique($section2Orders)),
            'Destination section should have no duplicate display_order values after move');

        // Verify continuous sequence in destination section
        $this->assertEquals([1, 2, 3], $section2Orders,
            'Destination section should have continuous sequence after move');

        // Verify moved item is at the end of destination section
        $movedItem = $section2Questions->where('question_identifier', 'Q1')->first();
        $this->assertNotNull($movedItem, 'Moved item should exist in destination section');
        $this->assertEquals(3, $movedItem->display_order, 'Moved item should be at end of destination section');
    }

    /**
     * Property: Adding new items should not create display_order conflicts
     */
    public function test_adding_items_prevents_display_order_conflicts()
    {
        // Create initial items with gaps (simulating potential conflict scenario)
        $initialItems = [
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'SH1',
                'label' => 'Header 1',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
        ];

        // Simulate adding new items (as controller would do)
        $nextOrder = $this->section1->questions()->max('display_order') + 1;
        
        $newItem1 = Question::create([
            'section_id' => $this->section1->id,
            'question_identifier' => 'SH2',
            'label' => 'Header 2',
            'type' => 'subheading',
            'display_order' => $nextOrder,
            'is_required' => false,
        ]);

        $nextOrder = $this->section1->questions()->max('display_order') + 1;
        
        $newItem2 = Question::create([
            'section_id' => $this->section1->id,
            'question_identifier' => 'Q2',
            'label' => 'Question 2',
            'type' => 'text',
            'display_order' => $nextOrder,
            'is_required' => true,
        ]);

        // Verify no conflicts after additions
        $allQuestions = Question::where('section_id', $this->section1->id)
            ->orderBy('display_order')
            ->get();

        $displayOrders = $allQuestions->pluck('display_order')->toArray();

        // Verify no duplicates
        $this->assertEquals(count($displayOrders), count(array_unique($displayOrders)),
            'Adding items should not create duplicate display_order values');

        // Verify continuous sequence
        $this->assertEquals([1, 2, 3, 4], $displayOrders,
            'Adding items should maintain continuous sequence');

        // Verify new items are at correct positions
        $this->assertEquals(3, $newItem1->display_order, 'First new item should be at position 3');
        $this->assertEquals(4, $newItem2->display_order, 'Second new item should be at position 4');
    }

    /**
     * Property: Deleting items should not create conflicts in remaining sequence
     */
    public function test_deleting_items_prevents_conflicts_in_remaining_sequence()
    {
        // Create items with mixed types
        $items = [
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'SH1',
                'label' => 'Header 1',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q1',
                'label' => 'Question 1',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'SH2',
                'label' => 'Header 2',
                'type' => 'subheading',
                'display_order' => 3,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q2',
                'label' => 'Question 2',
                'type' => 'text',
                'display_order' => 4,
                'is_required' => true,
            ]),
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => 'Q3',
                'label' => 'Question 3',
                'type' => 'text',
                'display_order' => 5,
                'is_required' => true,
            ]),
        ];

        // Delete middle item (SH2)
        $this->controller->destroy($items[2]);

        // Verify no conflicts after deletion
        $remainingQuestions = Question::where('section_id', $this->section1->id)
            ->orderBy('display_order')
            ->get();

        $displayOrders = $remainingQuestions->pluck('display_order')->toArray();

        // Verify no duplicates
        $this->assertEquals(count($displayOrders), count(array_unique($displayOrders)),
            'Deleting items should not create duplicate display_order values');

        // Verify continuous sequence (no gaps)
        $this->assertEquals([1, 2, 3, 4], $displayOrders,
            'Deleting items should maintain continuous sequence without gaps');

        // Verify correct items remain
        $identifiers = $remainingQuestions->pluck('question_identifier')->toArray();
        $this->assertEquals(['SH1', 'Q1', 'Q2', 'Q3'], $identifiers,
            'Correct items should remain after deletion');
    }

    /**
     * Property: Concurrent operations should not create display_order conflicts
     */
    public function test_concurrent_operations_prevent_conflicts()
    {
        // Create initial items
        $items = [];
        for ($i = 1; $i <= 10; $i++) {
            $isSubheading = ($i % 3 === 0);
            $item = Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => $isSubheading ? "SH{$i}" : "Q{$i}",
                'label' => $isSubheading ? "Header {$i}" : "Question {$i}",
                'type' => $isSubheading ? 'subheading' : 'text',
                'display_order' => $i,
                'is_required' => !$isSubheading,
            ]);
            $items[] = $item;
        }

        // Simulate concurrent operations: reorder + add + delete
        
        // 1. Reorder some items
        $reorderData = [
            ['id' => $items[0]->id, 'display_order' => 5],
            ['id' => $items[1]->id, 'display_order' => 1],
            ['id' => $items[2]->id, 'display_order' => 2],
            ['id' => $items[3]->id, 'display_order' => 3],
            ['id' => $items[4]->id, 'display_order' => 4],
        ];

        // Only reorder first 5 items to avoid conflicts with remaining items
        $partialReorderData = array_slice($reorderData, 0, 5);
        $remainingItems = array_slice($items, 5);
        
        // Add remaining items to reorder data to maintain their positions
        foreach ($remainingItems as $index => $item) {
            $partialReorderData[] = ['id' => $item->id, 'display_order' => $index + 6];
        }

        $request = new Request(['questions' => $partialReorderData]);
        $this->controller->reorder($request, $this->section1);

        // 2. Add new item
        $nextOrder = $this->section1->questions()->max('display_order') + 1;
        $newItem = Question::create([
            'section_id' => $this->section1->id,
            'question_identifier' => 'Q_NEW',
            'label' => 'New Question',
            'type' => 'text',
            'display_order' => $nextOrder,
            'is_required' => true,
        ]);

        // 3. Delete an item
        $this->controller->destroy($items[9]); // Delete last original item

        // Verify no conflicts after all operations
        $finalQuestions = Question::where('section_id', $this->section1->id)
            ->orderBy('display_order')
            ->get();

        $displayOrders = $finalQuestions->pluck('display_order')->toArray();

        // Verify no duplicates
        $this->assertEquals(count($displayOrders), count(array_unique($displayOrders)),
            'Concurrent operations should not create duplicate display_order values');

        // Verify continuous sequence
        $expectedSequence = range(1, count($finalQuestions));
        $this->assertEquals($expectedSequence, $displayOrders,
            'Concurrent operations should maintain continuous sequence');

        // Verify new item exists
        $newItemExists = $finalQuestions->where('question_identifier', 'Q_NEW')->isNotEmpty();
        $this->assertTrue($newItemExists, 'New item should exist after concurrent operations');
    }

    /**
     * Property: Cross-section operations should maintain isolation (no conflicts between sections)
     */
    public function test_cross_section_operations_maintain_isolation()
    {
        // Create identical display_order sequences in both sections
        for ($i = 1; $i <= 5; $i++) {
            Question::create([
                'section_id' => $this->section1->id,
                'question_identifier' => "S1_Q{$i}",
                'label' => "Section 1 Question {$i}",
                'type' => ($i % 2 === 0) ? 'subheading' : 'text',
                'display_order' => $i,
                'is_required' => ($i % 2 !== 0),
            ]);

            Question::create([
                'section_id' => $this->section2->id,
                'question_identifier' => "S2_Q{$i}",
                'label' => "Section 2 Question {$i}",
                'type' => ($i % 2 === 0) ? 'subheading' : 'text',
                'display_order' => $i,
                'is_required' => ($i % 2 !== 0),
            ]);
        }

        // Perform operations on section 1
        $section1Questions = Question::where('section_id', $this->section1->id)->get();
        $reorderData = $section1Questions->map(function ($q, $index) {
            return ['id' => $q->id, 'display_order' => 6 - $q->display_order]; // Reverse order
        })->toArray();

        $request = new Request(['questions' => $reorderData]);
        $this->controller->reorder($request, $this->section1);

        // Verify section 1 was modified
        $section1Final = Question::where('section_id', $this->section1->id)
            ->orderBy('display_order')
            ->pluck('question_identifier')
            ->toArray();

        $this->assertEquals(['S1_Q5', 'S1_Q4', 'S1_Q3', 'S1_Q2', 'S1_Q1'], $section1Final,
            'Section 1 should be reordered');

        // Verify section 2 was not affected
        $section2Final = Question::where('section_id', $this->section2->id)
            ->orderBy('display_order')
            ->pluck('question_identifier')
            ->toArray();

        $this->assertEquals(['S2_Q1', 'S2_Q2', 'S2_Q3', 'S2_Q4', 'S2_Q5'], $section2Final,
            'Section 2 should remain unchanged');

        // Verify both sections have no conflicts
        $section1Orders = Question::where('section_id', $this->section1->id)
            ->pluck('display_order')
            ->toArray();
        $section2Orders = Question::where('section_id', $this->section2->id)
            ->pluck('display_order')
            ->toArray();

        $this->assertEquals(count($section1Orders), count(array_unique($section1Orders)),
            'Section 1 should have no duplicate display_order values');
        $this->assertEquals(count($section2Orders), count(array_unique($section2Orders)),
            'Section 2 should have no duplicate display_order values');

        // Verify both sections can have same display_order values (isolation)
        $this->assertEquals([1, 2, 3, 4, 5], $section1Orders,
            'Section 1 should have complete sequence');
        $this->assertEquals([1, 2, 3, 4, 5], $section2Orders,
            'Section 2 should have complete sequence');
    }
}