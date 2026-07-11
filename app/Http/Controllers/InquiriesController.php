<?php

namespace App\Http\Controllers;

use App\Models\Inquiries;
use App\Models\InquiryReply;
use App\Models\User;
use App\Mail\InquiryReplied;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Services\NotificationService;


class InquiriesController extends Controller
{
    //-------------alumni--------------------

    public function alumniIndex() {
        $coordinators = User::where('user_role', 'coordinator')
            ->select('id', 'first_name', 'last_name', 'department')
            ->get();

        // Get unique departments from coordinators
        $departments = $coordinators->pluck('department')->unique()->filter()->values();

        return Inertia::render('Alumna/ContactUs', [
            'userEmail' => Auth::user()->email,
            'userName' => Auth::user()->first_name. ' ' .Auth::user()->last_name,
            'coordinators' => $coordinators,
            'departments' => $departments
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'department' => 'required|string',
            'alumni_coord' => 'required_unless:department,admin|nullable|integer',
            'subject' => 'required|string|max:50',
            'message' => 'required|string|min:10',
        ]);

        $inquiry = Inquiries::create([
            'user_id'        => Auth::id(),
            'recipient_type' => $request->department === 'admin' ? 'admin' : 'coordinator',
            'recipient_id'   => $request->department === 'admin' ? null : $request->alumni_coord,
            'department'     => $request->department === 'admin' ? null : $request->department,
            'title'          => $validated['title'],
            'message'        => $validated['message'],
            'subject'        => $validated['subject'],
            'status'         => 'pending',
        ]);

        if ($inquiry->recipient_type === 'admin') {

            NotificationService::inquiryReceived(
                $inquiry->id,
                auth()->user()->name,
                auth()->id(),
                'admin'
            );
        
        } else {
        
            NotificationService::inquiryReceived(
                $inquiry->id,
                auth()->user()->name,
                auth()->id(),
                'coordinator_specific',
                $inquiry->recipient_id
            );
        
        }

        return redirect()->back()->with('success', 'Message sent successfully!');
    }

    public function alumniInquiriesList(Request $request)
    {
        $query = Inquiries::with(['replies.sender', 'alumni:id,first_name,last_name,email,profile_picture'])
            ->where('user_id', Auth::id());

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Alumna/AlumnaInquiries', [
            'inquiries' => $query->latest()->paginate(10)->withQueryString(),
            'filters'   => ['search' => $request->search],
            'openId'    => $request->integer('open') ?: null,
        ]);
    }

        // Single inquiry thread
    public function alumniShow($id)
    {
        $inquiry = Inquiries::with([
            'alumni:id,first_name,last_name,email,profile_picture',
            'replies.sender'
        ])
        ->where('user_id', Auth::id()) // security: only their own
        ->findOrFail($id);

        return Inertia::render('Alumna/InquiryThread', [
            'inquiry' => $inquiry,
        ]);
    }

    public function replies($id)
    {
        $inquiry = Inquiries::with([
            'replies.sender',
            'alumni:id,first_name,last_name,email,profile_picture',
        ])
        ->where('user_id', Auth::id())
        ->findOrFail($id);

        return response()->json($inquiry);
    }

    //-------------admin-----------------------
    public function adminIndex(Request $request) {
        $query = Inquiries::with(['alumni:id,first_name,last_name,email,profile_picture', 'replies.sender'])
            ->where('recipient_type', 'admin');

        // Search across all fields
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhereHas('alumni', function($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $statuses = explode(',', $request->status);
            $query->whereIn('status', $statuses);
        }

        return Inertia::render('Admin/AdminInquiries', [
            'inquiries' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ]
        ]);
    }

    

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,replied,resolved',
        ]);

        $inquiry = Inquiries::findOrFail($id);
        $inquiry->update([
            'status' => $validated['status']
        ]);

        return redirect()->back();
    }

    //-------coord------------------
    public function coordIndex(Request $request) {
        $coordinatorId = Auth::id();
        
        $query = Inquiries::with(['alumni:id,first_name,last_name,email,profile_picture', 'replies.sender'])
            ->where('recipient_type', 'coordinator')
            ->where('recipient_id', $coordinatorId);

        // Search across all fields
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%")
                  ->orWhereHas('alumni', function($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $statuses = explode(',', $request->status);
            $query->whereIn('status', $statuses);
        }

        return Inertia::render('Coordinator/CoordinatorInquiries', [
            'inquiries' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ]
        ]);
    }

    //---------------REPLY FUNC--------------------
    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'message' => 'required|string|min:1|max:2000',
        ]);

        $inquiry = Inquiries::findOrFail($id);

        $reply = InquiryReply::create([
            'inquiry_id'  => $inquiry->id,
            'sender_id'   => Auth::id(),
            'sender_role' => Auth::user()->user_role,
            'message'     => $validated['message'],
        ]);

        if ($inquiry->status === 'pending') {
            $inquiry->update(['status' => 'replied']);
        }

        if (Auth::user()->user_role !== 'alumna') {
        Mail::to($inquiry->alumni->email)->send(new InquiryReplied($reply));

        NotificationService::inquiryReplied(
            $inquiry->id,
            $inquiry->user_id,   // the alumnus who owns this inquiry
            $inquiry->subject
        );
    }

    $reply = $reply->fresh()->load([
        'sender:id,first_name,last_name,profile_picture',
    ]);
    
    return response()->json([
        'reply' => $reply,
    ]);
    }

    public function staffReplies($id)
    {
        if (auth()->user()->user_role === 'admin') {

            $inquiry = Inquiries::with([
                'replies.sender',
                'alumni:id,first_name,last_name,email,profile_picture',
            ])
            ->where('recipient_type', 'admin')
            ->whereKey($id)
            ->firstOrFail();

        } elseif (auth()->user()->user_role === 'coordinator') {

            $inquiry = Inquiries::with([
                'replies.sender',
                'alumni:id,first_name,last_name,email,profile_picture',
            ])
            ->where('recipient_type', 'coordinator')
            ->where('recipient_id', auth()->id())
            ->whereKey($id)
            ->firstOrFail();

        } else {
            abort(403);
        }

        return response()->json([
            'status' => $inquiry->status,
            'replies' => $inquiry->replies,
        ]);
    }
}

