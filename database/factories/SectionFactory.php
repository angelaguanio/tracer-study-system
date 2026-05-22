<?php

namespace Database\Factories;

use App\Models\Section;
use App\Models\Survey;
use Illuminate\Database\Eloquent\Factories\Factory;

class SectionFactory extends Factory
{
    protected $model = Section::class;

    public function definition(): array
    {
        return [
            'survey_id' => 1, // Default to 1, should be overridden
            'title' => $this->faker->sentence(2),
            'description' => $this->faker->paragraph(),
            'display_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}