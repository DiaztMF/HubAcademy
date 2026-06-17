import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

type PostCardProps = {
    title: string;
    authorName: string;
    categoryName: string;
    categorySlug: string;
    commentCount: number;
    onClick?: () => void;
};

export function PostCard({ title, authorName, categoryName, categorySlug, commentCount, onClick }: PostCardProps) {
    return (
        <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
                <CardTitle className="text-base">{title}</CardTitle>
                <Badge variant="secondary" className="shrink-0">#{categorySlug}</Badge>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{authorName}</span>
                    <span className="flex items-center gap-1">
                        <MessageCircle className="size-3" />
                        {commentCount}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
