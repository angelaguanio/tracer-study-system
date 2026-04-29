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
        Schema::table('users', function (Blueprint $table) {
            // Idadagdag natin ang mga kulang na columns
            // Ginawa nating nullable() para hindi mag-error ang mga existing users na wala pang data nito
            if (!Schema::hasColumn('users', 'middle_name')) {
                $table->string('middle_name')->nullable()->after('first_name');
            }
            
            if (!Schema::hasColumn('users', 'department')) {
                $table->string('department')->nullable()->after('email');
            }
            
            if (!Schema::hasColumn('users', 'courses')) {
                $table->string('courses')->nullable()->after('department');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Tatanggalin ang columns kapag nag-rollback (php artisan migrate:rollback)
            $table->dropColumn(['middle_name', 'department', 'courses']);
        });
    }
};