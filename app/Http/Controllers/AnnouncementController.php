<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;
use Illuminate\Support\Facades\Storage;
use App\Services\NotificationService;


class AnnouncementController extends Controller
{
    private function validateTotalImageSize($files)
    {
        $totalSize = 0;

        foreach ($files as $file) {
            $totalSize += $file->getSize();
        }

        if (($totalSize / 1024 / 1024) > 10) {
            abort(422, 'Total image size must not exceed 10MB.');
        }
    }
    
    /* ================= ADMIN LIST ================= */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $sort = $request->query('sort', 'newest');

        $announcements = Announcement::query()
            ->whereIn('status', ['approved', 'pending', 'revise'])

            // STATUS FILTER
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })

            // SEARCH
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('details', 'like', "%{$search}%");
                });
            })

            // SORT
            ->when(
                $sort === 'oldest',
                function ($q) {
                    $q->orderBy('created_at', 'asc');
                },
                function ($q) {
                    $q->orderBy('created_at', 'desc');
                }
            )
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
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'images.*' => 'image',
        ]);

        $files = $request->file('images', []);

        // MAX 10 IMAGES
        if (count($files) > 10) {
            abort(422, 'Maximum of 10 images only.');
        }

        // TOTAL SIZE CHECK (10MB total)
        $totalSize = 0;

        foreach ($files as $file) {
            $totalSize += $file->getSize();
        }

        if (($totalSize / 1024 / 1024) > 10) {
            abort(422, 'Total image size must not exceed 10MB.');
        }

        $imageUrls = [];

        foreach ($files as $file) {
            $path = $file->store('announcements', 'public');
            $imageUrls[] = Storage::url($path);
        }

        $announcement = Announcement::create([
            'title'   => $request->title,
            'details' => $request->details,
            'image' => $imageUrls,
            'status' => auth()->user()->user_role === 'admin'
                ? 'approved'
                : 'pending',
            'user_id' => auth()->id(),
        ]);

        // Only send notification if it's pending (coordinator created it)
        if ($announcement->status === 'pending') {
            NotificationService::announcementPendingReview(
                $announcement->id,
                $announcement->title,
                auth()->id(),
                auth()->user()->name
            );
        }
        return redirect()
            ->route(auth()->user()->user_role . '.announcement.index')
            ->with('success', 'Announcement created successfully!');
    }

    /* ================= APPROVE / REVISE ================= */
    public function approve(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'approved'
        ]);

        NotificationService::announcementApproved(
            $announcement->id,
            $announcement->title,
            $announcement->user_id   // coordinator's user_id
        );

        return redirect()
            ->route('admin.announcement.index')
            ->with('success', 'Announcement approved successfully!');
    }

    public function reject(Request $request, Announcement $announcement)
    {
        $request->validate([
            'note' => 'required|string'
        ]);

        $announcement->update([
            'status' => 'revise',
            'revision_note' => $request->note,
        ]);

        NotificationService::announcementRejected(
            $announcement->id,
            $announcement->title,
            $announcement->user_id,   // coordinator's user_id
            'Announcement did not meet approval criteria.'  // default reason
        );

        return redirect()
            ->route('admin.announcement.index')
            ->with('success', 'Marked for revision');
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
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'images.*' => 'image',
        ]);

        $existing = json_decode($request->existing_images, true) ?? [];

        // MAX 10 TOTAL IMAGES (existing + new) (para di null)
        $newFiles = $request->file('images', []) ?? [];

        // RESET STATUS LOGIC
        $newStatus = $announcement->status === 'revise'
            ? 'pending'   // resubmit -> balik pending
            : $announcement->status;

        $newRevisionNote = $announcement->status === 'revise'
            ? null        // alisin note after resubmit
            : $announcement->revision_note;

        // IMAGE LIMIT CHECKS
        if (count($existing) + count($newFiles) > 10) {
            abort(422, 'Maximum of 10 images only.');
        }

        // TOTAL SIZE CHECK (NEW FILES ONLY)
        $totalSize = 0;

        foreach ($existing as $imageUrl) {
            $path = str_replace(
                '/storage/',
                '',
                parse_url($imageUrl, PHP_URL_PATH)
            );

            if (Storage::disk('public')->exists($path)) {
                $totalSize += Storage::disk('public')->size($path);
            }
        }

        // NEW FILES SIZE
        foreach ($newFiles as $file) {
            $totalSize += $file->getSize();
        }

        // FINAL CHECK (10MB TOTAL)
        if (($totalSize / 1024 / 1024) > 10) {
            abort(422, 'Total image size must not exceed 10MB.');
        }

        // SAVE IMAGES
        $imagePaths = $existing;

        foreach ($newFiles as $file) {
            $path = $file->store('announcements', 'public');
            $imagePaths[] = Storage::url($path);
        }

        // FINAL UPDATE
        $announcement->update([
            'title' => $request->title,
            'details' => $request->details,

            // status reset
            'image' => $imagePaths,
            'status' => $newStatus,

            // clear revision note
            'revision_note' => $newRevisionNote,
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
        $announcements = Announcement::where('status', 'approved')
            ->latest()
            ->paginate(4)
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
        $sort = $request->query('sort', 'newest');

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