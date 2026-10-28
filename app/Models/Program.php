<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id',
        'name',
        'code',
        'status',
    ];

    /**
     * Relationship: A program belongs to a department.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Relationship: Alumni registered under this program code.
     */
    public function alumni(): HasMany
    {
        return $this->hasMany(User::class, 'courses', 'code')->where('user_role', 'alumna');
    }

    /**
     * Scope: Only active programs.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Invalidate academic cache whenever a program changes.
     */
    protected static function booted()
    {
        $clearCache = function () {
            Cache::forget('academic_departments_programs');
        };

        static::created($clearCache);
        static::updated($clearCache);
        static::deleted($clearCache);
    }
}
