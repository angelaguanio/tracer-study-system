<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => fake()->optional()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'user_role' => 'alumna',
            'start_year' => fake()->numberBetween(2018, 2022),
            'end_year' => fake()->numberBetween(2022, 2026),
            'courses' => fake()->randomElement(['Computer Science', 'Information Technology', 'Engineering', 'Business Administration']),
            'department' => fake()->randomElement(['IT', 'Engineering', 'Business', 'Arts']),
            'address' => fake()->address(),
            'contact_number' => fake()->phoneNumber(),
            'profile_picture' => null,
        ];
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_role' => 'admin',
        ]);
    }

    /**
     * Indicate that the user is a coordinator.
     */
    public function coordinator(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_role' => 'coordinator',
        ]);
    }

    /**
     * Indicate that the user is an alumna.
     */
    public function alumna(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_role' => 'alumna',
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
