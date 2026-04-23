<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $choiceTypes = ['select', 'radio', 'checkbox'];
        $type = $this->input('type');

        return [
            'label'         => ['sometimes', 'string', 'max:1000'], // Increased for subheadings
            'type'          => ['sometimes', 'in:text,select,radio,checkbox,number,textarea,likert,subheading'],
            'is_required'   => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer', 'min:1'],
            'options'       => [
                Rule::requiredIf($type && in_array($type, $choiceTypes)),
                'sometimes',
                'array',
                'min:1',
            ],
            'options.*'     => ['sometimes', 'string', 'max:255'],
        ];
    }
}
