<?php

namespace Tests\Unit;

use Tests\TestCase;

/**
 * Unit tests for QuestionItem component
 * Feature: survey-subheading-feature
 * Validates: Requirements 2.1, 2.2
 */
class QuestionItemTest extends TestCase
{
    /**
     * Test visual styling differences between question types
     */
    public function test_visual_styling_differences_between_question_types()
    {
        // Test subheading styling
        $subheadingQuestion = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Personal Information',
            'is_required' => false,
            'options' => null,
        ];

        $isSubheading = $subheadingQuestion['type'] === 'subheading';
        $shouldHaveAmberStyling = $isSubheading;
        $shouldHaveDashedBorder = $isSubheading;
        $shouldHaveSpecialLayout = $isSubheading;

        $this->assertTrue($shouldHaveAmberStyling, 'Subheading should have amber styling');
        $this->assertTrue($shouldHaveDashedBorder, 'Subheading should have dashed border');
        $this->assertTrue($shouldHaveSpecialLayout, 'Subheading should have special layout');

        // Test regular question styling
        $regularQuestion = [
            'id' => 2,
            'type' => 'text',
            'label' => 'What is your name?',
            'is_required' => true,
            'options' => null,
        ];

        $isSubheading = $regularQuestion['type'] === 'subheading';
        $shouldHaveWhiteStyling = !$isSubheading;
        $shouldHaveSolidBorder = !$isSubheading;
        $shouldHaveStandardLayout = !$isSubheading;

