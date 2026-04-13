<?php

namespace App\Policies;

use App\Models\SurveyDraft;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SurveyDraftPolicy
{
    public function view(User $user, SurveyDraft $draft): Response
    {
        return $draft->user_id === $user->id
            ? Response::allow()
            : Response::deny('You are not authorized to view this draft.');
    }

    public function update(User $user, SurveyDraft $draft): Response
    {
        return $draft->user_id === $user->id
            ? Response::allow()
            : Response::deny('You are not authorized to update this draft.');
    }
}
