<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });

        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->string('name');
            $table->string('code');
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });

        // Seed initial baseline data (CECT & existing programs)
        $now = now();
        $deptId = DB::table('departments')->insertGetId([
            'name'       => 'College of Engineering and Computer Technology',
            'code'       => 'CECT',
            'status'     => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $defaultPrograms = [
            [
                'department_id' => $deptId,
                'name'          => 'Bachelor of Science in Information Technology',
                'code'          => 'BSIT',
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'department_id' => $deptId,
                'name'          => 'Bachelor of Science in Computer Science',
                'code'          => 'BSCS',
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'department_id' => $deptId,
                'name'          => 'Bachelor of Science in Computer Engineering',
                'code'          => 'BSCpE',
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'department_id' => $deptId,
                'name'          => 'Bachelor of Science in Electronics Engineering',
                'code'          => 'BSEcE',
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
        ];

        DB::table('programs')->insert($defaultPrograms);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
        Schema::dropIfExists('departments');
    }
};
