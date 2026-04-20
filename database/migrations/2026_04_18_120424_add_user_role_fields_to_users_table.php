<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // user_role
            if (!Schema::hasColumn('users', 'user_role')) {
                $table->string('user_role')->default('alumna');
            }

            // department
            if (!Schema::hasColumn('users', 'department')) {
                $table->string('department')->nullable();
            }

            // course (IMPORTANT since ginagamit mo na sa system)
            if (!Schema::hasColumn('users', 'course')) {
                $table->string('course')->nullable();
            }

        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            if (Schema::hasColumn('users', 'course')) {
                $table->dropColumn('course');
            }

            if (Schema::hasColumn('users', 'department')) {
                $table->dropColumn('department');
            }

            if (Schema::hasColumn('users', 'user_role')) {
                $table->dropColumn('user_role');
            }

        });
    }
};