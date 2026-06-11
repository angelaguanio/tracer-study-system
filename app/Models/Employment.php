<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employment extends Model
{
    use HasFactory;
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
        'employment_start_year',
        'employment_end_year',
        'is_present',
        'unemployment_reason'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}