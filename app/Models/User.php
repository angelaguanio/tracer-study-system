<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'last_name', 
        'first_name', 
        'middle_name', 
        'email', 
        'password', 
        'user_role', 
        'year_graduated', 
        'courses', 
        'address',       
        'contact_number',
        'profile_picture'
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password', 
        'remember_token'
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['initials', 'avatar_url'];

    /**
     * Generate initials from first and last name.
     */
    public function getInitialsAttribute() {
        return strtoupper(
            substr($this->first_name ?? '', 0, 1) . 
            substr($this->last_name ?? '', 0, 1)
        );
    }

    /**
     * Generate the full URL for the profile picture.
     * Tandaan: I-run ang 'php artisan storage:link' para gumana ito.
     */
    public function getAvatarUrlAttribute() {
        if ($this->profile_picture) {
            return asset('storage/' . $this->profile_picture);
        }
        return null;
    }

    /**
     * Role helper methods
     */
    public function isAlumna(): bool
    {
        return $this->user_role === 'alumna';
    }

    public function isCoordinator(): bool
    {
        return $this->user_role === 'coordinator';
    }

    public function isAdmin(): bool
    {
        return $this->user_role === 'admin';
    }

    /**
     * Relationship: One current employment status.
     */
    public function employment(): HasOne {
        return $this->hasOne(Employment::class, 'user_id');
    }
    
    /**
     * Relationship: Multiple employment history records.
     */
    public function employmentHistory(): HasMany
    {
         return $this->hasMany(EmploymentHistory::class);
    }
}