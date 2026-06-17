<?php

namespace Tests\Feature\Logbook;

use App\Models\Logbook;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class LogbookTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_student_can_view_own_logbook(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->get(route('logbook.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('logbook/index'));
    }

    public function test_student_can_create_logbook_entry(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->post(route('logbook.store'), [
                'date' => '2026-06-17',
                'summary' => 'Today I learned Laravel.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('logbooks', [
            'student_id' => $student->id,
            'summary' => 'Today I learned Laravel.',
        ]);
    }

    public function test_student_can_upload_photo_with_logbook(): void
    {
        $student = User::factory()->create()->assignRole('student');
        $file = UploadedFile::fake()->image('activity.jpg');

        $this->actingAs($student)
            ->post(route('logbook.store'), [
                'date' => '2026-06-17',
                'summary' => 'Activity with photo',
                'photo' => $file,
            ])
            ->assertRedirect();

        $logbook = Logbook::first();
        $this->assertNotNull($logbook->photo_path);
        $this->assertStringStartsWith('logbooks/', $logbook->photo_path);
    }

    public function test_teacher_cannot_create_logbook(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');

        $this->actingAs($teacher)
            ->post(route('logbook.store'), [
                'date' => '2026-06-17',
                'summary' => 'Should fail.',
            ])
            ->assertForbidden();
    }

    public function test_teacher_can_verify_logbook(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $student = User::factory()->create()->assignRole('student');
        $logbook = Logbook::factory()->create([
            'student_id' => $student->id,
            'date' => '2026-06-17',
            'summary' => 'Test entry',
        ]);

        $this->actingAs($teacher)
            ->post(route('logbook.verify', $logbook), [
                'feedback' => 'Good work!',
            ])
            ->assertRedirect();

        $this->assertNotNull($logbook->fresh()->verified_at);
        $this->assertEquals('Good work!', $logbook->fresh()->feedback);
    }

    public function test_student_cannot_verify_logbook(): void
    {
        $student = User::factory()->create()->assignRole('student');
        $logbook = Logbook::factory()->create([
            'student_id' => $student->id,
            'date' => '2026-06-17',
            'summary' => 'Test entry',
        ]);

        $this->actingAs($student)
            ->post(route('logbook.verify', $logbook), [
                'feedback' => 'Should fail.',
            ])
            ->assertForbidden();
    }

    public function test_cannot_create_logbook_for_future_date(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->post(route('logbook.store'), [
                'date' => '2099-01-01',
                'summary' => 'Future entry.',
            ])
            ->assertSessionHasErrors('date');
    }
}
