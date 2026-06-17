<?php

namespace Tests\Feature\Attendance;

use App\Models\Attendance;
use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_teacher_can_view_attendance_page(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        Course::factory()->create(['teacher_id' => $teacher->id]);

        $this->actingAs($teacher)
            ->get(route('attendance.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('attendance/index'));
    }

    public function test_student_cannot_view_attendance_page(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->get(route('attendance.index'))
            ->assertForbidden();
    }

    public function test_teacher_can_save_attendance(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $student = User::factory()->create()->assignRole('student');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);
        $course->students()->attach($student);

        $this->actingAs($teacher)
            ->post(route('attendance.store'), [
                'course_id' => $course->id,
                'date' => '2026-06-17',
                'attendances' => [
                    ['student_id' => $student->id, 'status' => 'present', 'notes' => null],
                ],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('attendances', [
            'course_id' => $course->id,
            'student_id' => $student->id,
            'status' => 'present',
        ]);
    }

    public function test_cannot_save_attendance_for_future_date(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $student = User::factory()->create()->assignRole('student');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);

        $this->actingAs($teacher)
            ->post(route('attendance.store'), [
                'course_id' => $course->id,
                'date' => '2099-01-01',
                'attendances' => [
                    ['student_id' => $student->id, 'status' => 'present', 'notes' => null],
                ],
            ])
            ->assertSessionHasErrors('date');
    }

    public function test_duplicate_attendance_is_updated_not_duplicated(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $student = User::factory()->create()->assignRole('student');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);
        $course->students()->attach($student);

        // First save
        $this->actingAs($teacher)->post(route('attendance.store'), [
            'course_id' => $course->id, 'date' => '2026-06-17',
            'attendances' => [['student_id' => $student->id, 'status' => 'present', 'notes' => null]],
        ]);

        // Second save with different status
        $this->actingAs($teacher)->post(route('attendance.store'), [
            'course_id' => $course->id, 'date' => '2026-06-17',
            'attendances' => [['student_id' => $student->id, 'status' => 'late', 'notes' => null]],
        ]);

        $this->assertEquals(1, Attendance::count());
        $this->assertEquals('late', Attendance::first()->status);
    }
}
