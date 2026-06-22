<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CoordinatorProfileController extends Controller
{
    public function show()
    {
        $coordinator = Auth::user();

        return Inertia::render('Coordinator/CoordinatorProfile', [
            'coordinator' => $coordinator,
        ]);
    }
}
