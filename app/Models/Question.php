<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;
    protected $fillable = [
        'section_id',
        'question_identifier',
        'label',
        'type',
        'options',
        'display_order',
        'is_required',
    ];

    protected $casts = [
        'options'     => 'array',
        'is_required' => 'boolean',
    ];

    /**
     * Check if this question is a subheading type
     */
    public function isSubheading(): bool
    {
        return $this->type === 'subheading';
    }
    /**
     * Scope to filter out subheadings and return only input questions
     */
    public function scopeInputQuestions($query)
    {
        return $query->where('type', '!=', 'subheading');
    }

    /**
     * Scope to filter only subheading questions
     */
    public function scopeSubheadings($query)
    {
        return $query->where('type', 'subheading');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class);
    }
}
