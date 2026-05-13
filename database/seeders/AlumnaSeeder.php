<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class AlumnaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Angela',
            'last_name' => 'Guanio',
            'middle_name' => 'Parial',
            'email' => 'gg@gmail.com',
            'password' => Hash::make('admin123'),
            'user_role' => 'alumna',
            'address' => 'Gapan City',
            'contact_number' => '09123456789',
            'courses' => 'Bachelor of Science in Information Technology',
            'year_graduated' => '2022'
        ]);

    }
}
