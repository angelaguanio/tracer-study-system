<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('likert_scale')->nullable();
            $table->unsignedInteger('display_order');
            $table->timestamps();

            $table->unique(['survey_id', 'title']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
