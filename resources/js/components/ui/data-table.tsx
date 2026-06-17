import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type Column<T> = {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    className?: string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
};

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    keyExtractor,
    loading = false,
    emptyMessage = 'No data found.',
    onRowClick,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSort = useCallback((key: string) => {
        setSortKey((prev) => {
            if (prev === key) {
                setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                return key;
            }
            setSortDir('asc');
            return key;
        });
    }, []);

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortKey, sortDir]);

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        );
    }

    if (sortedData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    'px-4 py-3 text-left font-medium text-muted-foreground',
                                    col.sortable && 'cursor-pointer select-none hover:text-foreground',
                                    col.className,
                                )}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                <div className="flex items-center gap-1">
                                    {col.label}
                                    {col.sortable && (
                                        sortKey === col.key ? (
                                            sortDir === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-30" />
                                        )
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            className={cn(
                                'border-b last:border-0 hover:bg-muted/30 transition-colors',
                                onRowClick && 'cursor-pointer',
                            )}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className={cn('px-4 py-3', col.className)}>
                                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
