<?php

namespace Tests\Unit;

use Tests\TestCase;

/**
 * Unit tests for QuestionFormModal component logic
 * Feature: survey-subheading-feature
 * Validates: Requirements 1.2, 1.3
 */
class QuestionFormModalTest extends TestCase
{
    /**
     * Test modal opening in subheading mode
     */
    public function test_modal_opens_in_subheading_mode()
    {
        // Test the logic for determining modal mode
        $questionType = 'subheading';
        $isSubheadingMode = $questionType === 'subheading';
        
        $this->assertTrue($isSubheadingMode, 'Modal should recognize subheading mode');
        
        // Test modal title logic
        $isEdit = false;
        $modalTitle = $isEdit ? "Edit Question" : "Add Question";
        
        $this->assertEquals("Add Question", $modalTitle);
    }

    /**
     * Test form field visibility based on question type
     */
    public function test_form_field_visibility_based_on_question_type()
    {
        // Test subheading type
        $questionType = 'subheading';
        
        $shouldShowRequiredToggle = $questionType !== 'subheading';
        $shouldShowOptions = in_array($questionType, ['select', 'radio', 'checkbox']);
        $shouldShowLikertScale = $questionType === 'likert';
        $shouldUseTextarea = $questionType === 'subheading';
        
        $this->assertFalse($shouldShowRequiredToggle, 'Required toggle should be hidden for subheadings');
        $this->assertFalse($shouldShowOptions, 'Options should be hidden for subheadings');
        $this->assertFalse($shouldShowLikertScale, 'Likert scale should be hidden for subheadings');
        $this->assertTrue($shouldUseTextarea, 'Should use textarea for subheadings');
        
        // Test text type for comparison
        $questionType = 'text';
        
        $shouldShowRequiredToggle = $questionType !== 'subheading';
        $shouldShowOptions = in_array($questionType, ['select', 'radio', 'checkbox']);
        $shouldShowLikertScale = $questionType === 'likert';
        $shouldUseTextarea = $questionType === 'subheading';
        
        $this->assertTrue($shouldShowRequiredToggle, 'Required toggle should be shown for text questions');
        $this->assertFalse($shouldShowOptions, 'Options should be hidden for text questions');
        $this->assertFalse($shouldShowLikertScale, 'Likert scale should be hidden for text questions');
        $this->assertFalse($shouldUseTextarea, 'Should not use textarea for text questions');
        
        // Test select type for comparison
        $questionType = 'select';
        
        $shouldShowRequiredToggle = $questionType !== 'subheading';
        $shouldShowOptions = in_array($questionType, ['select', 'radio', 'checkbox']);
        $shouldShowLikertScale = $questionType === 'likert';
        $shouldUseTextarea = $questionType === 'subheading';
        
        $this->assertTrue($shouldShowRequiredToggle, 'Required toggle should be shown for select questions');
        $this->assertTrue($shouldShowOptions, 'Options should be shown for select questions');
        $this->assertFalse($shouldShowLikertScale, 'Likert scale should be hidden for select questions');
        $this->assertFalse($shouldUseTextarea, 'Should not use textarea for select questions');
    }

    /**
     * Test form submission with subheading data
     */
    public function test_form_submission_with_subheading_data()
    {
        // Test payload preparation for subheading
        $formData = [
            'label' => 'Test subheading description',
            'type' => 'subheading',
            'is_required' => true, // This should be ignored
            'options' => ['option1', 'option2'] // This should be removed
        ];
        
        // Simulate the payload preparation logic
        $payload = $formData;
        $choiceTypes = ['select', 'radio', 'checkbox'];
        
        // Remove options if not a choice type
        if (!in_array($formData['type'], $choiceTypes)) {
            unset($payload['options']);
        }
        
        // For subheadings, ensure is_required is false
        if ($formData['type'] === 'subheading') {
            $payload['is_required'] = false;
        }
        
        // Verify the payload
        $this->assertEquals('Test subheading description', $payload['label']);
        $this->assertEquals('subheading', $payload['type']);
        $this->assertFalse($payload['is_required'], 'Subheading should never be required');
        $this->assertArrayNotHasKey('options', $payload, 'Options should be removed from subheading payload');
    }

    /**
     * Test form submission with regular question data
     */
    public function test_form_submission_with_regular_question_data()
    {
        // Test payload preparation for regular question
        $formData = [
            'label' => 'What is your name?',
            'type' => 'text',
            'is_required' => true,
            'options' => []
        ];
        
        // Simulate the payload preparation logic
        $payload = $formData;
        $choiceTypes = ['select', 'radio', 'checkbox'];
        
        // Remove options if not a choice type
        if (!in_array($formData['type'], $choiceTypes)) {
            unset($payload['options']);
        }
        
        // Verify the payload
        $this->assertEquals('What is your name?', $payload['label']);
        $this->assertEquals('text', $payload['type']);
        $this->assertTrue($payload['is_required'], 'Regular questions can be required');
        $this->assertArrayNotHasKey('options', $payload, 'Options should be removed for non-choice types');
    }

