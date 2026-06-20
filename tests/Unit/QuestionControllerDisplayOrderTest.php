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
 * Unit tests for QuestionController display order management
 * Feature: survey-subheading-feature
 * Validates: Requirements 1.4, 6.1, 6.3, 6.4
 */
class QuestionControllerDisplayOrderTest extends TestCase
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
     * Test reordering with mixed question and subheading types
     */
    public function test_reorder_handles_mixed_question_subheading_types()
    {
        // Create mixed items
        $subheading = Question::create([
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

        // Reorder: move text question to first position
        $reorderData = [
            ['id' => $textQuestion->id, 'display_order' => 1],
            ['id' => $subheading->id, 'display_order' => 2],
            ['id' => $selectQuestion->id, 'display_order' => 3],
        ];

        $request = new Request(['questions' => $reorderData]);
        $response = $this->controller->reorder($request, $this->section);

        // Verify successful response
        $this->assertEquals(302, $response->getStatusCode()); // Redirect back

        // Verify new order
        $reorderedQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertEquals('Q1', $reorderedQuestions[0]->question_identifier);
        $this->assertEquals('text', $reorderedQuestions[0]->type);
        $this->assertEquals(1, $reorderedQuestions[0]->display_order);

        $this->assertEquals('SH1', $reorderedQuestions[1]->question_identifier);
        $this->assertEquals('subheading', $reorderedQuestions[1]->type);
        $this->assertEquals(2, $reorderedQuestions[1]->display_order);

        $this->assertEquals('Q2', $reorderedQuestions[2]->question_identifier);
        $this->assertEquals('select', $reorderedQuestions[2]->type);
        $this->assertEquals(3, $reorderedQuestions[2]->display_order);
    }

    /**
     * Test moving subheading between sections
     */
    public function test_move_subheading_between_sections()
    {
        // Create second section
        $section2 = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Second Section',
            'display_order' => 2,
        ]);

        // Create items in first section
        $subheading = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH1',
            'label' => 'Section Header',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => false,
        ]);

        $textQuestion = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Question 1',
            'type' => 'text',
            'display_order' => 2,
            'is_required' => true,
        ]);

        // Create item in second section
        $existingQuestion = Question::create([
            'section_id' => $section2->id,
            'question_identifier' => 'Q2',
            'label' => 'Existing Question',
            'type' => 'text',
            'display_order' => 1,
            'is_required' => true,
        ]);

        // Move subheading to second section
        $request = new Request(['section_id' => $section2->id]);
        $response = $this->controller->move($request, $subheading);

        // Verify successful response
        $this->assertEquals(302, $response->getStatusCode());

        // Verify subheading moved to section 2
        $subheading->refresh();
        $this->assertEquals($section2->id, $subheading->section_id);
        $this->assertEquals(2, $subheading->display_order); // Should be appended

        // Verify source section resequenced
        $section1Questions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(1, $section1Questions);
        $this->assertEquals('Q1', $section1Questions[0]->question_identifier);
        $this->assertEquals(1, $section1Questions[0]->display_order); // Moved up

        // Verify destination section has correct order
        $section2Questions = Question::where('section_id', $section2->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(2, $section2Questions);
        $this->assertEquals('Q2', $section2Questions[0]->question_identifier);
        $this->assertEquals(1, $section2Questions[0]->display_order);
        $this->assertEquals('SH1', $section2Questions[1]->question_identifier);
        $this->assertEquals(2, $section2Questions[1]->display_order);
    }

    /**
     * Test deleting subheading resequences remaining items
     */
    public function test_delete_subheading_resequences_remaining_items()
    {
        // Create mixed items
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
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q3',
                'label' => 'Question 3',
                'type' => 'text',
                'display_order' => 4,
                'is_required' => true,
            ]),
        ];

        // Delete the subheading (position 2)
        $response = $this->controller->destroy($items[1]);

        // Verify successful response
        $this->assertEquals(302, $response->getStatusCode());

        // Verify subheading was deleted
        $this->assertDatabaseMissing('questions', ['id' => $items[1]->id]);

        // Verify remaining items were resequenced
        $remainingQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(3, $remainingQuestions);

        // Verify correct sequence
        $this->assertEquals('Q1', $remainingQuestions[0]->question_identifier);
        $this->assertEquals(1, $remainingQuestions[0]->display_order);

        $this->assertEquals('Q2', $remainingQuestions[1]->question_identifier);
        $this->assertEquals(2, $remainingQuestions[1]->display_order); // Moved up from 3

        $this->assertEquals('Q3', $remainingQuestions[2]->question_identifier);
        $this->assertEquals(3, $remainingQuestions[2]->display_order); // Moved up from 4
    }

    /**
     * Test conflict detection with duplicate display orders
     */
    public function test_reorder_handles_duplicate_display_orders()
    {
        // Create items
        $items = [
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

        // Attempt reorder with valid data
        $reorderData = [
            ['id' => $items[2]->id, 'display_order' => 1], // Q2 to position 1
            ['id' => $items[0]->id, 'display_order' => 2], // SH1 to position 2
            ['id' => $items[1]->id, 'display_order' => 3], // Q1 to position 3
        ];

        $request = new Request(['questions' => $reorderData]);
        $response = $this->controller->reorder($request, $this->section);

        // Verify successful reordering
        $this->assertEquals(302, $response->getStatusCode());

        // Verify final order is correct
        $reorderedQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertEquals('Q2', $reorderedQuestions[0]->question_identifier);
        $this->assertEquals(1, $reorderedQuestions[0]->display_order);

        $this->assertEquals('SH1', $reorderedQuestions[1]->question_identifier);
        $this->assertEquals(2, $reorderedQuestions[1]->display_order);

        $this->assertEquals('Q1', $reorderedQuestions[2]->question_identifier);
        $this->assertEquals(3, $reorderedQuestions[2]->display_order);
    }

    /**
     * Test sequential order assignment for new items
     */
    public function test_new_items_get_sequential_display_order()
    {
        // Create initial items
        $existingItems = [
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'SH1',
                'label' => 'Existing Header',
                'type' => 'subheading',
                'display_order' => 1,
                'is_required' => false,
            ]),
            Question::create([
                'section_id' => $this->section->id,
                'question_identifier' => 'Q1',
                'label' => 'Existing Question',
                'type' => 'text',
                'display_order' => 2,
                'is_required' => true,
            ]),
        ];

        // Simulate adding new items (as controller would do)
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

        // Verify sequential assignment
        $this->assertEquals(3, $newSubheading->display_order);
        $this->assertEquals(4, $newQuestion->display_order);

        // Verify complete sequence
        $allQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $displayOrders = $allQuestions->pluck('display_order')->toArray();
        $this->assertEquals([1, 2, 3, 4], $displayOrders);

        $identifiers = $allQuestions->pluck('question_identifier')->toArray();
        $this->assertEquals(['SH1', 'Q1', 'SH2', 'Q2'], $identifiers);
    }

    /**
     * Test reordering with large number of mixed items
     */
    public function test_reorder_large_number_of_mixed_items()
    {
        // Create 20 mixed items
        $items = [];
        for ($i = 1; $i <= 20; $i++) {
            $isSubheading = ($i % 4 === 0); // Every 4th item is a subheading
            
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

        // Create reorder data (reverse order)
        $reorderData = [];
        for ($i = 0; $i < count($items); $i++) {
            $reorderData[] = [
                'id' => $items[count($items) - 1 - $i]->id,
                'display_order' => $i + 1,
            ];
        }

        $request = new Request(['questions' => $reorderData]);
        $response = $this->controller->reorder($request, $this->section);

        // Verify successful response
        $this->assertEquals(302, $response->getStatusCode());

        // Verify reordering worked correctly
        $reorderedQuestions = Question::where('section_id', $this->section->id)
            ->orderBy('display_order')
            ->get();

        $this->assertCount(20, $reorderedQuestions);

        // Verify first few items are in reverse order
        $this->assertEquals('Q20', $reorderedQuestions[0]->question_identifier);
        $this->assertEquals('text', $reorderedQuestions[0]->type);
        
        $this->assertEquals('Q19', $reorderedQuestions[1]->question_identifier);
        $this->assertEquals('text', $reorderedQuestions[1]->type);
        
        $this->assertEquals('Q18', $reorderedQuestions[2]->question_identifier);
        $this->assertEquals('text', $reorderedQuestions[2]->type);
        
        $this->assertEquals('Q17', $reorderedQuestions[3]->question_identifier);
        $this->assertEquals('text', $reorderedQuestions[3]->type);
        
        $this->assertEquals('SH16', $reorderedQuestions[4]->question_identifier);
        $this->assertEquals('subheading', $reorderedQuestions[4]->type);

        // Verify continuous sequence
        $displayOrders = $reorderedQuestions->pluck('display_order')->toArray();
        $expectedSequence = range(1, 20);
        $this->assertEquals($expectedSequence, $displayOrders);
    }

    /**
     * Test moving items maintains type integrity
     */
    public function test_move_maintains_question_type_integrity()
    {
        // Create second section
        $section2 = Section::create([
            'survey_id' => $this->survey->id,
            'title' => 'Second Section',
            'display_order' => 2,
        ]);

        // Create subheading with specific properties
        $subheading = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'SH1',
            'label' => 'Important Section Header',
            'type' => 'subheading',
            'display_order' => 1,
            'is_required' => false,
            'options' => null,
        ]);

        // Move subheading to second section
        $request = new Request(['section_id' => $section2->id]);
        $this->controller->move($request, $subheading);

        // Verify subheading properties are preserved
        $subheading->refresh();
        $this->assertEquals('subheading', $subheading->type);
        $this->assertEquals('Important Section Header', $subheading->label);
        $this->assertEquals(false, $subheading->is_required);
        $this->assertNull($subheading->options);
        $this->assertEquals($section2->id, $subheading->section_id);
    }

    /**
     * Test validation of reorder request data
     */
    public function test_reorder_validates_request_data()
    {
        // Create items
        $item = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Question 1',
            'type' => 'text',
            'display_order' => 1,
            'is_required' => true,
        ]);

        // Test with invalid data (missing required fields)
        $invalidRequest = new Request(['questions' => [
            ['id' => $item->id] // Missing display_order
        ]]);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->controller->reorder($invalidRequest, $this->section);
    }

    /**
     * Test move validation
     */
    public function test_move_validates_section_exists()
    {
        $item = Question::create([
            'section_id' => $this->section->id,
            'question_identifier' => 'Q1',
            'label' => 'Question 1',
            'type' => 'text',
            'display_order' => 1,
            'is_required' => true,
        ]);

        // Test with non-existent section
        $invalidRequest = new Request(['section_id' => 99999]);

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->controller->move($invalidRequest, $item);
    }
}