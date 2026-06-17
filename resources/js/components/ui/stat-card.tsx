import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    description?: string;
    trend?: { value: number; direction: 'up' | 'down' };
    variant?: 'default' | 'success' | 'warning' | 'destructive';
};

const variantStyles: Record<string, string> = {
    default: 'border-border',
    success: 'border-emerald-200 dark:border-emerald-800',
    warning: 'border-amber-200 dark:border-amber-800',
    destructive: 'border-red-200 dark:border-red-800',
};

export function StatCard({ title, value, icon: Icon, description, trend, variant = 'default' }: StatCardProps) {
    return (
        <div className={cn('flex flex-col gap-1 rounded-xl border p-4 transition-shadow hover:shadow-sm', variantStyles[variant])}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {title}
                </span>
                {Icon && <Icon className="size-4 text-muted-foreground" />}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{value}</span>
                {trend && (
                    <span className={cn(
                        'flex items-center gap-0.5 text-xs font-medium',
                        trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600',
                    )}>
                        {trend.direction === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {trend.value}%
                    </span>
                )}
            </div>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
