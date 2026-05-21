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
}
