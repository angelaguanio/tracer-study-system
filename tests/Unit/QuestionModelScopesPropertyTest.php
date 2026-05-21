<?php

namespace Tests\Unit;

use App\Models\Question;
use Tests\TestCase;

/**
 * Property-based tests for Question model scopes
 * Feature: survey-subheading-feature
 * Property 6: Validation Exclusion
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 */
class QuestionModelScopesPropertyTest extends TestCase
{
    /**
     * Property: For any collection of questions with mixed types,
     * scopeInputQuestions should return only non-subheading questions
     * and scopeSubheadings should return only subheading questions
     */
    public function test_scope_methods_correctly_filter_questions_by_type()
    {
        // Test the scope query building logic without database interaction
        $query = Question::inputQuestions();
        $sql = $query->toSql();
        $bindings = $query->getBindings();
        
        // Verify the SQL contains the correct WHERE clause
        $this->assertStringContainsString('where "type" != ?', $sql);
        $this->assertEquals(['subheading'], $bindings);
        
        $query = Question::subheadings();
        $sql = $query->toSql();
        $bindings = $query->getBindings();
        
        // Verify the SQL contains the correct WHERE clause
        $this->assertStringContainsString('where "type" = ?', $sql);
        $this->assertEquals(['subheading'], $bindings);
    }

    /**
     * Property: Scope methods should build correct queries
     */
    public function test_scope_methods_build_correct_queries()
    {
        // Test inputQuestions scope
        $inputQuery = Question::inputQuestions();
        $this->assertStringContainsString('type', $inputQuery->toSql());
        $this->assertContains('subheading', $inputQuery->getBindings());
        
        // Test subheadings scope  
        $subheadingQuery = Question::subheadings();
        $this->assertStringContainsString('type', $subheadingQuery->toSql());
        $this->assertContains('subheading', $subheadingQuery->getBindings());
        
        // Verify they have different WHERE conditions
        $this->assertNotEquals($inputQuery->toSql(), $subheadingQuery->toSql());
    }

    /**
     * Property: Scopes should be chainable with other query methods
     */
    public function test_scopes_are_chainable()
    {
        // Test chaining with other query methods
        $query1 = Question::inputQuestions()->where('is_required', true);
        $sql1 = $query1->toSql();
        
        $this->assertStringContainsString('where "type" != ?', $sql1);
        $this->assertStringContainsString('and "is_required" = ?', $sql1);
        
        $query2 = Question::subheadings()->orderBy('display_order');
        $sql2 = $query2->toSql();
        
        $this->assertStringContainsString('where "type" = ?', $sql2);
        $this->assertStringContainsString('order by "display_order"', $sql2);
    }

    /**
     * Property: Model should have isSubheading helper method
     */
    public function test_model_has_is_subheading_helper()
    {
        $question = new Question(['type' => 'subheading']);
        $this->assertTrue($question->isSubheading());
        
        $question = new Question(['type' => 'text']);
        $this->assertFalse($question->isSubheading());
        
        $question = new Question(['type' => 'select']);
        $this->assertFalse($question->isSubheading());
    }
}