<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Section;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        $types = ['text', 'select', 'radio', 'checkbox', 'number', 'textarea', 'likert', 'subheading'];
        $type = $this->faker->randomElement($types);
        
        return [
            'section_id' => 1, // Default to 1, should be overridden
            'question_identifier' => $this->faker->unique()->bothify('Q##'),
            'label' => $type === 'subheading' ? $this->faker->sentence(4) : $this->faker->sentence(6) . '?',
            'type' => $type,
            'options' => $this->getOptionsForType($type),
            'display_order' => $this->faker->numberBetween(1, 20),
            'is_required' => $type === 'subheading' ? false : $this->faker->boolean(70),
        ];
    }

    private function getOptionsForType(string $type): ?array
    {
        return match ($type) {
            'select', 'radio', 'checkbox' => [
                'options' => [
                    $this->faker->word(),
                    $this->faker->word(),
                    $this->faker->word(),
                ]
            ],
            'likert' => [
                'scale' => 5,
                'labels' => [
                    'Strongly Disagree',
                    'Disagree', 
                    'Neutral',
                    'Agree',
                    'Strongly Agree'
                ]
            ],
            default => null,
        };
    }
}