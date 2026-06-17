# Sprint 2: LMS Engine & Attendance Ledger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Learning Management System (Course → Section → Topic) with join code enrollment, and the Teacher-driven Attendance system with backdated date support.

**Architecture:** Three new models (Course, Section, Topic) with nested relationships. Pivot table `course_student` for enrollment via unique join codes. Attendance model with per-student status per date. All backed by SQLite with indexes on high-frequency columns.

**Tech Stack:** Laravel 13, Inertia.js React, Tailwind CSS 4, SQLite, `react-markdown` + `remark-gfm` for LMS content rendering, Radix UI Calendar component for date picking.

---

### Task 1: Create LMS Migrations & Models

**Files:**
- Create: `database/migrations/2026_06_17_100001_create_courses_table.php`
- Create: `database/migrations/2026_06_17_100002_create_sections_table.php`
- Create: `database/migrations/2026_06_17_100003_create_topics_table.php`
- Create: `database/migrations/2026_06_17_100004_create_course_student_table.php`
- Create: `app/Models/Course.php`
- Create: `app/Models/Section.php`
- Create: `app/Models/Topic.php`
- Modify: `app/Models/User.php`
- Test: `tests/Feature/LMS/CourseModelTest.php`

- [ ] **Step 1: Create courses migration**

```php
Schema::create('courses', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('join_code', 8)->unique();
    $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
    $table->index('join_code');
    $table->index('teacher_id');
});
```

- [ ] **Step 2: Create sections migration**

```php
Schema::create('sections', function (Blueprint $table) {
    $table->id();
    $table->foreignId('course_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->integer('order')->default(0);
    $table->timestamps();
    $table->index('course_id');
});
```

- [ ] **Step 3: Create topics migration**

```php
Schema::create('topics', function (Blueprint $table) {
    $table->id();
    $table->foreignId('section_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->longText('content_markdown')->nullable();
    $table->string('embed_link')->nullable();
    $table->integer('order')->default(0);
    $table->timestamps();
    $table->index('section_id');
});
```

- [ ] **Step 4: Create course_student pivot migration**

```php
Schema::create('course_student', function (Blueprint $table) {
    $table->foreignId('course_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->primary(['course_id', 'user_id']);
    $table->timestamps();
});
```

- [ ] **Step 5: Create Course model**

```php
class Course extends Model
{
    protected $fillable = ['title', 'description', 'join_code', 'teacher_id'];

    public function sections(): HasMany { return $this->hasMany(Section::class)->orderBy('order'); }
    public function teacher(): BelongsTo { return $this->belongsTo(User::class, 'teacher_id'); }
    public function students(): BelongsToMany { return $this->belongsToMany(User::class, 'course_student')->withTimestamps(); }

    protected static function booted(): void
    {
        static::creating(function (Course $course) {
            $course->join_code = strtoupper(Str::random(6));
        });
    }
}
```

- [ ] **Step 6: Create Section model**

```php
class Section extends Model
{
    protected $fillable = ['course_id', 'title', 'order'];
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function topics(): HasMany { return $this->hasMany(Topic::class)->orderBy('order'); }
}
```

- [ ] **Step 7: Create Topic model**

```php
class Topic extends Model
{
    protected $fillable = ['section_id', 'title', 'content_markdown', 'embed_link', 'order'];
    public function section(): BelongsTo { return $this->belongsTo(Section::class); }
}
```

- [ ] **Step 8: Add courses relationship to User model**

Add to `app/Models/User.php`:
```php
public function taughtCourses(): HasMany { return $this->hasMany(Course::class, 'teacher_id'); }
public function enrolledCourses(): BelongsToMany { return $this->belongsToMany(Course::class, 'course_student')->withTimestamps(); }
```

Add imports:
```php
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
```

- [ ] **Step 9: Run migrations**

```bash
php artisan migrate
```

- [ ] **Step 10: Write model test**

```php
class CourseModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
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
}
```

- [ ] **Step 11: Create Course factory**

```bash
php artisan make:factory CourseFactory --model=Course
```

With content:
```php
public function definition(): array
{
    return [
        'title' => fake()->sentence(3),
        'description' => fake()->paragraph(),
        'join_code' => strtoupper(Str::random(6)),
        'teacher_id' => User::factory(),
    ];
}
```

- [ ] **Step 12: Run tests**

```bash
php artisan test tests/Feature/LMS/CourseModelTest.php
```

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add LMS models - Course, Section, Topic with migrations"
```

---

### Task 2: Install react-markdown & Build Topic Reader

**Files:**
- Modify: `package.json`
- Create: `resources/js/components/lms/topic-reader.tsx`
- Create: `resources/js/components/lms/course-card.tsx`
- Create: `resources/js/components/lms/section-list.tsx`

- [ ] **Step 1: Install react-markdown**

```bash
npm install react-markdown remark-gfm
```

- [ ] **Step 2: Create TopicReader component**

Create `resources/js/components/lms/topic-reader.tsx`:
```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type TopicReaderProps = {
    title: string;
    contentMarkdown: string;
    embedLink?: string | null;
};

