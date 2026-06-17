<?php

namespace Tests\Feature\News;

use App\Models\News;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_public_can_view_news_index(): void
    {
        News::factory()->count(3)->create();

        $this->get(route('news.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('news/index'));
    }

    public function test_public_can_view_single_news(): void
    {
        $news = News::factory()->create();

        $this->get(route('news.show', $news))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('news/show'));
    }

    public function test_public_cannot_view_unpublished_news(): void
    {
        $news = News::factory()->unpublished()->create();

        $this->get(route('news.show', $news))
            ->assertNotFound();
    }

    public function test_admin_can_create_news(): void
    {
        $admin = User::factory()->create()->assignRole('admin');

        $this->actingAs($admin)
            ->post(route('news.store'), [
                'title' => 'Important Announcement',
                'content' => 'This is some important news content.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('news', [
            'title' => 'Important Announcement',
            'user_id' => $admin->id,
        ]);
    }

    public function test_teacher_can_create_news(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');

        $this->actingAs($teacher)
            ->post(route('news.store'), [
                'title' => 'Class Update',
                'content' => 'Update for the class.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('news', [
            'title' => 'Class Update',
        ]);
    }

    public function test_student_cannot_create_news(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->post(route('news.store'), [
                'title' => 'Student News',
                'content' => 'Should not be allowed.',
            ])
            ->assertForbidden();
    }

    public function test_admin_can_view_create_page(): void
    {
        $admin = User::factory()->create()->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('news.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('news/create'));
    }
}
