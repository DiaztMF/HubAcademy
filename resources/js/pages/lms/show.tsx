import { Head } from '@inertiajs/react';
import { SectionList } from '@/components/lms/section-list';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import lms from '@/routes/lms';
import { dashboard } from '@/routes';

type Topic = { id: number; title: string; section_id: number; order: number };
type Section = { id: number; title: string; order: number; topics: Topic[] };
type Teacher = { id: number; name: string };
type Course = {
    id: number;
    title: string;
    description: string | null;
    join_code: string;
    teacher: Teacher;
    sections: Section[];
};

export default function CourseShow({ course }: { course: Course }) {
    const baseUrl = `/lms/courses/${course.id}/topics`;

    return (
        <>
            <Head title={course.title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <Heading title={course.title} />
                        <p className="text-sm text-muted-foreground">
                            Taught by {course.teacher.name}
                        </p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                        Code: {course.join_code}
                    </Badge>
                </div>

                {course.description && (
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                )}

                <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-sm font-medium">Course Content</h3>
                    {course.sections.length > 0 ? (
                        <SectionList
                            sections={course.sections}
                            baseUrl={baseUrl}
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground">No sections yet.</p>
                    )}
                </div>
            </div>
        </>
    );
}

CourseShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'My Courses', href: lms.courses.index.url() },
    ],
};
