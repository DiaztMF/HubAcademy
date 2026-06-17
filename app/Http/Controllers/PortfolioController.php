<?php

namespace App\Http\Controllers;

use App\Http\Requests\Portfolio\PortfolioStoreRequest;
use App\Models\Portfolio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $portfolios = Portfolio::with('user')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return inertia('portfolio/index', ['portfolios' => $portfolios]);
    }

    public function create(): Response
    {
        return inertia('portfolio/create');
    }

    public function store(PortfolioStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('portfolios', 'photos');
        }
        $request->user()->portfolios()->create($data);
        return to_route('portfolio.index');
    }

    public function show(Portfolio $portfolio): Response
    {
        $portfolio->load('user');
        return inertia('portfolio/show', ['portfolio' => $portfolio]);
    }
}
