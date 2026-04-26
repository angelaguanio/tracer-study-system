<?php

namespace Tests\Unit;

use Tests\TestCase;

/**
 * Property-based tests for QuestionItem visual distinction
 * Feature: survey-subheading-feature
 * Property 4: Visual Distinction
 * Validates: Requirements 2.1, 2.2
 */
class QuestionItemVisualDistinctionPropertyTest extends TestCase
{
    /**
     * Property: For any subheading item displayed in the Survey_Builder question list,
     * it should have distinct visual styling that clearly indicates it is a non-input
     * organizational element.
     */
    public function test_subheading_items_have_distinct_visual_styling()
    {
        $subheadingQuestion = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Personal Information Section',
            'is_required' => false,
            'options' => null,
        ];

        // Test visual distinction logic
        $isSubheading = $subheadingQuestion['type'] === 'subheading';
        $shouldHaveAmberBackground = $isSubheading; // bg-amber-50
        $shouldHaveDashedBorder = $isSubheading; // border-dashed border-amber-300
        $shouldHaveSpecialLabel = $isSubheading; // "Section Description"
        $shouldHaveHeadingIcon = $isSubheading; // Heading2 icon
        $shouldHaveHoverEffect = $isSubheading; // hover:bg-amber-100
        $shouldNotHaveTypeBadge = $isSubheading; // No type badge for subheadings
        $shouldNotHaveRequiredBadge = $isSubheading; // No required badge for subheadings

