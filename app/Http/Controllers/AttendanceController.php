<?php

namespace App\Http\Controllers;

use App\Http\Requests\Attendance\AttendanceStoreRequest;
use App\Models\Attendance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
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

        return back();
    }
}
