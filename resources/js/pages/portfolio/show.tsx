import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import portfolio from '@/routes/portfolio';
import { dashboard } from '@/routes';
import { StorageUrl } from '@/lib/storage-url';

type PortfolioItem = {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    external_link: string | null;
    image_path: string | null;
    user: { name: string };
};

export default function PortfolioShow({ portfolio: item }: { portfolio: PortfolioItem }) {
    return (
        <>
            <Head title={item.title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Link href={portfolio.index.url()}>
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="size-4" />
                        Back to Portfolio
                    </Button>
                </Link>

                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <Heading title={item.title} />
                            {item.category && <Badge variant="secondary">{item.category}</Badge>}
                        </div>
                        {item.external_link && (
                            <a href={item.external_link} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1">
                                    <ExternalLink className="size-4" />
                                    View Project
                                </Button>
                            </a>
                        )}
                    </div>

                    {item.image_path && (
                        <div className="overflow-hidden rounded-lg border">
                            <img
                                src={StorageUrl(item.image_path)}
                                alt={item.title}
                                className="w-full object-cover"
                            />
                        </div>
                    )}

                    {item.description && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

PortfolioShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Portfolio', href: portfolio.index.url() },
    ],
};
