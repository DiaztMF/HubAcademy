import { Head, Link, router } from '@inertiajs/react';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
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
};

export default function PortfolioIndex({ portfolios }: { portfolios: PortfolioItem[] }) {
    return (
        <>
            <Head title="My Portfolio" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="My Portfolio" description="Showcase your projects." />
                    <Link href={portfolio.create.url()}>
                        <Button>+ Add Project</Button>
                    </Link>
                </div>

                {portfolios.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No projects yet. Add your first portfolio project.
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {portfolios.map((item) => (
                            <PortfolioCard
                                key={item.id}
                                title={item.title}
                                category={item.category}
                                imageUrl={item.image_path ? StorageUrl(item.image_path) : null}
                                onClick={() => router.get(portfolio.show.url(item.id))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

PortfolioIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Portfolio', href: portfolio.index.url() },
    ],
};
