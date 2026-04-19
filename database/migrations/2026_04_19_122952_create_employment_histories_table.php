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
        Schema::create('employment_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Employment Details
            $table->string('currently_employed'); 
            $table->string('company_name')->nullable();
            $table->string('position')->nullable();
            $table->string('employment_type')->nullable();
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
        Schema::dropIfExists('employment_histories');
    }
};