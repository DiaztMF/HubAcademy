import { Head, router, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logbook from '@/routes/logbook';
import { dashboard } from '@/routes';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function LogbookCreate() {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [summary, setSummary] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const form = new FormData();
        form.append('date', date);
        form.append('summary', summary);
        if (photoFile) form.append('photo', photoFile);

        router.post(logbook.store.url(), form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => setSaving(false),
        });
    }

    return (
        <>
            <Head title="New Log Entry" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Heading title="New Log Entry" description="Record your daily internship activity." />

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="summary">Activity Summary</Label>
                        <textarea
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={6}
                            required
                            className={cn(
                                'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            )}
                            placeholder="Describe what you did today..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="photo">Photo (optional)</Label>
                        <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Entry'}
                        </Button>
                        <Link href={logbook.index.url()}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

LogbookCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Logbook', href: logbook.index.url() },
        { title: 'New Entry', href: logbook.create.url() },
    ],
};
