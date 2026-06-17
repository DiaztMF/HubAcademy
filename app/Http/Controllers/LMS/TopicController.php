<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Topic;
use Inertia\Response;

class TopicController extends Controller
{
    public function show(Course $course, Topic $topic): Response
    {
        $topic->load('section.course.teacher');
        return inertia('lms/topics/show', ['topic' => $topic]);
    }
}
