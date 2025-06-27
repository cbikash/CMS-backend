import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    MenuSquare,
    FolderCheckIcon,
    AirVentIcon,
    ImageIcon,
    Folder,
    LayoutGrid,
    FileQuestionIcon, SubscriptIcon, MessageCircle
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
        title: 'Pages',
        href: '/pages',
        icon: FolderCheckIcon,
    },
    {
        title: 'Posts',
        href: '/posts',
        icon: AirVentIcon,
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

];

const footerNavItems: NavItem[] = [
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
