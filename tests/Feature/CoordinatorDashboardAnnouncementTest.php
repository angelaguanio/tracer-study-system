<?php

use App\Models\User;
use App\Models\Announcement;

/**
 * Test suite for Coordinator Dashboard Announcement Distribution and Recent Announcements (Task 4.5)
 * Requirements: 8.1, 8.2
 */

test('coordinator dashboard returns announcement distribution', function () {
    $coordinator = User::factory()->create(['user_role' => 'coordinator']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('announcement_distribution')
            ->has('announcement_distribution.pending')
            ->has('announcement_distribution.approved')
            ->has('announcement_distribution.rejected')
    );
});

test('coordinator dashboard returns recent announcements', function () {
    $coordinator = User::factory()->create(['user_role' => 'coordinator']);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('recent_announcements')
    );
});

test('coordinator dashboard calculates announcement distribution correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    $otherCoordinator = User::factory()->coordinator()->create();
    
    // Create announcements for this coordinator
    Announcement::factory()->count(3)->pending()->create(['user_id' => $coordinator->id]);
    Announcement::factory()->count(5)->approved()->create(['user_id' => $coordinator->id]);
    Announcement::factory()->count(2)->rejected()->create(['user_id' => $coordinator->id]);
    
    // Create announcements for other coordinator (should not be counted)
    Announcement::factory()->count(4)->pending()->create(['user_id' => $otherCoordinator->id]);
    Announcement::factory()->count(6)->approved()->create(['user_id' => $otherCoordinator->id]);
    Announcement::factory()->count(1)->rejected()->create(['user_id' => $otherCoordinator->id]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('announcement_distribution.pending', 3)
            ->where('announcement_distribution.approved', 5)
            ->where('announcement_distribution.rejected', 2)
    );
});

test('coordinator dashboard returns empty announcement distribution when no announcements exist', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('announcement_distribution.pending', 0)
            ->where('announcement_distribution.approved', 0)
            ->where('announcement_distribution.rejected', 0)
    );
});

test('coordinator dashboard returns 5 most recent announcements ordered by created_at DESC', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create 8 announcements with different timestamps
    $announcements = [];
    for ($i = 0; $i < 8; $i++) {
        $announcements[] = Announcement::factory()->create([
            'user_id' => $coordinator->id,
            'created_at' => now()->subDays($i),
        ]);
    }
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('recent_announcements', 5)
            ->where('recent_announcements.0.id', $announcements[0]->id)
            ->where('recent_announcements.1.id', $announcements[1]->id)
            ->where('recent_announcements.2.id', $announcements[2]->id)
            ->where('recent_announcements.3.id', $announcements[3]->id)
            ->where('recent_announcements.4.id', $announcements[4]->id)
    );
});

test('coordinator dashboard recent announcements include required fields', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    Announcement::factory()->create([
        'user_id' => $coordinator->id,
        'title' => 'Test Announcement',
        'status' => 'pending',
    ]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('recent_announcements.0.id')
            ->has('recent_announcements.0.title')
            ->has('recent_announcements.0.status')
            ->has('recent_announcements.0.created_at')
            ->where('recent_announcements.0.title', 'Test Announcement')
            ->where('recent_announcements.0.status', 'pending')
    );
});

test('coordinator dashboard recent announcements formats date correctly', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    $announcement = Announcement::factory()->create([
        'user_id' => $coordinator->id,
        'created_at' => '2024-01-15 10:30:00',
    ]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('recent_announcements.0.created_at', 'Jan 15, 2024')
    );
});

test('coordinator dashboard only shows their own announcements in recent list', function () {
    $coordinator = User::factory()->coordinator()->create();
    $otherCoordinator = User::factory()->coordinator()->create();
    
    // Create announcements for this coordinator
    $myAnnouncements = Announcement::factory()->count(3)->create([
        'user_id' => $coordinator->id,
    ]);
    
    // Create announcements for other coordinator
    Announcement::factory()->count(5)->create([
        'user_id' => $otherCoordinator->id,
    ]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('recent_announcements', 3)
    );
    
    // Verify all announcements belong to the coordinator
    $recentAnnouncements = $response->viewData('page')['props']['recent_announcements'];
    $myAnnouncementIds = $myAnnouncements->pluck('id')->toArray();
    
    foreach ($recentAnnouncements as $announcement) {
        expect($announcement['id'])->toBeIn($myAnnouncementIds);
    }
});

test('coordinator dashboard returns empty array when coordinator has no announcements', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create announcements for other coordinator
    $otherCoordinator = User::factory()->coordinator()->create();
    Announcement::factory()->count(5)->create(['user_id' => $otherCoordinator->id]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('recent_announcements', [])
    );
});

test('coordinator dashboard returns less than 5 announcements when coordinator has fewer', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create only 2 announcements
    Announcement::factory()->count(2)->create(['user_id' => $coordinator->id]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->has('recent_announcements', 2)
    );
});

test('coordinator dashboard announcement distribution matches recent announcements', function () {
    $coordinator = User::factory()->coordinator()->create();
    
    // Create announcements with different statuses
    Announcement::factory()->count(2)->pending()->create(['user_id' => $coordinator->id]);
    Announcement::factory()->count(3)->approved()->create(['user_id' => $coordinator->id]);
    Announcement::factory()->count(1)->rejected()->create(['user_id' => $coordinator->id]);
    
    $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');
    
    // Verify distribution counts
    $response->assertInertia(fn ($page) => 
        $page->component('Coordinator/CoordinatorDashboard')
            ->where('announcement_distribution.pending', 2)
            ->where('announcement_distribution.approved', 3)
            ->where('announcement_distribution.rejected', 1)
    );
    
    // Verify total announcements in recent list (should be 5 or less)
    $recentCount = count($response->viewData('page')['props']['recent_announcements']);
    expect($recentCount)->toBeLessThanOrEqual(5);
    expect($recentCount)->toBe(5); // 2 + 3 + 1 = 6 total, but limited to 5
});
