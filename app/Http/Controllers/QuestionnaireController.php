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

        $completedSurveyIds = \App\Models\Response::where('user_id', $user->id)
        ->pluck('survey_id')
        ->toArray();
        
        // Get the latest tracer study survey
        $tracerStudySurvey = \App\Models\Survey::tracerStudy()->latest()->first();
        $tracerStudyCompleted = $tracerStudySurvey
            ? in_array($tracerStudySurvey->id, $completedSurveyIds)
            : false;
                
        // Get CECT surveys (active surveys that are not tracer study, and not archived)
        $cectSurveys = \App\Models\Survey::where('status', 'active')
            ->where('is_tracer_study', false)
            ->whereNull('archived_at')
            ->withCount(['questions'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($survey) use ($completedSurveyIds) {
                $survey->completed = in_array(
                    $survey->id,
                    $completedSurveyIds
                );
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
        $survey = Survey::tracerStudy()->latest()->first();

        if (!$survey) {
            return back()->withErrors(['survey' => 'No tracer study survey available at this time.']);
        }

        return redirect()->route('alumna.surveys.show', $survey->id);
    }


}
