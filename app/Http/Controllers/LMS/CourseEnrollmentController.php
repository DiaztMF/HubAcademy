<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Http\Requests\LMS\JoinCourseRequest;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;

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
