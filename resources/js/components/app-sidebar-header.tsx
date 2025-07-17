import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { Bell, Search, Home, Settings, Shield, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Link, router, usePage } from '@inertiajs/react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';


export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [notifOpen, setNotifOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const getInitials = useInitials();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target as Node)
            ) {
                setNotifOpen(false);
            }
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Left side */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <SearchDropdown />

                {/* Language */}
                <div className="w-6 h-6 rounded overflow-hidden">
                    <img
                        src="https://flagcdn.com/gb.svg"
                        alt="English"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Notification */}
                <div className="relative" ref={notifRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative"
                    >
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            2
                        </span>
                    </Button>

                    {notifOpen && (
                        <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
                            <div className="py-2 text-sm text-gray-700">
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    📬 New message from John
                                </div>
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    📢 Announcement: New feature!
                                </div>
                            </div>
                            <div className="border-t px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-100 cursor-pointer">
                                View all notifications
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar with dropdown */}

                <div className="relative" ref={menuRef}>
                    <Avatar onClick={() => setMenuOpen(!menuOpen)} className="h-8 w-8 overflow-hidden border-2  border-yellow-300 rounded-full cursor-pointer">
                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>


                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border z-50">
                            <div className="px-4 py-3 border-b">
                                <div className="font-semibold text-sm">{auth.user.name}</div>
                                <div className="text-xs text-gray-500">{auth.user.email}</div>
                            </div>
                            <div className="py-2 text-sm text-gray-700">
                                <Link href={'/dashboard'} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                                <Link href={'/settings/profile'} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                            </div>

                            <Link className="w-full border-t px-4 py-2 text-red-600 hover:bg-red-50 text-sm cursor-pointer" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                                Log out
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}


function SearchDropdown() {
    const [open, setOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={searchRef}>
            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
                <Search className="h-5 w-5 text-gray-600" />
            </Button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 p-4 bg-white rounded-xl shadow-xl z-50">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 text-sm text-gray-500">
                        Try to search.
                    </div>
                </div>
            )}
        </div>
    );
}
