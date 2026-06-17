<?php

namespace App\Http\Requests\Logbook;

use Illuminate\Foundation\Http\FormRequest;

class LogbookStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('student');
    }

    public function rules(): array
    {
        return [
            'date' => 'required|date|before_or_equal:today',
            'summary' => 'required|string|max:5000',
            'photo' => 'nullable|image|max:2048',
        ];
    }
}
