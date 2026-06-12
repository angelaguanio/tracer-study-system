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
        // Add index on users.user_role for alumni filtering
        Schema::table('users', function (Blueprint $table) {
            $table->index('user_role');
        });

        // Add index on surveys.status for active survey queries
        Schema::table('surveys', function (Blueprint $table) {
            $table->index('status');
        });

        // Add composite index on announcements for filtering by status and user_id
        // Note: announcements.status already has an index, so we add user_id and a composite index
        Schema::table('announcements', function (Blueprint $table) {
            $table->index('user_id');
            $table->index(['status', 'user_id']);
        });

        // Add index on inquiries.status for pending inquiry queries
        Schema::table('inquiries', function (Blueprint $table) {
            $table->index('status');
        });

        // Add indexes on responses for response aggregations
        // Note: responses already has composite index on [survey_id, user_id]
        // We need to add submitted_at for ordering recent responses
        Schema::table('responses', function (Blueprint $table) {
            $table->index('submitted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes in reverse order
        Schema::table('responses', function (Blueprint $table) {
            $table->dropIndex(['submitted_at']);
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->dropIndex(['status', 'user_id']);
            $table->dropIndex(['user_id']);
        });

        Schema::table('surveys', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['user_role']);
        });
    }
};
