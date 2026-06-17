import { Head, router, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import news from '@/routes/news';
import { dashboard } from '@/routes';
import { useState } from 'react';

export default function NewsCreate() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverImage(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const form = new FormData();
        form.append('title', title);
        form.append('content', content);
        if (coverImage) form.append('cover_image', coverImage);

        router.post(news.store.url(), form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => setSaving(false),
        });
    }

    return (
        <>
            <Head title="Create News" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Heading title="Create News" description="Post an announcement or update." />

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="News title"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your news content here..."
                            rows={10}
                            required
                            className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cover_image">Cover Image (optional, max 2MB)</Label>
                        <Input id="cover_image" type="file" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-2 max-h-48 rounded-md object-cover" />
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Publishing...' : 'Publish News'}
                        </Button>
                        <Link href={news.index.url()}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

NewsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'News', href: news.index.url() },
        { title: 'Create', href: news.create.url() },
    ],
};
