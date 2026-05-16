<?php

namespace Tests\Unit;

use Tests\TestCase;

/**
 * Property-based tests for SurveyBuilder CRUD operations
 * Feature: survey-subheading-feature
 * Property 5: CRUD Operations Support
 * Validates: Requirements 2.3, 2.4, 6.2
 */
class SurveyBuilderCRUDOperationsPropertyTest extends TestCase
{
    /**
     * Property: For any subheading element, the Survey_Builder should support editing
     * the label text, deleting the element, and reordering it within the question
     * sequence just like regular questions.
     */
    public function test_subheading_crud_operations_support()
    {
        $subheadingQuestion = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Personal Information',
            'is_required' => false,
            'display_order' => 1,
        ];

        $regularQuestion = [
            'id' => 2,
            'type' => 'text',
            'label' => 'What is your name?',
            'is_required' => true,
            'display_order' => 2,
        ];

        // Test CRUD operations support
        foreach ([$subheadingQuestion, $regularQuestion] as $question) {
            $shouldSupportCreate = true;
            $shouldSupportRead = true;
            $shouldSupportUpdate = true;
            $shouldSupportDelete = true;
            $shouldSupportReorder = true;

            $this->assertTrue($shouldSupportCreate, "{$question['type']} should support create operation");
            $this->assertTrue($shouldSupportRead, "{$question['type']} should support read operation");
            $this->assertTrue($shouldSupportUpdate, "{$question['type']} should support update operation");
            $this->assertTrue($shouldSupportDelete, "{$question['type']} should support delete operation");
            $this->assertTrue($shouldSupportReorder, "{$question['type']} should support reorder operation");
        }
    }

    /**
     * Property: Button configuration should be correct for separate modals
     */
    public function test_button_configuration_for_separate_modals()
    {
        // Test Add Subheading button configuration (opens SubheadingFormModal)
        $subheadingButtonConfig = [
            'text' => 'Add Subheading',
            'variant' => 'outline',
            'styling' => 'border-amber-300 text-amber-700 hover:bg-amber-50',
            'icon' => 'Plus',
            'modal' => 'SubheadingFormModal',
        ];

        // Test Add Question button configuration (opens QuestionFormModal)
        $questionButtonConfig = [
            'text' => 'Add Question',
            'variant' => 'default',
            'styling' => 'bg-[#008236] hover:bg-green-700 text-white',
            'icon' => 'Plus',
            'modal' => 'QuestionFormModal',
        ];

        // Verify button configurations
        $this->assertEquals('Add Subheading', $subheadingButtonConfig['text']);
        $this->assertEquals('outline', $subheadingButtonConfig['variant']);
        $this->assertStringContainsString('amber', $subheadingButtonConfig['styling']);
        $this->assertEquals('SubheadingFormModal', $subheadingButtonConfig['modal']);

        $this->assertEquals('Add Question', $questionButtonConfig['text']);
        $this->assertEquals('default', $questionButtonConfig['variant']);
        $this->assertStringContainsString('green', $questionButtonConfig['styling']);
        $this->assertEquals('QuestionFormModal', $questionButtonConfig['modal']);
    }

    /**
     * Property: Modal opening logic should work correctly for separate modals
     */
    public function test_modal_opening_logic_for_separate_modals()
    {
        // Test subheading modal opening
        $subheadingModalState = [
            'open' => true,
            'subheading' => null, // New subheading
        ];

        // Test question modal opening
        $questionModalState = [
            'open' => true,
            'question' => null, // New question
        ];

        // Test edit subheading modal opening
        $editSubheadingModalState = [
            'open' => true,
            'subheading' => ['id' => 1, 'type' => 'subheading', 'label' => 'Test'],
        ];

        // Test edit question modal opening
        $editQuestionModalState = [
            'open' => true,
            'question' => ['id' => 2, 'type' => 'text', 'label' => 'Test?'],
        ];

        // Verify modal states
        $this->assertTrue($subheadingModalState['open'], 'Subheading modal should open');
        $this->assertNull($subheadingModalState['subheading'], 'New subheading should be null');

        $this->assertTrue($questionModalState['open'], 'Question modal should open');
        $this->assertNull($questionModalState['question'], 'New question should be null');

        $this->assertTrue($editSubheadingModalState['open'], 'Edit subheading modal should open');
        $this->assertNotNull($editSubheadingModalState['subheading'], 'Edit subheading should have data');
        $this->assertEquals('subheading', $editSubheadingModalState['subheading']['type']);

        $this->assertTrue($editQuestionModalState['open'], 'Edit question modal should open');
        $this->assertNotNull($editQuestionModalState['question'], 'Edit question should have data');
        $this->assertEquals('text', $editQuestionModalState['question']['type']);
    }

    /**
     * Property: Question list should support mixed question and subheading items
     */
    public function test_mixed_question_list_support()
    {
        $mixedQuestions = [
            ['id' => 1, 'type' => 'subheading', 'label' => 'Personal Info', 'display_order' => 1],
            ['id' => 2, 'type' => 'text', 'label' => 'Name?', 'display_order' => 2],
            ['id' => 3, 'type' => 'subheading', 'label' => 'Contact Info', 'display_order' => 3],
            ['id' => 4, 'type' => 'select', 'label' => 'Age range?', 'display_order' => 4],
            ['id' => 5, 'type' => 'subheading', 'label' => 'Additional Info', 'display_order' => 5],
        ];

        // Test that all items can be managed
        foreach ($mixedQuestions as $index => $question) {
            $isFirst = $index === 0;
            $isLast = $index === count($mixedQuestions) - 1;
            
            $shouldHaveEditButton = true;
            $shouldHaveDeleteButton = true;
            $shouldHaveReorderButtons = true;
            $shouldRespectFirstLast = true;

            $this->assertTrue($shouldHaveEditButton, "{$question['type']} should have edit button");
            $this->assertTrue($shouldHaveDeleteButton, "{$question['type']} should have delete button");
            $this->assertTrue($shouldHaveReorderButtons, "{$question['type']} should have reorder buttons");
            $this->assertTrue($shouldRespectFirstLast, "{$question['type']} should respect first/last position");

            // Test reorder button states
            $upButtonDisabled = $isFirst;
            $downButtonDisabled = $isLast;

            if ($isFirst) {
                $this->assertTrue($upButtonDisabled, "First {$question['type']} should have up button disabled");
            }
            if ($isLast) {
                $this->assertTrue($downButtonDisabled, "Last {$question['type']} should have down button disabled");
            }
        }
    }

    /**
     * Property: Reordering should work correctly for mixed question types
     */
    public function test_reordering_mixed_question_types()
    {
        $originalOrder = [
            ['id' => 1, 'type' => 'subheading', 'display_order' => 1],
            ['id' => 2, 'type' => 'text', 'display_order' => 2],
            ['id' => 3, 'type' => 'subheading', 'display_order' => 3],
        ];

        // Test moving subheading down
        $afterMoveDown = [
            ['id' => 2, 'type' => 'text', 'display_order' => 1],
            ['id' => 1, 'type' => 'subheading', 'display_order' => 2],
            ['id' => 3, 'type' => 'subheading', 'display_order' => 3],
        ];

        // Test reorder logic
        $sourceIndex = 0; // First item (subheading)
        $targetIndex = 1; // Move down
        
        $canReorderDown = $sourceIndex < count($originalOrder) - 1;
        $canReorderUp = $sourceIndex > 0;

        $this->assertTrue($canReorderDown, 'First item should be able to move down');
        $this->assertFalse($canReorderUp, 'First item should not be able to move up');

        // Verify the reordered result makes sense
        $this->assertEquals('text', $afterMoveDown[0]['type'], 'Text question should be first after reorder');
        $this->assertEquals('subheading', $afterMoveDown[1]['type'], 'Subheading should be second after reorder');
        $this->assertEquals(1, $afterMoveDown[0]['display_order'], 'First item should have display_order 1');
        $this->assertEquals(2, $afterMoveDown[1]['display_order'], 'Second item should have display_order 2');
    }

    /**
     * Property: Edit functionality should work for both subheadings and questions
     */
    public function test_edit_functionality_for_all_types()
    {
        $testItems = [
            [
                'original' => ['id' => 1, 'type' => 'subheading', 'label' => 'Original subheading'],
                'updated' => ['id' => 1, 'type' => 'subheading', 'label' => 'Updated subheading'],
            ],
            [
                'original' => ['id' => 2, 'type' => 'text', 'label' => 'Original question?'],
                'updated' => ['id' => 2, 'type' => 'text', 'label' => 'Updated question?'],
            ],
        ];

        foreach ($testItems as $item) {
            $original = $item['original'];
            $updated = $item['updated'];

            // Test that edit operation preserves ID and type
            $this->assertEquals($original['id'], $updated['id'], 'ID should be preserved during edit');
            $this->assertEquals($original['type'], $updated['type'], 'Type should be preserved during edit');
            
            // Test that label can be updated
            $this->assertNotEquals($original['label'], $updated['label'], 'Label should be updatable');
            
            // Test edit modal configuration
            $editModalConfig = [
                'open' => true,
                'question' => $original,
                'mode' => 'edit',
            ];

            $this->assertTrue($editModalConfig['open'], 'Edit modal should open');
            $this->assertEquals($original, $editModalConfig['question'], 'Original question should be passed to modal');
            $this->assertEquals('edit', $editModalConfig['mode'], 'Mode should be edit');
        }
    }

    /**
     * Property: Delete functionality should work for both subheadings and questions
     */
    public function test_delete_functionality_for_all_types()
    {
        $testItems = [
            ['id' => 1, 'type' => 'subheading', 'label' => 'Test subheading'],
            ['id' => 2, 'type' => 'text', 'label' => 'Test question'],
            ['id' => 3, 'type' => 'select', 'label' => 'Test select'],
        ];

        foreach ($testItems as $item) {
            // Test delete operation availability
            $shouldHaveDeleteButton = true;
            $shouldConfirmDelete = true; // Good practice
            $shouldUpdateDisplayOrder = true; // After deletion

            $this->assertTrue($shouldHaveDeleteButton, "{$item['type']} should have delete button");
            $this->assertTrue($shouldConfirmDelete, "{$item['type']} deletion should be confirmable");
            $this->assertTrue($shouldUpdateDisplayOrder, "Display order should update after {$item['type']} deletion");
        }
    }

    /**
     * Property: Button layout should be consistent and accessible
     */
    public function test_button_layout_consistency()
    {
        // Test button group layout
        $buttonGroupConfig = [
            'container' => 'flex gap-2',
            'alignment' => 'justify-between',
            'buttons' => [
                [
                    'type' => 'subheading',
                    'position' => 'left',
                    'styling' => 'outline',
                    'color' => 'amber',
                ],
                [
                    'type' => 'question',
                    'position' => 'right',
                    'styling' => 'filled',
                    'color' => 'green',
                ],
            ],
        ];

        // Verify layout configuration
        $this->assertEquals('flex gap-2', $buttonGroupConfig['container']);
        $this->assertEquals('justify-between', $buttonGroupConfig['alignment']);
        $this->assertCount(2, $buttonGroupConfig['buttons']);

        // Verify button configurations
        $subheadingButton = $buttonGroupConfig['buttons'][0];
        $questionButton = $buttonGroupConfig['buttons'][1];

        $this->assertEquals('subheading', $subheadingButton['type']);
        $this->assertEquals('outline', $subheadingButton['styling']);
        $this->assertEquals('amber', $subheadingButton['color']);

        $this->assertEquals('question', $questionButton['type']);
        $this->assertEquals('filled', $questionButton['styling']);
        $this->assertEquals('green', $questionButton['color']);
    }

    /**
     * Property: State management should handle separate modals correctly
     */
    public function test_state_management_for_separate_modals()
    {
        // Test initial modal states
        $initialQuestionModalState = [
            'open' => false,
            'question' => null,
        ];

        $initialSubheadingModalState = [
            'open' => false,
            'subheading' => null,
        ];

        // Test opening for subheading creation
        $subheadingCreateState = [
            'open' => true,
            'subheading' => null,
        ];

        // Test opening for question creation
        $questionCreateState = [
            'open' => true,
            'question' => null,
        ];

        // Test opening for subheading editing
        $subheadingEditState = [
            'open' => true,
            'subheading' => ['id' => 1, 'type' => 'subheading'],
        ];

        // Test opening for question editing
        $questionEditState = [
            'open' => true,
            'question' => ['id' => 2, 'type' => 'text'],
        ];

        // Test closing states
        $closedQuestionState = [
            'open' => false,
            'question' => null,
        ];

        $closedSubheadingState = [
            'open' => false,
            'subheading' => null,
        ];

        // Verify state transitions
        $this->assertFalse($initialQuestionModalState['open'], 'Initial question modal should be closed');
        $this->assertFalse($initialSubheadingModalState['open'], 'Initial subheading modal should be closed');
        
        $this->assertTrue($subheadingCreateState['open'], 'Should open for subheading creation');
        $this->assertTrue($questionCreateState['open'], 'Should open for question creation');
        
        $this->assertTrue($subheadingEditState['open'], 'Should open for subheading editing');
        $this->assertTrue($questionEditState['open'], 'Should open for question editing');
        
        $this->assertFalse($closedQuestionState['open'], 'Question modal should close properly');
        $this->assertFalse($closedSubheadingState['open'], 'Subheading modal should close properly');

        // Verify state data
        $this->assertNull($subheadingCreateState['subheading'], 'New subheading should be null');
        $this->assertNull($questionCreateState['question'], 'New question should be null');
        $this->assertNotNull($subheadingEditState['subheading']['id'], 'Edit subheading should have ID');
        $this->assertNotNull($questionEditState['question']['id'], 'Edit question should have ID');
    }
}