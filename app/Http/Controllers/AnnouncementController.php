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

            ->where('status', '!=', 'rejected')

            // STATUS FILTER
            ->when($status && $status !== 'All', function ($q) use ($status) {
                $q->where('status', strtolower($status));
            })

            // SEARCH
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

            ->paginate(5)
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

    /* ================= CREATE FORM ================= */
    public function create()
    {
        if (auth()->user()->user_role === 'admin') {
            return Inertia::render('Admin/AdminAnnouncementCreate');
        }

        return Inertia::render('Coordinator/CoordinatorAnnouncementCreate');
    }

    /* ================= STORE ================= */
    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'details' => 'required|string',
            'images.*' => 'image|max:10240',
        ]);

        $imageUrls = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('announcements', 'public');
                $imageUrls[] = Storage::url($path);
            }
        }

        Announcement::create([
            'title'   => $request->title,
            'details' => $request->details,
            'image'   => $imageUrls,
            'status'  => auth()->user()->user_role === 'admin' ? 'approved' : 'pending',
            'user_id' => auth()->id(),
        ]);

        return redirect()
            ->route(auth()->user()->user_role . '.announcement.index')
            ->with('success', 'Announcement created successfully!');
    }

    /* ================= APPROVE / REJECT ================= */
    public function approve(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'approved'
        ]);

        return redirect()
            ->route('admin.announcement.index')
            ->with('success', 'Announcement approved successfully!');
    }

    public function reject(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'rejected'
        ]);

        return redirect()
            ->route('admin.announcement.index')
            ->with('success', 'Announcement rejected successfully!');
    }

    /* ================= VIEW ================= */
    public function show(Announcement $announcement)
    {
        $role = auth()->user()->user_role;

        $announcement->image = is_string($announcement->image)
        ? json_decode($announcement->image, true)
        : ($announcement->image ?? []);

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
        $announcement->image = is_string($announcement->image)
            ? json_decode($announcement->image, true)
            : ($announcement->image ?? []);

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
            'images.*' => 'image|max:10240',
        ]);

        $imagePaths = [];

        $imagePaths = json_decode($request->existing_images, true) ?? [];

        // ADD NEW IMAGES ONLY
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('announcements', 'public');
                $imagePaths[] = Storage::url($path);
            }
        }

        $announcement->update([
            'title'   => $request->title,
            'details' => $request->details,
            'image'   => $imagePaths,
        ]);

        return redirect()
            ->route(auth()->user()->user_role . '.announcement.index')
            ->with('success', 'Updated');
    }

    /* ================= DELETE ================= */
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()
            ->route(auth()->user()->user_role . '.announcement.index')
            ->with('success', 'Deleted');
    }

    /* ================= ALUMNA ================= */
    public function alumna()
    {

        // ONLY APPROVED SHOWN
        $announcements = Announcement::where('status', 'approved')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Alumna/AlumnaAnnouncements', [
            'announcements' => $announcements,
        ]);
    }

    public function showAlumna($id)
    {
        return Inertia::render('Alumna/AlumnaAnnouncementView', [
            'announcement' => Announcement::findOrFail($id)
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