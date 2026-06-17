<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Survey extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'is_tracer_study',
        'created_by',
        'archived_at',
    ];

    protected $casts = [
        'deleted_at'  => 'datetime',
        'archived_at' => 'datetime',
        'is_tracer_study' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeTracerStudy($query)
    {
        return $query->where('is_tracer_study', true);
    }

    /** Surveys not archived */
    public function scopeNotArchived($query)
    {
        return $query->whereNull('archived_at');
    }

    /** Only archived surveys */
    public function scopeArchived($query)
    {
        return $query->whereNotNull('archived_at');
    }

    public function isArchived(): bool
    {
        return $this->archived_at !== null;
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class)->orderBy('display_order');
    }

    public function questions(): HasManyThrough
    {
        return $this->hasManyThrough(Question::class, Section::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class);
    }

    public function drafts(): HasMany
    {
        return $this->hasMany(SurveyDraft::class);
    }
}
