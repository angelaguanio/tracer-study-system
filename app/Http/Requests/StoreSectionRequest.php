<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $surveyId = $this->route('survey')->id;

        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sections')->where('survey_id', $surveyId),
            ],
            'description'  => ['nullable', 'string'],
            'likert_scale' => ['nullable', 'array'],
            'likert_scale.*' => ['string', 'max:255'],
        ];
    }
}
