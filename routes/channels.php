<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

// Role-based public channels (admin, coordinator, alumna)
Broadcast::channel('role.{role}', function ($user, $role) {
    return in_array($role, ['admin', 'coordinator', 'alumna'])
        && $user->user_role === $role;
});

// User-specific channel (coordinator-specific / alumna-specific notifications)
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return $user->id === (int) $userId;
});

// Inquiry thread channel — alumni who owns it + admin/coordinator recipient
Broadcast::channel('inquiry.{inquiryId}', function ($user, $inquiryId) {
    $inquiry = \App\Models\Inquiries::find($inquiryId);
    if (!$inquiry) return false;

    if ($user->id === $inquiry->user_id) return true;
    if ($user->user_role === 'admin' && $inquiry->recipient_type === 'admin') return true;
    if ($user->user_role === 'coordinator' && $inquiry->recipient_id === $user->id) return true;

    return false;
});

// Announcements channel — all authenticated users
Broadcast::channel('announcements', function ($user) {
    return (bool) $user;
});

// Per-conversation chat channel (admin + coordinator pair) — private channel
Broadcast::channel('chat.{minId}.{maxId}', function (User $user, $minId, $maxId) {
    return $user->id === (int) $minId || $user->id === (int) $maxId;
});

// Global presence channel for online status (admin + coordinator only)
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
