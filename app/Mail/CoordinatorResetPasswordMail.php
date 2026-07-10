<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;

class CoordinatorResetPasswordMail extends Mailable
{
    public $coordinator;
    public $password;

    public function __construct(User $coordinator, $password)
    {
        $this->coordinator = $coordinator;
        $this->password = $password;
    }

    public function build()
    {
        return $this
            ->subject('Your GATE Password Has Been Reset')
            ->view('emails.coordinator-reset');
    }
}