<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employment', function (Blueprint $table) {
            $table->id();

            // Foreign key
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Employment status
            $table->enum('currently_employed', ['Yes', 'No']);

            // Employed fields
            $table->enum('employment_type', ['Permanent/Regular', 'Probationary', 'Contractual', 'Part-time'])->nullable();
            $table->string('company_name')->nullable();
            $table->string('position')->nullable();
            $table->string('location')->nullable();
            $table->decimal('monthly_salary', 10, 2)->nullable();

            // Unemployed fields
            $table->string('unemployment_reason')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employment');
    }
};
