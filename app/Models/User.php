<?php
 
namespace App\Models;
 
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
 
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
 
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
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
        'username',        // ✅ added
        'address',         // ✅ added
        'contact_number',  // ✅ added
    ];
 
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
 
    // helper func
    public function isAlumna()
    {
        return $this->user_role === 'alumna';
    }
 
    public function isCoordinator()
    {
        return $this->user_role === 'coordinator';
    }
 
    public function isAdmin()
    {
        return $this->user_role === 'admin';
    }
 
    // get initials for temp profile
    public function getInitialsAttribute()
    {
        return strtoupper(substr($this->first_name ?? '', 0, 1) . substr($this->last_name ?? '', 0, 1));
    }
 
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
 
    public function responses(): HasMany
    {
        return $this->hasMany(Response::class);
    }
 
    public function drafts(): HasMany
    {
        return $this->hasMany(SurveyDraft::class);
    }
 
    public function employment()
    {
        return $this->hasOne(Employment::class);
    }
}
 