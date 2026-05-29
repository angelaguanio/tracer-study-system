<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Models\Survey;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class SurveyController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $this->authorize('viewAny', Survey::class);

        $query = Survey::withCount('sections')
            ->orderBy('created_at', 'desc');

        // Filter surveys based on user role - both admins and coordinators only see their own surveys
        $user = auth()->user();
        if ($user->user_role === 'coordinator' || $user->user_role === 'admin') {
            // Both coordinators and admins can only see surveys they created
            $query->where('created_by', $user->id);
        }

        $surveys = $query->get();

        // Determine the correct view based on the current route name
        $routeName = request()->route()->getName();
        $viewPath = strpos($routeName, 'coordinator.') === 0 ? 'Coordinator/CoordinatorSurveyIndex' : 'Admin/SurveyIndex';

        return Inertia::render($viewPath, [
            'surveys' => $surveys,
        ]);
    }

    public function store(StoreSurveyRequest $request)
    {
        $this->authorize('create', Survey::class);

        $survey = Survey::create([
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->input('status', 'inactive'),
            'created_by'  => auth()->id(),
        ]);

        // Determine the correct redirect route based on the current route name
        $routeName = request()->route()->getName();
        $redirectRoute = strpos($routeName, 'coordinator.') === 0 ? 'coordinator.surveys.builder' : 'admin.surveys.builder';

        return redirect()->route($redirectRoute, $survey);
    }

    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $this->authorize('update', $survey);

        if ($request->input('status') === 'active') {
            $this->authorize('activate', $survey);
            // Multiple surveys can now be active at the same time
            // No need to deactivate other surveys
        }

        // Handle tracer study designation
        if ($request->has('is_tracer_study') && $request->input('is_tracer_study')) {
            // Only one survey can be the tracer study at a time
            Survey::where('id', '!=', $survey->id)
                ->update(['is_tracer_study' => false]);
        }

        $survey->update($request->validated());

        return back();
    }

    public function destroy(Survey $survey)
    {
        $this->authorize('delete', $survey);

        $survey->delete();

        // Determine the correct redirect route based on the current route name
        $routeName = request()->route()->getName();
        $redirectRoute = strpos($routeName, 'coordinator.') === 0 ? 'coordinator.surveys.index' : 'admin.surveys.index';

        return redirect()->route($redirectRoute);
    }

    public function builder(Survey $survey)
    {
        $this->authorize('update', $survey);

        $survey->load([
            'sections' => function ($query) {
                $query->orderBy('display_order')->with([
                    'questions' => function ($q) {
                        $q->orderBy('display_order');
                    },
                    'subheadings' => function ($q) {
                        $q->orderBy('display_order');
                    },
                ]);
            },
        ]);

        // Determine the correct view based on the current route name
        $routeName = request()->route()->getName();
        $viewPath = strpos($routeName, 'coordinator.') === 0 ? 'Coordinator/CoordinatorSurveyBuilder' : 'Admin/SurveyBuilder';

        return Inertia::render($viewPath, [
            'survey' => $survey,
        ]);
    }
}
