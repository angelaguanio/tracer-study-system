<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveSectionDraftRequest;
use App\Http\Requests\SubmitSurveyRequest;
use App\Models\Response;
use App\Models\Survey;
use App\Models\SurveyDraft;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\NotificationService;


class SurveyResponseController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $survey = Survey::tracerStudy()->first();

        if (!$survey) {
            return back()->withErrors(['survey' => 'No tracer study survey available at this time.']);
        }

        return redirect()->route('alumna.surveys.show', $survey->id);
    }

    public function show(Survey $survey)
    {
        $this->authorize('view', $survey);

        $user = Auth::user();

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

        $sections = $survey->sections;

        // Inject section's likert_scale into likert questions as options
        $sections->each(function ($section) {
            if ($section->likert_scale) {
                $section->questions->each(function ($question) use ($section) {
                    if ($question->type === 'likert') {
                        $question->options = $section->likert_scale;
                    }
                });
            }
        });

        $draft = SurveyDraft::where('user_id', $user->id)
            ->where('survey_id', $survey->id)
            ->first();

        $currentSectionIndex = 0;

        if ($draft && $draft->last_section_id) {
            $index = $sections->search(fn($s) => $s->id === $draft->last_section_id);
            if ($index !== false) {
                $currentSectionIndex = $index;
            }
        }

        return Inertia::render('Alumna/Survey', [
            'survey'               => $survey,
            'sections'             => $sections,
            'draft'                => $draft,
            'currentSectionIndex'  => $currentSectionIndex,
        ]);
    }

    public function saveSection(SaveSectionDraftRequest $request, Survey $survey)
    {
        $user = Auth::user();

        SurveyDraft::updateOrCreate(
            [
                'user_id'   => $user->id,
                'survey_id' => $survey->id,
            ],
            [
                'answers'         => $request->input('answers'),
                'last_section_id' => $request->input('section_id'),
                'updated_at'      => now(),
            ]
        );

        return redirect()->route('alumna.surveys.show', $survey);
    }

    public function submit(SubmitSurveyRequest $request, Survey $survey)
    {
        $this->authorize('submit', $survey);

        $user = Auth::user();

        DB::transaction(function () use ($user, $survey) {
            $draft = SurveyDraft::where('user_id', $user->id)
                ->where('survey_id', $survey->id)
                ->firstOrFail();

            // Subheadings are in a separate table, so draft answers should only contain question responses
            // No need to filter since subheadings don't generate form inputs
            $filteredAnswers = $draft->answers;

            // Create Response records only for actual input questions
            foreach ($filteredAnswers as $questionId => $answerValue) {
                Response::create([
                    'survey_id'    => $survey->id,
                    'user_id'      => $user->id,
                    'question_id'  => $questionId,
                    'answer_value' => is_array($answerValue) ? json_encode($answerValue) : $answerValue,
                    'submitted_at' => now(),
                ]);
            }

            NotificationService::surveyAnswered($survey->id, $user->id, $user->name);
            NotificationService::surveyCompleted($survey->id, $survey->title, $user->id);

            $draft->delete();
        });

        return redirect()->route('alumna.questionnaire')
            ->with('justCompleted', true)
            ->with('completedSurveyType', $survey->is_tracer_study ? 'tracer' : 'cect');
    }
}
