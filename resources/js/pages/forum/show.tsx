import { Head, router, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import forum from '@/routes/forum';
import { dashboard } from '@/routes';
import { useState } from 'react';

type User = { id: number; name: string };
type Comment = { id: number; user: User; content: string };
type Category = { id: number; name: string; slug: string };
type PostData = { id: number; title: string; content: string; user: User; category: Category; comments: Comment[] };

export default function ForumShow({ post }: { post: PostData }) {
    const [newComment, setNewComment] = useState('');

    function handleComment(e: React.FormEvent) {
        e.preventDefault();
        router.post(forum.comments.store.url(post.id), { content: newComment }, {
            onSuccess: () => setNewComment(''),
        });
    }

    return (
        <>
            <Head title={post.title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Link href={forum.index.url()}>
                    <Button variant="ghost" size="sm">&larr; Back to Forum</Button>
                </Link>

                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <Heading title={post.title} />
                            <p className="text-sm text-muted-foreground">
                                Posted by {post.user.name}
                            </p>
                        </div>
                        <Badge variant="secondary">#{post.category.slug}</Badge>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <p className="whitespace-pre-wrap text-sm">{post.content}</p>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Comments ({post.comments.length})</h3>

                        {post.comments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No comments yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {post.comments.map((comment) => (
                                    <Card key={comment.id}>
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-muted-foreground">{comment.user.name}</p>
                                            <p className="mt-1 text-sm">{comment.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleComment} className="flex gap-3">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={2}
                                className="min-h-0 flex-1 rounded-md border px-3 py-2 text-sm"
                                placeholder="Write a comment..."
                                required
                            />
                            <Button type="submit" size="sm">Comment</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

ForumShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Forum', href: forum.index.url() },
    ],
};
