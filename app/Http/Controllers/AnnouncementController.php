<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    /* ================= ADMIN LIST ================= */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $sort   = $request->query('sort', 'newest');

        $announcements = Announcement::query()

            // STATUS FILTER
            ->when($status && $status !== 'All', function ($q) use ($status) {
                $q->where('status', strtolower($status));
            })

            // SEARCH (IMPORTANT FIX)
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('details', 'like', "%{$search}%");
                });
            })

            // SORT
            ->when($sort === 'oldest', function ($q) {
                $q->orderBy('created_at', 'asc');
            }, function ($q) {
                $q->orderBy('created_at', 'desc');
            })

            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/AdminAnnouncement', [
            'announcements' => $announcements,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort' => $sort,
            ],
        ]);
    }

    /* ================= APPROVE / REJECT ================= */
    public function approve(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'approved'
        ]);

        return back()->with('success', 'Announcement approved successfully!');
    }

    public function reject(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'rejected'
        ]);

        return back()->with('success', 'Announcement rejected successfully!');
    }

    /* ================= VIEW ================= */
    public function show(Announcement $announcement)
    {
        $role = auth()->user()->user_role;

        if ($role === 'admin') {
            return Inertia::render('Admin/AdminAnnouncementView', [
                'announcement' => $announcement,
            ]);
        }

        if ($role === 'coordinator') {
            return Inertia::render('Coordinator/CoordinatorAnnouncementView', [
                'announcement' => $announcement,
            ]);
        }

        return abort(403);
    }

    /* ================= EDIT ================= */
    public function edit(Announcement $announcement)
    {
        // role-based page ulit
        if (auth()->user()->user_role === 'admin') {
            return Inertia::render('Admin/AdminAnnouncementEdit', [
                'announcement' => $announcement,
            ]);
        }

        return Inertia::render('Coordinator/CoordinatorAnnouncementEdit', [
            'announcement' => $announcement,
        ]);
    }

    /* ================= UPDATE ================= */
    public function update(Request $request, Announcement $announcement)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'details' => 'required|string',
            'image'   => 'nullable|image|max:2048',
        ]);

        $imagePath = $announcement->image;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('announcements', 'public');
            $imagePath = asset("storage/$path");
        }

        $announcement->update([
            'title'   => $request->title,
            'details' => $request->details,
            'image'   => $imagePath,
        ]);

        // REDIRECT BASED ON ROLE
        if (auth()->user()->user_role === 'admin') {
            return redirect()
                ->route('admin.announcement.index')
                ->with('success', 'Updated');
        }

        return redirect()
            ->route('coordinator.announcement.index')
            ->with('success', 'Updated');
    }

    /* ================= DELETE ================= */
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        // REDIRECT BASED ON ROLE
        if (auth()->user()->user_role === 'admin') {
            return redirect()
                ->route('admin.announcement.index')
                ->with('success', 'Deleted');
        }

        return redirect()
            ->route('coordinator.announcement.index')
            ->with('success', 'Deleted');
    }

    /* ================= ALUMNA ================= */
    public function alumna()
    {
        // ONLY APPROVED SHOWN
        $announcements = Announcement::where('status', 'approved')
            ->latest()
            ->get();

        return Inertia::render('Alumna/AlumnaAnnouncements', [
            'announcements' => $announcements,
        ]);
    }

    public function showAlumna($id)
    {
        $announcement = Announcement::findOrFail($id);

        return Inertia::render('Alumna/AlumnaAnnouncementView', [
            'announcement' => $announcement
        ]);
    }

    /* ================= COORDINATOR LIST ================= */
    public function coordinatorIndex(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');
        $sort   = $request->query('sort', 'newest');

        $announcements = Announcement::query()

            // STATUS FILTER
            ->when($status && $status !== 'All', function ($q) use ($status) {
                $q->where('status', strtolower($status));
            })

            // SEARCH (GLOBAL)
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('details', 'like', "%{$search}%");
                });
            })

            // SORT
            ->when($sort === 'oldest', function ($q) {
                $q->orderBy('created_at', 'asc');
            }, function ($q) {
                $q->orderBy('created_at', 'desc');
            })

            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Coordinator/CoordinatorAnnouncement', [
            'announcements' => $announcements,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }
}