export function TopicReader({ title, contentMarkdown, embedLink }: TopicReaderProps) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {contentMarkdown}
                </ReactMarkdown>
            </div>
            {embedLink && (
                <div className="aspect-video overflow-hidden rounded-lg border">
                    <iframe
                        src={embedLink}
                        className="size-full"
                        allowFullScreen
                        title="Embedded content"
                    />
                </div>
            )}
        </div>
    );
}
```

- [ ] **Step 3: Create CourseCard component**

```typescript
// resources/js/components/lms/course-card.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CourseCardProps = {
    title: string;
    teacherName: string;
    joinCode: string;
    studentCount: number;
    onClick?: () => void;
};

export function CourseCard({ title, teacherName, joinCode, studentCount, onClick }: CourseCardProps) {
    return (
        <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{teacherName}</p>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">{joinCode}</Badge>
                    <span className="text-xs text-muted-foreground">{studentCount} students</span>
                </div>
            </CardContent>
        </Card>
    );
}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add react-markdown, TopicReader, and CourseCard components"
```

---

### Task 3: Build LMS Controllers & Routes

**Files:**
- Create: `app/Http/Controllers/LMS/CourseController.php`
- Create: `app/Http/Controllers/LMS/TopicController.php`
- Create: `app/Http/Requests/LMS/StoreCourseRequest.php`
- Create: `app/Http/Requests/LMS/JoinCourseRequest.php`
- Modify: `routes/web.php`
- Create: `resources/js/pages/lms/index.tsx`
- Create: `resources/js/pages/lms/show.tsx`
- Create: `resources/js/pages/lms/topics/show.tsx`
- Create: `app/Http/Controllers/LMS/CourseEnrollmentController.php`
- Test: `tests/Feature/LMS/CourseControllerTest.php`

- [ ] **Step 1: Create StoreCourseRequest**

```php
class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasRole('teacher'); }
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
        ];
    }
}
```

- [ ] **Step 2: Create JoinCourseRequest**

```php
class JoinCourseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'join_code' => 'required|string|size:6|exists:courses,join_code',
        ];
    }
}
```

- [ ] **Step 3: Create CourseController**

```php
class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->hasRole('teacher')) {
            $courses = $user->taughtCourses()->with('teacher')->get();
        } else {
            $courses = $user->enrolledCourses()->with('teacher')->get();
        }
        return Inertia::render('lms/index', ['courses' => $courses]);
    }

    public function create(): Response { return Inertia::render('lms/create'); }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $course = $request->user()->taughtCourses()->create($request->validated());
        return to_route('lms.courses.show', $course);
    }

    public function show(Course $course)
    {
        $course->load(['sections.topics', 'teacher', 'students']);
        return Inertia::render('lms/show', ['course' => $course]);
    }
}
```

- [ ] **Step 4: Create CourseEnrollmentController**

```php
class CourseEnrollmentController extends Controller
{
    public function store(JoinCourseRequest $request): RedirectResponse
    {
        $course = Course::where('join_code', $request->join_code)->firstOrFail();
        if ($request->user()->enrolledCourses()->where('course_id', $course->id)->exists()) {
            return back()->withErrors(['join_code' => 'Already enrolled in this course.']);
        }
        $request->user()->enrolledCourses()->attach($course);
        return to_route('lms.courses.show', $course);
    }
}
```

- [ ] **Step 5: Create TopicController**

```php
class TopicController extends Controller
{
    public function show(Course $course, Topic $topic)
    {
        $topic->load('section.course.teacher');
        return Inertia::render('lms/topics/show', ['topic' => $topic]);
    }
}
```

- [ ] **Step 6: Add routes**

In `routes/web.php`, inside `auth, verified` group:

```php
use App\Http\Controllers\LMS\CourseController;
use App\Http\Controllers\LMS\CourseEnrollmentController;
use App\Http\Controllers\LMS\TopicController;

Route::prefix('lms')->name('lms.')->group(function () {
    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('courses/create', [CourseController::class, 'create'])->name('courses.create')->middleware('role:teacher');
    Route::post('courses', [CourseController::class, 'store'])->name('courses.store')->middleware('role:teacher');
    Route::get('courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::post('courses/join', [CourseEnrollmentController::class, 'store'])->name('courses.join');
    Route::get('courses/{course}/topics/{topic}', [TopicController::class, 'show'])->name('topics.show');
});
```

- [ ] **Step 7: Create LMS index page**

Create `resources/js/pages/lms/index.tsx`:
```typescript
import { Head, Link, router } from '@inertiajs/react';
import { CourseCard } from '@/components/lms/course-card';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard, lmsCoursesIndex, lmsCoursesCreate } from '@/routes';
import { useState } from 'react';

type Course = { id: number; title: string; join_code: string; teacher: { name: string }; students_count?: number };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'My Courses', href: lmsCoursesIndex() },
];

