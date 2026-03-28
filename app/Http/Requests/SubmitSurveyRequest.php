<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitSurveyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $section = $this->route('survey')
            ->sections()
            ->with('questions')
            ->findOrFail($this->input('section_id'));

        $rules = [];

        foreach ($section->questions as $question) {
            $key = "answers.{$question->id}";
            $presence = $question->is_required ? 'required' : 'nullable';

            $rules[$key] = match ($question->type) {
                'text', 'textarea' => [$presence, 'string', 'max:1000'],
                'number'           => [$presence, 'numeric'],
                'select', 'radio', 'likert' => [$presence, 'string'],
                'checkbox'         => [$presence, 'array', 'min:1'],
                default            => [$presence],
            };
        }

        return $rules;
    }

    public function messages(): array
    {
        $messages = [];
        foreach (array_keys($this->rules()) as $key) {
            $messages["{$key}.required"] = 'This field is required.';
            $messages["{$key}.min"]      = 'This field is required.';
        }
        return $messages;
    }
}