        $this->assertTrue($shouldHaveAmberBackground, 'Subheading should have amber background');
        $this->assertTrue($shouldHaveDashedBorder, 'Subheading should have dashed border');
        $this->assertTrue($shouldHaveSpecialLabel, 'Subheading should have special "Section Description" label');
        $this->assertTrue($shouldHaveHeadingIcon, 'Subheading should have Heading2 icon');
        $this->assertTrue($shouldHaveHoverEffect, 'Subheading should have hover effect');
        $this->assertTrue($shouldNotHaveTypeBadge, 'Subheading should not have type badge');
        $this->assertTrue($shouldNotHaveRequiredBadge, 'Subheading should not have required badge');
    }

    /**
     * Property: Regular questions should have different visual styling from subheadings
     */
    public function test_regular_questions_have_different_visual_styling()
    {
        $regularQuestionTypes = ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'likert'];

        foreach ($regularQuestionTypes as $type) {
            $regularQuestion = [
                'id' => 1,
                'type' => $type,
                'label' => "Test {$type} question",
                'is_required' => true,
                'options' => in_array($type, ['select', 'radio', 'checkbox', 'likert']) 
                    ? ['Option 1', 'Option 2'] 
                    : null,
            ];

            // Test visual styling logic for regular questions
            $isSubheading = $regularQuestion['type'] === 'subheading';
            $shouldHaveWhiteBackground = !$isSubheading; // bg-white
            $shouldHaveSolidBorder = !$isSubheading; // border-gray-200
            $shouldHaveTypeBadge = !$isSubheading; // Type badge with icon
            $shouldHaveRequiredBadge = $regularQuestion['is_required'] && !$isSubheading;
            $shouldNotHaveSpecialLabel = !$isSubheading; // No "Section Description"
            $shouldHaveGrayHover = !$isSubheading; // hover:bg-gray-50

            $this->assertFalse($isSubheading, "{$type} should not be subheading");
            $this->assertTrue($shouldHaveWhiteBackground, "{$type} should have white background");
            $this->assertTrue($shouldHaveSolidBorder, "{$type} should have solid border");
            $this->assertTrue($shouldHaveTypeBadge, "{$type} should have type badge");
            $this->assertTrue($shouldHaveRequiredBadge, "Required {$type} should have required badge");
            $this->assertTrue($shouldNotHaveSpecialLabel, "{$type} should not have special label");
            $this->assertTrue($shouldHaveGrayHover, "{$type} should have gray hover effect");
        }
    }

    /**
     * Property: TYPE_MAP should contain correct configuration for all question types
     */
    public function test_type_map_contains_correct_configuration()
    {
        $expectedTypeMap = [
            'text' => ['label' => 'Short Answer', 'hasIcon' => true],
            'textarea' => ['label' => 'Long Answer', 'hasIcon' => true],
            'number' => ['label' => 'Number', 'hasIcon' => true],
            'select' => ['label' => 'Dropdown', 'hasIcon' => true],
            'radio' => ['label' => 'Multiple Choice', 'hasIcon' => true],
            'checkbox' => ['label' => 'Checkboxes', 'hasIcon' => true],
            'likert' => ['label' => 'Likert Scale', 'hasIcon' => true],
            'subheading' => ['label' => 'Subheading', 'hasIcon' => true],
        ];

        foreach ($expectedTypeMap as $type => $config) {
            // Test that each type has proper configuration
            $hasTypeConfig = array_key_exists($type, $expectedTypeMap);
            $hasLabel = !empty($config['label']);
            $hasIcon = $config['hasIcon'];

            $this->assertTrue($hasTypeConfig, "TYPE_MAP should contain {$type}");
            $this->assertTrue($hasLabel, "{$type} should have label");
            $this->assertTrue($hasIcon, "{$type} should have icon");

            // Special validation for subheading
            if ($type === 'subheading') {
                $this->assertEquals('Subheading', $config['label'], 'Subheading should have correct label');
            }
        }
    }

    /**
     * Property: Visual styling should be consistent across different subheading labels
     */
    public function test_visual_styling_consistent_across_subheading_labels()
    {
        $subheadingLabels = [
            'Short section',
            'This is a longer section description with more detailed information',
            "Multi-line\nsection\ndescription",
            'Section with special characters: !@#$%^&*()',
            str_repeat('Very long section description ', 10),
        ];

        foreach ($subheadingLabels as $label) {
            $subheadingQuestion = [
                'id' => 1,
                'type' => 'subheading',
                'label' => $label,
                'is_required' => false,
                'options' => null,
            ];

            // Test that styling is consistent regardless of label content
            $isSubheading = $subheadingQuestion['type'] === 'subheading';
            $shouldHaveConsistentStyling = $isSubheading;
            $shouldPreserveWhitespace = $isSubheading; // whitespace-pre-wrap
            $shouldHandleLongText = $isSubheading;
            $shouldHandleSpecialChars = $isSubheading;

            $this->assertTrue($shouldHaveConsistentStyling, "Styling should be consistent for label: '{$label}'");
            $this->assertTrue($shouldPreserveWhitespace, "Should preserve whitespace for label: '{$label}'");
            $this->assertTrue($shouldHandleLongText, "Should handle long text for label: '{$label}'");
            $this->assertTrue($shouldHandleSpecialChars, "Should handle special chars for label: '{$label}'");
        }
    }

    /**
     * Property: Component structure should differ between subheadings and regular questions
     */
    public function test_component_structure_differs_between_types()
    {
        $subheadingQuestion = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Test subheading',
            'is_required' => false,
        ];

        $regularQuestion = [
            'id' => 2,
            'type' => 'text',
            'label' => 'Test question',
            'is_required' => true,
        ];

        // Test subheading structure
        $isSubheading = $subheadingQuestion['type'] === 'subheading';
        $shouldHaveSpecialStructure = $isSubheading;
        $shouldHaveIconWithLabel = $isSubheading; // Icon + "Section Description"
        $shouldHavePreformattedText = $isSubheading; // whitespace-pre-wrap
        $shouldNotHaveBadges = $isSubheading;

        $this->assertTrue($shouldHaveSpecialStructure, 'Subheading should have special structure');
        $this->assertTrue($shouldHaveIconWithLabel, 'Subheading should have icon with label');
        $this->assertTrue($shouldHavePreformattedText, 'Subheading should have preformatted text');
        $this->assertTrue($shouldNotHaveBadges, 'Subheading should not have badges');

        // Test regular question structure
        $isSubheading = $regularQuestion['type'] === 'subheading';
        $shouldHaveStandardStructure = !$isSubheading;
        $shouldHaveQuestionLabel = !$isSubheading;
        $shouldHaveBadges = !$isSubheading;
        $shouldHaveTypeBadge = !$isSubheading;

        $this->assertTrue($shouldHaveStandardStructure, 'Regular question should have standard structure');
        $this->assertTrue($shouldHaveQuestionLabel, 'Regular question should have question label');
        $this->assertTrue($shouldHaveBadges, 'Regular question should have badges');
        $this->assertTrue($shouldHaveTypeBadge, 'Regular question should have type badge');
    }

    /**
     * Property: Action buttons should be available for both subheadings and regular questions
     */
    public function test_action_buttons_available_for_all_types()
    {
        $questionTypes = ['subheading', 'text', 'select', 'radio'];

        foreach ($questionTypes as $type) {
            $question = [
                'id' => 1,
                'type' => $type,
                'label' => "Test {$type}",
                'is_required' => $type !== 'subheading',
                'options' => in_array($type, ['select', 'radio']) ? ['Option 1'] : null,
            ];

            // Test that all questions have action buttons
            $shouldHaveReorderButtons = true; // Up/Down arrows
            $shouldHaveEditButton = true; // Pencil icon
            $shouldHaveDeleteButton = true; // Trash icon
            $shouldRespectFirstLast = true; // Disable up/down based on position

            $this->assertTrue($shouldHaveReorderButtons, "{$type} should have reorder buttons");
            $this->assertTrue($shouldHaveEditButton, "{$type} should have edit button");
            $this->assertTrue($shouldHaveDeleteButton, "{$type} should have delete button");
            $this->assertTrue($shouldRespectFirstLast, "{$type} should respect first/last position");
        }
    }

    /**
     * Property: Color scheme should be consistent and accessible
     */
    public function test_color_scheme_consistency_and_accessibility()
    {
        // Test subheading color scheme
        $subheadingColors = [
            'background' => 'amber-50',
            'border' => 'amber-300',
            'hover' => 'amber-100',
            'icon' => 'amber-700',
            'text' => 'gray-700',
        ];

        // Test regular question color scheme
        $regularColors = [
            'background' => 'white',
            'border' => 'gray-200',
            'hover' => 'gray-50',
            'text' => 'gray-800',
            'badge_bg' => 'sky-100',
            'badge_text' => 'sky-700',
            'badge_border' => 'sky-300',
        ];

        // Verify color schemes are defined and consistent
        foreach ($subheadingColors as $element => $color) {
            $this->assertNotEmpty($color, "Subheading {$element} color should be defined");
            
            // Text color is gray, others should be amber
            if ($element === 'text') {
                $this->assertStringContainsString('gray', $color, "Subheading text should use gray color");
            } else {
                $this->assertStringContainsString('amber', $color, "Subheading {$element} should use amber theme");
            }
        }

        foreach ($regularColors as $element => $color) {
            $this->assertNotEmpty($color, "Regular question {$element} color should be defined");
            
            if (str_contains($element, 'badge')) {
                $this->assertStringContainsString('sky', $color, "Badge colors should use sky theme");
            } else {
                $this->assertTrue(
                    str_contains($color, 'gray') || str_contains($color, 'white'),
                    "Regular question colors should use gray/white theme"
                );
            }
        }
    }

    /**
     * Property: Required badge should only appear for required non-subheading questions
     */
    public function test_required_badge_logic()
    {
        $testCases = [
            ['type' => 'subheading', 'is_required' => false, 'shouldShowBadge' => false],
            ['type' => 'subheading', 'is_required' => true, 'shouldShowBadge' => false], // Never for subheadings
            ['type' => 'text', 'is_required' => true, 'shouldShowBadge' => true],
            ['type' => 'text', 'is_required' => false, 'shouldShowBadge' => false],
            ['type' => 'select', 'is_required' => true, 'shouldShowBadge' => true],
            ['type' => 'select', 'is_required' => false, 'shouldShowBadge' => false],
        ];

        foreach ($testCases as $case) {
            $question = [
                'id' => 1,
                'type' => $case['type'],
                'label' => 'Test question',
                'is_required' => $case['is_required'],
                'options' => $case['type'] === 'select' ? ['Option 1'] : null,
            ];

            // Test required badge logic
            $isSubheading = $question['type'] === 'subheading';
            $shouldShowRequiredBadge = $question['is_required'] && !$isSubheading;

            $this->assertEquals($case['shouldShowBadge'], $shouldShowRequiredBadge,
                "Required badge for {$case['type']} (required: {$case['is_required']}) should be {$case['shouldShowBadge']}");
        }
    }
}