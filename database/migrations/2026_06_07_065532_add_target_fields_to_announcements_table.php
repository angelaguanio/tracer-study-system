<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::table('announcements', function (Blueprint $table) {

            if (!Schema::hasColumn('announcements', 'target_courses')) {
                $table->string('target_courses')->nullable();
            }

            if (!Schema::hasColumn('announcements', 'target_department')) {
                $table->string('target_department')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            //
        });
    }
};
