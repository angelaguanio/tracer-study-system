<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('responses', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['survey_id']);
            
            // Add the new foreign key with cascade on delete
            $table->foreign('survey_id')
                  ->references('id')
                  ->on('surveys')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('responses', function (Blueprint $table) {
            // Drop the cascade foreign key
            $table->dropForeign(['survey_id']);
            
            // Restore the original restrict on delete
            $table->foreign('survey_id')
                  ->references('id')
                  ->on('surveys')
                  ->restrictOnDelete();
        });
    }
};
