<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Drop the unique constraint
        try {
            DB::statement('ALTER TABLE questions DROP INDEX questions_section_id_label_unique');
        } catch (\Exception $e) {
            // Index might not exist, continue
        }

        // Change label from string(255) to text
        DB::statement('ALTER TABLE questions MODIFY label TEXT NOT NULL');

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    public function down(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Change back to string
        DB::statement('ALTER TABLE questions MODIFY label VARCHAR(255) NOT NULL');

        // Recreate the unique constraint
        try {
            DB::statement('ALTER TABLE questions ADD UNIQUE questions_section_id_label_unique (section_id, label(255))');
        } catch (\Exception $e) {
            // Constraint might already exist
        }

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
};
