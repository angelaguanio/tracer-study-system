<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'status',
    ];

    /**
     * Relationship: A department has many programs.
     */
    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    /**
     * Relationship: Coordinators assigned to this department.
     */
    public function coordinators(): HasMany
    {
        return $this->hasMany(User::class, 'department', 'code')->where('user_role', 'coordinator');
    }

    /**
     * Relationship: Alumni under this department.
     */
    public function alumni(): HasMany
    {
        return $this->hasMany(User::class, 'department', 'code')->where('user_role', 'alumna');
    }

    /**
     * Scope: Only active departments.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Invalidate academic cache whenever a department changes.
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
