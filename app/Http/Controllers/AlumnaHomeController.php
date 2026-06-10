<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;

class AlumnaHomeController extends Controller
{
    public function __invoke(Request $request)
    {
        // Kunin latest 3 announcements 
        $announcements = Announcement::where('status', 'approved')
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Alumna/AlumnaHome', [
            'announcements' => $announcements
        ]);
    }
}