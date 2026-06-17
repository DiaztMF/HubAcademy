import attendance from '@/routes/attendance';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';

type Student = { id: number; name: string; nisn?: string };

type AttendanceGridProps = {
    courseId: number;
    students: Student[];
    existingAttendances?: Record<number, { status: string; notes: string | null }>;
    date?: string;
};

const STATUS_OPTIONS = ['present', 'late', 'permit', 'sick', 'alpa'] as const;

const STATUS_STYLES: Record<string, string> = {
    present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    permit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    sick: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    alpa: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function AttendanceGrid({ courseId, students, existingAttendances = {}, date: initialDate }: AttendanceGridProps) {
    const today = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(initialDate ?? today);
    const [attendances, setAttendances] = useState<
        Record<number, { status: string; notes: string | null }>
    >(existingAttendances);
    const [saving, setSaving] = useState(false);

    function setStatus(studentId: number, status: string) {
        setAttendances((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    }

    function handleSave() {
        setSaving(true);
        const payload = {
            course_id: courseId,
            date: selectedDate,
            attendances: Object.entries(attendances).map(([studentId, data]) => ({
                student_id: Number(studentId),
                status: data.status,
                notes: data.notes,
            })),
        };
        router.post(attendance.store.url(), payload, {
            onFinish: () => setSaving(false),
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        max={today}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border-input rounded-md border px-3 py-2 text-sm shadow-xs"
                    />
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Attendance'}
                </Button>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">NISN</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => {
                            const current = attendances[student.id];
                            return (
                                <tr key={student.id} className="border-b last:border-0">
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium">{student.name}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{student.nisn ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <Select
                                            value={current?.status ?? ''}
                                            onValueChange={(val) => setStatus(student.id, val)}
                                        >
                                            <SelectTrigger
                                                className={cn(
                                                    'w-32',
                                                    current?.status && STATUS_STYLES[current.status],
                                                )}
                                            >
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map((status) => (
                                                    <SelectItem key={status} value={status} className="capitalize">
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
