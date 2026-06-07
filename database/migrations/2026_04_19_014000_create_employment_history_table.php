<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Append-only archive of employment changes over time.
        // Created by StudentProfileController::update() whenever employment data changes.
        Schema::create('employment_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->string('currently_employed')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('company_name')->nullable();
            $table->string('position')->nullable();
            $table->string('location')->nullable();
            $table->decimal('monthly_salary', 10, 2)->nullable();
            $table->text('unemployment_reason')->nullable();
           $table->string('employment_start_year')->nullable();
           $table->string('employment_end_year')->nullable();

            $table->timestamps();

            // Index for "get all history for a user" queries ordered by time.
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employment_history');
    }
};
