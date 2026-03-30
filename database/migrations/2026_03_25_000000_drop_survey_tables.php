<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop in reverse FK dependency order
        Schema::dropIfExists('survey_drafts');
        Schema::dropIfExists('responses');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('surveys');
    }

    public function down(): void
    {
        // Recreate would require the original migration logic — intentionally left empty
    }
};
