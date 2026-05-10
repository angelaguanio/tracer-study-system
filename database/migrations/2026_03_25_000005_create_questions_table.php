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

            // TEXT to support long question labels (was VARCHAR(255) originally,
            // widened via ALTER migration). Unique index on (section_id, label)
            // was intentionally dropped because TEXT columns cannot be fully
            // indexed in MySQL without a prefix, and subheading-type questions
            // may share labels across a section.
            $table->text('label');

            $table->enum('type', [
                'text',
                'select',
                'radio',
                'checkbox',
                'number',
                'textarea',
                'likert',
                'subheading',
            ]);
            $table->json('options')->nullable();
            $table->unsignedInteger('display_order');
            $table->boolean('is_required')->default(false);
            $table->timestamps();

            $table->index(['section_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
