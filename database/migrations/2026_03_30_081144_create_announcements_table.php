<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->index();
            $table->string('title');
            $table->text('details');

            $table->longText('image')->nullable();

            // Workflow states: pending → approved | rejected
            $table->string('status')->default('pending');
            $table->text('revision_note')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['status', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
