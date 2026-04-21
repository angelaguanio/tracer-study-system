<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Explicitly naming the table 'employment' to match your Model
        Schema::create('employment', function (Blueprint $table) {
            $table->id();
            // This links the record to the User
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Employment detail columns
            $table->string('currently_employed')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('company_name')->nullable();
            $table->string('position')->nullable();
            $table->string('location')->nullable();
            $table->string('monthly_salary')->nullable();
            $table->text('unemployment_reason')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employment');
    }
};