<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Survey;
use Inertia\Inertia;
use Illuminate\Http\Request;

class QuestionnaireController extends Controller
{
    public function showQuestionnaire()
    {
        $user = Auth::user();
        
        // Get the tracer study survey
        $tracerStudySurvey = \App\Models\Survey::tracerStudy()->first();
        $tracerStudyCompleted = $tracerStudySurvey
            ? \App\Models\Response::where('user_id', $user->id)
                ->where('survey_id', $tracerStudySurvey->id)
                ->exists()
            : false;

        // Get CECT surveys (active surveys that are not tracer study)
        $cectSurveys = \App\Models\Survey::where('status', 'active')
            ->where('is_tracer_study', false)
            ->withCount(['questions'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($survey) use ($user) {
                $survey->completed = \App\Models\Response::where('user_id', $user->id)
                    ->where('survey_id', $survey->id)
                    ->exists();
                return $survey;
            });

        return Inertia::render('Alumna/AlumnaQuestionnaire', [
            'tracerStudySurvey' => $tracerStudySurvey,
            'tracerStudyCompleted' => $tracerStudyCompleted,
            'cectSurveys' => $cectSurveys,
            'hasTracerStudy' => $tracerStudySurvey !== null,
        ]);
    }

    public function btnStartSurvey()
    {
        $survey = Survey::tracerStudy()->first();

        if (!$survey) {
            return back()->withErrors(['survey' => 'No tracer study survey available at this time.']);
        }

        return redirect()->route('alumna.surveys.show', $survey->id);
    }


}
