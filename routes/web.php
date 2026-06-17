<?php

use App\Http\Controllers\Admin\UserImportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LMS\CourseController;
use App\Http\Controllers\LMS\CourseEnrollmentController;
use App\Http\Controllers\LMS\TopicController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
});

require __DIR__.'/settings.php';
