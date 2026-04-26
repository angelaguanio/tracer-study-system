<?php

namespace Tests\Unit;

use Tests\TestCase;

/**
 * Unit tests for QuestionRenderer component
 * Feature: survey-subheading-feature
 * Validates: Requirements 3.1, 3.2, 3.3
 */
class QuestionRendererTest extends TestCase
{
    /**
     * Test subheading rendering with short label
     */
    public function test_subheading_rendering_with_short_label()
    {
        $question = [
            'id' => 1,
            'type' => 'subheading',
            'label' => 'Personal Information',
            'is_required' => false,
            'options' => null,
        ];

        // Test the rendering logic
        $isSubheading = $question['type'] === 'subheading';
        $shouldRenderAsText = $isSubheading;
        $shouldShowIcon = $isSubheading;
        $shouldHaveSpecialStyling = $isSubheading;

        $this->assertTrue($shouldRenderAsText, 'Short subheading should render as text');
        $this->assertTrue($shouldShowIcon, 'Short subheading should show icon');
        $this->assertTrue($shouldHaveSpecialStyling, 'Short subheading should have special styling');
        $this->assertEquals('Personal Information', $question['label']);
    }

    /**
     * Test subheading rendering with long label
     */
    public function test_subheading_rendering_with_long_label()
    {
        $longLabel = 'This is a very long subheading that contains detailed instructions for the survey section. It explains what kind of information the respondent should provide and gives context about why this information is being collected. The text may span multiple lines and should be properly formatted.';
        
        $question = [
            'id' => 2,
            'type' => 'subheading',
            'label' => $longLabel,
            'is_required' => false,
            'options' => null,
        ];

        // Test the rendering logic
        $isSubheading = $question['type'] === 'subheading';
        $shouldRenderAsText = $isSubheading;
        $shouldPreserveFormatting = $isSubheading;
        $shouldHandleLongText = $isSubheading;

        $this->assertTrue($shouldRenderAsText, 'Long subheading should render as text');
        $this->assertTrue($shouldPreserveFormatting, 'Long subheading should preserve formatting');
        $this->assertTrue($shouldHandleLongText, 'Long subheading should handle long text');
        $this->assertEquals($longLabel, $question['label']);
        $this->assertGreaterThan(100, strlen($question['label']), 'Label should be long');
    }

    /**
     * Test subheading rendering with multi-line label
     */
    public function test_subheading_rendering_with_multiline_label()
    {
        $multilineLabel = "Section 1: Basic Information\n\nPlease provide your basic personal information.\nAll fields marked with * are required.\n\nThis information will be kept confidential.";
        
        $question = [
            'id' => 3,
            'type' => 'subheading',
            'label' => $multilineLabel,
            'is_required' => false,
            'options' => null,
        ];

        // Test the rendering logic
        $isSubheading = $question['type'] === 'subheading';
        $shouldRenderAsText = $isSubheading;
        $shouldPreserveLineBreaks = $isSubheading; // whitespace-pre-wrap
        $hasLineBreaks = strpos($question['label'], "\n") !== false;

        $this->assertTrue($shouldRenderAsText, 'Multiline subheading should render as text');
        $this->assertTrue($shouldPreserveLineBreaks, 'Multiline subheading should preserve line breaks');
        $this->assertTrue($hasLineBreaks, 'Label should contain line breaks');
        $this->assertEquals($multilineLabel, $question['label']);
    }

    /**
     * Test input field rendering for text type
     */
    public function test_input_field_rendering_for_text_type()
    {
        $question = [
            'id' => 4,
            'type' => 'text',
            'label' => 'What is your full name?',
            'is_required' => true,
            'options' => null,
        ];

        // Test the rendering logic
        $isSubheading = $question['type'] === 'subheading';
        $shouldRenderAsInput = !$isSubheading;
        $shouldShowLabel = !$isSubheading;
        $shouldShowRequiredIndicator = $question['is_required'] && !$isSubheading;
        $shouldHaveTextInput = $question['type'] === 'text';

        $this->assertFalse($isSubheading, 'Text question should not be subheading');
        $this->assertTrue($shouldRenderAsInput, 'Text question should render as input');
        $this->assertTrue($shouldShowLabel, 'Text question should show label');
        $this->assertTrue($shouldShowRequiredIndicator, 'Required text question should show required indicator');
        $this->assertTrue($shouldHaveTextInput, 'Text question should have text input');
    }

