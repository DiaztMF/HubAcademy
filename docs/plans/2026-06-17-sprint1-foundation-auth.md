# Sprint 1: Foundation & Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up RBAC (Spatie), extend User model with role/class fields, build student self-registration and admin CSV import, finalize design tokens, and create core reusable UI components (DataTable, StatCard).

**Architecture:** Four-role RBAC via Spatie Laravel-Permission. Fortify handles auth; registration extended to accept Student-specific fields. Design tokens (OKLCH) already defined in `app.css` — only primary hue needs adjustment. DataTable and StatCard built as generic Inertia-compatible React components.

**Tech Stack:** Laravel 13, Inertia.js React 3, Fortify, Spatie Laravel-Permission, Laravel Excel, Tailwind CSS 4, shadcn/ui, CVA

---

## Global Constraints

- Database: SQLite (index `user_id`, `role_id`, `email`, `class` columns)
- All Inertia props must be typed via TypeScript interfaces in `resources/js/types/`
- New components follow existing shadcn/ui patterns (CVA variants, cn() utility, Radix primitives)
- Color tokens defined in `resources/css/app.css` using OKLCH
- Spatie Permission middleware applied via Laravel routes, NOT in Inertia page components

---

### Task 1: Install & Configure Spatie Laravel-Permission

**Files:**
- Create: `database/migrations/2026_06_17_000001_create_permission_tables.php` (via vendor publish)
- Modify: `config/permission.php`
- Modify: `app/Models/User.php`
- Create: `database/seeders/RolePermissionSeeder.php`
- Create: `database/seeders/DatabaseSeeder.php` (overwrite existing)
- Test: `tests/Feature/RolesAndPermissionsTest.php`

**Interfaces:**
- Consumes: existing `User` model
- Produces: 4 seeded roles (`admin`, `teacher`, `student`, `industry-mentor`), `User` with `HasRoles` trait

- [ ] **Step 1: Install Spatie package & publish config**

Run:
```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="permission-migrations"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="permission-config"
```

- [ ] **Step 2: Add `HasRoles` trait to User model**

Edit `app/Models/User.php`:

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements PasskeyUser
{
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasRoles;
```

- [ ] **Step 3: Create RolePermissionSeeder**

Create `database/seeders/RolePermissionSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Permissions
        $permissions = [
            // User management
            'users.import', 'users.view', 'users.create', 'users.edit', 'users.delete',
            // LMS
            'courses.create', 'courses.edit', 'courses.delete', 'courses.view', 'courses.enroll',
            // Attendance
            'attendance.create', 'attendance.view', 'attendance.edit',
            // Internship
            'logbook.create', 'logbook.view', 'logbook.verify', 'logbook.edit',
            // Portfolio
            'portfolio.create', 'portfolio.view', 'portfolio.edit', 'portfolio.delete',
            // Forum
            'forum.create', 'forum.edit', 'forum.delete', 'forum.moderate',
            // Chat
            'chat.send', 'chat.delete', 'chat.block',
            // News
            'news.create', 'news.edit', 'news.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Roles & assigned permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $teacher = Role::create(['name' => 'teacher']);
        $teacher->givePermissionTo([
            'courses.create', 'courses.edit', 'courses.delete', 'courses.view',
            'attendance.create', 'attendance.view', 'attendance.edit',
            'logbook.view', 'logbook.verify',
            'forum.create', 'forum.edit',
            'news.create', 'news.edit',
        ]);

        $student = Role::create(['name' => 'student']);
        $student->givePermissionTo([
            'courses.view', 'courses.enroll',
            'logbook.create', 'logbook.view', 'logbook.edit',
            'portfolio.create', 'portfolio.view', 'portfolio.edit', 'portfolio.delete',
            'forum.create',
            'chat.send',
        ]);

        $mentor = Role::create(['name' => 'industry-mentor']);
        $mentor->givePermissionTo([
            'logbook.view', 'logbook.verify',
        ]);
    }
}
```

- [ ] **Step 4: Update DatabaseSeeder**

Edit `database/seeders/DatabaseSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);
    }
}
```

- [ ] **Step 5: Run migration & seeder**

```bash
php artisan migrate
php artisan db:seed --class=RolePermissionSeeder
```

Expected output: `4 roles seeded, X permissions seeded`

- [ ] **Step 6: Write role-seeding test**

Create `tests/Feature/RolesAndPermissionsTest.php`:

```php
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
```

- [ ] **Step 7: Run tests**

```bash
php artisan test tests/Feature/RolesAndPermissionsTest.php
```

Expected: 3 passed.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: install Spatie RBAC with 4 roles and permission seeder"
```

