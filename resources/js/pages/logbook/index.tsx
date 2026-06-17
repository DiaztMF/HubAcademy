import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logbook from '@/routes/logbook';
import { dashboard } from '@/routes';
import { StorageUrl } from '@/lib/storage-url';

type LogbookEntry = {
    id: number;
    date: string;
    summary: string;
    photo_path: string | null;
    verified_at: string | null;
    feedback: string | null;
    student?: { id: number; name: string };
};

export default function LogbookIndex({ logbooks, role }: { logbooks: LogbookEntry[]; role: string }) {
    return (
        <>
            <Head title="Logbook" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Logbook" description="Daily internship activity logs." />
                    {role === 'student' && (
                        <Link href={logbook.create.url()}>
                            <Button>+ New Entry</Button>
                        </Link>
                    )}
                </div>

                {logbooks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        {role === 'student' ? 'No log entries yet. Start logging your daily activities.' : 'No log entries to review.'}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {logbooks.map((entry) => (
                            <Card key={entry.id}>
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-medium">
                                            {entry.student ? `${entry.student.name} — ` : ''}
                                            {entry.date}
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {entry.verified_at ? (
                                            <Badge variant="default" className="bg-green-600">Verified</Badge>
                                        ) : (
                                            <Badge variant="secondary">Pending</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                        {entry.summary}
                                    </p>
                                    {entry.photo_path && (
                                        <img
                                            src={StorageUrl(entry.photo_path)}
                                            alt="Activity photo"
                                            className="max-h-48 rounded-md object-cover"
                                        />
                                    )}
                                    {role !== 'student' && !entry.verified_at && (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const form = e.currentTarget;
                                                const feedback = new FormData(form).get('feedback') as string;
                                                router.post(logbook.verify.url(entry.id), { feedback });
                                            }}
                                            className="flex items-start gap-3 pt-2"
                                        >
                                            <textarea
                                                name="feedback"
                                                rows={2}
                                                className="min-h-0 flex-1 rounded-md border px-3 py-2 text-sm"
                                                placeholder="Optional feedback..."
                                            />
                                            <Button type="submit" size="sm">Verify</Button>
                                        </form>
                                    )}
                                    {entry.feedback && (
                                        <div className="rounded-md bg-muted p-3 text-sm">
                                            <span className="font-medium">Feedback: </span>
                                            {entry.feedback}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

LogbookIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Logbook', href: logbook.index.url() },
    ],
};
