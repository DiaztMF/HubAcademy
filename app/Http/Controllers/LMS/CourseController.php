<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Http\Requests\LMS\StoreCourseRequest;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $courses = $user->hasRole('teacher')
            ? $user->taughtCourses()->with('teacher')->get()
            : $user->enrolledCourses()->with('teacher')->get();

        return inertia('lms/index', [
            'courses' => $courses,
            'canCreate' => $user->hasRole('teacher'),
        ]);
    }

    public function create(): Response
    {
        return inertia('lms/create');
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $course = $request->user()->taughtCourses()->create($request->validated());
        return to_route('lms.courses.show', $course);
    }

    public function show(Course $course): Response
    {
        $course->load(['sections.topics', 'teacher', 'students']);
        return inertia('lms/show', ['course' => $course]);
    }
}
