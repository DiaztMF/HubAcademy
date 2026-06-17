<?php

namespace App\Http\Controllers;

use App\Models\User;
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
                'total_users' => User::count(),
                'total_teachers' => User::role('teacher')->count(),
                'total_students' => User::role('student')->count(),
            ],
            'teacher' => [
                'total_courses' => 0,
                'pending_verifications' => 0,
            ],
            'student' => [
                'enrolled_courses' => 0,
                'pending_logbooks' => 0,
            ],
            'industry-mentor' => [
                'assigned_students' => 0,
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
