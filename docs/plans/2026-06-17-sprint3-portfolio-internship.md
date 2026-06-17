# Sprint 3: Portfolio & Internship (PKL Logbook) Implementation Plan

**Goal:** Build the Portfolio submission system and the Internship (PKL) daily logbook with mentor verification workflow.

**Storage strategy:** All file operations go through Laravel's `Storage` facade against a `photos` disk that defaults to `local` (storage/app/public) in development. Cloudflare R2 config is pre-written — swapping to R2/S3 requires only setting env vars and installing `league/flysystem-aws-s3-v3`.

**Tech Stack:** Laravel 13, Inertia.js React, SQLite, Laravel Storage (local dev / R2 production).

---

### Task 1: Filesystem Configuration & Storage Setup

**Files:**
- Modify: `config/filesystems.php`
- Create: `storage/app/public/photos/` directory
- Run: `php artisan storage:link`

- [ ] **Step 1: Add `photos` disk + R2 config to `config/filesystems.php`**

```php
'photos' => [
    'driver' => 'local',
    'root' => storage_path('app/public/photos'),
    'url' => env('APP_URL').'/storage/photos',
    'visibility' => 'public',
],

'r2' => [
    'driver' => 's3',
    'key' => env('R2_ACCESS_KEY_ID'),
    'secret' => env('R2_SECRET_ACCESS_KEY'),
    'region' => 'auto',
    'bucket' => env('R2_BUCKET'),
    'url' => env('R2_URL'),
    'endpoint' => env('R2_ENDPOINT'),
    'use_path_style_endpoint' => true,
    'visibility' => 'public',
],
```

- [ ] **Step 2: Create symlink**

```bash
php artisan storage:link
```

- [ ] **Step 3: Commit**

---

### Task 2: Portfolio System

**Files:**
- Create: `database/migrations/2026_06_17_400001_create_portfolios_table.php`
- Create: `app/Models/Portfolio.php`
- Create: `app/Http/Controllers/PortfolioController.php`
- Create: `app/Http/Requests/PortfolioStoreRequest.php`
- Create: `resources/js/components/portfolio/portfolio-card.tsx`
- Create: `resources/js/pages/portfolio/index.tsx`
- Create: `resources/js/pages/portfolio/create.tsx`
- Create: `resources/js/pages/portfolio/show.tsx`
- Modify: `routes/web.php`
- Install: `browser-image-compression`
- Test: `tests/Feature/Portfolio/PortfolioTest.php`

- [ ] **Step 1: Create portfolios migration**

```php
Schema::create('portfolios', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('category')->nullable();
    $table->string('external_link')->nullable();
    $table->string('image_path')->nullable();
    $table->timestamps();
    $table->index('user_id');
});
```

- [ ] **Step 2: Create Portfolio model**

```php
class Portfolio extends Model
{
    protected $fillable = ['user_id', 'title', 'description', 'category', 'external_link', 'image_path'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
```

- [ ] **Step 3: Create PortfolioStoreRequest**

```php
class PortfolioStoreRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasRole('student'); }
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'category' => 'nullable|string|max:100',
            'external_link' => 'nullable|url|max:500',
            'image' => 'nullable|image|max:2048', // 2MB max
        ];
    }
}
```

- [ ] **Step 4: Create PortfolioController**

```php
class PortfolioController extends Controller
{
    public function index(Request $request): Response
    {
        $portfolios = Portfolio::with('user')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
        return inertia('portfolio/index', ['portfolios' => $portfolios]);
    }

    public function create(): Response
    {
        return inertia('portfolio/create');
    }

    public function store(PortfolioStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('portfolios', 'photos');
        }
        $request->user()->portfolios()->create($data);
        return to_route('portfolio.index');
    }

    public function show(Portfolio $portfolio): Response
    {
        $portfolio->load('user');
        return inertia('portfolio/show', ['portfolio' => $portfolio]);
    }
}
```

- [ ] **Step 5: Add `portfolios()` relationship to User model**

```php
public function portfolios(): HasMany { return $this->hasMany(Portfolio::class); }
```

- [ ] **Step 6: Add routes**

```php
Route::prefix('portfolio')->name('portfolio.')->group(function () {
    Route::get('/', [PortfolioController::class, 'index'])->name('index');
    Route::get('/create', [PortfolioController::class, 'create'])->name('create');
    Route::post('/', [PortfolioController::class, 'store'])->name('store');
    Route::get('/{portfolio}', [PortfolioController::class, 'show'])->name('show');
});
```

- [ ] **Step 7: Create PortfolioCard component**

