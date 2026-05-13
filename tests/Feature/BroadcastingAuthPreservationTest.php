<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Broadcast;
use Tests\TestCase;

/**
 * Preservation Property Tests — Broadcasting Auth 403 Fix
 *
 * These tests verify that behaviors which must remain unchanged after the fix
 * are indeed preserved. They encode invariants that hold on BOTH unfixed and
 * fixed code (they are not bug-condition tests).
 *
 * Observations on unfixed code (baseline):
 *   - POST /broadcasting/auth with no session → 403 or redirect (correct, preserved)
 *   - POST /broadcasting/auth as a user whose id is not in {minId, maxId} → 403 from channel callback
 *   - isAdmin() returns false for user_role='alumna' and null (if method existed)
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 */
class BroadcastingAuthPreservationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Do not override the broadcasting driver here.
        // The channel callback tests use the default driver (which has channels registered).
        // The HTTP tests rely on the auth middleware, not the broadcaster driver.
    }

    private function createUserWithRole(string $role, string $suffix = ''): User
    {
        return User::create([
            'first_name' => 'Test',
            'last_name'  => ucfirst($role) . $suffix,
            'email'      => $role . $suffix . '@example.com',
            'password'   => bcrypt('password'),
            'user_role'  => $role,
        ]);
    }

    // -------------------------------------------------------------------------
    // Property: isAdmin() returns false for all user_role values that are NOT 'admin'
    // Validates: Requirement 3.3
    // **Validates: Requirements 3.3**
    // -------------------------------------------------------------------------

    /**
     * @dataProvider nonAdminRoleProvider
     */
    public function test_isAdmin_returns_false_for_non_admin_roles(mixed $role): void
    {
        $user = new User(['user_role' => $role]);

        $this->assertFalse($user->isAdmin());
    }

    public static function nonAdminRoleProvider(): array
    {
        return [
            'coordinator role'      => ['coordinator'],
            'alumna role'           => ['alumna'],
            'empty string'          => [''],
            'null role'             => [null],
            'arbitrary string foo'  => ['foo'],
            'arbitrary string bar'  => ['bar'],
            'ADMIN uppercase'       => ['ADMIN'],
            'Admin mixed case'      => ['Admin'],
            'admin with space'      => [' admin'],
            'numeric string'        => ['123'],
        ];
    }

    // -------------------------------------------------------------------------
    // Property: isCoordinator() returns false for all user_role values NOT 'coordinator'
    // Validates: Requirement 3.3
    // **Validates: Requirements 3.3**
    // -------------------------------------------------------------------------

    /**
     * @dataProvider nonCoordinatorRoleProvider
     */
    public function test_isCoordinator_returns_false_for_non_coordinator_roles(mixed $role): void
    {
        $user = new User(['user_role' => $role]);

        $this->assertFalse($user->isCoordinator());
    }

    public static function nonCoordinatorRoleProvider(): array
    {
        return [
            'admin role'                  => ['admin'],
            'alumna role'                 => ['alumna'],
            'empty string'                => [''],
            'null role'                   => [null],
            'arbitrary string foo'        => ['foo'],
            'arbitrary string bar'        => ['bar'],
            'COORDINATOR uppercase'       => ['COORDINATOR'],
            'Coordinator mixed case'      => ['Coordinator'],
            'coordinator with space'      => [' coordinator'],
            'numeric string'              => ['456'],
        ];
    }

    // -------------------------------------------------------------------------
    // Property: Channel callback returns false for user ids NOT in {minId, maxId}
    // Validates: Requirement 3.1
    // **Validates: Requirements 3.1**
    //
    // We test the channel callback directly (not via HTTP) because the null
    // broadcaster driver bypasses channel authorization at the HTTP layer.
    // The channel callback in routes/channels.php is the authoritative source
    // of the "outsider gets false" invariant, so we invoke it directly.
    // -------------------------------------------------------------------------

    /**
     * @dataProvider outsiderIdProvider
     */
    public function test_channel_callback_returns_false_for_outsider_user(
        int $minId,
        int $maxId,
        int $outsiderId
    ): void {
        // Build a user whose id is not in {minId, maxId}
        $outsider     = new User();
        $outsider->id = $outsiderId;

        // Retrieve the registered channel callback for 'chat.{minId}.{maxId}'
        $channels = Broadcast::driver()->getChannels();

        // Find the callback registered for the chat channel pattern
        $chatPattern  = null;
        $chatCallback = null;
        foreach ($channels as $pattern => $callback) {
            if (str_contains($pattern, 'chat')) {
                $chatPattern  = $pattern;
                $chatCallback = $callback;
                break;
            }
        }

        $this->assertNotNull($chatCallback, 'No chat channel callback registered');

        // Invoke the callback directly: callback(User $user, $minId, $maxId)
        $result = $chatCallback($outsider, (string) $minId, (string) $maxId);

        $this->assertFalse($result, "Expected channel callback to return false for outsider id={$outsiderId} not in {{$minId},{$maxId}}");
    }

    public static function outsiderIdProvider(): array
    {
        return [
            'outsider below range'  => [10, 20, 5],
            'outsider above range'  => [10, 20, 30],
            'outsider between'      => [10, 20, 15],
            'outsider id=0'         => [10, 20, 0],
            'outsider id=1'         => [2, 3, 1],
            'outsider id=100'       => [1, 2, 100],
            'large ids outsider'    => [1000, 2000, 999],
            'large ids outsider 2'  => [1000, 2000, 2001],
        ];
    }

    // -------------------------------------------------------------------------
    // Test: Unauthenticated POST /broadcasting/auth is still rejected after fix
    // Validates: Requirement 3.2
    // **Validates: Requirements 3.2**
    //
    // The auth middleware runs before the broadcaster, so unauthenticated
    // requests are rejected at the middleware layer regardless of the driver.
    // -------------------------------------------------------------------------

    public function test_unauthenticated_broadcasting_auth_is_rejected(): void
    {
        $response = $this->post('/broadcasting/auth', [
            'channel_name' => 'presence-chat.1.2',
            'socket_id'    => '123.456',
        ]);

        // Must be rejected — either 403 or a redirect (302) to login
        $this->assertTrue(
            in_array($response->getStatusCode(), [302, 401, 403]),
            'Expected unauthenticated request to be rejected (302/401/403), got: '
                . $response->getStatusCode()
        );
    }
}
