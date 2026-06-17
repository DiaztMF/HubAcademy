<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'date' => 'required|date|before_or_equal:today',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:present,late,permit,sick,alpa',
            'attendances.*.notes' => 'nullable|string|max:500',
        ];
    }
}
