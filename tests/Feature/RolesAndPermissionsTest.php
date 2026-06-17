<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolesAndPermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_roles_are_seeded(): void
    {
        $this->assertDatabaseHas('roles', ['name' => 'admin']);
        $this->assertDatabaseHas('roles', ['name' => 'teacher']);
        $this->assertDatabaseHas('roles', ['name' => 'student']);
        $this->assertDatabaseHas('roles', ['name' => 'industry-mentor']);
    }

    public function test_admin_has_all_permissions(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->assertTrue($admin->hasPermissionTo('users.import'));
        $this->assertTrue($admin->hasPermissionTo('courses.create'));
        $this->assertTrue($admin->hasPermissionTo('news.delete'));
    }

    public function test_student_cannot_verify_logbook(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $this->assertFalse($student->hasPermissionTo('logbook.verify'));
    }
}
