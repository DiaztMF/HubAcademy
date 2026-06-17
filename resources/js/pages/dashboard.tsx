import { Head } from '@inertiajs/react';
import { BookOpen, UserCheck, Users } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { dashboard } from '@/routes';

const sampleColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' },
];

const sampleData = [
    { name: 'Adi Pratama', role: 'Student', status: 'Active' },
    { name: 'Budi Santoso', role: 'Student', status: 'Active' },
    { name: 'Mr. Andi', role: 'Teacher', status: 'Active' },
];

export default function Dashboard({ stats, role }: { stats?: Record<string, number>; role?: string }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <StatCard
                        title="Students"
                        value={stats?.total_students ?? 0}
                        icon={Users}
                    />
                    <StatCard
                        title="Teachers"
                        value={stats?.total_teachers ?? 0}
                        icon={UserCheck}
                    />
                    <StatCard
                        title="Courses"
                        value={stats?.total_courses ?? 0}
                        icon={BookOpen}
                    />
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-medium">Recent Users</h3>
                    <DataTable
                        columns={sampleColumns}
                        data={sampleData}
                        keyExtractor={(item) => item.name}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
