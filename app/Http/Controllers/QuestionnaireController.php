<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
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
        $jsonPath = resource_path('js/lib/questions.json');
        $allCategories = json_decode(file_get_contents($jsonPath), true);

        $rules = [];
        $niceLabels = [];

    // loop through every category
    foreach ($allCategories as $categoryKey => $categoryData) {
        
        // loop through every question in that category
        foreach ($categoryData['questions'] as $question) {
            $id = $question['id'];
            
            // Generate the path
            $path = "answers.{$categoryKey}.{$id}";
            $rules[$path] = $question['validation'];
            //get the labels
            $niceLabels[$path] = $question['label'];
        }
    }

    $validated = $request->validate($rules,[], $niceLabels);

        DB::transaction(function () use ($validated, $request) {

            //create submission
            $submission = SurveySubmission::create([
                'user_id' => Auth::id(),
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
