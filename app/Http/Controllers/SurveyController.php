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

        $surveys = Survey::withCount('sections')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/SurveyIndex', [
            'surveys' => $surveys,
        ]);
    }

    public function store(StoreSurveyRequest $request)
    {
        $this->authorize('create', Survey::class);

        Survey::create([
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->input('status', 'inactive'),
        ]);

        return redirect()->route('admin.surveys.index');
    }

    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $this->authorize('update', $survey);

        if ($request->input('status') === 'active') {
            $this->authorize('activate', $survey);
        }

        $survey->update($request->validated());

        return back();
    }

    public function destroy(Survey $survey)
    {
        $this->authorize('delete', $survey);

        $survey->delete();

        return redirect()->route('admin.surveys.index');
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
                ]);
            },
        ]);

        return Inertia::render('Admin/SurveyBuilder', [
            'survey' => $survey,
        ]);
    }
}
