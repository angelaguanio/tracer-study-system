<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employment;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AlumnaSeeder extends Seeder
{
    public function run(): void
    {
        // Keep your personal account
        $user = User::create([
            'first_name' => 'Gaile',
            'last_name' => 'Guanio',
            'middle_name' => 'Parial',
            'email' => 'gg@gmail.com',
            'password' => Hash::make('admin123'),
            'password_changed' => true,
            'user_role' => 'alumna',
            'status' => 'active',
            'address' => 'Blk 4 Lot 12, Greenfields Subdivision, Brgy. Mangino, Gapan City, Nueva Ecija, Region III - Central Luzon',
            'contact_number' => '09123456789',
            'department' => 'CECT',
            'courses' => 'BSIT',
            'start_year' => 2017,
            'end_year' => 2018,
            'semester' => '2nd Semester',
            'email_verified_at' => now(),
        ]);

        Address::create([
            'user_id' => $user->id,
            'street_address' => 'Blk 4 Lot 12',
            'subdivision' => 'Greenfields Subdivision',
            'region' => 'Region III - Central Luzon',
            'province' => 'Nueva Ecija',
            'city' => 'Gapan City',
            'barangay' => 'Mangino',
            'full_address' => 'Blk 4 Lot 12, Greenfields Subdivision, Brgy. Mangino, Gapan City, Nueva Ecija, Region III - Central Luzon',
        ]);

        Employment::create([
            'user_id' => $user->id,
            'currently_employed' => true,
            'employment_type' => 'Permanent/Regular',
            'company_name' => 'Google Philippines',
            'position' => 'Software Developer',
            'location' => 'Taguig City',
            'monthly_salary' => 45000,
            'employment_start_year' => 2023,
            'employment_end_year' => null,
            'is_present' => true,
            'unemployment_reason' => null,
        ]);

        $firstNames = [
            'John','Jane','Michael','Michelle','Kevin','Mark','Paul','Joshua',
            'Daniel','Chris','Ryan','Patrick','Kim','Anne','Rose','Angela',
            'John Paul','Jerome','Carl','James','Aira','Princess','Nicole',
            'Katherine','Kenneth','Ralph','Justin','Sean','Kyle','Jessa',
            'Angel','Mary','Joshua','Francis','Louie','John Mark','Bryan',
            'Carlo','Vincent','Reynald'
        ];

        $lastNames = [
            'Santos','Reyes','Garcia','Cruz','Bautista','Dela Cruz','Mendoza',
            'Torres','Flores','Rivera','Castro','Navarro','Aquino','Ramos',
            'Perez','Domingo','Villanueva','Fernandez','Diaz','Salazar',
            'Lopez','Tolentino','Valdez','Mercado','Alvarez','David',
            'Evangelista','Manalo','Rosales','Luna','Soriano','Lim',
            'Tan','Chua','Gonzales','Agustin','Pascual','Ocampo','De Leon'
        ];

        $companies = [
            'Accenture',
            'DXC Technology',
            'IBM',
            'Google Philippines',
            'Microsoft',
            'Oracle',
            'Concentrix',
            'Globe Telecom',
            'PLDT',
            'GCash',
            'Shopee',
            'Lazada',
            'Trend Micro',
            'Samsung',
            'Huawei'
        ];

        $positions = [
            'Software Developer',
            'Web Developer',
            'QA Engineer',
            'System Analyst',
            'IT Support',
            'Network Administrator',
            'Database Administrator',
            'Technical Support',
            'Programmer',
            'UI/UX Designer'
        ];

        $cities = [
            'Cabanatuan City',
            'San Jose City',
            'Gapan City',
            'Quezon City',
            'Manila',
            'Pasig',
            'Taguig',
            'Makati',
            'Clark',
            'Angeles City'
        ];

        $employmentTypes = [
            'Permanent/Regular',
            'Probationary',
        ];

        $courses = [
            'BSIT',
            'BSEcE',
            'BSCpE'
        ];

        $salary = [
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
            60000
        ];

        $middleNames = [
            'Santos', 'Reyes', 'Garcia', 'Cruz', 'Bautista', 'Mendoza', 'Torres',
            'Flores', 'Rivera', 'Castro', 'Navarro', 'Aquino', 'Ramos', 'Perez',
            'Domingo', 'Villanueva', 'Fernandez', 'Diaz', 'Salazar', 'Lopez',
            'Tolentino', 'Valdez', 'Mercado', 'Alvarez', 'David', 'Manalo',
            'Rosales', 'Luna', 'Soriano', 'Lim', 'Dela Cruz', 'Evangelista',
            'Gonzales', 'Agustin', 'Pascual', 'Ocampo', 'De Leon', 'Magpayo',
            'Buenaventura', 'Macaraeg',
        ];

        $addressPool = [
            ['region' => 'Region III - Central Luzon', 'province' => 'Nueva Ecija', 'city' => 'Gapan City', 'barangay' => 'Mangino', 'street' => 'Blk 1 Lot 5', 'subd' => 'Greenfields Subd.'],
            ['region' => 'Region III - Central Luzon', 'province' => 'Nueva Ecija', 'city' => 'Gapan City', 'barangay' => 'San Vicente', 'street' => '123 Maharlika Highway', 'subd' => ''],
            ['region' => 'Region III - Central Luzon', 'province' => 'Nueva Ecija', 'city' => 'Cabanatuan City', 'barangay' => 'Sumacab Main', 'street' => 'Purok 3', 'subd' => 'St. Francis Subd.'],
            ['region' => 'Region III - Central Luzon', 'province' => 'Nueva Ecija', 'city' => 'Cabanatuan City', 'barangay' => 'Kapitan Pepe', 'street' => 'Rizal St.', 'subd' => 'Kapitan Pepe Subd.'],
            ['region' => 'Region III - Central Luzon', 'province' => 'Nueva Ecija', 'city' => 'San Jose City', 'barangay' => 'Abar 1st', 'street' => 'Del Pilar St.', 'subd' => ''],
            ['region' => 'NCR - National Capital Region', 'province' => 'Metro Manila', 'city' => 'Quezon City', 'barangay' => 'Batasan Hills', 'street' => 'Blk 8 Lot 2', 'subd' => 'Batasan Subd.'],
            ['region' => 'NCR - National Capital Region', 'province' => 'Metro Manila', 'city' => 'Taguig City', 'barangay' => 'BGC (Bonifacio Global City)', 'street' => '5th Ave', 'subd' => 'Two Serendra'],
            ['region' => 'NCR - National Capital Region', 'province' => 'Metro Manila', 'city' => 'Manila', 'barangay' => 'Sampaloc', 'street' => 'España Blvd', 'subd' => ''],
            ['region' => 'NCR - National Capital Region', 'province' => 'Metro Manila', 'city' => 'Makati City', 'barangay' => 'Poblacion', 'street' => 'Makati Ave', 'subd' => ''],
            ['region' => 'NCR - National Capital Region', 'province' => 'Metro Manila', 'city' => 'Pasig City', 'barangay' => 'Kapitolyo', 'street' => 'East Capitol Drive', 'subd' => ''],
            ['region' => 'Region III - Central Luzon', 'province' => 'Pampanga', 'city' => 'Angeles City', 'barangay' => 'Balibago', 'street' => 'Fields Ave', 'subd' => ''],
            ['region' => 'Region III - Central Luzon', 'province' => 'Pampanga', 'city' => 'Mabalacat City (Clark)', 'barangay' => 'Clark Freeport Zone', 'street' => 'Manuel A. Roxas Hwy', 'subd' => ''],
        ];

        for ($i = 1; $i <= 100; $i++) {

            $startYear = rand(2000, 2025);
            $employed = rand(1, 100) <= 75;

            $addr = $addressPool[array_rand($addressPool)];
            $fullAddr = Address::formatFullAddress([
                'street_address' => $addr['street'],
                'subdivision' => $addr['subd'],
                'barangay' => $addr['barangay'],
                'city' => $addr['city'],
                'province' => $addr['province'],
                'region' => $addr['region'],
            ]);

            $user = User::create([
                'first_name' => $firstNames[array_rand($firstNames)],
                'last_name' => $lastNames[array_rand($lastNames)],
                'middle_name' => $middleNames[array_rand($middleNames)],
                'email' => "alumna{$i}@gmail.com",
                'password' => Hash::make('admin123'),
                'password_changed' => true,
                'user_role' => 'alumna',
                'status' => 'active',
                'address' => $fullAddr,
                'contact_number' => '09'.rand(100000000,999999999),
                'department' => 'CECT',
                'courses' => $courses[array_rand($courses)],
                'start_year' => $startYear,
                'end_year' => $startYear + 1,
                'semester' => rand(0,1) ? '1st Semester' : '2nd Semester',
                'email_verified_at' => now(),
            ]);

            Address::create([
                'user_id' => $user->id,
                'street_address' => $addr['street'],
                'subdivision' => $addr['subd'],
                'region' => $addr['region'],
                'province' => $addr['province'],
                'city' => $addr['city'],
                'barangay' => $addr['barangay'],
                'full_address' => $fullAddr,
            ]);

            if ($employed) {

                Employment::create([
                    'user_id' => $user->id,
                    'currently_employed' => true,
                    'employment_type' => $employmentTypes[array_rand($employmentTypes)],
                    'company_name' => $companies[array_rand($companies)],
                    'position' => $positions[array_rand($positions)],
                    'location' => $cities[array_rand($cities)],
                    'monthly_salary' => $salary[array_rand($salary)],
                    'employment_start_year' => rand(2022, 2026),
                    'employment_end_year' => null,
                    'is_present' => true,
                    'unemployment_reason' => null,
                ]);

            } else {

                Employment::create([
                    'user_id' => $user->id,
                    'currently_employed' => false,
                    'employment_type' => null,
                    'company_name' => null,
                    'position' => null,
                    'location' => null,
                    'monthly_salary' => null,
                    'employment_start_year' => null,
                    'employment_end_year' => null,
                    'is_present' => false,
                    'unemployment_reason' => 'Looking for a Job',
                ]);
            }
        }
    }
}