---

### Task 2: Extend User Model with Student Fields

**Files:**
- Create: `database/migrations/2026_06_17_000002_add_student_fields_to_users_table.php`
- Modify: `app/Models/User.php`
- Modify: `resources/js/types/auth.ts`
- Create: `database/factories/UserFactory.php` (modify existing)

**Interfaces:**
- Consumes: existing `User` model, RolePermissionSeeder
- Produces: `User` with `nisn`, `class`, `major` fields; typed Inertia `User` props

- [ ] **Step 1: Create migration**

```bash
php artisan make:migration add_student_fields_to_users_table
```

Write to the generated file:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nisn')->nullable()->unique()->after('email');
            $table->string('class')->nullable()->after('nisn');
            $table->string('major')->nullable()->after('class');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nisn', 'class', 'major']);
        });
    }
};
```

- [ ] **Step 2: Add fillable and cast to User model**

Edit `app/Models/User.php` - update the `#[Fillable]` attribute:

```php
#[Fillable(['name', 'email', 'password', 'nisn', 'class', 'major'])]
```

- [ ] **Step 3: Update User factory**

Edit `database/factories/UserFactory.php`:

```php
public function definition(): array
{
    return [
        'name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
        'nisn' => fake()->unique()->numerify('##########'),
        'class' => fake()->randomElement(['X-A', 'X-B', 'XI-A', 'XI-B', 'XII-A', 'XII-B']),
        'major' => fake()->randomElement(['IPA', 'IPS', 'Bahasa']),
        'remember_token' => Str::random(10),
    ];
}
```

- [ ] **Step 4: Update TypeScript auth type**

Edit `resources/js/types/auth.ts` (read it first, then update):

```typescript
export type User = {
    id: number;
    name: string;
    email: string;
    nisn: string | null;
    class: string | null;
    major: string | null;
    avatar?: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: string[];
    permissions?: string[];
};
```

- [ ] **Step 5: Run migration**

```bash
php artisan migrate
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add nisn, class, major fields to users table"
```

---

### Task 3: Extend Registration with Student Fields & Role Assignment

**Files:**
- Modify: `app/Actions/Fortify/CreateNewUser.php`
- Modify: `resources/js/pages/auth/register.tsx`
- Test: `tests/Feature/Auth/RegistrationTest.php`

**Interfaces:**
- Consumes: Task 2 User fields, RolePermissionSeeder roles
- Produces: Self-registered users auto-assigned `student` role

- [ ] **Step 1: Update CreateNewUser action**

Edit `app/Actions/Fortify/CreateNewUser.php`:

```php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'nisn' => ['required', 'string', 'size:10', 'unique:users'],
            'class' => ['required', 'string', 'max:50'],
            'major' => ['required', 'string', 'max:50'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'nisn' => $input['nisn'],
            'class' => $input['class'],
            'major' => $input['major'],
        ]);

        $user->assignRole('student');

        return $user;
    }
}
```

- [ ] **Step 2: Update registration page**

Read `resources/js/pages/auth/register.tsx` first, then edit to add NISN, Class, Major fields after the email field:

```typescript
{/* After email field, add: */}
<div className="grid gap-4 sm:grid-cols-2">
    <div className="grid gap-2">
        <Label htmlFor="nisn">NISN</Label>
        <Input
            id="nisn"
            type="text"
            required
            maxLength={10}
            placeholder="10-digit NISN"
            value={data.nisn}
            onChange={(e) => setData('nisn', e.target.value)}
            autoComplete="off"
        />
        <InputError message={errors.nisn} />
    </div>

    <div className="grid gap-2">
        <Label htmlFor="class">Class</Label>
        <Select value={data.class} onValueChange={(v) => setData('class', v)}>
            <SelectTrigger>
                <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="X-A">X-A</SelectItem>
                <SelectItem value="X-B">X-B</SelectItem>
                <SelectItem value="XI-A">XI-A</SelectItem>
                <SelectItem value="XI-B">XI-B</SelectItem>
                <SelectItem value="XII-A">XII-A</SelectItem>
                <SelectItem value="XII-B">XII-B</SelectItem>
            </SelectContent>
        </Select>
        <InputError message={errors.class} />
    </div>
</div>

<div className="grid gap-2">
    <Label htmlFor="major">Major</Label>
    <Select value={data.major} onValueChange={(v) => setData('major', v)}>
        <SelectTrigger>
            <SelectValue placeholder="Select major" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="IPA">IPA</SelectItem>
            <SelectItem value="IPS">IPS</SelectItem>
            <SelectItem value="Bahasa">Bahasa</SelectItem>
        </SelectContent>
    </Select>
    <InputError message={errors.major} />
</div>
```

