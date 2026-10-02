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
                
        // Get CECT surveys (Forms and Requests)
        $cectSurveys = \App\Models\Survey::where('status', 'active')
            ->where('type', 'Forms and Requests')
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

        // Get Event surveys
        $eventSurveys = \App\Models\Survey::where('status', 'active')
            ->where('type', 'Events')
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
            'eventSurveys' => $eventSurveys,
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
