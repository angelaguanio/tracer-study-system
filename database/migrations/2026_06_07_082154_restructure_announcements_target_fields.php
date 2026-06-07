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

            // ADD NEW CLEAN FIELDS
            if (!Schema::hasColumn('announcements', 'target_type')) {
                $table->string('target_type')->after('id');
            }

            if (!Schema::hasColumn('announcements', 'target_value')) {
                $table->string('target_value')->nullable()->after('target_type');
            }

            // DROP OLD FIELDS (IMPORTANT)
            if (Schema::hasColumn('announcements', 'target')) {
                $table->dropColumn('target');
            }

            if (Schema::hasColumn('announcements', 'target_courses')) {
                $table->dropColumn('target_courses');
            }

            if (Schema::hasColumn('announcements', 'target_department')) {
                $table->dropColumn('target_department');
            }

            if (Schema::hasColumn('announcements', 'target_college')) {
                $table->dropColumn('target_college');
            }
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {

            $table->dropColumn(['target_type', 'target_value']);

            $table->string('target')->nullable();
            $table->string('target_courses')->nullable();
            $table->string('target_department')->nullable();
            $table->string('target_college')->nullable();
        });
    }
};