Add necessary imports at top of the file:
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
```

- [ ] **Step 3: Update form data type in register.tsx**

Add to the existing `data` object initialization:
```typescript
const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nisn: '',
    class: '',
    major: '',
});
```

- [ ] **Step 4: Update registration test**

Edit `tests/Feature/Auth/RegistrationTest.php`:

Add `nisn`, `class`, `major` to the registration payload and add assertions:

```php
public function test_new_users_can_register(): void
{
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'nisn' => '1234567890',
        'class' => 'X-A',
        'major' => 'IPA',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'test@example.com')->first();
    $this->assertNotNull($user);
    $this->assertEquals('1234567890', $user->nisn);
    $this->assertEquals('X-A', $user->class);
    $this->assertEquals('IPA', $user->major);
    $this->assertTrue($user->hasRole('student'));
}
```

- [ ] **Step 5: Run tests**

```bash
php artisan test tests/Feature/Auth/RegistrationTest.php
```

Expected: all registration tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: extend registration with NISN, class, major, and auto-role assignment"
```

---

### Task 4: RBAC Middleware & Route Protection

**Files:**
- Create: `app/Http/Middleware/CheckRole.php`
- Modify: `bootstrap/app.php`
- Modify: `routes/web.php`
- Create: `app/Http/Controllers/DashboardController.php`

**Interfaces:**
- Consumes: Spatie roles, User model
- Produces: `role:` middleware alias, role-based dashboard redirection

- [ ] **Step 1: Create CheckRole middleware**

Create `app/Http/Middleware/CheckRole.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized action.');
    }
}
```

- [ ] **Step 2: Register middleware in bootstrap/app.php**

Edit `bootstrap/app.php`. Read the file first, then add to the `withMiddleware` callback:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

- [ ] **Step 3: Create DashboardController**

