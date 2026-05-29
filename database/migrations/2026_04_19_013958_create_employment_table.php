<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Stores the CURRENT employment status for each alumna (1-to-1 with users).
        Schema::create('employment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // 'Yes' or 'No' — kept as string to match existing controller logic.
            $table->string('currently_employed')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('company_name')->nullable();
            $table->string('position')->nullable();
            $table->string('location')->nullable();

            // FIXED: Added ->nullable() so unemployed alumni can skip this field cleanly.
            $table->smallInteger('employment_start_year')->nullable(); 
            $table->smallInteger('employment_end_year')->nullable();
            $table->boolean('is_current')->default(false);

            // decimal instead of string — analytics controller does float casts on this value.
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