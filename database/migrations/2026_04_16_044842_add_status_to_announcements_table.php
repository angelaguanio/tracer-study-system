<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('announcements', function (Blueprint $table) {

            if (!Schema::hasColumn('announcements', 'status')) {
                $table->string('status')->default('pending');
            }

            if (!Schema::hasColumn('announcements', 'user_id')) {
                $table->foreignId('user_id')
                    ->nullable()
                    ->after('id')
                    ->constrained()
                    ->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
