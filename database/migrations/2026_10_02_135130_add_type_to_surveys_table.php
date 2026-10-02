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
        Schema::table('surveys', function (Blueprint $table) {
            $table->string('type')->default('Forms and Requests')->after('status');
        });

        // Migrate existing data
        DB::statement("UPDATE surveys SET type = 'Tracer Study' WHERE is_tracer_study = 1");

        Schema::table('surveys', function (Blueprint $table) {
            $table->dropColumn('is_tracer_study');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surveys', function (Blueprint $table) {
            $table->boolean('is_tracer_study')->default(false)->after('status');
        });

        // Revert data
        DB::statement("UPDATE surveys SET is_tracer_study = 1 WHERE type = 'Tracer Study'");

        Schema::table('surveys', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
