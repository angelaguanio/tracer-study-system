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
        'zip_code',
        'full_address',
    ];

    /**
     * Helper to format full address string from components.
     */
    public static function formatFullAddress(array $data): string
    {
        $cityWithZip = array_filter([
            $data['city'] ?? null,
            $data['zip_code'] ?? null,
        ]);
        $cityString = !empty($cityWithZip) ? implode(' ', $cityWithZip) : null;

        $parts = array_filter([
            $data['street_address'] ?? null,
            $data['subdivision'] ?? null,
            isset($data['barangay']) && $data['barangay'] ? 'Brgy. ' . $data['barangay'] : null,
            $cityString,
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
