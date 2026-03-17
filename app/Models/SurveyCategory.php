<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyCategory extends Model
{
     protected $fillable = [
        'name',
        'slug',
    ];

     public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
