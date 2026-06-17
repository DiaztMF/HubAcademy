import { Head, router, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import lms from '@/routes/lms';
import { dashboard } from '@/routes';
import { useState } from 'react';

export default function CourseCreate() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(lms.courses.store.url(), { title, description });
    }

    return (
        <>
            <Head title="Create Course" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Heading title="Create Course" description="Set up a new course for your students." />

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Mathematics Grade X"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional course description"
                            rows={4}
                            className={cn(
                                'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit">Create Course</Button>
                        <Link href={lms.courses.index.url()}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

CourseCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'My Courses', href: lms.courses.index.url() },
        { title: 'Create', href: lms.courses.create.url() },
    ],
};
