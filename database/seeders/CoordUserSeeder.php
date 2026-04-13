<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class CoordUserSeeder extends Seeder
{
    public function run()
{
    User::updateOrCreate(
        ['email' => 'k@gmail.com'],
        [
            'last_name' => 'Tugaff',
            'first_name' => 'Catalina',
            'password' => Hash::make('admin123'),
            'user_role' => 'coordinator', // if you have role column
        ]
    );
}
}
