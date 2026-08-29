<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerifyEmailNotification;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $casts = [
        'password_changed' => 'boolean', // ← add this
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'last_name', 
        'first_name', 
        'middle_name', 
        'suffix',
        'email', 
        'password', 
        'password_changed',
        'user_role', 
        'start_year', 
        'end_year', 
        'semester', 
        'courses', 
        'status', 
        'department',
        'address',       
        'contact_number',
        'profile_picture',
        'notifications_seen_at',
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
    protected $appends = ['initials', 'avatar_url', 'name'];

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
     * Note: Run 'php artisan storage:link' for this to function properly.
     */
    public function getAvatarUrlAttribute() {
        if ($this->profile_picture) {
            return asset('storage/' . $this->profile_picture);
        }
        return null;
    }

    /**
     * Get the user's full name.
     */
    public function getNameAttribute() {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Relationship: Address details record.
     */
    public function addressDetails(): HasOne
    {
        return $this->hasOne(Address::class, 'user_id');
    }

    /**
     * Relationship: Address (alias for addressDetails)
     */
    public function address(): HasOne
    {
        return $this->hasOne(Address::class, 'user_id');
    }

    /**
     * Get user's formatted full address string.
     */
    public function getFormattedAddressAttribute(): string
    {
        if ($this->relationLoaded('address') && $this->address) {
            return $this->address->full_address ?? '';
        }
        if ($this->relationLoaded('addressDetails') && $this->addressDetails) {
            return $this->addressDetails->full_address ?? '';
        }
        return $this->attributes['address'] ?? '';
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

    public function responses()
    {
        return $this->hasMany(Response::class);
    }

    /**
     * Check if the user is an administrator.
     */
    public function isAdmin(): bool
    {
        return $this->user_role === 'admin';
    }

    /**
     * Check if the user is a coordinator.
     */
    public function isCoordinator(): bool
    {
        return $this->user_role === 'coordinator';
    }

    public function isAlumna(): bool
    {
        return $this->user_role === 'alumna';
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

        /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailNotification());
    }
}