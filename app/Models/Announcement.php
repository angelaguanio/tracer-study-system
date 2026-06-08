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
        'revision_note',
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
        static::created(function ($announcement) {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
            
            // Clear coordinator dashboard cache for the announcement creator
            if ($announcement->user_id) {
                Cache::forget("coordinator_dashboard_metrics_{$announcement->user_id}");
                Cache::forget("coordinator_dashboard_recent_activity_{$announcement->user_id}");
                Cache::forget("coordinator_dashboard_announcement_distribution_{$announcement->user_id}");
            }
        });

        static::updated(function ($announcement) {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
            
            // Clear coordinator dashboard cache for the announcement creator
            if ($announcement->user_id) {
                Cache::forget("coordinator_dashboard_metrics_{$announcement->user_id}");
                Cache::forget("coordinator_dashboard_recent_activity_{$announcement->user_id}");
                Cache::forget("coordinator_dashboard_announcement_distribution_{$announcement->user_id}");
            }
        });

        static::deleted(function ($announcement) {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
            
            // Clear coordinator dashboard cache for the announcement creator
            if ($announcement->user_id) {
                Cache::forget("coordinator_dashboard_metrics_{$announcement->user_id}");
                Cache::forget("coordinator_dashboard_recent_activity_{$announcement->user_id}");
                Cache::forget("coordinator_dashboard_announcement_distribution_{$announcement->user_id}");
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}