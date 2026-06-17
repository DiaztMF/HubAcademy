<?php

namespace App\Http\Requests\Chat;

use Illuminate\Foundation\Http\FormRequest;

class StartConversationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'recipient_id' => 'required|exists:users,id|different:user',
        ];
    }
}
