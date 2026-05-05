<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiries extends Model
{
    
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
