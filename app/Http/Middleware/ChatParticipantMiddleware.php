<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChatParticipantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Alumna users have no access to chat
        if (!$user || $user->user_role === 'alumna') {
            abort(403);
        }

        // Only admin and coordinator are allowed
        if (!in_array($user->user_role, ['admin', 'coordinator'])) {
            abort(403);
        }

        // If a conversation is bound in the route, verify the user is a participant
        $conversation = $request->route('conversation');
        if ($conversation) {
            if ($user->id !== $conversation->admin_id && $user->id !== $conversation->coordinator_id) {
                abort(403);
            }
        }

        return $next($request);
    }
}
