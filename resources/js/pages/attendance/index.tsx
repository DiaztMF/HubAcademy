import { Head, router } from '@inertiajs/react';
import { AttendanceGrid } from '@/components/attendance/attendance-grid';
import Heading from '@/components/heading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import { useState } from 'react';

type Student = { id: number; name: string; nisn?: string };
type Course = { id: number; title: string; students: Student[] };

export default function AttendanceIndex({ courses }: { courses: Course[] }) {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        courses.length > 0 ? courses[0].id : null,
    );

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);

    return (
        <>
            <Head title="Attendance" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Heading title="Attendance" description="Record student attendance per course and date." />

                {courses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        You don't have any courses yet. Create one first.
                    </p>
                ) : (
                    <div className="space-y-6">
                        <div className="grid max-w-xs gap-2">
                            <label className="text-sm font-medium">Course</label>
                            <Select
                                value={String(selectedCourseId ?? '')}
                                onValueChange={(val) => setSelectedCourseId(Number(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={String(course.id)}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedCourse && (
                            <AttendanceGrid
                                key={selectedCourse.id}
                                courseId={selectedCourse.id}
                                students={selectedCourse.students}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Attendance', href: '/attendance' },
    ],
};
