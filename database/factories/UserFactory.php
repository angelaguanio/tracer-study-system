<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $start = fake()->numberBetween(2018, 2022);

        return [

            'first_name' => fake()->firstName(),

            'last_name' => fake()->lastName(),

            'middle_name' => fake()->optional()->firstName(),

            'email' => fake()->unique()->safeEmail(),

            'email_verified_at' => now(),

            'password' => Hash::make('admin123'),

            'password_changed' => true,

            'user_role' => 'alumna',

            'status' => 'active',

            'start_year' => $start,

            'end_year' => $start + 4,

            'semester' => fake()->randomElement([
                '1st Semester',
                '2nd Semester'
            ]),

            'courses' => fake()->randomElement([
                'BSIT',
                'BSCS'
            ]),

            'department' => 'CECT',

            'address' => fake()->address(),

            'contact_number' => '09'.fake()->numerify('#########'),

            'profile_picture' => null,
        ];
    }
}