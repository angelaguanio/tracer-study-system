<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Inquiries extends Model
{
    use HasFactory;
    
    protected $appends = ['formatted_date'];

    protected $table = 'inquiries';

    protected $fillable = [
        'user_id',
        'recipient_type',
        'recipient_id',
        'department',
        'title',
        'subject',
        'message',
        'status',

        
    ];

    /**
     * Boot method to clear dashboard cache when inquiries are modified
     */
    protected static function booted()
    {
        // Clear cache when inquiry is created, updated, or deleted
        static::created(function () {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
            
            // Clear coordinator dashboard cache for all coordinators
            // Since we don't know which coordinator's cache to clear, we clear the pattern
            // In production, consider using cache tags or a more sophisticated approach
            $coordinators = User::where('user_role', 'coordinator')->pluck('id');
            foreach ($coordinators as $coordinatorId) {
                Cache::forget("coordinator_dashboard_metrics_{$coordinatorId}");
                Cache::forget("coordinator_dashboard_recent_activity_{$coordinatorId}");
            }
        });

        static::updated(function () {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
            
            // Clear coordinator dashboard cache for all coordinators
            $coordinators = User::where('user_role', 'coordinator')->pluck('id');
            foreach ($coordinators as $coordinatorId) {
                Cache::forget("coordinator_dashboard_metrics_{$coordinatorId}");
                Cache::forget("coordinator_dashboard_recent_activity_{$coordinatorId}");
            }
        });

        static::deleted(function () {
            Cache::forget('admin_dashboard_metrics');
            Cache::forget('admin_dashboard_recent_activity');
            
            // Clear coordinator dashboard cache for all coordinators
            $coordinators = User::where('user_role', 'coordinator')->pluck('id');
            foreach ($coordinators as $coordinatorId) {
                Cache::forget("coordinator_dashboard_metrics_{$coordinatorId}");
                Cache::forget("coordinator_dashboard_recent_activity_{$coordinatorId}");
            }
        });
    }

    public function alumni(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('M d, Y');
    }

    public function replies()
    {
        return $this->hasMany(InquiryReply::class, 'inquiry_id')->with('sender')->oldest();
    }
}
