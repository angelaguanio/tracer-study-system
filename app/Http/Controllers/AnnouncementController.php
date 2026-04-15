<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::latest()->paginate(10);

        return Inertia::render('Admin/AdminAnnouncement', [
            'announcements' => $announcements,
            'flash' => session()->all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/AdminAnnouncementCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'details' => 'required|string',
            'image'   => 'nullable|image|max:2048',
        ]);

        $imageUrl = '';

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('announcements', 'public');
            $imageUrl = asset("storage/$path");
        }

        Announcement::create([
            'title'   => $request->title,
            'details' => $request->details,
            'image'   => $imageUrl,
        ]);

        return redirect()
            ->route('admin.announcement.index')
            ->with('success', 'Announcement created successfully.');
    }

    public function show(Announcement $announcement)
    {
        return Inertia::render('Admin/AdminAnnouncementView', [
            'announcement' => $announcement,
        ]);
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('Admin/AdminAnnouncementEdit', [
            'announcement' => $announcement,
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        // Validate input
        $request->validate([
            'title'   => 'required|string|max:255',
            'details' => 'required|string',
            'image'   => 'nullable|image|max:2048',
        ]);

        // Keep old image if no new file uploaded
        $imagePath = $announcement->image;

        if ($request->hasFile('image')) {
            // Optional: delete old image file
            // Storage::disk('public')->delete(str_replace(asset('storage/'), '', $announcement->image));

            $path = $request->file('image')->store('announcements', 'public');
            $imagePath = asset("storage/$path");
        }

        // Update announcement
        $announcement->update([
            'title'   => $request->title,
            'details' => $request->details,
            'image'   => $imagePath,
        ]);

        return redirect()
        ->route('admin.announcement.edit', $announcement->id)
        ->with('success', 'updated');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()
            ->route('admin.announcement.index')
            ->with('success', 'Announcement deleted successfully.');
    }

    // ALUMNA SIDE
    public function alumna()
    {
        $announcements = Announcement::latest()->get();

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
}