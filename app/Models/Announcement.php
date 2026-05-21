<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'details',
        'image',
        'status',
        'user_id',
    ];

     protected $casts = [
        'image' => 'array',
    ];

    /**
     * Boot method to clear dashboard cache when announcements are modified
     */
    protected static function booted()
    {
        // Clear cache when announcement is created, updated, or deleted
        static::created(function () {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
        });

        static::updated(function () {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
        });

        static::deleted(function () {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}