import { Head, Link, router } from '@inertiajs/react';
import { PostCard } from '@/components/forum/post-card';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import forum from '@/routes/forum';
import { dashboard } from '@/routes';

type Category = { id: number; name: string; slug: string };
type Post = { id: number; title: string; user: { name: string }; category: Category; comments_count?: number };

export default function ForumIndex({ posts, categories }: { posts: Post[]; categories: Category[] }) {
    return (
        <>
            <Head title="Forum" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Forum" description="Community discussions." />
                    <Link href={forum.create.url()}>
                        <Button>+ New Post</Button>
                    </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <span key={cat.id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                            #{cat.slug}
                        </span>
                    ))}
                </div>

                {posts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No discussions yet. Start a new post.</p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                title={post.title}
                                authorName={post.user.name}
                                categoryName={post.category.name}
                                categorySlug={post.category.slug}
                                commentCount={post.comments_count ?? 0}
                                onClick={() => router.get(forum.show.url(post.id))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ForumIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Forum', href: forum.index.url() },
    ],
};
