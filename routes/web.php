<?php

use App\Http\Controllers\Admin\UserImportController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('import-users', [UserImportController::class, 'create'])->name('import.users');
        Route::post('import-users', [UserImportController::class, 'store']);
    });
});

require __DIR__.'/settings.php';
