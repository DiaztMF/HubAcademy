<?php

namespace Tests\Feature\LMS;

use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_teacher_can_view_course_index(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        Course::factory()->create(['teacher_id' => $teacher->id]);

        $this->actingAs($teacher)
            ->get(route('lms.courses.index'))
            ->assertOk();
    }

    public function test_student_can_view_course_index(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->get(route('lms.courses.index'))
            ->assertOk();
    }

    public function test_teacher_can_create_course(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');

        $this->actingAs($teacher)
            ->post(route('lms.courses.store'), [
                'title' => 'Mathematics',
                'description' => 'Advanced math course',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('courses', ['title' => 'Mathematics']);
    }

    public function test_student_cannot_create_course(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->post(route('lms.courses.store'), [
                'title' => 'Mathematics',
            ])
            ->assertForbidden();
    }

    public function test_student_can_join_course_with_valid_code(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $student = User::factory()->create()->assignRole('student');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);

        $this->actingAs($student)
            ->post(route('lms.courses.join'), [
                'join_code' => $course->join_code,
            ])
            ->assertRedirect();

        $this->assertTrue($course->fresh()->students->contains($student));
    }

    public function test_cannot_join_with_invalid_code(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->post(route('lms.courses.join'), [
                'join_code' => 'XXXXXX',
            ])
            ->assertSessionHasErrors('join_code');
    }

    public function test_teacher_can_view_course_detail(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);

        $this->actingAs($teacher)
            ->get(route('lms.courses.show', $course))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('lms/show'));
    }

    public function test_teacher_can_view_create_page(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');

        $this->actingAs($teacher)
            ->get(route('lms.courses.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('lms/create'));
    }
}
