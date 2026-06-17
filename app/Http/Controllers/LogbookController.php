<?php

namespace App\Http\Controllers;

use App\Http\Requests\Logbook\LogbookStoreRequest;
use App\Http\Requests\Logbook\LogbookVerifyRequest;
use App\Models\Logbook;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class LogbookController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('student')) {
            $logbooks = $user->logbooks()->latest('date')->get();
        } elseif ($user->hasRole('industry_mentor')) {
            $students = User::where('mentor_id', $user->id)->role('student')->get();
            $logbooks = Logbook::whereIn('student_id', $students->pluck('id'))
                ->with('student')
                ->latest('date')
                ->get();
        } else {
            // teacher / admin: see all
            $logbooks = Logbook::with('student')->latest('date')->get();
        }

        return inertia('logbook/index', [
            'logbooks' => $logbooks,
            'role' => $user->getRoleNames()->first(),
        ]);
    }

    public function create(): Response
    {
        return inertia('logbook/create');
    }

    public function store(LogbookStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['student_id'] = $request->user()->id;

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('logbooks', 'photos');
        }

        Logbook::create($data);
        return to_route('logbook.index');
    }

    public function verify(Logbook $logbook, LogbookVerifyRequest $request): RedirectResponse
    {
        $logbook->update([
            'verified_at' => now(),
            'feedback' => $request->feedback,
        ]);

        return back();
    }
}
