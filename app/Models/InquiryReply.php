<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;       
use App\Models\Inquiries;  

class InquiryReply extends Model
{
    protected $fillable = ['inquiry_id', 'sender_id', 'sender_role', 'message'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id')
                    ->select('id', 'first_name', 'last_name', 'profile_picture', 'user_role');
    }

    public function inquiry()
    {
        return $this->belongsTo(Inquiries::class);
    }
}