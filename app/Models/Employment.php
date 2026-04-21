<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employment extends Model
{
    // Points to the singular table name in your migration
    protected $table = 'employment';

    protected $fillable = [
        'user_id',
        'currently_employed',
        'employment_type',
        'company_name',
        'position',
        'location',
        'monthly_salary',
        'unemployment_reason'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}