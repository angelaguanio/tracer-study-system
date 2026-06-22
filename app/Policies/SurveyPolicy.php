<?php

namespace App\Policies;

use App\Models\Survey;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SurveyPolicy
{
    public function viewAny(User $user): Response
    {
        return ($user->isCoordinator() || $user->isAdmin())
            ? Response::allow()
            : Response::deny('Only coordinators and admins can access surveys.');
    }

    public function viewAnalytics(User $user): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Only admins can access survey analytics.');
    }

    public function view(User $user, Survey $survey): Response
    {
        // Both admins and coordinators can only view surveys they created
        if ($user->isAdmin() || $user->isCoordinator()) {
            if ($survey->created_by === $user->id) {
                return Response::allow();
            }
            return Response::deny('You can only view surveys you created.');
        }

        // Alumni can view tracer study surveys or active surveys
        if ($user->isAlumna() && ($survey->is_tracer_study || $survey->status === 'active')) {
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
        // Both admins and coordinators can only update surveys they created
        if ($user->isAdmin() || $user->isCoordinator()) {
            if ($survey->created_by === $user->id) {
                return Response::allow();
            }
            return Response::deny('You can only update surveys you created.');
        }

        return Response::deny('Only coordinators and admins can update surveys.');
    }

    public function delete(User $user, Survey $survey): Response
    {
        // Both admins and coordinators can only delete surveys they created
        if ($user->isAdmin() || $user->isCoordinator()) {
            if ($survey->created_by !== $user->id) {
                return Response::deny('You can only delete surveys you created.');
            }
            if ($survey->responses()->exists()) {
                return Response::deny('Cannot delete a survey that already has responses.');
            }
            return Response::allow();
        }

        return Response::deny('Only coordinators and admins can delete surveys.');
    }

    public function archive(User $user, Survey $survey): Response
    {
        // Archive is allowed even when responses exist — it just hides the survey
        if ($user->isAdmin() || $user->isCoordinator()) {
            if ($survey->created_by !== $user->id) {
                return Response::deny('You can only archive surveys you created.');
            }
            return Response::allow();
        }

        return Response::deny('Only coordinators and admins can archive surveys.');
    }

    public function activate(User $user, Survey $survey): Response
    {
        // Both admins and coordinators can only activate surveys they created
        if ($user->isAdmin() || $user->isCoordinator()) {
            if ($survey->created_by !== $user->id) {
                return Response::deny('You can only activate surveys you created.');
            }
            if (!$survey->sections()->exists()) {
                return Response::deny('A survey must have at least one section before it can be activated.');
            }
            return Response::allow();
        }

        return Response::deny('Only coordinators and admins can activate surveys.');
    }

    public function submit(User $user, Survey $survey): Response
    {
        if (!$user->isAlumna()) {
            return Response::deny('Only alumni can submit survey responses.');
        }

        // Alumni can submit tracer study surveys or active surveys
        if (!$survey->is_tracer_study && $survey->status !== 'active') {
            return Response::deny('This survey is not available for submission.');
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
