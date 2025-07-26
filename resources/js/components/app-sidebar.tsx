import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    MenuSquare,
    AirVentIcon,
    Folder,
    LayoutGrid,
    FileQuestionIcon,
    SubscriptIcon,
    MessageCircle,
    Building,
    Columns3,
    DiamondPercent,
    BookUser,
    LucideUsers,
    LockKeyhole
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Menus',
        href: '/menus',
        icon: MenuSquare,
    },
    {
        title: 'Posts',
        href: '/posts',
        icon: AirVentIcon,
    },
    {
        title: 'Contacts',
        href: '/contacts',
        icon: BookUser,
    },
    {
        title: 'FAQs',
        href: '/faqs',
        icon: FileQuestionIcon,
    },
    {
        title: 'Subscribers',
        href: '/subscribers',
        icon: SubscriptIcon,
    },
    {
        title: 'Messages',
        href: '/messages',
        icon: MessageCircle,
    },
    {
        title: 'Sliders',
        href: '/sliders',
        icon: Columns3,
    },
    {
        title: 'Testimonials',
        href: '/testimonials',
        icon: DiamondPercent,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: LockKeyhole,
    }

];

const footerNavItems: NavItem[] = [
    {
        title: 'Organization',
        href: '/organization/profile',
        icon: Building,
    },
    {
        title: 'Users',
        href: '/users',
        icon: LucideUsers,
    },
    {
        title: 'Setting',
        href: '/settings',
        icon: Folder,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {/*<NavUser />*/}
            </SidebarFooter>
        </Sidebar>
    );
}
