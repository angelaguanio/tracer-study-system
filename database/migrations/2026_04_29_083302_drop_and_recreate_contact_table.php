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
        // Drop the existing contact table
        Schema::dropIfExists('contact');

        // Recreate the contact table with correct schema
        Schema::create('contact', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('recipient_type'); 
            $table->foreignId('recipient_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('department')->nullable();
            $table->string('title')->nullable(); 
            $table->text('message');
            $table->string('status')->default('pending'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact');
    }
};
