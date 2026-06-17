<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(15);

        return Inertia::render('notification/index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead($id): void
    {
        $notification = DatabaseNotification::findOrFail($id);

        if ($notification->notifiable_id !== auth()->id()) {
            abort(403);
        }

        $notification->markAsRead();
    }

    public function markAllAsRead(Request $request): void
    {
        $request->user()->unreadNotifications->markAsRead();
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'count' => $request->user()->unreadNotifications()->count(),
        ]);
    }
}