- [ ] **Step 8: Create portfolio pages (index, create, show)**

- [ ] **Step 9: Write tests**

- [ ] **Step 10: Build + commit**

---

### Task 3: Internship (PKL) Logbook System

**Files:**
- Create: `database/migrations/2026_06_17_500001_create_logbooks_table.php`
- Create: `database/migrations/2026_06_17_500002_add_mentor_id_to_users_table.php`
- Create: `app/Models/Logbook.php`
- Create: `app/Http/Controllers/LogbookController.php`
- Create: `app/Http/Requests/LogbookStoreRequest.php`
- Create: `app/Http/Requests/LogbookVerifyRequest.php`
- Create: `resources/js/pages/logbook/index.tsx`
- Create: `resources/js/pages/logbook/create.tsx`
- Create: `resources/js/pages/logbook/mentor.tsx`
- Modify: `routes/web.php`
- Test: `tests/Feature/Logbook/LogbookTest.php`

- [ ] **Step 1: Create logbooks migration**

```php
Schema::create('logbooks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
    $table->date('date');
    $table->text('summary');
    $table->string('photo_path')->nullable();
    $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
    $table->foreignId('mentor_id')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamp('verified_at')->nullable();
    $table->text('feedback')->nullable();
    $table->timestamps();
    $table->index('student_id');
    $table->index('date');
    $table->index('mentor_id');
});
```

- [ ] **Step 2: Add mentor_id to users**

```php
Schema::table('users', function (Blueprint $table) {
    $table->foreignId('mentor_id')->nullable()->constrained('users')->nullOnDelete();
});
```

- [ ] **Step 3: Create Logbook model**

```php
class Logbook extends Model
{
    protected $fillable = ['student_id', 'date', 'summary', 'photo_path', 'teacher_id', 'mentor_id', 'verified_at', 'feedback'];
    protected function casts(): array { return ['date' => 'date:Y-m-d', 'verified_at' => 'datetime']; }
    public function student(): BelongsTo { return $this->belongsTo(User::class, 'student_id'); }
    public function teacher(): BelongsTo { return $this->belongsTo(User::class, 'teacher_id'); }
    public function mentor(): BelongsTo { return $this->belongsTo(User::class, 'mentor_id'); }
}
```

- [ ] **Step 4: Add mentor relationship to User model**

```php
public function mentor(): BelongsTo { return $this->belongsTo(User::class, 'mentor_id'); }
public function mentees(): HasMany { return $this->hasMany(User::class, 'mentor_id'); }
public function logbooks(): HasMany { return $this->hasMany(Logbook::class, 'student_id'); }
```

- [ ] **Step 5: Create LogbookController**

```php
class LogbookController extends Controller
{
    // Student: view own logs
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->hasRole('student')) {
            $logbooks = $user->logbooks()->latest('date')->get();
        } else {
            // Teacher/Mentor: view logs of assigned students
            $students = $user->hasRole('teacher')
                ? User::role('student')->get()
                : User::where('mentor_id', $user->id)->role('student')->get();
            $logbooks = Logbook::whereIn('student_id', $students->pluck('id'))
                ->with('student')->latest('date')->get();
        }
        return inertia('logbook/index', ['logbooks' => $logbooks, 'role' => $user->getRoleNames()->first()]);
    }

    public function create(): Response { return inertia('logbook/create'); }

    public function store(LogbookStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['student_id'] = $request->user()->id;
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('logbooks', 'photos');
        }
        Logbook::create($data);
        return to_route('logbook.index');
    }

    // Mentor/Teacher verification
    public function verify(Logbook $logbook, LogbookVerifyRequest $request): RedirectResponse
    {
        $logbook->update([
            'verified_at' => now(),
            'feedback' => $request->feedback,
        ]);
        return back();
    }
}
```

- [ ] **Step 6: Create form requests**

- [ ] **Step 7: Add routes**

```php
Route::prefix('logbook')->name('logbook.')->group(function () {
    Route::get('/', [LogbookController::class, 'index'])->name('index');
    Route::get('/create', [LogbookController::class, 'create'])->name('create')->middleware('role:student');
    Route::post('/', [LogbookController::class, 'store'])->name('store')->middleware('role:student');
    Route::post('/{logbook}/verify', [LogbookController::class, 'verify'])->name('verify')->middleware('role:teacher,industry_mentor');
});
```

- [ ] **Step 8: Create logbook pages (index, create)**

- [ ] **Step 9: Create mentor assignment page (admin/teacher)**

- [ ] **Step 10: Write tests**

- [ ] **Step 11: Build + commit + push**