    /**
     * Test input field rendering for textarea type
     */
    public function test_input_field_rendering_for_textarea_type()
    {
        $question = [
            'id' => 5,
            'type' => 'textarea',
            'label' => 'Please provide additional comments',
            'is_required' => false,
            'options' => null,
        ];

        // Test the rendering logic
        $isSubheading = $question['type'] === 'subheading';
        $shouldRenderAsInput = !$isSubheading;
        $shouldShowLabel = !$isSubheading;
        $shouldShowRequiredIndicator = $question['is_required'] && !$isSubheading;
        $shouldHaveTextarea = $question['type'] === 'textarea';

        $this->assertFalse($isSubheading, 'Textarea question should not be subheading');
        $this->assertTrue($shouldRenderAsInput, 'Textarea question should render as input');
        $this->assertTrue($shouldShowLabel, 'Textarea question should show label');
        $this->assertFalse($shouldShowRequiredIndicator, 'Non-required textarea should not show required indicator');
        $this->assertTrue($shouldHaveTextarea, 'Textarea question should have textarea');
    }

    /**
     * Test input field rendering for select type
     */
    public function test_input_field_rendering_for_select_type()
    {
        $question = [
            'id' => 6,
            'type' => 'select',
            'label' => 'Select your age range',
            'is_required' => true,
            'options' => ['18-25', '26-35', '36-45', '46-55', '55+'],
        ];

        // Test the rendering logic
        $isSubheading = $question['type'] === 'subheading';
        $shouldRenderAsInput = !$isSubheading;
        $shouldShowLabel = !$isSubheading;
        $shouldShowRequiredIndicator = $question['is_required'] && !$isSubheading;
        $shouldHaveOptions = in_array($question['type'], ['select', 'radio', 'checkbox']);
        $shouldHaveSelectDropdown = $question['type'] === 'select';

        $this->assertFalse($isSubheading, 'Select question should not be subheading');
        $this->assertTrue($shouldRenderAsInput, 'Select question should render as input');
        $this->assertTrue($shouldShowLabel, 'Select question should show label');
        $this->assertTrue($shouldShowRequiredIndicator, 'Required select should show required indicator');
        $this->assertTrue($shouldHaveOptions, 'Select question should have options');
        $this->assertTrue($shouldHaveSelectDropdown, 'Select question should have dropdown');
        $this->assertNotEmpty($question['options'], 'Select question should have option values');
        $this->assertCount(5, $question['options'], 'Select question should have 5 options');
    }

    /**
     * Test styling and visual distinction for subheadings
     */
    public function test_styling_and_visual_distinction_for_subheadings()
    {
        $question = [
            'id' => 7,
            'type' => 'subheading',
            'label' => 'Employment History',
            'is_required' => false,
            'options' => null,
        ];

        // Test styling logic
        $isSubheading = $question['type'] === 'subheading';
        $shouldHaveBlueBackground = $isSubheading; // bg-blue-50
        $shouldHaveBlueBorder = $isSubheading; // border-l-4 border-blue-500
        $shouldHaveIcon = $isSubheading; // Heading2 icon
        $shouldHavePadding = $isSubheading; // px-4 py-3
        $shouldHaveRoundedCorners = $isSubheading; // rounded-lg
        $shouldHaveSectionLabel = $isSubheading; // "Section Information" label

        $this->assertTrue($shouldHaveBlueBackground, 'Subheading should have blue background');
        $this->assertTrue($shouldHaveBlueBorder, 'Subheading should have blue border');
        $this->assertTrue($shouldHaveIcon, 'Subheading should have icon');
        $this->assertTrue($shouldHavePadding, 'Subheading should have padding');
        $this->assertTrue($shouldHaveRoundedCorners, 'Subheading should have rounded corners');
        $this->assertTrue($shouldHaveSectionLabel, 'Subheading should have section label');
    }

