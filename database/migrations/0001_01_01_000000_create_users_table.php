<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Personal info
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_number')->nullable();

            // Auth
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('password_changed')->default(false);

            // Role & academic info
            $table->string('user_role')->index();
            $table->string('status')->default('active');
            $table->smallInteger('start_year')->nullable(); // smallInteger is sufficient for a 4-digit year
            $table->smallInteger('end_year')->nullable();
            $table->string('semester')->nullable(); // smallInteger is sufficient for a 4-digit year
            $table->string('courses')->nullable();
            $table->string('department')->nullable();          // used by AdminAlumniController

            // Profile
            $table->string('profile_picture')->nullable();     // stores relative path under storage/avatars/

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
