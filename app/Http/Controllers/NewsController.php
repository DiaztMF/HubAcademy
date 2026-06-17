<?php

namespace App\Http\Controllers;

use App\Http\Requests\News\NewsStoreRequest;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $news = News::with('user')
            ->where('is_published', true)
            ->latest()
            ->paginate(12);

        return inertia('news/index', [
            'news' => $news,
        ]);
    }

    public function create(): Response
    {
        return inertia('news/create');
    }

    public function store(NewsStoreRequest $request): RedirectResponse
    {
        $news = $request->user()->news()->create($request->validated());

        $image = $request->file('cover_image');

        if ($image) {
            $news->update([
                'cover_image' => $image->store('news', 'public'),
            ]);
        }

        return to_route('news.show', $news);
    }

    public function show(News $news): Response
    {
        if (!$news->is_published && (!auth()->check() || !auth()->user()->hasAnyRole(['admin', 'teacher']))) {
            abort(404);
        }

        $news->load('user');

        return inertia('news/show', [
            'news' => $news,
        ]);
    }
}
