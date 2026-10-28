<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Default fallback configuration.
     */
    public static function defaults(): array
    {
        return [
            'app_name'              => 'Alumni Connect',
            'app_logo'              => null,
            'theme_preset'          => 'emerald',
            'theme_style'           => 'solid', // 'solid' or 'gradient'
            'primary_color'         => '#15803d',
            'secondary_color'       => '#166534',
            'font_color_on_primary' => '#ffffff',
            'text_color_primary'    => '#15803d',
        ];
    }

    /**
     * Retrieve all settings as a merged key-value array with caching.
     */
    public static function getAll(): array
    {
        if (!Schema::hasTable('system_settings')) {
            return self::defaults();
        }

        return Cache::remember('system_settings', 86400, function () {
            $dbSettings = self::pluck('value', 'key')->toArray();
            return array_merge(self::defaults(), $dbSettings);
        });
    }

    /**
     * Retrieve a specific setting by key.
     */
    public static function get(string $key, $default = null)
    {
        $all = self::getAll();
        return $all[$key] ?? $default;
    }

    /**
     * Set or update a specific setting and clear the cache.
     */
    public static function set(string $key, $value): self
    {
        $setting = self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        self::clearCache();

        return $setting;
    }

    /**
     * Clear the cached settings.
     */
    public static function clearCache(): void
    {
        Cache::forget('system_settings');
    }

    protected static function booted()
    {
        static::saved(fn () => self::clearCache());
        static::deleted(fn () => self::clearCache());
    }
}
