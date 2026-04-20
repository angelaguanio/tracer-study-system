<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Employment extends Model
{
    protected $table = 'employment';

    protected $fillable = [
        'user_id',
        'currently_employed',
        'employment_type',
        'company_name',
        'position',
        'location',
        'monthly_salary',
        'unemployment_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}