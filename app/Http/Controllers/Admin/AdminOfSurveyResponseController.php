<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOfSurveyResponseController extends Controller
{
    /**
     * Display a listing of the survey responses.
     */
    public function index(Request $request)
    {
        // 1. Base query: Siguraduhin na alumna lang ang kinukuha
        $query = User::query()->where('user_role', 'alumna');

        // 2. SEARCH logic (First Name or Last Name)
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        // 3. FILTER by Course
        if ($request->filled('course') && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        // 4. FILTER by Year
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        // 5. PAGINATION: withQueryString() para hindi mawala ang filters paglipat ng page
        $users = $query->latest()->paginate(10)->withQueryString();

        // 6. TRANSFORM: I-format ang data bago ipadala sa Inertia
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'status' => $user->responses()->exists() ? 'completed' : 'incomplete',
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',
            ];
        });

        return Inertia::render('Admin/AdminSurveyResponse', [
            'responses' => $users,
            'filters' => $request->only(['search', 'course', 'year']),
        ]);
    }

    /**
     * Show the detailed response of a specific user.
     */
    public function show($id)
    {
        $user = User::where('user_role', 'alumna')
            ->with(['responses.question'])
            ->findOrFail($id);

        $isCompleted = $user->responses()->exists();

        // Redirect kung wala pang sagot
        if (!$isCompleted) {
            return redirect()->route('survey-response.not-complete', $id);
        }

        return Inertia::render('Admin/AdminSurveyResponseView', [
            'response' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'email' => $user->email,
                'mobile' => $user->contact_number ?? '-',
                'address' => $user->address ?? '-',
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',
                'answers' => $user->responses->map(function ($r) {
                    return [
                        'question' => $r->question->question_text 
                                      ?? $r->question->text 
                                      ?? 'Question not found',
                        'answer' => $r->answer_value ?? '-',
                    ];
                })->values(),
            ],
        ]);
    }

    /**
     * Show incomplete status.
     */
    public function notComplete($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);

        return Inertia::render('Admin/AdminSurveyResponseViewNotComplete', [
            'user' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',
            ],
        ]);
    }

    /**
     * Delete the user/response.
     */
    public function destroy($id)
    {
        // Hanapin ang user, siguruhing alumna ito bago i-delete
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        
        // Delete the user record
        $user->delete();

        /** * Importante: Ang redirect back() ay magpapadala ng updated props sa Inertia.
         * Ang flash message ('success') ay pwedeng basahin sa frontend kung kailangan.
         */
        return redirect()->back()->with('success', 'Deleted successfully');
    }
}