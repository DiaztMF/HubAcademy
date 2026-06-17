import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import { Calendar } from 'lucide-react';
import news from '@/routes/news';

type NewsItem = {
    id: number;
    title: string;
    content: string;
    cover_image: string | null;
    created_at: string;
    user: { name: string };
};

export default function NewsIndex({ news: newsList }: { news: { data: NewsItem[] } }) {
    return (
        <>
            <Head title="News" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Heading title="News" description="Latest updates and announcements." />

                {newsList.data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No news yet.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {newsList.data.map((item) => (
                            <Card
                                key={item.id}
                                className="cursor-pointer transition-shadow hover:shadow-md"
                                onClick={() => router.get(news.show.url(item.id))}
                            >
                                {item.cover_image && (
                                    <div className="overflow-hidden rounded-t-xl">
                                        <img
                                            src={`/storage/${item.cover_image}`}
                                            alt={item.title}
                                            className="h-48 w-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardContent className="space-y-2 p-4">
                                    <h3 className="font-semibold leading-tight">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="size-3" />
                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        <span>by {item.user.name}</span>
                                    </div>
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {item.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

NewsIndex.layout = {
    breadcrumbs: [
        { title: 'News', href: news.index.url() },
    ],
};
