<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Section extends Model
{
    use HasFactory;
    protected $fillable = [
        'survey_id',
        'title',
        'description',
        'likert_scale',
        'display_order',
    ];

    protected $casts = [
        'likert_scale' => 'array',
    ];

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('display_order');
    }

    public function subheadings(): HasMany
    {
        return $this->hasMany(Subheading::class)->orderBy('display_order');
    }

    public function responses(): HasManyThrough
    {
        return $this->hasManyThrough(Response::class, Question::class);
    }
}
