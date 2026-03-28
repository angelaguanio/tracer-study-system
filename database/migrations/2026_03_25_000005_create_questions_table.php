<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->string('question_identifier');
            $table->string('label');
            $table->enum('type', ['text', 'select', 'radio', 'checkbox', 'number', 'textarea', 'likert']);
            $table->json('options')->nullable();
            $table->unsignedInteger('display_order');
            $table->boolean('is_required')->default(false);
            $table->timestamps();

            $table->unique(['section_id', 'label']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
