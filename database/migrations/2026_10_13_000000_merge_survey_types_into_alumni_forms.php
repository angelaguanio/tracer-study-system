<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Merge the old "Forms and Requests" and "Events" survey types into "Alumni Forms".
     */
    public function up(): void
    {
        DB::table('surveys')
            ->whereIn('type', ['Forms and Requests', 'Events'])
            ->update(['type' => 'Alumni Forms']);
    }

    /**
     * Not perfectly reversible (merged types can't be split); map back to "Events".
     */
    public function down(): void
    {
        DB::table('surveys')
            ->where('type', 'Alumni Forms')
            ->update(['type' => 'Events']);
    }
};
