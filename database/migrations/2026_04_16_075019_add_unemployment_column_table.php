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
            $table->string('unemployment_reason')->nullable()->after('monthly_salary');
            
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('employment', function (Blueprint $table) {
            $table->dropColumn('unemployement_reason');
        });
    }
};
