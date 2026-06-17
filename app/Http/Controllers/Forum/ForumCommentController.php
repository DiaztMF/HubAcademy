<?php

namespace App\Http\Controllers\Forum;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forum\StoreCommentRequest;
use App\Models\ForumPost;
use Illuminate\Http\RedirectResponse;

class ForumCommentController extends Controller
{
    public function store(ForumPost $post, StoreCommentRequest $request): RedirectResponse
    {
        $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        return back();
    }
}
