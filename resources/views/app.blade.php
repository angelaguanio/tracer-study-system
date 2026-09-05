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


    <title inertia>{{ config('app.name', 'Alumni Connect') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    
    <!-- Preload Logos (Globally) -->
    <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/logotracer.webp') }}">
    <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/wup_cect.webp') }}">

    <!-- Conditional Preloading (Injects before React even loads!) -->
    @if (isset($page['component']))
        @if (str_starts_with($page['component'], 'Auth/'))
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/cover4.webp') }}">
        @elseif ($page['component'] === 'Alumna/AlumnaHome')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/cect_home_new.webp') }}">
        @elseif ($page['component'] === 'Alumna/AlumnaAbout')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/grad_pic.webp') }}">
        @elseif ($page['component'] === 'Alumna/AlumnaAssociation')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/cect_bg_clean.webp') }}">
        @elseif ($page['component'] === 'Alumna/ContactUs')
            <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/contact.webp') }}">
        @endif
    @endif

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>