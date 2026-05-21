<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subheading extends Model
{
    protected $fillable = [
        'section_id',
        'subheading_identifier',
        'label',
        'display_order',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }
}