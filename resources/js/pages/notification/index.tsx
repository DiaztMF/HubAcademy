import { Head, Link, router } from '@inertiajs/react';
import { Check, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import notifRoutes from '@/routes/notifications';

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type NotificationItem = {
    id: string;
    type: string;
    data: {
        title?: string;
        message: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
};

type Props = {
    notifications: PaginatedData<NotificationItem>;
};

export default function Index({ notifications: notifs }: Props) {
    const handleMarkAllAsRead = () => {
        router.post(
            notifRoutes.readAll().url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleMarkAsRead = (id: string) => {
        router.post(
            notifRoutes.read({ id }).url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    {notifs.data.some((n) => !n.read_at) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                        >
                            <CheckCheck className="mr-1.5 h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            All notifications ({notifs.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {notifs.data.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                No notifications yet.
                            </p>
                        ) : (
                            <div className="divide-y">
                                {notifs.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`flex items-start gap-4 px-1 py-3 ${
                                            !notification.read_at
                                                ? 'bg-accent/30 -mx-1 rounded-sm px-3'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                {!notification.read_at && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                )}
                                                {notification.data.title && (
                                                    <p className="text-sm font-medium">
                                                        {
                                                            notification.data
                                                                .title
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.data.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground/60">
                                                {notification.created_at}
                                            </p>
                                        </div>
                                        {!notification.read_at && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 shrink-0 text-xs"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id,
                                                    )
                                                }
                                            >
                                                <Check className="mr-1 h-3 w-3" />
                                                Mark read
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    {notifs.last_page > 1 && (
                        <CardFooter className="flex items-center justify-between border-t">
                            <p className="text-xs text-muted-foreground">
                                Showing {notifs.from}–{notifs.to} of{' '}
                                {notifs.total}
                            </p>
                            <div className="flex gap-1">
                                {notifs.links.map((link, i) => {
                                    if (
                                        link.label.includes('Previous') ||
                                        link.label.includes('Next')
                                    ) {
                                        const Icon =
                                            link.label.includes('Previous')
                                                ? ChevronLeft
                                                : ChevronRight;
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url ?? '#'}
                                                preserveState
                                                preserveScroll
                                                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                                                    link.active
                                                        ? 'bg-accent font-medium'
                                                        : 'text-muted-foreground hover:bg-accent'
                                                } ${
                                                    !link.url
                                                        ? 'pointer-events-none opacity-40'
                                                        : ''
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </Link>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Notifications',
            href: notifRoutes.index().url,
        },
    ],
};
