import { Head, router, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import imageCompression from 'browser-image-compression';
import portfolio from '@/routes/portfolio';
import { dashboard } from '@/routes';
import { useState } from 'react';

export default function PortfolioCreate() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            });
            setImageFile(compressed);
            setImagePreview(URL.createObjectURL(compressed));
        } catch {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const form = new FormData();
        form.append('title', title);
        if (description) form.append('description', description);
        if (category) form.append('category', category);
        if (externalLink) form.append('external_link', externalLink);
        if (imageFile) form.append('image', imageFile);

        router.post(portfolio.store.url(), form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => setSaving(false),
        });
    }

    return (
        <>
            <Head title="Add Project" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Heading title="Add Project" description="Showcase your work." />

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={cn(
                                'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            )}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web App, UI Design" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="external_link">External Link</Label>
                        <Input id="external_link" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://github.com/your-project" type="url" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Image (max 2MB, compressed to ~200KB)</Label>
                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-2 max-h-48 rounded-md object-cover" />
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Add Project'}
                        </Button>
                        <Link href={portfolio.index.url()}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

PortfolioCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Portfolio', href: portfolio.index.url() },
        { title: 'Add Project', href: portfolio.create.url() },
    ],
};
