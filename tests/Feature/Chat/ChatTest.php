<?php

namespace Tests\Feature\Chat;

use App\Models\ChatConversation;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_user_can_view_chat_index(): void
    {
        $user = User::factory()->create()->assignRole('student');

        $this->actingAs($user)
            ->get(route('chat.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('chat/index'));
    }

    public function test_user_can_start_conversation(): void
    {
        $user = User::factory()->create()->assignRole('student');
        $recipient = User::factory()->create()->assignRole('student');

        $this->actingAs($user)
            ->post(route('chat.store'), ['recipient_id' => $recipient->id])
            ->assertRedirect();

        $this->assertDatabaseHas('chat_participants', [
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseHas('chat_participants', [
            'user_id' => $recipient->id,
        ]);
    }

    public function test_user_can_send_message(): void
    {
        $user = User::factory()->create()->assignRole('student');
        $recipient = User::factory()->create()->assignRole('student');

        $conversation = ChatConversation::create();
        $conversation->participants()->attach([$user->id, $recipient->id]);

        $this->actingAs($user)
            ->post(route('chat.send', $conversation), ['content' => 'Hello!'])
            ->assertRedirect();

        $this->assertDatabaseHas('chat_messages', [
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'content' => 'Hello!',
        ]);
    }

    public function test_user_cannot_view_conversation_not_belonging_to(): void
    {
        $user = User::factory()->create()->assignRole('student');
        $otherUser = User::factory()->create()->assignRole('student');
        $stranger = User::factory()->create()->assignRole('student');

        $conversation = ChatConversation::create();
        $conversation->participants()->attach([$user->id, $otherUser->id]);

        $this->actingAs($stranger)
            ->get(route('chat.show', $conversation))
            ->assertForbidden();
    }
}
