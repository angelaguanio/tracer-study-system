<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/
Broadcast::channel('role.{role}', function ($user, $role) {
    return in_array($role, ['admin', 'coordinator', 'alumna'])
        && $user->user_role === $role;
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return $user->id === (int) $userId;
});


Broadcast::channel('chat.{minId}.{maxId}', function (User $user, $minId, $maxId) {
    if ($user->id === (int) $minId || $user->id === (int) $maxId) {
        return [
            'id'   => $user->id,
            'name' => $user->first_name . ' ' . $user->last_name,
        ];
    }

    return false;
});

// Global presence channel for all chat users - converted to regular channel for Pusher
Broadcast::channel('chat.presence', function (User $user) {
    if ($user->user_role === 'admin' || $user->user_role === 'coordinator') {
        return [
            'id'   => $user->id,
            'name' => $user->first_name . ' ' . $user->last_name,
            'role' => $user->user_role,
        ];
    }

    return false;
});
