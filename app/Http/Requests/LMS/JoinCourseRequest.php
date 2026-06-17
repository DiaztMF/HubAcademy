<?php

namespace App\Http\Requests\LMS;

use Illuminate\Foundation\Http\FormRequest;

class JoinCourseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'join_code' => 'required|string|size:6|exists:courses,join_code',
        ];
    }
}
