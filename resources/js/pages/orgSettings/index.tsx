import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { format } from 'date-fns';
import { Badge } from 'primereact/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subscribers',
        href: '/Subscribers',
    },
];

interface Subscriber{
    email: string,
    created_at: string,
    status: string,
}

export default function Menus({subscribers}: {subscribers: Subscriber[]}) {
    const dateFormat = (date : string) => {
        const formatted = format(date, 'yyyy-MM-dd HH:mm:ss'); // "2025-06-24 16:15:30"
        return <p>{formatted}</p>;
    }

    const rnStatus = (status: string) => {
        return (
            <Badge value={`${status}`} severity={status == 'subscribed' ? 'success' : 'danger'}></Badge>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscribers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="">
                    <DataTable value={subscribers} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="email" header="Email" sortable style={{ width: '50%' }}></Column>
                        <Column field="status" header="Status" sortable style={{ width: '25%' }} body={(field) => rnStatus(field.status)}></Column>
                        <Column field="created_at" body={(field) => dateFormat(field.created_at)} header="createdAt" sortable style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>
        </AppLayout>
    );
}
