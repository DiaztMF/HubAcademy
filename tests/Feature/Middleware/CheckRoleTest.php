<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckRoleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_authenticated_user_can_access_dashboard(): void
    {
        $user = User::factory()->create()->assignRole('student');

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();
    }
}
