<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Stores in-progress survey answers per user per survey.
        // No created_at — SurveyDraft model sets $timestamps = false.
        Schema::create('survey_drafts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('survey_id')->constrained()->cascadeOnDelete();
            $table->json('answers');
            $table->foreignId('last_section_id')->constrained('sections')->restrictOnDelete();
            $table->timestamp('updated_at')->nullable();

            // One draft per user per survey.
            $table->unique(['user_id', 'survey_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_drafts');
    }
};
