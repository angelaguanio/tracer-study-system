<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeaturedAlumni extends Model
{
    use HasFactory;

    protected $table = 'featured_alumni';

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

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
