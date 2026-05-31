<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['type', 'target_role', 'title', 'message', 'data', 'triggered_by', 'target_user_id'];
    protected $casts = ['data' => 'array'];

    public function reads()
    {
        return $this->hasMany(NotificationRead::class);
    }

    public function isReadBy(User $user): bool
    {
        return $this->reads()->where('user_id', $user->id)->exists();
    }
}
