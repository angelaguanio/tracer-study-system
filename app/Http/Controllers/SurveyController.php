<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Models\Survey;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use App\Services\NotificationService;

class SurveyController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $this->authorize('viewAny', Survey::class);

        $user  = auth()->user();
        $routeName = request()->route()->getName();
        $viewPath  = strpos($routeName, 'coordinator.') === 0
            ? 'Coordinator/CoordinatorSurveyIndex'
            : 'Admin/SurveyIndex';

        $base = Survey::withCount('sections')
            ->where('created_by', $user->id)
            ->orderBy('created_at', 'desc');

        // Active surveys (not archived)
        $surveys = (clone $base)
        ->notArchived()
        ->paginate(5, ['*'], 'active_page')
        ->through(fn ($s) => array_merge($s->toArray(), [
            'has_responses' => $s->responses()->exists(),
        ]))
        ->withQueryString();

        // Archived surveys
        $archivedSurveys = (clone $base)
        ->archived()
        ->paginate(5, ['*'], 'archived_page')
        ->through(fn ($s) => array_merge($s->toArray(), [
            'has_responses' => true,
        ]))
        ->withQueryString();

        return Inertia::render($viewPath, [
            'surveys'         => $surveys,
            'archivedSurveys' => $archivedSurveys,
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

        $wasActive = $survey->status === 'active';

        if ($request->input('status') === 'active') {
            $this->authorize('activate', $survey);
            // Multiple surveys can now be active at the same time
            // No need to deactivate other surveys
        }

        // Handle tracer study active status
        $isTracer = $request->has('is_tracer_study') ? $request->input('is_tracer_study') : $survey->is_tracer_study;
        
        if ($isTracer && $request->input('status') === 'active') {
            // Only one tracer study can be active at a time.
            // Deactivate older active tracer studies so they become historical records.
            Survey::where('id', '!=', $survey->id)
                ->where('is_tracer_study', true)
                ->where('status', 'active')
                ->update(['status' => 'inactive']);
        }

        $survey->update($request->validated());

        if (!$wasActive && $survey->status === 'active') {
            NotificationService::surveyPublished(
                $survey->id,
                $survey->title,
                $survey->is_tracer_study ? 'tracer' : 'normal'
            );
        }

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

    public function archive(Survey $survey)
    {
        $this->authorize('archive', $survey);

        $survey->update([
            'archived_at' => now(),
            'status'      => 'inactive',
        ]);

        $routeName     = request()->route()->getName();
        $redirectRoute = strpos($routeName, 'coordinator.') === 0
            ? 'coordinator.surveys.index'
            : 'admin.surveys.index';

        return redirect()->route($redirectRoute);
    }

    public function unarchive(Survey $survey)
    {
        $this->authorize('archive', $survey);

        $survey->update(['archived_at' => null]);

        $routeName     = request()->route()->getName();
        $redirectRoute = strpos($routeName, 'coordinator.') === 0
            ? 'coordinator.surveys.index'
            : 'admin.surveys.index';

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
            'survey'        => $survey,
            'has_responses' => $survey->responses()->exists(),
        ]);
    }
}
