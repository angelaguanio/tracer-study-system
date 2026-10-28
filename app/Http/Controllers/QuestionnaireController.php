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

        $showCompletionMessage = false;
        $completionExpiresAt = null;

        if ($tracerStudyCompleted && $tracerStudySurvey) {
            $tracerResponse = \App\Models\Response::where('user_id', $user->id)
                ->where('survey_id', $tracerStudySurvey->id)
                ->latest('submitted_at')
                ->first();

            $submittedAt = $tracerResponse?->submitted_at ?? $tracerResponse?->created_at;
            if ($submittedAt) {
                $expiresAt = $submittedAt->copy()->addHours(24);
                $completionExpiresAt = $expiresAt->toIso8601String();
                $showCompletionMessage = now()->lt($expiresAt);
            }
        }
                
        // Get Alumni Forms surveys
        $cectSurveys = \App\Models\Survey::where('status', 'active')
            ->where('type', 'Alumni Forms')
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
            'tracerStudySurvey'     => $tracerStudySurvey,
            'tracerStudyCompleted'  => $tracerStudyCompleted,
            'showCompletionMessage' => $showCompletionMessage,
            'completionExpiresAt'   => $completionExpiresAt,
            'cectSurveys'           => $cectSurveys,
            'hasTracerStudy'        => $tracerStudySurvey !== null,
        ]);
    }

    public function btnStartSurvey()
    {
        $user = Auth::user();
        $survey = Survey::tracerStudy()->latest()->first();

        if (!$survey) {
            return back()->withErrors(['survey' => 'No tracer study survey available at this time.']);
        }

        $alreadySubmitted = \App\Models\Response::where('user_id', $user->id)
            ->where('survey_id', $survey->id)
            ->exists();

        if ($alreadySubmitted) {
            return redirect()->route('alumna.questionnaire');
        }

        return redirect()->route('alumna.surveys.show', $survey->id);
    }


}
