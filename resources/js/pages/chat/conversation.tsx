import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConversationList } from '@/components/chat/conversation-list';
import { MessageBubble } from '@/components/chat/message-bubble';
import chat from '@/routes/chat';
import { dashboard } from '@/routes';

type User = { id: number; name: string };
type Message = { id: number; user: User; content: string; created_at: string };
type Conversation = {
    id: number;
    participants: User[];
    messages_count: number;
};

type PageProps = {
    auth: { user: User };
    conversation: Conversation;
    messages: Message[];
};

export default function ConversationShow() {
    const { auth, conversation, messages } = usePage<PageProps>().props;
    const [content, setContent] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim()) return;
        router.post(chat.send.url(conversation.id), { content }, {
            onSuccess: () => setContent(''),
        });
    }

    const other = conversation.participants.find((p) => p.id !== auth.user.id);

    return (
        <>
            <Head title={`Chat with ${other?.name ?? 'Unknown'}`} />
            <div className="flex h-full flex-1 gap-0 overflow-hidden">
                <div className="hidden w-72 shrink-0 border-r md:block">
                    <div className="p-4">
                        <ConversationList
                            conversations={[]}
                            currentUserId={auth.user.id}
                            activeId={conversation.id}
                        />
                    </div>
                </div>

                <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2 border-b px-4 py-3">
                        <a href={chat.index.url()} className="text-sm text-muted-foreground hover:underline">
                            &larr; Back
                        </a>
                        <span className="text-sm font-medium">
                            {other?.name ?? 'Unknown'}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground">
                                No messages yet. Say hello!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg) => (
                                    <MessageBubble
                                        key={msg.id}
                                        content={msg.content}
                                        isOwn={msg.user.id === auth.user.id}
                                        userName={msg.user.name}
                                        createdAt={msg.created_at}
                                    />
                                ))}
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={handleSend} className="flex gap-3 border-t p-4">
                        <input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-0 flex-1 rounded-md border px-3 py-2 text-sm"
                            placeholder="Type a message..."
                            required
                        />
                        <Button type="submit" size="sm">Send</Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ConversationShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Chat', href: chat.index.url() },
    ],
};
