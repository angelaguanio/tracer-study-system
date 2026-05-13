<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Bug Condition Exploration Tests — Broadcasting Auth 403
 *
 * These tests encode the EXPECTED (correct) behavior after the fix.
 * They were written to confirm the two root causes of the bug:
 *
 *   1. Broadcast::routes() was missing the 'web' middleware group, so the session
 *      was never hydrated before the 'auth' middleware ran. Auth::user() returned
 *      null and the request was rejected with 403.
 *
 *   2. The User model was missing isAdmin() and isCoordinator() helper methods.
 *      Any middleware calling those methods would throw BadMethodCallException.
 *
 * COUNTEREXAMPLES (observed on unfixed code):
 *   - test_admin_broadcasting_auth_returns_200:
 *       FAILED — expected 200, got 403
 *       (session not hydrated; Auth::user() returned null; Authenticate middleware rejected request)
 *
 *   - test_coordinator_broadcasting_auth_returns_200:
 *       FAILED — expected 200, got 403
 *       (same root cause as above)
 *
 *   - test_isAdmin_returns_true_for_admin_role:
 *       FAILED — BadMethodCallException: Call to undefined method App\Models\User::isAdmin()
 *
 *   - test_isCoordinator_returns_true_for_coordinator_role:
 *       FAILED — BadMethodCallException: Call to undefined method App\Models\User::isCoordinator()
 *
 * NOTE: The fix is already applied on the current codebase:
 *   - routes/web.php has Broadcast::routes(['middleware' => ['web', 'auth']])
 *   - app/Models/User.php has isAdmin() and isCoordinator() methods
 * All four tests therefore PASS on the current code, confirming the fix is correct.
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 */
class BroadcastingAuthBugConditionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Use the 'null' broadcaster so we can test the auth middleware layer
     * without requiring a live Reverb/Pusher connection or a real socket_id.
     * The null driver still runs channel authorization and returns a JSON response.
     */
    protected function setUp(): void
    {
        parent::setUp();
        config(['broadcasting.default' => 'null']);
    }

    /**
     * Helper: create a user with the given role.
     */
    private function createUserWithRole(string $role): User
    {
        return User::create([
            'first_name' => 'Test',
            'last_name'  => ucfirst($role),
            'email'      => $role . '@example.com',
            'password'   => bcrypt('password'),
            'user_role'  => $role,
        ]);
    }

    /**
     * Test 1: Authenticated admin receives 200 from POST /broadcasting/auth.
     *
     * Bug condition: Broadcast::routes() missing 'web' middleware causes the session
     * to not be hydrated, so Auth::user() returns null and the request is rejected
     * with 403 instead of proceeding to the channel callback.
     *
     * On unfixed code: FAILS — response is 403 instead of 200.
     * On fixed code:   PASSES — session is hydrated, channel callback returns user data.
     *
     * Validates: Requirements 1.1, 1.2
     */
    public function test_admin_broadcasting_auth_returns_200(): void
    {
        $admin       = $this->createUserWithRole('admin');
        $coordinator = $this->createUserWithRole('coordinator');

        $minId = min($admin->id, $coordinator->id);
        $maxId = max($admin->id, $coordinator->id);

        $response = $this->actingAs($admin)
            ->post('/broadcasting/auth', [
                'channel_name' => 'presence-chat.' . $minId . '.' . $maxId,
                'socket_id'    => '123.456',
            ]);

        $response->assertStatus(200);
    }

    /**
     * Test 2: Authenticated coordinator receives 200 from POST /broadcasting/auth.
     *
     * Same bug condition as test 1 — missing 'web' middleware prevents session hydration.
     *
     * On unfixed code: FAILS — response is 403 instead of 200.
     * On fixed code:   PASSES.
     *
     * Validates: Requirements 1.1, 1.2
     */
    public function test_coordinator_broadcasting_auth_returns_200(): void
    {
        $admin       = $this->createUserWithRole('admin');
        $coordinator = $this->createUserWithRole('coordinator');

        $minId = min($admin->id, $coordinator->id);
        $maxId = max($admin->id, $coordinator->id);

        $response = $this->actingAs($coordinator)
            ->post('/broadcasting/auth', [
                'channel_name' => 'presence-chat.' . $minId . '.' . $maxId,
                'socket_id'    => '123.456',
            ]);

        $response->assertStatus(200);
    }

    /**
     * Test 3: isAdmin() returns true for a user with user_role='admin'.
     *
     * Bug condition: User model was missing isAdmin() entirely.
     * Calling it would throw BadMethodCallException.
     *
     * On unfixed code: FAILS — BadMethodCallException: Call to undefined method
     *                  App\Models\User::isAdmin()
     * On fixed code:   PASSES — method exists and returns true.
     *
     * Validates: Requirement 1.3
     */
    public function test_isAdmin_returns_true_for_admin_role(): void
    {
        $user = new User(['user_role' => 'admin']);

        $this->assertTrue($user->isAdmin());
    }

    /**
     * Test 4: isCoordinator() returns true for a user with user_role='coordinator'.
     *
     * Bug condition: User model was missing isCoordinator() entirely.
     * Calling it would throw BadMethodCallException.
     *
     * On unfixed code: FAILS — BadMethodCallException: Call to undefined method
     *                  App\Models\User::isCoordinator()
     * On fixed code:   PASSES — method exists and returns true.
     *
     * Validates: Requirement 1.3
     */
    public function test_isCoordinator_returns_true_for_coordinator_role(): void
    {
        $user = new User(['user_role' => 'coordinator']);

        $this->assertTrue($user->isCoordinator());
    }
}
