<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmploymentHistory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
     protected $table = 'employment_history';
    protected $fillable = [
        'user_id',
        'currently_employed',
        'company_name',
        'position',
        'employment_type',
        'location',
        'monthly_salary',
        'unemployment_reason',
    ];

    /**
     * Get the user that owns the history record.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}