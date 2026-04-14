<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employment extends Model
{
    protected $table = 'employment';

    protected $fillable = [
        'user_id',
        'is_employed',
        'employment_type',
        'company',
        'position',
        'location',
        'monthly_salary',
        'reason_unemployed',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}