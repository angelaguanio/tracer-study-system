<?php

namespace Database\Factories;

use App\Models\Employment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmploymentFactory extends Factory
{
    protected $model = Employment::class;

    public function definition(): array
    {
        $currentlyEmployed = $this->faker->boolean(70); // 70% employed

        return [
            'user_id' => User::factory(),
            'currently_employed' => $currentlyEmployed,
            'employment_type' => $currentlyEmployed 
                ? $this->faker->randomElement(['employed', 'self-employed']) 
                : 'unemployed',
            'company_name' => $currentlyEmployed ? $this->faker->company() : null,
            'position' => $currentlyEmployed ? $this->faker->jobTitle() : null,
            'location' => $currentlyEmployed ? $this->faker->city() : null,
            'monthly_salary' => $currentlyEmployed ? $this->faker->numberBetween(20000, 100000) : null,
            'unemployment_reason' => !$currentlyEmployed ? $this->faker->sentence() : null,
        ];
    }

    public function employed(): static
    {
        return $this->state(fn (array $attributes) => [
            'currently_employed' => true,
            'employment_type' => 'employed',
            'company_name' => $this->faker->company(),
            'position' => $this->faker->jobTitle(),
            'location' => $this->faker->city(),
            'monthly_salary' => $this->faker->numberBetween(20000, 100000),
            'unemployment_reason' => null,
        ]);
    }

    public function unemployed(): static
    {
        return $this->state(fn (array $attributes) => [
            'currently_employed' => false,
            'employment_type' => 'unemployed',
            'company_name' => null,
            'position' => null,
            'location' => null,
            'monthly_salary' => null,
            'unemployment_reason' => $this->faker->sentence(),
        ]);
    }

    public function selfEmployed(): static
    {
        return $this->state(fn (array $attributes) => [
            'currently_employed' => true,
            'employment_type' => 'self-employed',
            'company_name' => $this->faker->company(),
            'position' => 'Self-Employed',
            'location' => $this->faker->city(),
            'monthly_salary' => $this->faker->numberBetween(15000, 80000),
            'unemployment_reason' => null,
        ]);
    }
}
