<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subheadings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->string('subheading_identifier');
            $table->text('label');
            $table->unsignedInteger('display_order');
            $table->timestamps();
            
            $table->index(['section_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subheadings');
    }
};