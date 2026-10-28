<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\ImageHelper;

class AdminThemeSettingsController extends Controller
{
    private function checkAdmin()
    {
        if (!auth()->check() || auth()->user()->user_role !== 'admin') {
            abort(403, 'Unauthorized access.');
        }
    }

    /**
     * Show the theme and branding settings page.
     */
    public function index()
    {
        $this->checkAdmin();

        return Inertia::render('Admin/AdminThemeSettings', [
            'settings' => SystemSetting::getAll(),
        ]);
    }

    /**
     * Update branding (App Name, Logo).
     */
    public function updateBranding(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'app_name' => ['required', 'string', 'max:100'],
            'app_logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:3072'],
        ]);

        SystemSetting::set('app_name', trim($validated['app_name']));

        if ($request->boolean('remove_logo')) {
            SystemSetting::set('app_logo', null);
        } elseif ($request->hasFile('app_logo')) {
            $baseFilename = 'logo_' . time();
            $filename = ImageHelper::convertAndSaveToWebp(
                $request->file('app_logo'),
                'uploads/branding',
                $baseFilename
            );
            SystemSetting::set('app_logo', '/uploads/branding/' . $filename);
        }

        return back()->with('success', 'Branding updated successfully.');
    }

    /**
     * Update color palette, style, and font color on primary.
     */
    public function updateTheme(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'theme_preset'          => ['required', 'string', 'max:50'],
            'theme_style'           => ['required', 'in:solid,gradient'],
            'primary_color'         => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'secondary_color'       => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'font_color_on_primary' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'text_color_primary'    => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        foreach ($validated as $key => $value) {
            SystemSetting::set($key, $value);
        }

        return back()->with('success', 'Theme and colors updated successfully.');
    }

    /**
     * Reset branding and theme to default system state.
     */
    public function resetDefaults()
    {
        $this->checkAdmin();

        $defaults = SystemSetting::defaults();
        foreach ($defaults as $key => $value) {
            SystemSetting::set($key, $value);
        }

        return back()->with('success', 'Theme and branding reset to original defaults.');
    }
}
