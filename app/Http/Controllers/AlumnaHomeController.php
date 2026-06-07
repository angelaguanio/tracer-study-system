<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;

class AlumnaHomeController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = auth()->user();

        $map = $this->collegeCoursesMap();
        $userCollege = $this->getUserCollege($user->courses);

        $announcements = Announcement::where('status', 'approved')
            ->where(function ($q) use ($user, $userCollege) {

                $q->where('target_type', 'ALL')

                ->orWhere(function ($q2) use ($user) {
                    $q2->where('target_type', 'COURSE')
                        ->where('target_value', $user->courses);
                })

                ->orWhere(function ($q2) use ($userCollege) {
                    if (!$userCollege) return;

                    $q2->where('target_type', 'COLLEGE')
                        ->where('target_value', $userCollege);
                });

            })
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Alumna/AlumnaHome', [
            'announcements' => $announcements
        ]);
    }

    private function collegeCoursesMap()
    {
        return [
            'CECT' => ['BSIT', 'BSECE', 'BSCpE'],
            'COED' => ['BEED', 'BPED', 'BSED'],
            'CAMS' => ['BSMT', 'BSPH', 'BSPT', 'BSRT'],
            'CON'  => ['BSN'],
            'CBA'  => ['BSA', 'BSBA', 'BSMA', 'BSREM'],
            'CHTM' => [],
            'CCJE' => [],
            'CAS'  => [],
        ];
    }

    private function getUserCollege($course)
    {
        $map = $this->collegeCoursesMap();

        foreach ($map as $college => $courses) {
            if (in_array($course, $courses)) {
                return $college;
            }
        }

        return null;
    }
}