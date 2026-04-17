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
        return [];
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