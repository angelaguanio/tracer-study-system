<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify the enum to include 'subheading'
        DB::statement("ALTER TABLE questions MODIFY COLUMN type ENUM('text', 'select', 'radio', 'checkbox', 'number', 'textarea', 'likert', 'subheading') NOT NULL");
    }

    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE questions MODIFY COLUMN type ENUM('text', 'select', 'radio', 'checkbox', 'number', 'textarea', 'likert') NOT NULL");
    }
};
