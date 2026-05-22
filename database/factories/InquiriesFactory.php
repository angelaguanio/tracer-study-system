<?php

namespace Database\Factories;

use App\Models\Inquiries;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InquiriesFactory extends Factory
{
    protected $model = Inquiries::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'recipient_type' => $this->faker->randomElement(['admin', 'coordinator']),
            'recipient_id' => User::factory(),
            'department' => $this->faker->randomElement(['IT', 'Engineering', 'Business', 'Arts']),
            'title' => $this->faker->sentence(),
            'subject' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending', 'open', 'closed']),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
        ]);
    }
}
