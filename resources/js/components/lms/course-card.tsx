import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CourseCardProps = {
    title: string;
    teacherName: string;
    joinCode: string;
    studentCount: number;
    onClick?: () => void;
};

export function CourseCard({ title, teacherName, joinCode, studentCount, onClick }: CourseCardProps) {
    return (
        <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{teacherName}</p>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">{joinCode}</Badge>
                    <span className="text-xs text-muted-foreground">{studentCount} students</span>
                </div>
            </CardContent>
        </Card>
    );
}
