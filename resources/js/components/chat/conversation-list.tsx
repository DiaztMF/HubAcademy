import { router } from '@inertiajs/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import chat from '@/routes/chat';

type Participant = { id: number; name: string };
type LastMessage = { content: string; created_at: string } | null;

type Conversation = {
    id: number;
    participants: Participant[];
    last_message: LastMessage;
    messages_count: number;
};

type Props = {
    conversations: Conversation[];
    currentUserId: number;
    activeId?: number;
};

export function ConversationList({ conversations, currentUserId, activeId }: Props) {
    return (
        <div className="flex flex-col gap-1">
            {conversations.map((conv) => {
                const other = conv.participants.find((p) => p.id !== currentUserId);
                const isActive = conv.id === activeId;

                return (
                    <button
                        key={conv.id}
                        onClick={() => router.get(chat.show.url(conv.id))}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                            isActive ? 'bg-accent' : ''
                        }`}
                    >
                        <Avatar className="size-9">
                            <AvatarFallback>
                                {(other?.name ?? '?').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                                {other?.name ?? 'Deleted User'}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {conv.last_message?.content ?? 'No messages yet'}
                            </p>
                        </div>
                    </button>
                );
            })}

            {conversations.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No conversations yet.
                </p>
            )}
        </div>
    );
}
