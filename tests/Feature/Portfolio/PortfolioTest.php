<?php

namespace Tests\Feature\Portfolio;

use App\Models\Portfolio;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_student_can_view_portfolio_index(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->get(route('portfolio.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('portfolio/index'));
    }

    public function test_student_can_create_portfolio(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->post(route('portfolio.store'), [
                'title' => 'My Project',
                'description' => 'A cool project',
                'category' => 'Web App',
                'external_link' => 'https://github.com/test',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('portfolios', [
            'title' => 'My Project',
            'user_id' => $student->id,
        ]);
    }

    public function test_student_can_upload_image_with_portfolio(): void
    {
        $student = User::factory()->create()->assignRole('student');
        $file = UploadedFile::fake()->image('project.png', 200, 200);

        $this->actingAs($student)
            ->post(route('portfolio.store'), [
                'title' => 'With Image',
                'image' => $file,
            ])
            ->assertRedirect();

        $portfolio = Portfolio::first();
        $this->assertNotNull($portfolio->image_path);
        $this->assertStringStartsWith('portfolios/', $portfolio->image_path);
    }

    public function test_teacher_cannot_create_portfolio(): void
    {
        $teacher = User::factory()->create()->assignRole('teacher');

        $this->actingAs($teacher)
            ->post(route('portfolio.store'), [
                'title' => 'My Project',
            ])
            ->assertForbidden();
    }

    public function test_student_can_view_own_portfolio_detail(): void
    {
        $student = User::factory()->create()->assignRole('student');
        $portfolio = Portfolio::factory()->create(['user_id' => $student->id]);

        $this->actingAs($student)
            ->get(route('portfolio.show', $portfolio))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('portfolio/show'));
    }
}
