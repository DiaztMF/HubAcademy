<?php

namespace App\Http\Controllers\Forum;

use App\Http\Controllers\Controller;
use App\Http\Requests\Forum\StorePostRequest;
use App\Models\Category;
use App\Models\ForumPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class ForumPostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = ForumPost::with(['user', 'category'])
            ->latest()
            ->get();

        $categories = Category::all();

        return inertia('forum/index', [
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::all();
        return inertia('forum/create', ['categories' => $categories]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $request->user()->forumPosts()->create($request->validated());
        return to_route('forum.index');
    }

    public function show(ForumPost $post): Response
    {
        $post->load(['user', 'category', 'comments.user']);
        return inertia('forum/show', ['post' => $post]);
    }
}