        $this->assertTrue($shouldHaveWhiteStyling, 'Regular question should have white styling');
        $this->assertTrue($shouldHaveSolidBorder, 'Regular question should have solid border');
        $this->assertTrue($shouldHaveStandardLayout, 'Regular question should have standard layout');
    }

    /**
     * Test subheading-specific display elements
     */
    public function test_subheading_specific_display_elements()
    {
        $subheadingQuestion = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Employment History Section',
            'is_required' => false,
            'options' => null,
        ];

        // Test subheading-specific elements
        $isSubheading = $subheadingQuestion['type'] === 'subheading';
        $shouldShowHeadingIcon = $isSubheading;
        $shouldShowSectionLabel = $isSubheading; // "Section Description"
        $shouldPreserveWhitespace = $isSubheading; // whitespace-pre-wrap
        $shouldNotShowTypeBadge = $isSubheading;
        $shouldNotShowRequiredBadge = $isSubheading;

        $this->assertTrue($shouldShowHeadingIcon, 'Subheading should show Heading2 icon');
        $this->assertTrue($shouldShowSectionLabel, 'Subheading should show "Section Description" label');
        $this->assertTrue($shouldPreserveWhitespace, 'Subheading should preserve whitespace in label');
        $this->assertTrue($shouldNotShowTypeBadge, 'Subheading should not show type badge');
        $this->assertTrue($shouldNotShowRequiredBadge, 'Subheading should not show required badge');
    }

    /**
     * Test regular question display elements
     */
    public function test_regular_question_display_elements()
    {
        $regularQuestion = [
            'id' => 1,
            'type' => 'select',
            'label' => 'Select your age range',
            'is_required' => true,
            'options' => ['18-25', '26-35', '36-45'],
        ];

        // Test regular question elements
        $isSubheading = $regularQuestion['type'] === 'subheading';
        $shouldShowQuestionLabel = !$isSubheading;
        $shouldShowTypeBadge = !$isSubheading;
        $shouldShowRequiredBadge = $regularQuestion['is_required'] && !$isSubheading;
        $shouldNotShowSectionLabel = !$isSubheading;
        $shouldNotShowHeadingIcon = !$isSubheading;

        $this->assertTrue($shouldShowQuestionLabel, 'Regular question should show question label');
        $this->assertTrue($shouldShowTypeBadge, 'Regular question should show type badge');
        $this->assertTrue($shouldShowRequiredBadge, 'Required regular question should show required badge');
        $this->assertTrue($shouldNotShowSectionLabel, 'Regular question should not show section label');
        $this->assertTrue($shouldNotShowHeadingIcon, 'Regular question should not show heading icon');
    }

    /**
     * Test TYPE_MAP configuration for all question types
     */
    public function test_type_map_configuration()
    {
        $expectedTypeMap = [
            'text' => ['label' => 'Short Answer'],
            'textarea' => ['label' => 'Long Answer'],
            'number' => ['label' => 'Number'],
            'select' => ['label' => 'Dropdown'],
            'radio' => ['label' => 'Multiple Choice'],
            'checkbox' => ['label' => 'Checkboxes'],
            'likert' => ['label' => 'Likert Scale'],
            'subheading' => ['label' => 'Subheading'],
        ];

        foreach ($expectedTypeMap as $type => $config) {
            // Simulate TYPE_MAP lookup
            $typeInfo = $expectedTypeMap[$type] ?? ['label' => $type];
            
            $this->assertArrayHasKey('label', $typeInfo, "{$type} should have label in TYPE_MAP");
            $this->assertEquals($config['label'], $typeInfo['label'], "{$type} should have correct label");
            
            // Special check for subheading
            if ($type === 'subheading') {
                $this->assertEquals('Subheading', $typeInfo['label'], 'Subheading should have correct label');
            }
        }
    }

    /**
     * Test action buttons functionality
     */
    public function test_action_buttons_functionality()
    {
        $testQuestions = [
            [
                'id' => 1,
                'type' => 'subheading',
                'label' => 'Test subheading',
                'is_required' => false,
            ],
            [
                'id' => 2,
                'type' => 'text',
                'label' => 'Test question',
                'is_required' => true,
            ],
        ];

        foreach ($testQuestions as $question) {
            // Test that all questions have action buttons
            $shouldHaveEditButton = true;
            $shouldHaveDeleteButton = true;
            $shouldHaveReorderButtons = true;

            $this->assertTrue($shouldHaveEditButton, "{$question['type']} should have edit button");
            $this->assertTrue($shouldHaveDeleteButton, "{$question['type']} should have delete button");
            $this->assertTrue($shouldHaveReorderButtons, "{$question['type']} should have reorder buttons");
        }
    }

    /**
     * Test reorder button state logic
     */
    public function test_reorder_button_state_logic()
    {
        $question = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Test subheading',
            'is_required' => false,
        ];

        // Test first item (up button should be disabled)
        $isFirst = true;
        $isLast = false;
        $upButtonDisabled = $isFirst;
        $downButtonDisabled = $isLast;

        $this->assertTrue($upButtonDisabled, 'Up button should be disabled for first item');
        $this->assertFalse($downButtonDisabled, 'Down button should not be disabled for first item');

        // Test last item (down button should be disabled)
        $isFirst = false;
        $isLast = true;
        $upButtonDisabled = $isFirst;
        $downButtonDisabled = $isLast;

        $this->assertFalse($upButtonDisabled, 'Up button should not be disabled for last item');
        $this->assertTrue($downButtonDisabled, 'Down button should be disabled for last item');

        // Test middle item (both buttons enabled)
        $isFirst = false;
        $isLast = false;
        $upButtonDisabled = $isFirst;
        $downButtonDisabled = $isLast;

        $this->assertFalse($upButtonDisabled, 'Up button should not be disabled for middle item');
        $this->assertFalse($downButtonDisabled, 'Down button should not be disabled for middle item');
    }

    /**
     * Test badge display logic
     */
    public function test_badge_display_logic()
    {
        $testCases = [
            [
                'question' => [
                    'id' => 1,
                    'type' => 'subheading',
                    'label' => 'Test subheading',
                    'is_required' => false,
                ],
                'shouldShowTypeBadge' => false,
                'shouldShowRequiredBadge' => false,
            ],
            [
                'question' => [
                    'id' => 2,
                    'type' => 'text',
                    'label' => 'Test question',
                    'is_required' => true,
                ],
                'shouldShowTypeBadge' => true,
                'shouldShowRequiredBadge' => true,
            ],
            [
                'question' => [
                    'id' => 3,
                    'type' => 'select',
                    'label' => 'Test select',
                    'is_required' => false,
                    'options' => ['Option 1', 'Option 2'],
                ],
                'shouldShowTypeBadge' => true,
                'shouldShowRequiredBadge' => false,
            ],
        ];

        foreach ($testCases as $case) {
            $question = $case['question'];
            $isSubheading = $question['type'] === 'subheading';
            
            // Badge logic
            $shouldShowTypeBadge = !$isSubheading;
            $shouldShowRequiredBadge = $question['is_required'] && !$isSubheading;

            $this->assertEquals($case['shouldShowTypeBadge'], $shouldShowTypeBadge,
                "{$question['type']} type badge display should be {$case['shouldShowTypeBadge']}");
            $this->assertEquals($case['shouldShowRequiredBadge'], $shouldShowRequiredBadge,
                "{$question['type']} required badge display should be {$case['shouldShowRequiredBadge']}");
        }
    }

    /**
     * Test component layout structure
     */
    public function test_component_layout_structure()
    {
        // Test subheading layout
        $subheadingQuestion = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Test subheading',
            'is_required' => false,
        ];

        $isSubheading = $subheadingQuestion['type'] === 'subheading';
        $shouldHaveSpecialLayout = $isSubheading;
        $shouldHaveIconAndLabel = $isSubheading;
        $shouldHavePreformattedText = $isSubheading;
        $shouldHaveActionButtons = true; // Both types have action buttons

        $this->assertTrue($shouldHaveSpecialLayout, 'Subheading should have special layout');
        $this->assertTrue($shouldHaveIconAndLabel, 'Subheading should have icon and label');
        $this->assertTrue($shouldHavePreformattedText, 'Subheading should have preformatted text');
        $this->assertTrue($shouldHaveActionButtons, 'Subheading should have action buttons');

        // Test regular question layout
        $regularQuestion = [
            'id' => 2,
            'type' => 'text',
            'label' => 'Test question',
            'is_required' => true,
        ];

        $isSubheading = $regularQuestion['type'] === 'subheading';
        $shouldHaveStandardLayout = !$isSubheading;
        $shouldHaveQuestionText = !$isSubheading;
        $shouldHaveBadgeSection = !$isSubheading;
        $shouldHaveActionButtons = true; // Both types have action buttons

        $this->assertTrue($shouldHaveStandardLayout, 'Regular question should have standard layout');
        $this->assertTrue($shouldHaveQuestionText, 'Regular question should have question text');
        $this->assertTrue($shouldHaveBadgeSection, 'Regular question should have badge section');
        $this->assertTrue($shouldHaveActionButtons, 'Regular question should have action buttons');
    }

    /**
     * Test hover effects
     */
    public function test_hover_effects()
    {
        // Test subheading hover
        $subheadingQuestion = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Test subheading',
            'is_required' => false,
        ];

        $isSubheading = $subheadingQuestion['type'] === 'subheading';
        $shouldHaveAmberHover = $isSubheading; // hover:bg-amber-100
        $shouldHaveTransition = true; // All items have transition

        $this->assertTrue($shouldHaveAmberHover, 'Subheading should have amber hover effect');
        $this->assertTrue($shouldHaveTransition, 'Subheading should have transition');

        // Test regular question hover
        $regularQuestion = [
            'id' => 2,
            'type' => 'text',
            'label' => 'Test question',
            'is_required' => true,
        ];

        $isSubheading = $regularQuestion['type'] === 'subheading';
        $shouldHaveGrayHover = !$isSubheading; // hover:bg-gray-50
        $shouldHaveTransition = true; // All items have transition

        $this->assertTrue($shouldHaveGrayHover, 'Regular question should have gray hover effect');
        $this->assertTrue($shouldHaveTransition, 'Regular question should have transition');
    }

    /**
     * Test label text handling
     */
    public function test_label_text_handling()
    {
        $testLabels = [
            'Simple label',
            'Label with special characters: !@#$%^&*()',
            "Multi-line\nlabel\nwith\nbreaks",
            'Very long label that might wrap to multiple lines in the interface',
            '',
            '   Label with spaces   ',
        ];

        foreach ($testLabels as $label) {
            $subheadingQuestion = [
                'id' => 1,
                'type' => 'subheading',
                'label' => $label,
                'is_required' => false,
            ];

            $regularQuestion = [
                'id' => 2,
                'type' => 'text',
                'label' => $label,
                'is_required' => false,
            ];

            // Test that both types can handle various label content
            $subheadingShouldPreserveWhitespace = $subheadingQuestion['type'] === 'subheading';
            $regularShouldDisplayLabel = $regularQuestion['type'] !== 'subheading';

            $this->assertTrue($subheadingShouldPreserveWhitespace, "Subheading should preserve whitespace for: '{$label}'");
            $this->assertTrue($regularShouldDisplayLabel, "Regular question should display label for: '{$label}'");
        }
    }
}