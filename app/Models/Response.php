<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class Response extends Model
{
    use HasFactory;
    protected $fillable = [
        'survey_id',
        'user_id',
        'question_id',
        'answer_value',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    /**
     * Boot method to clear dashboard cache when responses are modified
     */
    protected static function booted()
    {
        // Clear cache when response is created, updated, or deleted
        static::created(function ($response) {
            // Only clear cache if response is submitted
            if ($response->submitted_at) {
                Cache::forget('admin_dashboard_metrics');
                Cache::forget('admin_dashboard_recent_activity');
                
                // Clear coordinator dashboard cache for all coordinators
                $coordinators = User::where('user_role', 'coordinator')->pluck('id');
                foreach ($coordinators as $coordinatorId) {
                    Cache::forget("coordinator_dashboard_metrics_{$coordinatorId}");
                    Cache::forget("coordinator_dashboard_recent_activity_{$coordinatorId}");
                }
            }
        });

        static::updated(function ($response) {
            // Only clear cache if response is submitted
            if ($response->submitted_at) {
                Cache::forget('admin_dashboard_metrics');
                Cache::forget('admin_dashboard_recent_activity');
                
                // Clear coordinator dashboard cache for all coordinators
                $coordinators = User::where('user_role', 'coordinator')->pluck('id');
                foreach ($coordinators as $coordinatorId) {
                    Cache::forget("coordinator_dashboard_metrics_{$coordinatorId}");
                    Cache::forget("coordinator_dashboard_recent_activity_{$coordinatorId}");
                }
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

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
