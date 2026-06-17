import { cn } from '@/lib/utils';

type MessageBubbleProps = {
    content: string;
    isOwn: boolean;
    userName: string;
    createdAt: string;
};

export function MessageBubble({ content, isOwn, userName, createdAt }: MessageBubbleProps) {
    return (
        <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
            <div
                className={cn(
                    'max-w-[75%] rounded-lg px-4 py-2 text-sm',
                    isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                )}
            >
                {!isOwn && (
                    <p className="mb-1 text-xs font-medium">{userName}</p>
                )}
                <p className="whitespace-pre-wrap">{content}</p>
                <p
                    className={cn(
                        'mt-1 text-[10px]',
                        isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground/60',
                    )}
                >
                    {createdAt}
                </p>
            </div>
        </div>
    );
}
