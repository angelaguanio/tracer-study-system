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
            'first_name' => 'Gaile',
            'last_name' => 'Guanio',
            'middle_name' => 'Parial',
            'email' => 'gg@gmail.com',
            'password' => Hash::make('admin123'),
            'user_role' => 'alumna',
            'address' => 'Gapan City',
            'contact_number' => '09123456789',
            'department' => 'CECT',
            'courses' => 'BSIT',
            'start_year' => '2017',
            'end_year' => '2018',
            'semester' => '2nd Semester',
            'department' => 'CECT'

        ]);

    }
}