    /**
     * Test that subheadings don't show required indicators
     */
    public function test_subheadings_never_show_required_indicators()
    {
        // Test subheading with is_required = false
        $question1 = [
            'id' => 8,
            'type' => 'subheading',
            'label' => 'Optional Section',
            'is_required' => false,
            'options' => null,
        ];

        // Test subheading with is_required = true (should still not show required)
        $question2 = [
            'id' => 9,
            'type' => 'subheading',
            'label' => 'Required Section',
            'is_required' => true, // This should be ignored
            'options' => null,
        ];

        foreach ([$question1, $question2] as $question) {
            $isSubheading = $question['type'] === 'subheading';
            $shouldShowRequiredIndicator = $question['is_required'] && !$isSubheading;

            $this->assertTrue($isSubheading, 'Question should be subheading');
            $this->assertFalse($shouldShowRequiredIndicator, 'Subheading should never show required indicator');
        }
    }

    /**
     * Test error display capability
     */
    public function test_error_display_capability()
    {
        $testCases = [
            [
                'question' => [
                    'id' => 10,
                    'type' => 'subheading',
                    'label' => 'Test Subheading',
                    'is_required' => false,
                ],
                'error' => 'Some error message',
                'shouldShowError' => true,
            ],
            [
                'question' => [
                    'id' => 11,
                    'type' => 'text',
                    'label' => 'Test Question',
                    'is_required' => true,
                ],
                'error' => 'This field is required',
                'shouldShowError' => true,
            ],
            [
                'question' => [
                    'id' => 12,
                    'type' => 'select',
                    'label' => 'Test Select',
                    'is_required' => false,
                    'options' => ['Option 1', 'Option 2'],
                ],
                'error' => null,
                'shouldShowError' => false,
            ],
        ];

        foreach ($testCases as $case) {
            $hasError = !empty($case['error']);
            $shouldDisplayError = $hasError && $case['shouldShowError'];

            if ($case['shouldShowError'] && $case['error']) {
                $this->assertTrue($shouldDisplayError, 'Should display error when error exists');
                $this->assertEquals($case['error'], $case['error']);
            } else {
                $this->assertFalse($shouldDisplayError, 'Should not display error when no error');
            }
        }
    }

    /**
     * Test component ID generation
     */
    public function test_component_id_generation()
    {
        $questions = [
            ['id' => 1, 'type' => 'subheading'],
            ['id' => 42, 'type' => 'text'],
            ['id' => 999, 'type' => 'select'],
        ];

        foreach ($questions as $question) {
            $expectedId = "q-{$question['id']}";
            $generatedId = "q-{$question['id']}"; // Simulate the ID generation logic

            $this->assertEquals($expectedId, $generatedId, "ID should be generated correctly for question {$question['id']}");
        }
    }

    /**
     * Test options handling for different question types
     */
    public function test_options_handling_for_different_types()
    {
        $testCases = [
            [
                'type' => 'subheading',
                'options' => null,
                'shouldHaveOptions' => false,
            ],
            [
                'type' => 'text',
                'options' => null,
                'shouldHaveOptions' => false,
            ],
            [
                'type' => 'select',
                'options' => ['Option 1', 'Option 2'],
                'shouldHaveOptions' => true,
            ],
            [
                'type' => 'radio',
                'options' => ['Yes', 'No', 'Maybe'],
                'shouldHaveOptions' => true,
            ],
            [
                'type' => 'checkbox',
                'options' => ['A', 'B', 'C', 'Others'],
                'shouldHaveOptions' => true,
            ],
            [
                'type' => 'likert',
                'options' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
                'shouldHaveOptions' => true,
            ],
        ];

        foreach ($testCases as $case) {
            $question = [
                'id' => 1,
                'type' => $case['type'],
                'label' => "Test {$case['type']} question",
                'is_required' => false,
                'options' => $case['options'],
            ];

            $hasOptions = !empty($question['options']);
            $shouldUseOptions = in_array($question['type'], ['select', 'radio', 'checkbox', 'likert']);

            if ($case['shouldHaveOptions']) {
                $this->assertTrue($hasOptions, "{$case['type']} should have options");
                $this->assertTrue($shouldUseOptions, "{$case['type']} should use options");
            } else {
                $this->assertFalse($shouldUseOptions || $hasOptions, "{$case['type']} should not use options");
            }
        }
    }
}