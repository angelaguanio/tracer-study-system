<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">


    @php
        $sysSettings = \App\Models\SystemSetting::getAll();
        $primaryColor = $sysSettings['primary_color'] ?? '#2563eb';
        $secondaryColor = $sysSettings['secondary_color'] ?? '#1d4ed8';
        $isGradient = ($sysSettings['theme_style'] ?? 'solid') === 'gradient';
        $fontOnPrimary = $sysSettings['font_color_on_primary'] ?? '#ffffff';
        $textPrimary = $sysSettings['text_color_primary'] ?? '#0f172a';
    @endphp

    <title inertia>{{ $sysSettings['app_name'] ?? config('app.name', 'Alumni Connect') }}</title>

    <style id="system-theme-variables">
        :root {
            --theme-primary: {{ $primaryColor }};
            --theme-secondary: {{ $secondaryColor }};
            --theme-gradient: {{ $isGradient ? "linear-gradient(135deg, {$primaryColor}, {$secondaryColor})" : $primaryColor }};
            --theme-text-on-primary: {{ $fontOnPrimary }};
            --theme-text-primary: {{ $textPrimary }};

            /* Direct mapped overrides for buttons, navbars, sidebars, badges */
            --color-blue-btn: {{ $primaryColor }};
            --color-bluehover-btn: {{ $secondaryColor }};
            --color-navbar: {{ $isGradient ? "linear-gradient(135deg, {$primaryColor}, {$secondaryColor})" : $primaryColor }};
            --color-navbar-text: {{ $fontOnPrimary }};
            --sidebar-accent: {{ $primaryColor }};
            --sidebar-accent-foreground: {{ $fontOnPrimary }};
            --primary: {{ $primaryColor }};
            --primary-foreground: {{ $fontOnPrimary }};
        }

        /* Global Theme Helper Utilities */
        .theme-bg-primary {
            background: var(--theme-gradient) !important;
            color: var(--theme-text-on-primary) !important;
        }
        .theme-bg-solid {
            background-color: var(--theme-primary) !important;
            color: var(--theme-text-on-primary) !important;
        }
        .theme-text-primary {
            color: var(--theme-primary) !important;
        }
        .theme-border-primary {
            border-color: var(--theme-primary) !important;
        }
        .theme-ring-primary {
            --tw-ring-color: var(--theme-primary) !important;
        }

        /* Direct class overrides for Admin, Coordinator, and Alumni components */
        .theme-sidebar-bg,
        [data-sidebar="sidebar"],
        [data-slot="sidebar-inner"] {
            background: var(--theme-gradient) !important;
            color: var(--theme-text-on-primary) !important;
        }

        /* Primary Buttons & Actions */
        .bg-blue-600,
        button.bg-blue-600,
        a.bg-blue-600,
        .bg-blue-btn,
        .bg-\[\#005AAA\],
        .bg-\[\#007AD7\],
        .bg-\[\#009AFB\],
        .bg-\[\#1258D6\] {
            background-color: var(--theme-primary) !important;
            color: var(--theme-text-on-primary) !important;
            border-color: var(--theme-primary) !important;
        }

        .bg-blue-600:hover,
        .hover\:bg-blue-700:hover,
        button.bg-blue-600:hover,
        a.bg-blue-600:hover,
        .hover\:bg-bluehover-btn:hover,
        .hover\:bg-\[\#003C87\]:hover,
        .hover\:bg-\[\#005AAA\]:hover,
        .hover\:bg-\[\#0082D6\]:hover {
            background-color: var(--theme-secondary) !important;
            border-color: var(--theme-secondary) !important;
        }

        /* Headings, Icons, & Accent Text */
        .text-blue-600,
        .focus\:text-blue-600:focus,
        .hover\:text-blue-600:hover,
        .text-\[\#003C87\],
        .text-\[\#005AAA\],
        .text-\[\#007AD7\],
        .text-\[\#009AFB\],
        .text-\[\#1258D6\],
        .group:hover .group-hover\:text-\[\#005AAA\] {
            color: var(--theme-primary) !important;
        }

        .text-blue-700 {
            color: var(--theme-secondary) !important;
        }

        /* Card Borders & Focus Rings */
        .border-blue-600,
        .border-\[\#007AD7\],
        .border-\[\#009AFB\] {
            border-color: var(--theme-primary) !important;
        }

        .border-blue-200,
        .border-blue-200\/80,
        .border-blue-100,
        .border-blue-100\/50,
        .hover\:border-blue-300:hover {
            border-color: color-mix(in srgb, var(--theme-primary) 25%, #e2e8f0) !important;
        }

        .bg-blue-50,
        .bg-blue-50\/80,
        .bg-blue-100,
        .bg-blue-100\/50,
        .hover\:bg-blue-50:hover,
        .focus\:bg-blue-50:focus {
            background-color: color-mix(in srgb, var(--theme-primary) 10%, white) !important;
        }

        /* Headings, Text & Dots */
        .text-blue-500,
        .text-blue-800,
        .text-blue-text {
            color: var(--theme-primary) !important;
        }

        .bg-blue-400 {
            background-color: var(--theme-primary) !important;
        }

        /* SVG Waves & Background Magic UI */
        .fill-blue-500\/20 {
            fill: color-mix(in srgb, var(--theme-primary) 18%, transparent) !important;
        }

        path[fill="#005AAA"],
        path[fill="#003C87"],
        path[fill="#60A5FA"],
        path[fill="#93C5FD"] {
            fill: var(--theme-primary) !important;
        }

        /* Card Adaptive Highlights */
        .theme-card-accent {
            border-top: 3px solid var(--theme-primary) !important;
        }

        .theme-banner-bg {
            background: var(--theme-gradient) !important;
            color: var(--theme-text-on-primary) !important;
        }

        .theme-hero-overlay {
            background: linear-gradient(to top, color-mix(in srgb, var(--theme-primary) 85%, black) 0%, rgba(0, 0, 0, 0.4) 100%) !important;
        }
    </style>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    
    <!-- Preload Logos (Globally) -->
    @if (!empty($sysSettings['app_logo']))
        <link rel="preload" as="image" href="{{ $sysSettings['app_logo'] }}">
    @else
        <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/logotracer.webp') }}">
    @endif
    <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/wup_cect.webp') }}">

    <!-- Conditional Preloading (Injects before React even loads!) -->
    @if (isset($page['component']))
        @if (str_starts_with($page['component'], 'Auth/'))
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/cover4.webp') }}">
        @elseif ($page['component'] === 'Alumna/AlumnaHome')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/bg_test_1.webp') }}">
        @elseif ($page['component'] === 'Alumna/AlumnaAbout')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/grad_pic.webp') }}">
        @elseif ($page['component'] === 'Alumna/AlumnaAssociation')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/cect_bg_clean.webp') }}">
        @elseif ($page['component'] === 'Alumna/ContactUs')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/contact_us_new.webp') }}">
        @endif
    @endif

    <script>
        window.__SYSTEM_SETTINGS__ = {!! json_encode($sysSettings) !!};
    </script>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>