<?php

namespace App\Http\Requests\Logbook;

use Illuminate\Foundation\Http\FormRequest;

class LogbookVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['teacher', 'industry-mentor']);
    }

    public function rules(): array
    {
        return [
            'feedback' => 'nullable|string|max:2000',
        ];
    }
}
