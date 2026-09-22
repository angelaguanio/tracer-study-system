<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employment;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AlumnaSeeder extends Seeder
{
    /**
     * Sanitize and convert strings to clean UTF-8 to prevent MySQL 1366 errors on 'ñ' / 'Ñ'
     */
    private function sanitizeUtf8(?string $str): string
    {
        if ($str === null || $str === '') {
            return '';
        }

        // Convert Windows-1252 / ISO-8859-1 byte 0xF1 (ñ) and 0xD1 (Ñ) to UTF-8
        $str = str_replace(["\xF1", "\xD1"], ['ñ', 'Ñ'], $str);

        // Replace common corrupted replacement character if needed
        $str = str_replace('', 'ñ', $str);

        // Ensure valid UTF-8 encoding
        if (!mb_check_encoding($str, 'UTF-8')) {
            $str = mb_convert_encoding($str, 'UTF-8', 'Windows-1252');
        }

        return trim($str);
    }

    public function run(): void
    {
        // ── 1. Create Default Developer / Admin Account ───────────────────────
        $adminUser = User::where('email', 'gg@gmail.com')->first();
        if (!$adminUser) {
            $user = User::create([
                'first_name'        => 'Gaile',
                'last_name'         => 'Guanio',
                'middle_name'       => 'Parial',
                'email'             => 'gg@gmail.com',
                'password'          => Hash::make('admin123'),
                'password_changed'  => true,
                'user_role'         => 'alumna',
                'status'            => 'active',
                'address'           => 'Blk 4 Lot 12, Greenfields Subdivision, Brgy. Mangino, Gapan City, 3105, Nueva Ecija, Region III - Central Luzon, Philippines',
                'contact_number'    => '+639123456789',
                'department'        => 'CECT',
                'courses'           => 'BSIT',
                'start_year'        => 2017,
                'end_year'          => 2018,
                'semester'          => '2nd Semester',
                'email_verified_at' => now(),
            ]);

            Address::create([
                'user_id'        => $user->id,
                'street_address' => 'Blk 4 Lot 12',
                'subdivision'    => 'Greenfields Subdivision',
                'region'         => 'Region III - Central Luzon',
                'province'       => 'Nueva Ecija',
                'city'           => 'Gapan City',
                'barangay'       => 'Mangino',
                'zip_code'       => '3105',
                'country'        => 'Philippines',
                'full_address'   => 'Blk 4 Lot 12, Greenfields Subdivision, Brgy. Mangino, Gapan City, 3105, Nueva Ecija, Region III - Central Luzon, Philippines',
            ]);

            Employment::create([
                'user_id'             => $user->id,
                'currently_employed'  => 'Yes',
                'employment_type'     => 'Permanent/Regular',
                'company_name'        => 'Google Philippines',
                'position'            => 'Software Developer',
                'location'            => '123 Corporate Ave, Bonifacio Global City, Taguig, Metro Manila',
                'monthly_salary'      => 45000,
                'employment_duration' => '2023 - Present',
                'is_present'          => true,
                'unemployment_reason' => null,
            ]);
        }

        // ── 2. Read Alumni CSV File ───────────────────────────────────────────
        $csvPath = database_path('seeders/data/alumni.csv');

        if (!file_exists($csvPath)) {
            $this->command->error("CSV file not found at: {$csvPath}");
            return;
        }

        // Random pools for employment data
        $companies = [
            'Accenture', 'DXC Technology', 'IBM', 'Google Philippines',
            'Microsoft', 'Oracle', 'Concentrix', 'Globe Telecom', 'PLDT',
            'GCash', 'Shopee', 'Lazada', 'Trend Micro', 'Samsung', 'Huawei',
            'Smart Communications', 'TaskUs', 'MicroSourcing',
        ];

        $positions = [
            'Software Developer', 'Web Developer', 'QA Engineer',
            'System Analyst', 'IT Support', 'Network Administrator',
            'Database Administrator', 'Technical Support', 'Programmer',
            'UI/UX Designer', 'Computer Engineer', 'Electronics Engineer',
            'Network Engineer', 'Data Analyst',
        ];

        $companyAddresses = [
            'Bonifacio Global City, Taguig, Metro Manila',
            'Ayala Avenue, Makati City, Metro Manila',
            'Araneta City, Quezon City, Metro Manila',
            'Commonwealth Ave, Quezon City, Metro Manila',
            'Northgate Cyberzone, Alabang, Muntinlupa City',
            'Cebu IT Park, Lahug, Cebu City',
            'Maharlika Highway, Cabanatuan City, Nueva Ecija',
            'Clark Freeport Zone, Mabalacat, Pampanga',
            'Ortigas Center, Pasig City, Metro Manila',
        ];

        $employmentTypes = ['Permanent/Regular', 'Probationary'];
        $salaryPool      = [18000, 20000, 22000, 25000, 28000, 30000, 35000, 40000, 45000, 50000, 60000];
        $unemployedReasons = [
            'Studying', 'Job Hunting', 'Career Break',
            'Family / Personal Responsibilities', 'Health Reasons',
            'Preparing for Licensure/Certification Exam', 'Starting a Business',
        ];

        $handle  = fopen($csvPath, 'r');
        $rawHeaders = fgetcsv($handle);

        if (!$rawHeaders) {
            $this->command->error("CSV file is empty or missing headers.");
            fclose($handle);
            return;
        }

        // Normalize headers: trim + lowercase
        $headers = array_map(fn($h) => strtolower(trim((string)$h)), $rawHeaders);

        $created = 0;
        $skipped = 0;
        $row     = 1;

        while (($values = fgetcsv($handle)) !== false) {
            $row++;

            // Skip empty rows
            if (count(array_filter($values, fn($v) => trim((string)$v) !== '')) === 0) {
                continue;
            }

            // Map headers to values with UTF-8 sanitization
            $d = [];
            foreach ($headers as $i => $col) {
                if ($col !== '') {
                    $val = isset($values[$i]) ? $values[$i] : '';
                    $d[$col] = $this->sanitizeUtf8($val);
                }
            }

            $firstName = $d['first_name'] ?? '';
            $lastName  = $d['last_name']  ?? '';

            if (empty($firstName) || empty($lastName)) {
                $skipped++;
                continue;
            }

            // Email handling
            $email = !empty($d['email']) ? $d['email'] : '';
            if (empty($email) || User::where('email', $email)->exists()) {
                $slug = strtolower(
                    preg_replace('/[^a-z0-9]/i', '', $firstName) . '.' .
                    preg_replace('/[^a-z0-9]/i', '', $lastName)
                );
                $email = $slug . '@gmail.com';
                $n = 1;
                while (User::where('email', $email)->exists()) {
                    $email = $slug . $n . '@gmail.com';
                    $n++;
                }
            }

            // Password handling
            $passwordRaw = !empty($d['password']) ? $d['password'] : 'alumni123';

            // Contact number formatting
            $contactRaw = preg_replace('/[^\d+]/', '', $d['contact_number'] ?? '');
            if (empty($contactRaw)) {
                $contactNum = '+639' . rand(100000000, 999999999);
            } elseif (str_starts_with($contactRaw, '9') && strlen($contactRaw) === 10) {
                $contactNum = '+63' . $contactRaw;
            } elseif (str_starts_with($contactRaw, '09') && strlen($contactRaw) === 11) {
                $contactNum = '+63' . substr($contactRaw, 1);
            } else {
                $contactNum = $contactRaw;
            }

            // Combine House No. + Street Address
            $houseNo = $d['house no.'] ?? ($d['house_no'] ?? '');
            $street  = $d['street_address'] ?? ($d['street'] ?? '');
            $streetAddress = trim(implode(' ', array_filter([$houseNo, $street])));

            $subdivision = $d['subdivision'] ?? '';
            $barangay    = $d['barangay'] ?? '';
            $city        = $d['city'] ?? '';
            $province    = $d['province'] ?? '';
            $region      = $d['region'] ?? '';
            $country     = !empty($d['country']) ? $d['country'] : 'Philippines';
            $zipCode     = $d['code'] ?? ($d['zip_code'] ?? '');

            // Format full address
            $fullAddress = Address::formatFullAddress([
                'street_address' => $streetAddress,
                'subdivision'    => $subdivision,
                'barangay'       => $barangay,
                'city'           => $city,
                'zip_code'       => $zipCode,
                'province'       => $province,
                'region'         => $region,
                'country'        => $country,
            ]);

            // Courses & Semester normalization
            $course = $d['courses'] ?? ($d['course'] ?? 'BSIT');
            $semester = $d['semester'] ?? '1st Semester';
            if (stripos($semester, 'Second') !== false || stripos($semester, '2nd') !== false) {
                $semester = '2nd Semester';
            } elseif (stripos($semester, 'First') !== false || stripos($semester, '1st') !== false) {
                $semester = '1st Semester';
            } elseif (stripos($semester, 'Midyear') !== false || stripos($semester, 'Summer') !== false) {
                $semester = 'Summer/Midyear';
            }

            $startYear = !empty($d['start_year']) ? (int)$d['start_year'] : 2020;
            $endYear   = !empty($d['end_year'])   ? (int)$d['end_year']   : 2024;

            // Create User Record
            $user = User::create([
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'middle_name'       => (!empty($d['middle_name']) && $d['middle_name'] !== '*') ? $d['middle_name'] : '*',
                'suffix'            => !empty($d['suffix']) ? $d['suffix'] : 'N/A',
                'email'             => $email,
                'password'          => Hash::make($passwordRaw),
                'password_changed'  => true,
                'user_role'         => 'alumna',
                'status'            => 'active',
                'address'           => $fullAddress,
                'contact_number'    => $contactNum,
                'department'        => !empty($d['department']) ? $d['department'] : 'CECT',
                'courses'           => $course,
                'start_year'        => $startYear,
                'end_year'          => $endYear,
                'semester'          => $semester,
                'email_verified_at' => now(),
            ]);

            // Create Address Record
            Address::create([
                'user_id'        => $user->id,
                'street_address' => $streetAddress,
                'subdivision'    => $subdivision,
                'barangay'       => $barangay,
                'city'           => $city,
                'province'       => $province,
                'region'         => $region,
                'zip_code'       => $zipCode,
                'country'        => $country,
                'full_address'   => $fullAddress,
            ]);

            // ── Randomly Generate Employment Data (75% Employed, 25% Unemployed) ──
            $isEmployed = rand(1, 100) <= 75;

            if ($isEmployed) {
                $startEmpYear = rand(max(2020, $endYear), 2024);
                Employment::create([
                    'user_id'             => $user->id,
                    'currently_employed'  => 'Yes',
                    'employment_type'     => $employmentTypes[array_rand($employmentTypes)],
                    'company_name'        => $companies[array_rand($companies)],
                    'position'            => $positions[array_rand($positions)],
                    'location'            => $companyAddresses[array_rand($companyAddresses)],
                    'monthly_salary'      => $salaryPool[array_rand($salaryPool)],
                    'employment_duration' => $startEmpYear . ' - Present',
                    'is_present'          => true,
                    'unemployment_reason' => null,
                ]);
            } else {
                Employment::create([
                    'user_id'             => $user->id,
                    'currently_employed'  => 'No',
                    'employment_type'     => null,
                    'company_name'        => null,
                    'position'            => null,
                    'location'            => null,
                    'monthly_salary'      => null,
                    'employment_duration' => null,
                    'is_present'          => false,
                    'unemployment_reason' => $unemployedReasons[array_rand($unemployedReasons)],
                ]);
            }

            $created++;
        }

        fclose($handle);

        $this->command->info("Alumni CSV Seeding Complete! Successfully created {$created} alumni users.");
    }
}