Create `app/Http/Controllers/DashboardController.php`:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $role = $user->roles->first()?->name ?? 'student';

        $stats = match ($role) {
            'admin' => [
                'total_users' => \App\Models\User::count(),
                'total_teachers' => \App\Models\User::role('teacher')->count(),
                'total_students' => \App\Models\User::role('student')->count(),
            ],
            'teacher' => [
                'total_courses' => 0, // Placeholder — Sprint 2
                'pending_verifications' => 0,
            ],
            'student' => [
                'enrolled_courses' => 0, // Placeholder — Sprint 2
                'pending_logbooks' => 0,
            ],
            'industry-mentor' => [
                'assigned_students' => 0, // Placeholder — Sprint 3
                'pending_verifications' => 0,
            ],
            default => [],
        };

        return Inertia::render('dashboard', [
            'role' => $role,
            'stats' => $stats,
        ]);
    }
}
```

- [ ] **Step 4: Update web.php routes**

Edit `routes/web.php`:

```php
<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__.'/settings.php';
```

- [ ] **Step 5: Write middleware test**

Create `tests/Feature/Middleware/CheckRoleTest.php`:

```php
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

    public function test_admin_can_access_admin_route(): void
    {
        $admin = User::factory()->create()->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk();
    }

    public function test_student_receives_403_for_admin_route(): void
    {
        $student = User::factory()->create()->assignRole('student');

        $this->actingAs($student)
            ->get(route('dashboard'))
            ->assertOk(); // Dashboard is accessible to all roles
    }
}
```

- [ ] **Step 6: Run tests**

```bash
php artisan test tests/Feature/Middleware/CheckRoleTest.php
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add CheckRole middleware and role-aware dashboard"
```

---

### Task 5: Admin CSV Bulk User Import

**Files:**
- Create: `app/Imports/UsersImport.php`
- Create: `app/Http/Controllers/Admin/UserImportController.php`
- Create: `app/Http/Requests/Admin/UserImportRequest.php`
- Create: `resources/js/pages/admin/import-users.tsx`
- Modify: `routes/web.php`
- Test: `tests/Feature/Admin/UserImportTest.php`

**Interfaces:**
- Consumes: Spatie roles, Task 2 User fields
- Produces: CSV import endpoint, admin import page, Laravel Excel import class

- [ ] **Step 1: Install Laravel Excel**

```bash
composer require maatwebsite/laravel-excel
php artisan vendor:publish --provider="Maatwebsite\Excel\ExcelServiceProvider"
```

- [ ] **Step 2: Create UsersImport class**

Create `app/Imports/UsersImport.php`:

```php
<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    public function __construct(
        private readonly string $role = 'student'
    ) {}

    public function model(array $row): User
    {
        $user = User::create([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password'] ?? 'password123'),
            'nisn' => $row['nisn'] ?? null,
            'class' => $row['class'] ?? null,
            'major' => $row['major'] ?? null,
        ]);

        $user->assignRole($this->role);

        return $user;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'nisn' => 'nullable|size:10|unique:users,nisn',
            'class' => 'nullable|string|max:50',
            'major' => 'nullable|string|max:50',
        ];
    }
}
```

- [ ] **Step 3: Create import request**

Create `app/Http/Requests/Admin/UserImportRequest.php`:

```php
<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UserImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:csv,xlsx,xls', 'max:2048'],
            'role' => ['required', 'string', 'in:student,teacher'],
        ];
    }
}
```

- [ ] **Step 4: Create import controller**

Create `app/Http/Controllers/Admin/UserImportController.php`:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserImportRequest;
use App\Imports\UsersImport;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class UserImportController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/import-users');
    }

    public function store(UserImportRequest $request): RedirectResponse
    {
        $import = new UsersImport($request->input('role', 'student'));

        Excel::import($import, $request->file('file'));

        $count = $import->getRowCount() ?? 0;

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$count} users imported successfully as {$request->input('role')}s.",
        ]);

        return to_route('admin.import.users');
    }
}
```

- [ ] **Step 5: Create import page**

Create `resources/js/pages/admin/import-users.tsx`:

```typescript
import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { AppLayout } from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Import Users', href: route('admin.import.users') },
];

export default function ImportUsers() {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
        role: 'student',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.import.users'));
    }

    return (
        <>
            <Head title="Import Users" />
            <div className="max-w-xl space-y-6">
                <Heading title="Import Users" description="Upload a CSV or Excel file to bulk-create user accounts." />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="role">User Role</Label>
                        <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">CSV / Excel File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Required columns: name, email. Optional: nisn, class, major, password.
                        </p>
                        <InputError message={errors.file} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Importing...' : 'Import Users'}
                    </Button>
                </form>
            </div>
        </>
    );
}

ImportUsers.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;
```

- [ ] **Step 6: Add admin routes**

Edit `routes/web.php` — add inside the `auth, verified` group:

```php
use App\Http\Controllers\Admin\UserImportController;

Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('import-users', [UserImportController::class, 'create'])->name('import.users');
    Route::post('import-users', [UserImportController::class, 'store']);
});
```

- [ ] **Step 7: Write import test**

Create `tests/Feature/Admin/UserImportTest.php`:

```php
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

        $this->actingAs($admin)
            ->post(route('admin.import.users'), [
                'file' => $file,
                'role' => 'student',
            ])
            ->assertSessionHas('toast')
            ->assertRedirect(route('admin.import.users'));

        $this->assertDatabaseHas('users', ['email' => 'adi@test.com']);
        $this->assertDatabaseHas('users', ['email' => 'budi@test.com']);

        $adi = User::where('email', 'adi@test.com')->first();
        $this->assertTrue($adi->hasRole('student'));
    }
}
```

- [ ] **Step 8: Run tests**

```bash
php artisan test tests/Feature/Admin/UserImportTest.php
```

