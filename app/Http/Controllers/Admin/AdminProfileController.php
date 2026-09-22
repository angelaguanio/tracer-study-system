<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdminProfileController extends Controller
{
    public function show()
    {
        $admin = Auth::user()->load('address');

        return Inertia::render('Admin/AdminProfile', [
            'profile' => $admin,
        ]);
    }

    public function edit()
    {
        $admin = Auth::user()->load('address');

        return Inertia::render('Admin/AdminProfileEdit', [
            'profile' => $admin,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'middle_name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $val = trim($value);
                    if ($val === '*') return;
                    if (strlen($val) === 1 || preg_match('/^[A-Z]{2}$/', $val) || str_ends_with($val, '.')) {
                        $fail('Please enter your full middle name, not just an initial. Enter * if you do not have a middle name.');
                    }
                }
            ],
            'suffix'         => 'nullable|string|max:10',
            'country'        => 'nullable|string|max:255',
            'street_address' => 'nullable|string|max:255',
            'subdivision'    => 'nullable|string|max:255',
            'region'         => 'nullable|string|max:255',
            'province'       => 'nullable|string|max:255',
            'city'           => 'nullable|string|max:255',
            'barangay'       => 'nullable|string|max:255',
            'zip_code'       => 'nullable|string|max:20',
            'address'        => 'nullable|string|max:500',
            'contact_number' => 'required|string|max:20',
            'email'          => 'required|email|max:255|unique:users,email,' . $user->id,
            'profile_picture'=> 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $fullAddress = \App\Models\Address::formatFullAddress($request->all());
        if (empty($fullAddress)) {
            $fullAddress = $request->address;
        }

        try {
            DB::transaction(function () use ($request, $user, $fullAddress) {
                
                // Handle File Upload
                if ($request->hasFile('profile_picture')) {

                    // Delete old profile picture
                    if ($user->profile_picture) {
                        $oldFile = public_path(ltrim($user->profile_picture, '/'));
                
                        if (file_exists($oldFile)) {
                            unlink($oldFile);
                        }
                    }
                
                    $baseFilename = uniqid() . '_' . time();
                    $filename = \App\Helpers\ImageHelper::convertAndSaveToWebp(
                        $request->file('profile_picture'),
                        'uploads/profile-pictures',
                        $baseFilename
                    );
                
                    $user->profile_picture = '/uploads/profile-pictures/' . $filename;
                }

                // Update User Basic Info
                $user->update([
                    'first_name'     => $request->first_name,
                    'middle_name'    => $request->middle_name,
                    'suffix'         => $request->suffix ?? null,
                    'last_name'      => $request->last_name,
                    'contact_number' => $request->contact_number,
                    'address'        => $fullAddress,
                    'email'          => $request->email,
                    'profile_picture' => $user->profile_picture,
                ]);

                // Update or Create Address Record
                \App\Models\Address::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'country'        => $request->country ?? 'Philippines',
                        'street_address' => $request->street_address ?? null,
                        'subdivision'    => $request->subdivision ?? null,
                        'region'         => $request->region ?? null,
                        'province'       => $request->province ?? null,
                        'city'           => $request->city ?? null,
                        'barangay'       => $request->barangay ?? null,
                        'zip_code'       => $request->zip_code ?? null,
                        'full_address'   => $fullAddress,
                    ]
                );
            });

            return redirect()->route('admin.profile')->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Admin Profile Update Failed: ' . $e->getMessage() . ' on line ' . $e->getLine());
            return back()->withErrors(['error' => 'An error occurred while updating the profile: ' . $e->getMessage()]);
        }
    }
}
