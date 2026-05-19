<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyResponse extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'survey_id',
        // add other fields like 'answers' or 'status' if applicable
    ];

    /**
     * Relationship back to the User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}