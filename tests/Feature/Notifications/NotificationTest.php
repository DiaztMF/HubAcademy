<?php

namespace Tests\Feature\Notifications;

use App\Models\User;
use App\Notifications\TestNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_guest_cannot_view_notifications()
    {
        $response = $this->get(route('notifications.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_notifications_page()
    {
        $this->actingAs($this->user);
        $this->user->notify(new TestNotification());

        $response = $this->get(route('notifications.index'));

        $response->assertOk();
    }

    public function test_unread_count_returns_json()
    {
        $this->actingAs($this->user);
        $this->user->notify(new TestNotification());

        $response = $this->getJson(route('notifications.unread-count'));

        $response->assertOk();
        $response->assertJsonStructure(['count']);
        $response->assertJson(['count' => 1]);
    }

    public function test_can_mark_single_notification_as_read()
    {
        $this->actingAs($this->user);
        $this->user->notify(new TestNotification());

        $notification = $this->user->notifications()->first();

        $response = $this->post(route('notifications.read', $notification->id));

        $response->assertSuccessful();
        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_can_mark_all_notifications_as_read()
    {
        $this->actingAs($this->user);
        $this->user->notify(new TestNotification());
        $this->user->notify(new TestNotification());

        $response = $this->post(route('notifications.read-all'));

        $response->assertSuccessful();
        $this->assertEquals(0, $this->user->unreadNotifications()->count());
    }
}
