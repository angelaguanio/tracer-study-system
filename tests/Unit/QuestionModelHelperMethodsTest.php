<?php

namespace Tests\Unit;

use App\Models\Question;
use Tests\TestCase;

/**
 * Unit tests for Question model helper methods
 * Feature: survey-subheading-feature
 * Validates: Requirements 4.1, 5.1
 */
class QuestionModelHelperMethodsTest extends TestCase
{
    /**
     * Test isSubheading() method with subheading type
     */
    public function test_is_subheading_returns_true_for_subheading_type()
    {
        $question = new Question(['type' => 'subheading']);
        
        $this->assertTrue($question->isSubheading());
    }

    /**
     * Test isSubheading() method with text type
     */
    public function test_is_subheading_returns_false_for_text_type()
    {
        $question = new Question(['type' => 'text']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with select type
     */
    public function test_is_subheading_returns_false_for_select_type()
    {
        $question = new Question(['type' => 'select']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with radio type
     */
    public function test_is_subheading_returns_false_for_radio_type()
    {
        $question = new Question(['type' => 'radio']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with checkbox type
     */
    public function test_is_subheading_returns_false_for_checkbox_type()
    {
        $question = new Question(['type' => 'checkbox']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with number type
     */
    public function test_is_subheading_returns_false_for_number_type()
    {
        $question = new Question(['type' => 'number']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with textarea type
     */
    public function test_is_subheading_returns_false_for_textarea_type()
    {
        $question = new Question(['type' => 'textarea']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with likert type
     */
    public function test_is_subheading_returns_false_for_likert_type()
    {
        $question = new Question(['type' => 'likert']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with null type
     */
    public function test_is_subheading_returns_false_for_null_type()
    {
        $question = new Question(['type' => null]);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with empty string type
     */
    public function test_is_subheading_returns_false_for_empty_string_type()
    {
        $question = new Question(['type' => '']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method with invalid type
     */
    public function test_is_subheading_returns_false_for_invalid_type()
    {
        $question = new Question(['type' => 'invalid_type']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test isSubheading() method is case sensitive
     */
    public function test_is_subheading_is_case_sensitive()
    {
        $question = new Question(['type' => 'SUBHEADING']);
        
        $this->assertFalse($question->isSubheading());
        
        $question = new Question(['type' => 'Subheading']);
        
        $this->assertFalse($question->isSubheading());
        
        $question = new Question(['type' => 'SubHeading']);
        
        $this->assertFalse($question->isSubheading());
    }

    /**
     * Test scope methods with various question types
     */
    public function test_scope_methods_with_mixed_question_datasets()
    {
        // Test inputQuestions scope excludes subheadings
        $inputQuery = Question::inputQuestions();
        $sql = $inputQuery->toSql();
        $bindings = $inputQuery->getBindings();
        
        $this->assertStringContainsString('where "type" != ?', $sql);
        $this->assertEquals(['subheading'], $bindings);
        
        // Test subheadings scope includes only subheadings
        $subheadingQuery = Question::subheadings();
        $sql = $subheadingQuery->toSql();
        $bindings = $subheadingQuery->getBindings();
        
        $this->assertStringContainsString('where "type" = ?', $sql);
        $this->assertEquals(['subheading'], $bindings);
    }

    /**
     * Test scope methods can be chained with other query methods
     */
    public function test_scope_methods_are_chainable()
    {
        // Test chaining inputQuestions with where clause
        $query = Question::inputQuestions()->where('is_required', true);
        $sql = $query->toSql();
        
        $this->assertStringContainsString('where "type" != ?', $sql);
        $this->assertStringContainsString('and "is_required" = ?', $sql);
        
        // Test chaining subheadings with orderBy
        $query = Question::subheadings()->orderBy('display_order', 'asc');
        $sql = $query->toSql();
        
        $this->assertStringContainsString('where "type" = ?', $sql);
        $this->assertStringContainsString('order by "display_order" asc', $sql);
        
        // Test chaining with multiple conditions
        $query = Question::inputQuestions()
            ->where('section_id', 1)
            ->where('is_required', false)
            ->orderBy('display_order');
        $sql = $query->toSql();
        
        $this->assertStringContainsString('where "type" != ?', $sql);
        $this->assertStringContainsString('and "section_id" = ?', $sql);
        $this->assertStringContainsString('and "is_required" = ?', $sql);
        $this->assertStringContainsString('order by "display_order"', $sql);
    }

    /**
     * Test that scope methods return query builder instances
     */
    public function test_scope_methods_return_query_builder()
    {
        $inputQuery = Question::inputQuestions();
        $subheadingQuery = Question::subheadings();
        
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Builder::class, $inputQuery);
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Builder::class, $subheadingQuery);
    }
}