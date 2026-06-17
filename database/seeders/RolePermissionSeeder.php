<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'users.import', 'users.view', 'users.create', 'users.edit', 'users.delete',
            'courses.create', 'courses.edit', 'courses.delete', 'courses.view', 'courses.enroll',
            'attendance.create', 'attendance.view', 'attendance.edit',
            'logbook.create', 'logbook.view', 'logbook.verify', 'logbook.edit',
            'portfolio.create', 'portfolio.view', 'portfolio.edit', 'portfolio.delete',
            'forum.create', 'forum.edit', 'forum.delete', 'forum.moderate',
            'chat.send', 'chat.delete', 'chat.block',
            'news.create', 'news.edit', 'news.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $admin = Role::findOrCreate('admin');
        $admin->givePermissionTo(Permission::all());

        $teacher = Role::findOrCreate('teacher');
        $teacher->givePermissionTo([
            'courses.create', 'courses.edit', 'courses.delete', 'courses.view',
            'attendance.create', 'attendance.view', 'attendance.edit',
            'logbook.view', 'logbook.verify',
            'forum.create', 'forum.edit',
            'news.create', 'news.edit',
        ]);

        $student = Role::findOrCreate('student');
        $student->givePermissionTo([
            'courses.view', 'courses.enroll',
            'logbook.create', 'logbook.view', 'logbook.edit',
            'portfolio.create', 'portfolio.view', 'portfolio.edit', 'portfolio.delete',
            'forum.create',
            'chat.send',
        ]);

        $mentor = Role::findOrCreate('industry-mentor');
        $mentor->givePermissionTo([
            'logbook.view', 'logbook.verify',
        ]);

        \App\Models\Category::create(['name' => 'General', 'slug' => 'general', 'description' => 'General discussion']);
        \App\Models\Category::create(['name' => 'Internal Announcements', 'slug' => 'internal-announcements', 'is_protected' => true, 'description' => 'Official announcements']);

        $admin = \App\Models\User::role('admin')->first();
        if ($admin) {
            $admin->notify(new \App\Notifications\TestNotification());
        }
    }
}
