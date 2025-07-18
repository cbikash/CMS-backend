import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Post } from '@/types/posts';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { format } from 'date-fns';
import { EditIcon, EyeIcon } from 'lucide-react';
import { Badge } from 'primereact/badge';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Menu } from '@/types/menus';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: '/posts' },
];

export default function Posts({ posts, menu }: { posts: Post[], menu: Menu }) {
    const [menus, setMenus] = useState<Menu[]>([]);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = () => {
        axios.get('/ajax/menuNames').then(res => setMenus(res.data.data.menus));
    };

    const formatDate = (date: string) => {
        if (!date) return '-';
        return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
    };

    const renderStatus = (status: string) => {
        const severity = status === 'read' ? 'success' : 'danger';
        return <Badge value={status} severity={severity} className="capitalize" />;
    };

    const renderImage = (image: string, post: Post) => {
        return (
            <img
                src={`/uploads/${image}`}
                alt={post.title}
                className="h-16 w-auto rounded-md object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png'; // fallback image if needed
                }}
            />
        );
    };

    const actionBodyTemplate = (post: Post) => {
        return (
            <div className={'flex flex-row gap-2'}>
                <Link
                    href={`/posts/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    aria-label={`View details of ${post.title}`}
                >
                    <EyeIcon className="w-5 h-5" />
                </Link>
                <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    aria-label={`View details of ${post.title}`}
                >
                    <EditIcon className="w-5 h-5" />
                </Link>
            </div>


        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Posts of {menu.name}</h1>
                    <Link
                        href="/posts/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                    >
                        + New Post
                    </Link>
                </div>

                <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <DataTable
                        value={posts}
                        size="small"
                        responsiveLayout="scroll"
                        tableClassName="min-w-full"
                        emptyMessage="No posts found."
                    >
                        <Column
                            header="Image"
                            body={(row) => renderImage(row.image, row)}
                            sortable
                            style={{ width: '10rem' }}
                        />
                        <Column field="title" header="Title" sortable style={{ minWidth: '14rem' }} />
                        <Column
                            field="status"
                            header="Status"
                            body={(row) => renderStatus(row.status)}
                            sortable
                            style={{ width: '8rem' }}
                        />
                        <Column
                            field="created_at"
                            header="Created At"
                            body={(row) => formatDate(row.created_at)}
                            sortable
                            style={{ minWidth: '12rem' }}
                        />
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            style={{ width: '8rem' }}
                            exportable={false}
                        />
                    </DataTable>
                </div>
            </div>
        </AppLayout>
    );
}
