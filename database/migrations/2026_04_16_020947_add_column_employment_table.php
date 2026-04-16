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
        Schema::table('employment', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('currently_employed', ['Yes', 'No']);
            $table->enum('employment_type', ['Permanent/Regular', 'Probationary'])->nullable();
            $table->string('company_name')->nullable();
            $table->string('position')->nullable();
            $table->string('location')->nullable();
            $table->decimal('monthly_salary', 10, 2)->nullable();
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employment', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'currently_employed', 'employment_type',
            'company_name', 'position', 'location', 'monthly_salary']);
        });
    }
};
