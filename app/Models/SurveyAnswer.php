<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyAnswer extends Model
{
     protected $fillable = [
        'survey_submission_id',
        'category_id',
        'question_identifier',
        'answer_value',
    ];

    public function submission()
    {
        return $this->belongsTo(SurveySubmission::class);
    }

    public function category()
    {
        return $this->belongsTo(SurveyCategory::class);
    }
}
