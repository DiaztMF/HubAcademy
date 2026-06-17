import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

type PortfolioCardProps = {
    title: string;
    category?: string | null;
    imageUrl?: string | null;
    onClick?: () => void;
};

export function PortfolioCard({ title, category, imageUrl, onClick }: PortfolioCardProps) {
    return (
        <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md" onClick={onClick}>
            {imageUrl && (
                <div className="aspect-video overflow-hidden bg-muted">
                    <img src={imageUrl} alt={title} className="size-full object-cover" />
                </div>
            )}
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            {category && (
                <CardContent>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <ExternalLink className="size-3" />
                        {category}
                    </span>
                </CardContent>
            )}
        </Card>
    );
}