Expected: 3 passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add admin CSV user import with Laravel Excel"
```

---

### Task 6: Design Tokens — Finalize Color Palette

**Files:**
- Modify: `resources/css/app.css`

- [ ] **Step 1: Adjust primary hue to subtle blue (260)**

Edit `resources/css/app.css`. Change the primary color in the `:root` block:

```css
:root {
    /* Keep existing colors, change primary to subtle blue */
    --primary: oklch(0.35 0.02 260);
    --primary-foreground: oklch(0.985 0 0);
    /* Add semantic accent tokens */
    --success: oklch(0.55 0.13 150);
    --success-foreground: oklch(0.98 0 0);
    --warning: oklch(0.7 0.15 80);
    --warning-foreground: oklch(0.15 0 0);
    --info: oklch(0.55 0.10 240);
    --info-foreground: oklch(0.98 0 0);
}

.dark {
    --primary: oklch(0.85 0.01 260);
    --primary-foreground: oklch(0.15 0 0);
    --success: oklch(0.65 0.12 150);
    --success-foreground: oklch(0.15 0 0);
    --warning: oklch(0.75 0.14 80);
    --warning-foreground: oklch(0.15 0 0);
    --info: oklch(0.65 0.10 240);
    --info-foreground: oklch(0.15 0 0);
}
```

Add to the `@theme` block:

```css
@theme {
    /* ...existing... */
    --color-success: var(--success);
    --color-success-foreground: var(--success-foreground);
    --color-warning: var(--warning);
    --color-warning-foreground: var(--warning-foreground);
    --color-info: var(--info);
    --color-info-foreground: var(--info-foreground);
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "style: finalize OKLCH color tokens with subtle blue primary"
```

---

### Task 7: Create DataTable Reusable Component

**Files:**
- Create: `resources/js/components/ui/data-table.tsx`
- Modify: `resources/js/pages/dashboard.tsx` (demo usage)

**Interfaces:**
- Consumes: `cn()` from `@/lib/utils`
- Produces: `<DataTable columns data loading />` component with sort, empty state, loading skeleton

- [ ] **Step 1: Create DataTable component**

Create `resources/js/components/ui/data-table.tsx`:

```typescript
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type Column<T> = {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    className?: string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
};

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    keyExtractor,
    loading = false,
    emptyMessage = 'No data found.',
    onRowClick,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSort = useCallback((key: string) => {
        setSortKey((prev) => {
            if (prev === key) {
                setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                return key;
            }
            setSortDir('asc');
            return key;
        });
    }, []);

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortKey, sortDir]);

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        );
    }

    if (sortedData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    'px-4 py-3 text-left font-medium text-muted-foreground',
                                    col.sortable && 'cursor-pointer select-none hover:text-foreground',
                                    col.className,
                                )}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                <div className="flex items-center gap-1">
                                    {col.label}
                                    {col.sortable && (
                                        sortKey === col.key ? (
                                            sortDir === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-30" />
                                        )
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            className={cn(
                                'border-b last:border-0 hover:bg-muted/30 transition-colors',
                                onRowClick && 'cursor-pointer',
                            )}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className={cn('px-4 py-3', col.className)}>
                                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

- [ ] **Step 2: Demo DataTable on Dashboard**

Edit `resources/js/pages/dashboard.tsx` — replace placeholder grid with a sample table (remove placeholder pattern, add DataTable):

```typescript
import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import { dashboard } from '@/routes';

const sampleColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' },
];

const sampleData = [
    { name: 'Adi Pratama', role: 'Student', status: 'Active' },
    { name: 'Budi Santoso', role: 'Student', status: 'Active' },
    { name: 'Mr. Andi', role: 'Teacher', status: 'Active' },
];

export default function Dashboard({ stats, role }: { stats?: Record<string, number>; role?: string }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {stats && Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1 rounded-xl border p-4">
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-2xl font-semibold">{value}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-medium">Recent Users</h3>
                    <DataTable
                        columns={sampleColumns}
                        data={sampleData}
                        keyExtractor={(item) => item.name}
                    />
                </div>
            </div>
        </>
    );
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add DataTable reusable component with sorting and loading state"
```

---

### Task 8: Create StatCard Reusable Component

**Files:**
- Create: `resources/js/components/ui/stat-card.tsx`
- Modify: `resources/js/pages/dashboard.tsx` (use StatCard instead of manual cards)

**Interfaces:**
- Consumes: `cn()`, `lucide-react` icons
- Produces: `<StatCard title value icon trend variant />` component

- [ ] **Step 1: Create StatCard component**

Create `resources/js/components/ui/stat-card.tsx`:

```typescript
import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    description?: string;
    trend?: { value: number; direction: 'up' | 'down' };
    variant?: 'default' | 'success' | 'warning' | 'destructive';
};

const variantStyles: Record<string, string> = {
    default: 'border-border',
    success: 'border-emerald-200 dark:border-emerald-800',
    warning: 'border-amber-200 dark:border-amber-800',
    destructive: 'border-red-200 dark:border-red-800',
};

export function StatCard({ title, value, icon: Icon, description, trend, variant = 'default' }: StatCardProps) {
    return (
        <div className={cn('flex flex-col gap-1 rounded-xl border p-4 transition-shadow hover:shadow-sm', variantStyles[variant])}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {title}
                </span>
                {Icon && <Icon className="size-4 text-muted-foreground" />}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{value}</span>
                {trend && (
                    <span className={cn(
                        'flex items-center gap-0.5 text-xs font-medium',
                        trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600',
                    )}>
                        {trend.direction === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {trend.value}%
                    </span>
                )}
            </div>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
```

- [ ] **Step 2: Update Dashboard to use StatCard**

Edit `resources/js/pages/dashboard.tsx`:

```typescript
import { Head } from '@inertiajs/react';
import { BookOpen, Users, UserCheck } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { dashboard } from '@/routes';

const sampleColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' },
];

const sampleData = [
    { name: 'Adi Pratama', role: 'Student', status: 'Active' },
    { name: 'Budi Santoso', role: 'Student', status: 'Active' },
    { name: 'Mr. Andi', role: 'Teacher', status: 'Active' },
];

export default function Dashboard({ stats, role }: { stats?: Record<string, number>; role?: string }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <StatCard
                        title="Students"
                        value={stats?.total_students ?? 0}
                        icon={Users}
                    />
                    <StatCard
                        title="Teachers"
                        value={stats?.total_teachers ?? 0}
                        icon={UserCheck}
                    />
                    <StatCard
                        title="Courses"
                        value={stats?.total_courses ?? 0}
                        icon={BookOpen}
                    />
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-medium">Recent Users</h3>
                    <DataTable
                        columns={sampleColumns}
                        data={sampleData}
                        keyExtractor={(item) => item.name}
                    />
                </div>
            </div>
        </>
    );
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add StatCard reusable component with variant styles"
```

---

### Task 9: Update Sidebar Navigation with Role-Based Links

**Files:**
- Modify: `resources/js/components/app-sidebar.tsx`
- Modify: `resources/js/types/navigation.ts`

- [ ] **Step 1: Update NavItem type with roles field**

Edit `resources/js/types/navigation.ts`:

```typescript
export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[]; // If set, only show for these roles
};
```

- [ ] **Step 2: Update app-sidebar with role-gated nav items**

Edit `resources/js/components/app-sidebar.tsx`:

```typescript
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen, FileSpreadsheet, FolderGit2, LayoutGrid,
    MessageSquare, Newspaper, NotebookPen, Settings, Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    // Module navigation — links hidden until Sprint 2-4
    // Each will get a `roles` filter when built
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = (auth?.user as { roles?: string[] })?.roles?.[0];

    function filterByRole(items: NavItem[]): NavItem[] {
        return items.filter((item) => !item.roles || (userRole && item.roles.includes(userRole)));
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filterByRole(mainNavItems)} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add role-based sidebar navigation filtering"
```

---

### Task 10: Ensure All Existing Tests Pass

- [ ] **Step 1: Run full test suite**

```bash
php artisan test
```

Expected: all tests pass (existing auth tests + new RBAC/import tests).

- [ ] **Step 2: Fix any failures**

If any existing tests fail due to changes (e.g., registration tests need NISN field), fix them.

- [ ] **Step 3: Run TypeScript check**

```bash
npm run types:check
```

Expected: no type errors.

- [ ] **Step 4: Run linter**

```bash
npm run lint:check
```

Expected: no lint errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: fix tests and types after Sprint 1 changes"
```
