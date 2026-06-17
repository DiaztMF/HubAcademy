<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class UserImportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_admin_can_access_import_page(): void
    {
        $admin = User::factory()->create()->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('admin.import.users'))
            ->assertOk();
    }

    public function test_non_admin_cannot_access_import_page(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->get(route('admin.import.users'))
            ->assertForbidden();
    }

    public function test_admin_can_import_users_from_csv(): void
    {
        $admin = User::factory()->create()->assignRole('admin');

        $csv = "name,email,nisn,class,major\n" .
               "Adi Pratama,adi@test.com,1234567890,X-A,IPA\n" .
               "Budi Santoso,budi@test.com,0987654321,XI-B,IPS";

        $file = UploadedFile::fake()->createWithContent('users.csv', $csv);

        $response = $this->actingAs($admin)
            ->post(route('admin.import.users'), [
                'file' => $file,
                'role' => 'student',
            ]);

        $response->assertRedirect(route('admin.import.users'));

        $this->assertDatabaseHas('users', ['email' => 'adi@test.com']);
        $this->assertDatabaseHas('users', ['email' => 'budi@test.com']);

        $adi = User::where('email', 'adi@test.com')->first();
        $this->assertTrue($adi->hasRole('student'));
    }
}
