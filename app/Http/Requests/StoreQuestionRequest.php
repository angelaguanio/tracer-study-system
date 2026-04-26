<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $choiceTypes = ['select', 'radio', 'checkbox'];

        return [
            'label'         => ['required', 'string', 'max:1000'], // Increased for subheadings
            'type'          => ['required', 'in:text,select,radio,checkbox,number,textarea,likert,subheading'],
            'is_required'   => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:1'],
            'options'       => [
                Rule::requiredIf(in_array($this->input('type'), $choiceTypes)),
                'array',
                'min:1',
            ],
            'options.*'     => ['string', 'max:255'],
        ];
    }
}
