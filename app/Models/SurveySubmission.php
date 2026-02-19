<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveySubmission extends Model
{
    protected $fillable = [
        'user_id',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    //relationships
    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
