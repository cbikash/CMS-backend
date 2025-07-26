import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { BreadcrumbItem } from '@/types';
import { Role } from '@/types/role';
import dayjs from 'dayjs';
import { EditIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role',
        href: '/roles',
    },
];

const actionBodyTemplate = (role: Role) => (
    <div className="flex gap-3 justify-center">
        <Link
            href={`/roles/${role.id}/edit`}
            className="text-indigo-500 hover:text-indigo-700 transition-colors"
            title="Edit"
        >
            <EditIcon className="w-5 h-5" />
        </Link>
    </div>
);

export default function RolePage ({ roles } : { roles: Role[]}) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscribers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Role Management</h2>
                    <Link
                        href={'/roles/create'}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                    >
                        + New Role
                    </Link>
                </div>

                <div className="">
                    <DataTable value={roles} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
                        <Column field="guard_name" header="Guard" sortable style={{ width: '25%' }}></Column>
                        <Column field="created_at"
                                body={(field) => dayjs(field.created_at).format('DD MMM YYYY, HH:mm')}
                                header="createdAt" sortable style={{ width: '25%' }}></Column>
                        <Column field="updated_at"
                                body={(field) => dayjs(field.updated_at).format('DD MMM YYYY, HH:mm')}
                                header="createdAt" sortable style={{ width: '25%' }}></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            style={{ width: '100px' }}
                            exportable={false}
                        />
                    </DataTable>
                </div>
            </div>
        </AppLayout>
    )
}
