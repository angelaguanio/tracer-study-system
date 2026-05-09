<?php

namespace App\Policies;

use App\Models\Survey;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SurveyPolicy
{
    public function viewAny(User $user): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Only admins can access survey analytics.');
    }

    public function view(User $user, Survey $survey): Response
    {
        // Admins can view any survey
        if ($user->isAdmin()) {
            return Response::allow();
        }

        // Alumni can view active surveys (for taking them)
        if ($user->isAlumna() && $survey->status === 'active') {
            return Response::allow();
        }

        return Response::deny('You are not authorized to view this survey.');
    }

    public function create(User $user): Response
    {
        return ($user->isCoordinator() || $user->isAdmin())
            ? Response::allow()
            : Response::deny('Only coordinators can create surveys.');
    }

    public function update(User $user, Survey $survey): Response
    {
        return ($user->isCoordinator() || $user->isAdmin())
            ? Response::allow()
            : Response::deny('Only coordinators can update surveys.');
    }

    public function delete(User $user, Survey $survey): Response
    {
        if (!$user->isCoordinator() && !$user->isAdmin()) {
            return Response::deny('Only coordinators can delete surveys.');
        }

        if ($survey->responses()->exists()) {
            return Response::deny('Cannot delete a survey that already has responses.');
        }

        return Response::allow();
    }

    public function activate(User $user, Survey $survey): Response
    {
        if (!$user->isCoordinator() && !$user->isAdmin()) {
            return Response::deny('Only coordinators can activate surveys.');
        }

        if (!$survey->sections()->exists()) {
            return Response::deny('A survey must have at least one section before it can be activated.');
        }

        return Response::allow();
    }

    public function submit(User $user, Survey $survey): Response
    {
        if (!$user->isAlumna()) {
            return Response::deny('Only alumni can submit survey responses.');
        }

        if ($survey->status !== 'active') {
            return Response::deny('This survey is not currently active.');
        }

        $alreadySubmitted = $survey->responses()
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadySubmitted) {
            return Response::deny('You have already submitted a response to this survey.');
        }

        return Response::allow();
    }
}
