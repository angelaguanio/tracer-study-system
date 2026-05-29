<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmploymentHistory extends Model
{
    use HasFactory;

    protected $table = 'employment_history';

    /**
     * The attributes that are mass assignable.
     * Dapat tumugma ito sa totoong structure ng table mo sa MySQL workbench/phpMyAdmin!
     */
    protected $fillable = [
        'user_id',
        'currently_employed',
        'company_name',
        'position',
        'employment_type',
        'location',
        'monthly_salary',
        'unemployment_reason',
        'employment_start_year', // Binalik sa totoong column name ng DB mo
        'employment_end_year',   // Binalik sa totoong column name ng DB mo
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}