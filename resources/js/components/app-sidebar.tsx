import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    MessageCircle,
    Newspaper,
    NotebookPen,
    Bell,
    ScrollText,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as attendanceIndex } from '@/routes/attendance';
import { index as chatIndex } from '@/routes/chat';
import { index as forumIndex } from '@/routes/forum';
import lms from '@/routes/lms';
import { index as logbookIndex } from '@/routes/logbook';
import { index as newsIndex } from '@/routes/news';
import { index as notificationIndex } from '@/routes/notifications';
import { index as portfolioIndex } from '@/routes/portfolio';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Courses',
        href: lms.courses.index(),
        icon: GraduationCap,
    },
    {
        title: 'Attendance',
        href: attendanceIndex(),
        icon: ClipboardList,
        roles: ['admin', 'teacher'],
    },
    {
        title: 'Portfolio',
        href: portfolioIndex(),
        icon: FolderGit2,
    },
    {
        title: 'Logbook',
        href: logbookIndex(),
        icon: NotebookPen,
        roles: ['admin', 'teacher', 'student', 'industry-mentor'],
    },
    {
        title: 'Forum',
        href: forumIndex(),
        icon: MessageCircle,
    },
    {
        title: 'Chat',
        href: chatIndex(),
        icon: ScrollText,
    },
    {
        title: 'News',
        href: newsIndex(),
        icon: Newspaper,
    },
    {
        title: 'Notifications',
        href: notificationIndex(),
        icon: Bell,
    },
    {
        title: 'Import Users',
        href: '/admin/import-users',
        icon: Users,
        roles: ['admin'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/DiaztMF/HubAcademy',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth?.user as { roles?: string[] } | undefined;
    const userRole = user?.roles?.[0];

    function filterByRole(items: NavItem[]): NavItem[] {
        return items.filter((item) => !item.roles || (userRole && item.roles.includes(userRole)));
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filterByRole(mainNavItems)} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
