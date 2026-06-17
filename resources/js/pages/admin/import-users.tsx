import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Import Users', href: admin.import.users() },
];

export default function ImportUsers() {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
        role: 'student',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/import-users');
    }

    return (
        <>
            <Head title="Import Users" />
            <div className="max-w-xl space-y-6">
                <Heading title="Import Users" description="Upload a CSV or Excel file to bulk-create user accounts." />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="role">User Role</Label>
                        <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">CSV / Excel File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Required columns: name, email. Optional: nisn, class, major, password.
                        </p>
                        <InputError message={errors.file} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Importing...' : 'Import Users'}
                    </Button>
                </form>
            </div>
        </>
    );
}

ImportUsers.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs} children={page} />;