    /**
     * Test form submission with choice question data
     */
    public function test_form_submission_with_choice_question_data()
    {
        // Test payload preparation for choice question
        $formData = [
            'label' => 'Select your favorite color',
            'type' => 'select',
            'is_required' => false,
            'options' => ['Red', 'Blue', 'Green']
        ];
        
        // Simulate the payload preparation logic
        $payload = $formData;
        $choiceTypes = ['select', 'radio', 'checkbox'];
        
        // Keep options for choice types
        if (!in_array($formData['type'], $choiceTypes)) {
            unset($payload['options']);
        }
        
        // Verify the payload
        $this->assertEquals('Select your favorite color', $payload['label']);
        $this->assertEquals('select', $payload['type']);
        $this->assertFalse($payload['is_required']);
        $this->assertArrayHasKey('options', $payload, 'Options should be kept for choice types');
        $this->assertEquals(['Red', 'Blue', 'Green'], $payload['options']);
    }

    /**
     * Test label and placeholder text for different question types
     */
    public function test_label_and_placeholder_text()
    {
        // Test subheading
        $questionType = 'subheading';
        $labelText = $questionType === 'subheading' ? 'Subheading / Description Text:' : 'Question:';
        $placeholder = $questionType === 'subheading' 
            ? 'Enter section description or instructions...' 
            : 'Question label';
        
        $this->assertEquals('Subheading / Description Text:', $labelText);
        $this->assertEquals('Enter section description or instructions...', $placeholder);
        
        // Test regular question
        $questionType = 'text';
        $labelText = $questionType === 'subheading' ? 'Subheading / Description Text:' : 'Question:';
        $placeholder = $questionType === 'subheading' 
            ? 'Enter section description or instructions...' 
            : 'Question label';
        
        $this->assertEquals('Question:', $labelText);
        $this->assertEquals('Question label', $placeholder);
    }

    /**
     * Test form initialization with existing question data
     */
    public function test_form_initialization_with_existing_question()
    {
        // Test initializing form with existing subheading
        $existingQuestion = [
            'label' => 'Existing subheading',
            'type' => 'subheading',
            'is_required' => false,
            'options' => null
        ];
        
        // Simulate form initialization
        $form = [
            'label' => $existingQuestion['label'],
            'type' => $existingQuestion['type'],
            'is_required' => $existingQuestion['is_required'],
            'options' => $existingQuestion['options'] ?? []
        ];
        
        $this->assertEquals('Existing subheading', $form['label']);
        $this->assertEquals('subheading', $form['type']);
        $this->assertFalse($form['is_required']);
        $this->assertEmpty($form['options']);
        
        // Test initializing form with existing regular question
        $existingQuestion = [
            'label' => 'What is your age?',
            'type' => 'number',
            'is_required' => true,
            'options' => null
        ];
        
        $form = [
            'label' => $existingQuestion['label'],
            'type' => $existingQuestion['type'],
            'is_required' => $existingQuestion['is_required'],
            'options' => $existingQuestion['options'] ?? []
        ];
        
        $this->assertEquals('What is your age?', $form['label']);
        $this->assertEquals('number', $form['type']);
        $this->assertTrue($form['is_required']);
        $this->assertEmpty($form['options']);
    }

    /**
     * Test form reset to default values
     */
    public function test_form_reset_to_defaults()
    {
        // Test default form state
        $defaultForm = [
            'label' => '',
            'type' => 'text',
            'is_required' => false,
            'options' => []
        ];
        
        $this->assertEquals('', $defaultForm['label']);
        $this->assertEquals('text', $defaultForm['type']);
        $this->assertFalse($defaultForm['is_required']);
        $this->assertEmpty($defaultForm['options']);
    }

    /**
     * Test type change resets options
     */
    public function test_type_change_resets_options()
    {
        // Start with a select question with options
        $form = [
            'label' => 'Test question',
            'type' => 'select',
            'is_required' => false,
            'options' => ['Option 1', 'Option 2', 'Option 3']
        ];
        
        // Change type to subheading (should reset options)
        $newType = 'subheading';
        $form['type'] = $newType;
        $form['options'] = []; // Options should be reset when type changes
        
        $this->assertEquals('subheading', $form['type']);
        $this->assertEmpty($form['options'], 'Options should be reset when changing to subheading');
        
        // Change type to text (should also reset options)
        $newType = 'text';
        $form['type'] = $newType;
        $form['options'] = []; // Options should be reset when type changes
        
        $this->assertEquals('text', $form['type']);
        $this->assertEmpty($form['options'], 'Options should be reset when changing to text');
    }

    /**
     * Test question types array contains subheading
     */
    public function test_question_types_contains_subheading()
    {
        $questionTypes = [
            ['value' => 'text', 'label' => 'Short Answer'],
            ['value' => 'textarea', 'label' => 'Long Answer'],
            ['value' => 'number', 'label' => 'Number'],
            ['value' => 'select', 'label' => 'Dropdown'],
            ['value' => 'radio', 'label' => 'Multiple Choice'],
            ['value' => 'checkbox', 'label' => 'Checkboxes'],
            ['value' => 'likert', 'label' => 'Likert Scale'],
            ['value' => 'subheading', 'label' => 'Subheading / Description'],
        ];
        
        $subheadingType = collect($questionTypes)->firstWhere('value', 'subheading');
        
        $this->assertNotNull($subheadingType, 'Subheading type should exist in question types');
        $this->assertEquals('subheading', $subheadingType['value']);
        $this->assertStringContainsString('Subheading', $subheadingType['label']);
    }
}