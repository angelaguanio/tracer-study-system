<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\SurveySubmission;
use App\Models\SurveyCategory;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionnaireController extends Controller
{
    public function showQuestionnaire() 
    {
        return Inertia::render('Alumna/AlumnaQuestionnaire');
    }

    public function btnStartSurvey() 
    {
        return Inertia::render('Alumna/Survey');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        DB::transaction(function () use ($validated, $request) {

            //create submission
            $submission = SurveySubmission::create([
                'user_id' => auth()->id,
                'submitted_at' => now(),
            ]);

            //loop categories
            foreach ($validated['answers'] as $categorySlug => $questions) {

                $category = SurveyCategory::where('slug', $categorySlug)->firstOrFail();

                //loop answers
                foreach ($questions as $question => $value) {

                    SurveyAnswer::create([
                        'survey_submission_id' => $submission->id,
                        'category_id' => $category->id,
                        'question_identifier' => $question,
                        'answer_value' => $value,
                    ]);
                }
            }
        });

        return back()->with('success', 'Survey submitted!');
    }

}
