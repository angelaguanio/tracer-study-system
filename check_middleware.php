<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$router = app('router');
$groups = $router->getMiddlewareGroups();
echo "web group middleware:\n";
foreach ($groups['web'] ?? [] as $m) {
    echo "  - $m\n";
}

echo "\nRoute middleware for broadcasting/auth:\n";
$routes = $router->getRoutes();
$count = 0;
foreach ($routes as $route) {
    if (in_array($route->uri(), ['broadcasting/auth', 'test-auth-route'])) {
        $count++;
        echo "Route #$count:\n";
        echo "  URI: " . $route->uri() . "\n";
        echo "  methods: " . implode(', ', $route->methods()) . "\n";
        echo "  middleware: " . implode(', ', $route->middleware()) . "\n";
        echo "  excluded: " . implode(', ', $route->excludedMiddleware()) . "\n\n";
    }
}

// Check channels
$broadcaster = app('Illuminate\Broadcasting\BroadcastManager')->driver();
echo "Broadcaster class: " . get_class($broadcaster) . "\n";
echo "Channels registered: " . implode(', ', array_keys($broadcaster->getChannels()->toArray())) . "\n";
