import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import notifRoutes from '@/routes/notifications';

type NotificationItem = {
    id: string;
    data: {
        title?: string;
        message: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
};

export function NotificationBell() {
    const { auth } = usePage().props;
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentNotifs, setRecentNotifs] = useState<NotificationItem[]>([]);
    const [open, setOpen] = useState(false);

    const fetchUnreadCount = async () => {
        try {
            const res = await fetch(notifRoutes.unreadCount().url);
            const data = await res.json();
            setUnreadCount(data.count);
        } catch {
            // silently fail
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = (id: string) => {
        router.post(
            notifRoutes.read({ id }).url,
            {},
            {
                preserveState: true,
                onSuccess: () => {
                    setRecentNotifs((prev) =>
                        prev.filter((n) => n.id !== id),
                    );
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                },
            },
        );
    };

    const handleMarkAllAsRead = () => {
        router.post(
            notifRoutes.readAll().url,
            {},
            {
                preserveState: true,
                onSuccess: () => {
                    setRecentNotifs([]);
                    setUnreadCount(0);
                },
            },
        );
    };

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            await fetchUnreadCount();
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="group relative h-9 w-9 cursor-pointer"
                >
                    <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 p-0"
                sideOffset={8}
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <span className="text-sm font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleMarkAllAsRead}
                        >
                            <CheckCheck className="mr-1 h-3.5 w-3.5" />
                            Mark all read
                        </Button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {recentNotifs.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
                            <Bell className="h-8 w-8 opacity-40" />
                            <p>No new notifications</p>
                            <Link
                                href={notifRoutes.index().url}
                                className="text-xs text-primary underline-offset-2 hover:underline"
                            >
                                View all notifications
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {recentNotifs.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50"
                                >
                                    <div className="flex-1 space-y-1">
                                        {notification.data.title && (
                                            <p className="text-xs font-medium">
                                                {notification.data.title}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.data.message}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0"
                                        onClick={() =>
                                            handleMarkAsRead(notification.id)
                                        }
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="border-t px-4 py-2">
                    <Link
                        href={notifRoutes.index().url}
                        className="block text-center text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                    >
                        View all notifications
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
