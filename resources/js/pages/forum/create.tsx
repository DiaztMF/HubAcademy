import { Head, router, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import forum from '@/routes/forum';
import { dashboard } from '@/routes';
import { useState } from 'react';

type Category = { id: number; name: string; slug: string };

export default function ForumCreate({ categories }: { categories: Category[] }) {
    const [categoryId, setCategoryId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(forum.store.url(), { category_id: Number(categoryId), title, content });
    }

    return (
        <>
            <Head title="New Post" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Heading title="New Post" description="Start a discussion." />

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        #{cat.slug} — {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit">Post</Button>
                        <Link href={forum.index.url()}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

ForumCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Forum', href: forum.index.url() },
        { title: 'New Post', href: forum.create.url() },
    ],
};
