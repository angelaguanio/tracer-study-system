<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'country',
        'street_address',
        'subdivision',
        'region',
        'province',
        'city',
        'barangay',
        'full_address',
    ];

    /**
     * Helper to format full address string from components.
     */
    public static function formatFullAddress(array $data): string
    {
        $parts = array_filter([
            $data['street_address'] ?? null,
            $data['subdivision'] ?? null,
            isset($data['barangay']) && $data['barangay'] ? 'Brgy. ' . $data['barangay'] : null,
            $data['city'] ?? null,
            $data['province'] ?? null,
            $data['region'] ?? null,
            $data['country'] ?? null,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Relationship: Belongs to User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
