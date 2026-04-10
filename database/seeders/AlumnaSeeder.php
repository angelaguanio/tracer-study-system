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
            'email' => 'gg@gmail.com',
            'password' => Hash::make('admin123'),
            'user_role' => 'alumna',
        ]);

    }
}
