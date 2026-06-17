import { Head, router, Link } from '@inertiajs/react';
import { CourseCard } from '@/components/lms/course-card';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import lms from '@/routes/lms';
import { dashboard } from '@/routes';
import { useState } from 'react';

type Course = {
    id: number;
    title: string;
    join_code: string;
    teacher: { name: string };
};

export default function CourseIndex({ courses, canCreate }: { courses: Course[]; canCreate: boolean }) {
    const [joinCode, setJoinCode] = useState('');

    function handleJoin(e: React.FormEvent) {
        e.preventDefault();
        router.post(lms.courses.join.url(), { join_code: joinCode });
    }

    return (
        <>
            <Head title="My Courses" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="My Courses" description="Browse and manage your courses." />
                    {canCreate && (
                        <Link href={lms.courses.create.url()}>
                            <Button>+ New Course</Button>
                        </Link>
                    )}
                </div>

                <form onSubmit={handleJoin} className="flex items-end gap-4 rounded-lg border p-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="join_code">Join Course by Code</Label>
                        <Input
                            id="join_code"
                            placeholder="Enter 6-character code"
                            maxLength={6}
                            className="font-mono uppercase"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        />
                    </div>
                    <Button type="submit">Join</Button>
                </form>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            title={course.title}
                            teacherName={course.teacher.name}
                            joinCode={course.join_code}
                            studentCount={0}
                            onClick={() => router.get(lms.courses.show.url(course.id))}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

CourseIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'My Courses', href: lms.courses.index.url() },
    ],
};
