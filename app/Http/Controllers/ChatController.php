<?php

namespace App\Http\Controllers;

use App\Http\Requests\Chat\SendMessageRequest;
use App\Http\Requests\Chat\StartConversationRequest;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = $user->chatConversations()
            ->with(['participants', 'lastMessage'])
            ->withCount('messages')
            ->latest('updated_at')
            ->get();

        return inertia('chat/index', ['conversations' => $conversations]);
    }

    public function show(Request $request, ChatConversation $conversation): Response
    {
        $user = $request->user();

        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        $conversation->load(['participants', 'messages' => function ($query) {
            $query->with('user')->latest()->limit(100);
        }]);

        $conversation->participants()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        return inertia('chat/conversation', [
            'conversation' => $conversation,
            'messages' => $conversation->messages->reverse()->values(),
        ]);
    }

    public function store(StartConversationRequest $request): RedirectResponse
    {
        $user = $request->user();
        $recipientId = $request->validated()['recipient_id'];

        $existing = $user->chatConversations()
            ->whereHas('participants', fn ($q) => $q->where('user_id', $recipientId))
            ->first();

        if ($existing) {
            return to_route('chat.show', $existing);
        }

        $conversation = DB::transaction(function () use ($user, $recipientId) {
            $conversation = ChatConversation::create();
            $conversation->participants()->attach([$user->id, $recipientId]);
            return $conversation;
        });

        return to_route('chat.show', $conversation);
    }

    public function send(SendMessageRequest $request, ChatConversation $conversation): RedirectResponse
    {
        $user = $request->user();

        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'content' => $request->validated()['content'],
        ]);

        $conversation->touch();

        return to_route('chat.show', $conversation);
    }
}
