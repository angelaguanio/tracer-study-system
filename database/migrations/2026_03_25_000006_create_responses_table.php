<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('question_id')->constrained()->restrictOnDelete();
            $table->text('answer_value')->nullable();
            $table->timestamp('submitted_at')->index();
            $table->timestamps();

            // Composite index for the most common query pattern:
            // "all responses for a survey by a specific user"
            $table->index(['survey_id', 'user_id']);
            // Separate index for question-level aggregation queries.
            $table->index('question_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('responses');
    }
};
