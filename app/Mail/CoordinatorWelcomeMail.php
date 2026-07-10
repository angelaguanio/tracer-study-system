<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use App\Models\User;


class CoordinatorWelcomeMail extends Mailable
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
            ->subject('Your GATE Coordinator Account')
            ->view('emails.coordinator-created');
    }
}