export default function CourseIndex({ courses, canCreate }: { courses: Course[]; canCreate: boolean }) {
    const [joinCode, setJoinCode] = useState('');

    function handleJoin(e: React.FormEvent) {
        e.preventDefault();
        router.post(lmsCoursesJoin(), { join_code: joinCode });
    }

    return (
        <>
            <Head title="My Courses" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="My Courses" description="Browse and manage your courses." />
                    {canCreate && (
                        <Link href={lmsCoursesCreate()}>
                            <Button>+ New Course</Button>
                        </Link>
                    )}
                </div>

                <form onSubmit={handleJoin} className="flex items-end gap-4 rounded-lg border p-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="join_code">Join Course by Code</Label>
                        <Input
                            id="join_code"
                            placeholder="Enter 6-character code"
                            maxLength={6}
                            className="font-mono uppercase"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        />
                    </div>
                    <Button type="submit">Join</Button>
                </form>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            title={course.title}
                            teacherName={course.teacher.name}
                            joinCode={course.join_code}
                            studentCount={course.students_count ?? 0}
                            onClick={() => router.get(lmsCoursesShow(course.id))}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

CourseIndex.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;
```

- [ ] **Step 8: Create LMS show page (course detail)**

Create `resources/js/pages/lms/show.tsx` with section list and topic navigation.

- [ ] **Step 9: Create topic reader page**

Create `resources/js/pages/lms/topics/show.tsx` using TopicReader component.

- [ ] **Step 10: Write controller test**

- [ ] **Step 11: Regenerate Wayfinder + build**

```bash
php artisan wayfinder:generate
npm run build
```

- [ ] **Step 12: Run tests**

```bash
php artisan test tests/Feature/LMS/
```

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add LMS controllers, routes, and pages"
```

---

### Task 4: Build Attendance System

**Files:**
- Create: `database/migrations/2026_06_17_200001_create_attendances_table.php`
- Create: `app/Models/Attendance.php`
- Create: `app/Http/Controllers/AttendanceController.php`
- Create: `app/Http/Requests/AttendanceStoreRequest.php`
- Create: `resources/js/components/attendance/attendance-grid.tsx`
- Create: `resources/js/pages/attendance/index.tsx`
- Modify: `routes/web.php`
- Test: `tests/Feature/Attendance/AttendanceTest.php`

- [ ] **Step 1: Create attendance migration**

```php
Schema::create('attendances', function (Blueprint $table) {
    $table->id();
    $table->foreignId('course_id')->constrained()->cascadeOnDelete();
    $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
    $table->date('date');
    $table->string('status'); // present, late, permit, sick, alpa
    $table->text('notes')->nullable();
    $table->timestamps();
    $table->unique(['course_id', 'student_id', 'date']);
    $table->index('date');
    $table->index('student_id');
});
```

- [ ] **Step 2: Create Attendance model**

```php
class Attendance extends Model
{
    protected $fillable = ['course_id', 'student_id', 'teacher_id', 'date', 'status', 'notes'];
    protected function casts(): array { return ['date' => 'date:Y-m-d']; }
    public function student(): BelongsTo { return $this->belongsTo(User::class, 'student_id'); }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
}
```

- [ ] **Step 3: Create AttendanceStoreRequest**

```php
class AttendanceStoreRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasRole('teacher'); }
    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'date' => 'required|date|before_or_equal:today',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:present,late,permit,sick,alpa',
            'attendances.*.notes' => 'nullable|string|max:500',
        ];
    }
}
```

- [ ] **Step 4: Create AttendanceController**

```php
class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('attendance/index', [
            'courses' => $request->user()->taughtCourses()->with('students')->get(),
        ]);
    }

    public function store(AttendanceStoreRequest $request): RedirectResponse
    {
        $teacher = $request->user();
        $courseId = $request->course_id;
        $date = $request->date;

        foreach ($request->attendances as $att) {
            Attendance::updateOrCreate(
                ['course_id' => $courseId, 'student_id' => $att['student_id'], 'date' => $date],
                ['teacher_id' => $teacher->id, 'status' => $att['status'], 'notes' => $att['notes'] ?? null],
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Attendance saved.']);
        return back();
    }
}
```

- [ ] **Step 5: Create AttendanceGrid component**

Create `resources/js/components/attendance/attendance-grid.tsx`:
A table with student rows and status dropdowns. Include date picker at top.

- [ ] **Step 6: Create attendance page**

Create `resources/js/pages/attendance/index.tsx`.

- [ ] **Step 7: Add attendance routes**

```php
Route::middleware(['role:teacher'])->prefix('attendance')->name('attendance.')->group(function () {
    Route::get('/', [AttendanceController::class, 'index'])->name('index');
    Route::post('/', [AttendanceController::class, 'store'])->name('store');
});
```

- [ ] **Step 8: Run migrations**

```bash
php artisan migrate
```

- [ ] **Step 9: Write attendance test**

- [ ] **Step 10: Wayfinder + build + test**

```bash
php artisan wayfinder:generate
npm run build
php artisan test tests/Feature/Attendance/
```

- [ ] **Step 11: Run full suite**

```bash
php artisan test
```

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add attendance system with backdated date support"
```
