<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyDraft extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'survey_id',
        'answers',
        'last_section_id',
        'updated_at',
    ];

    protected $casts = [
        'answers'    => 'array',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    public function lastSection(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'last_section_id');
    }
}
