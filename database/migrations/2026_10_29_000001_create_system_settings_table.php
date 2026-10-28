<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique()->index();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default baseline settings
        $now = now();
        $defaults = [
            ['key' => 'app_name',               'value' => 'Alumni Connect', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'app_logo',               'value' => null,             'created_at' => $now, 'updated_at' => $now],
            ['key' => 'theme_preset',           'value' => 'emerald',        'created_at' => $now, 'updated_at' => $now],
            ['key' => 'theme_style',            'value' => 'solid',          'created_at' => $now, 'updated_at' => $now],
            ['key' => 'primary_color',          'value' => '#15803d',        'created_at' => $now, 'updated_at' => $now],
            ['key' => 'secondary_color',        'value' => '#166534',        'created_at' => $now, 'updated_at' => $now],
            ['key' => 'font_color_on_primary',  'value' => '#ffffff',        'created_at' => $now, 'updated_at' => $now],
            ['key' => 'text_color_primary',     'value' => '#15803d',        'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('system_settings')->insert($defaults);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
