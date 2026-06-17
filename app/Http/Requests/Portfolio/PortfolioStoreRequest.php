<?php

namespace App\Http\Requests\Portfolio;

use Illuminate\Foundation\Http\FormRequest;

class PortfolioStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('student');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'category' => 'nullable|string|max:100',
            'external_link' => 'nullable|url|max:500',
            'image' => 'nullable|image|max:2048',
        ];
    }
}
