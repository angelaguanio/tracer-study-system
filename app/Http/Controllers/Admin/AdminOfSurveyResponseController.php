<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOfSurveyResponseController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->where('user_role', 'alumna');

        // SEARCH
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        // FILTER COURSE
        if ($request->filled('course') && $request->course !== 'all') {
            $query->where('courses', $request->course);
        }

        // FILTER YEAR
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year_graduated', $request->year);
        }

        $users = $query->latest()->paginate(10);

        $users->getCollection()->transform(function ($user) {

            $hasResponse = $user->responses()->exists();

            return [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'status' => $hasResponse ? 'completed' : 'incomplete',
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',
            ];
        });

        return Inertia::render('Admin/AdminSurveyResponse', [
            'responses' => $users,
            'filters' => $request->only(['search', 'course', 'year']),
        ]);
    }

    public function show($id)
    {
        $user = User::where('user_role', 'alumna')
            ->with(['responses.question'])
            ->findOrFail($id);

        $isCompleted = $user->responses()->exists();

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

                // 🔥 SURVEY Q&A (SAFE + COMPLETE)
                'answers' => $user->responses->map(function ($r) {

                    return [
                        'question' =>
                            $r->question->question_text
                            ?? $r->question->text
                            ?? 'Question not found',

                        'answer' => $r->answer_value ?? '-',
                    ];
                })->values(),
            ],
        ]);
    }

    public function notComplete($id)
    {
        $user = User::where('user_role', 'alumna')
            ->findOrFail($id);

        return Inertia::render('Admin/AdminSurveyResponseViewNotComplete', [
            'user' => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'course' => $user->courses ?? '-',
                'year' => $user->year_graduated ?? '-',
            ],
        ]);
    }

    public function destroy($id)
    {
        $user = User::where('user_role', 'alumna')->findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'Deleted successfully');
    }
}