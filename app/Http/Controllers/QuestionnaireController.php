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
        $survey = \App\Models\Survey::active()->first();

        $completed = $survey
            ? \App\Models\Response::where('user_id', $user->id)
                ->where('survey_id', $survey->id)
                ->exists()
            : false;

        return Inertia::render('Alumna/AlumnaQuestionnaire', [
            'completed'       => $completed,
            'hasActiveSurvey' => $survey !== null,
        ]);
    }

    public function btnStartSurvey()
    {
        $survey = Survey::where('status', 'active')->first();

        if (!$survey) {
            return back()->withErrors(['survey' => 'No active survey available at this time.']);
        }

        return redirect()->route('alumna.surveys.show', $survey->id);
    }


}
