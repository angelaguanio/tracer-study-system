<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop in reverse dependency order
        Schema::dropIfExists('survey_answers');
        Schema::dropIfExists('survey_submissions');
        Schema::dropIfExists('survey_categories');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // These tables are intentionally not recreated on rollback
        // as they are replaced by the new schema
    }
};
