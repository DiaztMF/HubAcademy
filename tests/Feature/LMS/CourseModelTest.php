<?php

namespace Tests\Feature\LMS;

use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_course_creates_unique_join_code(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);
        $this->assertNotNull($course->join_code);
        $this->assertEquals(6, strlen($course->join_code));
    }

    public function test_course_belongs_to_teacher(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);
        $this->assertTrue($course->teacher->is($teacher));
    }

    public function test_student_can_enroll_in_course(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $student = User::factory()->create()->assignRole('student');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);
        $course->students()->attach($student);
        $this->assertTrue($course->students->contains($student));
    }

    public function test_course_has_sections(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);
        $section = $course->sections()->create(['title' => 'Week 1', 'order' => 1]);
        $this->assertTrue($course->fresh()->sections->contains($section));
    }
}
