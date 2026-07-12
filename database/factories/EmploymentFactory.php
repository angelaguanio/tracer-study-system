<?php

namespace Database\Factories;

use App\Models\Employment;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmploymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Employment>
     */
    protected $model = Employment::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $employed = $this->faker->boolean(75);

        if (! $employed) {
            return [
                'currently_employed'      => false,
                'employment_type'         => null,
                'company_name'            => null,
                'position'                => null,
                'location'                => null,
                'monthly_salary'          => null,
                'employment_start_year'   => null,
                'employment_end_year'     => null,
                'is_present'              => false,
                'unemployment_reason'     => $this->faker->randomElement([
                    'Studying', 'Job Hunting', 'Career Break',
                ]),
            ];
        }

        $startYear = $this->faker->numberBetween(2022, 2026);

        return [
            'currently_employed'      => true,

            'employment_type'         => $this->faker->randomElement([
                'Permanent/Regular',
                'Probationary',
            ]),

            'company_name'            => $this->faker->company(),

            'position'                => $this->faker->randomElement([
                'Software Developer',
                'Web Developer',
                'QA Engineer',
                'IT Support Specialist',
                'Network Administrator',
                'System Analyst',
                'Database Administrator',
                'Technical Support',
                'Programmer',
                'UI/UX Designer',
            ]),

            'location'                => $this->faker->city(),

            'monthly_salary'          => $this->faker->randomElement([
                18000,
                20000,
                22000,
                25000,
                28000,
                30000,
                35000,
                40000,
                45000,
                50000,
                60000,
            ]),

            'employment_start_year'   => $startYear,

            'employment_end_year'     => null,

            'is_present'              => true,

            'unemployment_reason'     => null,
        ];
    }
}