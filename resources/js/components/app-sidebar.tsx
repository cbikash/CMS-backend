import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
        permission: 'list menu'
    },
    {
        title: 'Posts',
        href: '/posts',
        icon: AirVentIcon,
        permission: 'list post'
    },
    {
        title: 'Contacts',
        href: '/contacts',
        icon: BookUser,
        permission: 'list contact'
    },
    {
        title: 'FAQs',
        href: '/faqs',
        icon: FileQuestionIcon,
        permission: 'list faq'
    },
    {
        title: 'Subscribers',
        href: '/subscribers',
        icon: SubscriptIcon,
        permission: 'list subscription'
    },
    {
        title: 'Messages',
        href: '/messages',
        icon: MessageCircle,
        permission: 'list message'
    },
    {
        title: 'Sliders',
        href: '/sliders',
        icon: Columns3,
        permission: 'list slider'
    },
    {
        title: 'Testimonials',
        href: '/testimonials',
        icon: DiamondPercent,
        permission: 'list testimonial'
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: LockKeyhole,
        permission: 'list role'
    }

];

const footerNavItems: NavItem[] = [
    {
        title: 'Organization',
        href: '/organization/profile',
        icon: Building,
        permission: 'view organization'
    },
    {
        title: 'Users',
        href: '/users',
        icon: LucideUsers,
        permission: 'list user'
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
