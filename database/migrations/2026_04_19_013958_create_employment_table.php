<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Gamitin ang Schema::create para sa bagong table
        Schema::create('employment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            $table->string('currently_employed')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('company_name')->nullable();
            $table->string('position')->nullable();
            $table->string('location')->nullable();

            $table->smallInteger('employment_start_year')->nullable();
            $table->smallInteger('employment_end_year')->nullable();
            $table->boolean('is_present')->default(false);

            $table->decimal('monthly_salary', 10, 2)->nullable();
            $table->text('unemployment_reason')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employment');
    }
};