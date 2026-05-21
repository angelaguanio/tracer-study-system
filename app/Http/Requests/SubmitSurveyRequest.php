<?php

namespace App\Http\Requests;

use App\Models\Question;
use App\Models\Survey;
use Illuminate\Foundation\Http\FormRequest;

class SubmitSurveyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $survey = $this->route('survey');
        
        if (!$survey instanceof Survey) {
            return [];
        }

        $rules = [];
        
        // Get all input questions (excluding subheadings) for this survey
        $inputQuestions = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })
        ->inputQuestions() // Use the scope to exclude subheadings
        ->where('is_required', true)
        ->get();

        // Build validation rules only for required input questions
        foreach ($inputQuestions as $question) {
            $fieldKey = "answers.{$question->id}";
            
            switch ($question->type) {
                case 'text':
                case 'textarea':
                case 'number':
                    $rules[$fieldKey] = ['required', 'string', 'min:1'];
                    break;
                    
                case 'select':
                case 'radio':
                    $rules[$fieldKey] = ['required', 'string', 'min:1'];
                    break;
                    
                case 'checkbox':
                    $rules[$fieldKey] = ['required', 'array', 'min:1'];
                    $rules[$fieldKey . '.*'] = ['string'];
                    break;
                    
                case 'likert':
                    $rules[$fieldKey] = ['required', 'string', 'min:1'];
                    break;
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        $messages = [];
        
        foreach (array_keys($this->rules()) as $key) {
            $messages["{$key}.required"] = 'This field is required.';
            $messages["{$key}.min"] = 'This field is required.';
        }
        
        return $messages;
    }

    /**
     * Get the validation data from the request.
     * Filter out any subheading responses before validation.
     */
    public function validationData()
    {
        $data = parent::validationData();
        
        if (!isset($data['answers'])) {
            return $data;
        }

        $survey = $this->route('survey');
        
        if (!$survey instanceof Survey) {
            return $data;
        }

        // Get all subheading question IDs for this survey
        $subheadingQuestionIds = Question::whereHas('section', function ($query) use ($survey) {
            $query->where('survey_id', $survey->id);
        })
        ->subheadings() // Use the scope to get only subheadings
        ->pluck('id')
        ->toArray();

        // Filter out subheading answers from validation data
        $filteredAnswers = collect($data['answers'])
            ->reject(function ($value, $questionId) use ($subheadingQuestionIds) {
                return in_array($questionId, $subheadingQuestionIds);
            })
            ->toArray();

        $data['answers'] = $filteredAnswers;
        
        return $data;
    }
}