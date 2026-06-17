import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Heading from '@/components/heading';
import { ArrowLeft, Calendar } from 'lucide-react';
import news from '@/routes/news';

type NewsItem = {
    id: number;
    title: string;
    content: string;
    cover_image: string | null;
    created_at: string;
    user: { name: string };
};

export default function NewsShow({ news: item }: { news: NewsItem }) {
    return (
        <>
            <Head title={item.title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Link href={news.index.url()}>
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="size-4" />
                        Back to News
                    </Button>
                </Link>

                <article className="max-w-3xl space-y-6">
                    <div className="space-y-2">
                        <Heading title={item.title} />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            <span>by {item.user.name}</span>
                        </div>
                    </div>

                    {item.cover_image && (
                        <div className="overflow-hidden rounded-lg border">
                            <img
                                src={`/storage/${item.cover_image}`}
                                alt={item.title}
                                className="w-full object-cover"
                            />
                        </div>
                    )}

                    <Card>
                        <CardContent className="pt-6">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                {item.content}
                            </p>
                        </CardContent>
                    </Card>
                </article>
            </div>
        </>
    );
}

NewsShow.layout = {
    breadcrumbs: [
        { title: 'News', href: news.index.url() },
    ],
};
