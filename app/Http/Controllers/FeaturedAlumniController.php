<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FeaturedAlumni;
use App\Services\NotificationService;

class FeaturedAlumniController extends Controller
{
    /* ================= ADMIN LIST ================= */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $sort = $request->query('sort', 'newest');

        $featuredAlumni = FeaturedAlumni::query()
            ->whereIn('status', ['Approved', 'Pending', 'Rejected', 'Revise', 'approved', 'pending', 'revise', 'rejected'])
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('details', 'like', "%{$search}%");
                });
            })
            ->when(
                $sort === 'oldest',
                function ($q) { $q->orderBy('created_at', 'asc'); },
                function ($q) { $q->orderBy('created_at', 'desc'); }
            )
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Admin/AdminFeaturedAlumni', [
            'featuredAlumni' => $featuredAlumni,
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
            return Inertia::render('Admin/AdminFeaturedAlumniCreate');
        }

        return Inertia::render('Coordinator/CoordinatorFeaturedAlumniCreate');
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

        if (count($files) > 1) {
            abort(422, 'Maximum of 1 image only.');
        }

        $imageUrls = [];
        foreach ($files as $file) {
            $baseFilename = time() . '_' . uniqid();
            $filename = \App\Helpers\ImageHelper::convertAndSaveToWebp(
                $file,
                'uploads/featured_alumni',
                $baseFilename
            );
            $imageUrls[] = '/uploads/featured_alumni/' . $filename;
        }

        $isCoordinator = auth()->user()->user_role === 'coordinator';
        $status = $isCoordinator ? 'Pending' : 'Approved';

        $featuredAlumni = FeaturedAlumni::create([
            'title'   => $request->title,
            'details' => $request->details,
            'image' => $imageUrls,
            'status' => $status,
            'user_id' => auth()->id(),
        ]);

        if ($isCoordinator) {
            NotificationService::featuredAlumniPendingReview(
                $featuredAlumni->id,
                $featuredAlumni->title,
                auth()->id(),
                auth()->user()->name
            );
        }

        return redirect()
            ->route(auth()->user()->user_role . '.featured-alumni.index')
            ->with('success', 'Featured Alumni created successfully!');
    }

    /* ================= APPROVE / REJECT ================= */
    public function approve(FeaturedAlumni $featuredAlumni)
    {
        $featuredAlumni->update([
            'status' => 'Approved'
        ]);

        if ($featuredAlumni->user_id) {
            NotificationService::featuredAlumniApproved(
                $featuredAlumni->id,
                $featuredAlumni->title,
                $featuredAlumni->user_id
            );
        }

        return redirect()
            ->route('admin.featured-alumni.index')
            ->with('success', 'Featured Alumni approved successfully!');
    }

    public function reject(Request $request, FeaturedAlumni $featuredAlumni)
    {
        $request->validate([
            'note' => 'required|string'
        ]);

        $featuredAlumni->update([
            'status' => 'Rejected',
            'revision_note' => $request->note,
        ]);

        if ($featuredAlumni->user_id) {
            NotificationService::featuredAlumniNeedsRevision(
                $featuredAlumni->id,
                $featuredAlumni->title,
                $featuredAlumni->user_id,
                $request->note
            );
        }

        return redirect()
            ->route('admin.featured-alumni.index')
            ->with('success', 'Marked for revision');
    }

    /* ================= VIEW ================= */
    public function show(FeaturedAlumni $featuredAlumni)
    {
        $role = auth()->user()->user_role;

        $featuredAlumni->image = is_string($featuredAlumni->image)
            ? json_decode($featuredAlumni->image, true)
            : ($featuredAlumni->image ?? []);

        if ($role === 'admin') {
            return Inertia::render('Admin/AdminFeaturedAlumniView', [
                'featuredAlumni' => $featuredAlumni,
            ]);
        }

        if ($role === 'coordinator') {
            return Inertia::render('Coordinator/CoordinatorFeaturedAlumniView', [
                'featuredAlumni' => $featuredAlumni,
            ]);
        }

        return abort(403);
    }

    /* ================= EDIT ================= */
    public function edit(FeaturedAlumni $featuredAlumni)
    {
        $featuredAlumni->image = is_string($featuredAlumni->image)
            ? json_decode($featuredAlumni->image, true)
            : ($featuredAlumni->image ?? []);

        if (auth()->user()->user_role === 'admin') {
            return Inertia::render('Admin/AdminFeaturedAlumniEdit', [
                'featuredAlumni' => $featuredAlumni,
            ]);
        }

        return Inertia::render('Coordinator/CoordinatorFeaturedAlumniEdit', [
            'featuredAlumni' => $featuredAlumni,
        ]);
    }

    /* ================= UPDATE ================= */
    public function update(Request $request, FeaturedAlumni $featuredAlumni)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'images.*' => 'image',
        ]);

        $existing = json_decode($request->existing_images, true) ?? [];
        $newFiles = $request->file('images', []) ?? [];

        $isRevision = in_array(strtolower($featuredAlumni->status), ['rejected', 'revise']);
        $newStatus = $isRevision
            ? 'Pending'
            : $featuredAlumni->status;

        $newRevisionNote = $isRevision
            ? null
            : $featuredAlumni->revision_note;

        if (count($existing) + count($newFiles) > 1) {
            abort(422, 'Maximum of 1 image only.');
        }

        $oldImages = is_string($featuredAlumni->image)
            ? json_decode($featuredAlumni->image, true)
            : ($featuredAlumni->image ?? []);

        foreach ($oldImages as $oldImage) {
            if (!in_array($oldImage, $existing)) {
                $file = public_path(ltrim($oldImage, '/'));
                if (file_exists($file)) {
                    unlink($file);
                }
            }
        }
        $imagePaths = $existing;

        foreach ($newFiles as $file) {
            $baseFilename = time() . '_' . uniqid();
            $filename = \App\Helpers\ImageHelper::convertAndSaveToWebp(
                $file,
                'uploads/featured_alumni',
                $baseFilename
            );
            $imagePaths[] = '/uploads/featured_alumni/' . $filename;
        }

        $featuredAlumni->update([
            'title' => $request->title,
            'details' => $request->details,
            'image' => $imagePaths,
            'status' => $newStatus,
            'revision_note' => $newRevisionNote,
        ]);

        if ($isRevision && auth()->user()->user_role === 'coordinator') {
            NotificationService::featuredAlumniResubmitted(
                $featuredAlumni->id,
                $featuredAlumni->title,
                auth()->id(),
                auth()->user()->name
            );
        }

        return redirect()
            ->route(auth()->user()->user_role . '.featured-alumni.index')
            ->with('success', 'Updated successfully');
    }

    /* ================= DELETE ================= */
    public function destroy(FeaturedAlumni $featuredAlumni)
    {
        $images = is_string($featuredAlumni->image)
            ? json_decode($featuredAlumni->image, true)
            : ($featuredAlumni->image ?? []);
    
        foreach ($images as $image) {
            $file = public_path(ltrim($image, '/'));
            if (file_exists($file)) {
                unlink($file);
            }
        }
    
        $featuredAlumni->delete();
    
        return redirect()
            ->route(auth()->user()->user_role . '.featured-alumni.index')
            ->with('success', 'Deleted');
    }

    /* ================= COORDINATOR LIST ================= */
    public function coordinatorIndex(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');
        $sort = $request->query('sort', 'newest');

        $featuredAlumni = FeaturedAlumni::query()
            ->when($status && $status !== 'All', function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('details', 'like', "%{$search}%");
                });
            })
            ->when($sort === 'oldest', function ($q) {
                $q->orderBy('created_at', 'asc');
            }, function ($q) {
                $q->orderBy('created_at', 'desc');
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Coordinator/CoordinatorFeaturedAlumni', [
            'featuredAlumni' => $featuredAlumni,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }
}
