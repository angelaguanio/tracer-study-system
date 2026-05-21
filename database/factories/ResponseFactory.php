<?php

namespace Database\Factories;

use App\Models\Response;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResponseFactory extends Factory
{
    protected $model = Response::class;

    public function definition(): array
    {
        return [
            'survey_id' => Survey::factory(),
            'user_id' => User::factory(),
            'question_id' => 1, // Default to 1, can be overridden
            'answer_value' => $this->faker->sentence(),
            'submitted_at' => null,
        ];
    }

    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'submitted_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}
