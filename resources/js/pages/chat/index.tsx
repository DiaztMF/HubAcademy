import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConversationList } from '@/components/chat/conversation-list';
import chat from '@/routes/chat';
import { dashboard } from '@/routes';

type User = { id: number; name: string };

type PageProps = {
    auth: { user: User };
    conversations: { id: number; participants: User[]; last_message: { content: string; created_at: string } | null; messages_count: number }[];
};

export default function ChatIndex() {
    const { auth, conversations } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const [recipientId, setRecipientId] = useState('');

    function startConversation(e: React.FormEvent) {
        e.preventDefault();
        router.post(chat.store.url(), { recipient_id: recipientId }, {
            onSuccess: () => {
                setOpen(false);
                setRecipientId('');
            },
        });
    }

    return (
        <>
            <Head title="Chat" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Chat" description="Your conversations." />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>+ New Message</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Message</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={startConversation} className="space-y-4">
                                <Input
                                    placeholder="Recipient ID"
                                    value={recipientId}
                                    onChange={(e) => setRecipientId(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="w-full">
                                    Start Conversation
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <ConversationList
                    conversations={conversations}
                    currentUserId={auth.user.id}
                />
            </div>
        </>
    );
}

ChatIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Chat', href: chat.index.url() },
    ],
};
