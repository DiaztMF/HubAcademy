<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserImportRequest;
use App\Imports\UsersImport;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserImportController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/import-users');
    }

    public function store(UserImportRequest $request): RedirectResponse
    {
        $import = new UsersImport($request->input('role', 'student'));

        $import->import($request->file('file')->getPathname());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$import->rowCount} users imported successfully as {$request->input('role')}s.",
        ]);

        return to_route('admin.import.users');
    }
}
