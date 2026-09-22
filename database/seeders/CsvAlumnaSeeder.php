<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CsvAlumnaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(AlumnaSeeder::class);
    }
}
