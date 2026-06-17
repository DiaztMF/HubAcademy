<?php

use App\Http\Controllers\Admin\UserImportController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Forum\ForumCommentController;
use App\Http\Controllers\Forum\ForumPostController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\LMS\CourseController;
use App\Http\Controllers\LMS\CourseEnrollmentController;
use App\Http\Controllers\LMS\TopicController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('news', [NewsController::class, 'index'])->name('news.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('import-users', [UserImportController::class, 'create'])->name('import.users');
        Route::post('import-users', [UserImportController::class, 'store']);
    });

    Route::prefix('lms')->name('lms.')->group(function () {
        Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
        Route::get('courses/create', [CourseController::class, 'create'])->name('courses.create')->middleware('role:teacher');
        Route::post('courses', [CourseController::class, 'store'])->name('courses.store')->middleware('role:teacher');
        Route::get('courses/{course}', [CourseController::class, 'show'])->name('courses.show');
        Route::post('courses/join', [CourseEnrollmentController::class, 'store'])->name('courses.join');
        Route::get('courses/{course}/topics/{topic}', [TopicController::class, 'show'])->name('topics.show');
    });

    Route::middleware(['role:teacher'])->prefix('attendance')->name('attendance.')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::post('/', [AttendanceController::class, 'store'])->name('store');
    });

    Route::prefix('portfolio')->name('portfolio.')->group(function () {
        Route::get('/', [PortfolioController::class, 'index'])->name('index');
        Route::get('/create', [PortfolioController::class, 'create'])->name('create');
        Route::post('/', [PortfolioController::class, 'store'])->name('store');
        Route::get('/{portfolio}', [PortfolioController::class, 'show'])->name('show');
    });

    Route::prefix('logbook')->name('logbook.')->group(function () {
        Route::get('/', [LogbookController::class, 'index'])->name('index');
        Route::get('/create', [LogbookController::class, 'create'])->name('create')->middleware('role:student');
        Route::post('/', [LogbookController::class, 'store'])->name('store')->middleware('role:student');
        Route::post('/{logbook}/verify', [LogbookController::class, 'verify'])->name('verify')->middleware('role:teacher,industry-mentor');
    });

    Route::prefix('forum')->name('forum.')->group(function () {
        Route::get('/', [ForumPostController::class, 'index'])->name('index');
        Route::get('/create', [ForumPostController::class, 'create'])->name('create');
        Route::post('/', [ForumPostController::class, 'store'])->name('store');
        Route::get('/{post}', [ForumPostController::class, 'show'])->name('show');
        Route::post('/{post}/comments', [ForumCommentController::class, 'store'])->name('comments.store');
    });

    Route::middleware(['role:admin,teacher'])->group(function () {
        Route::get('news/create', [NewsController::class, 'create'])->name('news.create');
        Route::post('news', [NewsController::class, 'store'])->name('news.store');
    });

    Route::prefix('chat')->name('chat.')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('index');
        Route::get('/{conversation}', [ChatController::class, 'show'])->name('show');
        Route::post('/', [ChatController::class, 'store'])->name('store');
        Route::post('/{conversation}/send', [ChatController::class, 'send'])->name('send');
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
    });
});

Route::get('news/{news}', [NewsController::class, 'show'])->name('news.show');

require __DIR__.'/settings.php';
