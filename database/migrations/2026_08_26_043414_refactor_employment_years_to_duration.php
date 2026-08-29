<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add new column
        Schema::table('employment', function (Blueprint $table) {
            $table->string('employment_duration')->nullable();
        });

        Schema::table('employment_history', function (Blueprint $table) {
            $table->string('employment_duration')->nullable();
        });

        // Migrate existing data
        $employments = DB::table('employment')->get();
        foreach ($employments as $emp) {
            if ($emp->employment_start_year) {
                $end = $emp->is_present ? 'Present' : $emp->employment_end_year;
                $duration = $end ? $emp->employment_start_year . '-' . $end : $emp->employment_start_year;
                DB::table('employment')->where('id', $emp->id)->update(['employment_duration' => $duration]);
            }
        }

        $history = DB::table('employment_history')->get();
        foreach ($history as $h) {
            if ($h->employment_start_year) {
                $end = $h->is_present ? 'Present' : $h->employment_end_year;
                $duration = $end ? $h->employment_start_year . '-' . $end : $h->employment_start_year;
                DB::table('employment_history')->where('id', $h->id)->update(['employment_duration' => $duration]);
            }
        }

        // Drop old columns
        Schema::table('employment', function (Blueprint $table) {
            $table->dropColumn(['employment_start_year', 'employment_end_year']);
        });

        Schema::table('employment_history', function (Blueprint $table) {
            $table->dropColumn(['employment_start_year', 'employment_end_year']);
        });
    }

    public function down(): void
    {
        Schema::table('employment', function (Blueprint $table) {
            $table->string('employment_start_year')->nullable();
            $table->string('employment_end_year')->nullable();
            $table->dropColumn('employment_duration');
        });

        Schema::table('employment_history', function (Blueprint $table) {
            $table->string('employment_start_year')->nullable();
            $table->string('employment_end_year')->nullable();
            $table->dropColumn('employment_duration');
        });
    }
};
