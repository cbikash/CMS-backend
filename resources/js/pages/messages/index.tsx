import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {Message } from '@/types/posts';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { format } from 'date-fns';
import { EyeIcon } from 'lucide-react';
import { Badge } from 'primereact/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/messages',
    },
];


export default function Messages({messages}: {messages: Message[]}) {
    const dateFormat = (date : string) => {
        const formatted = format(date, 'yyyy-MM-dd HH:mm:ss'); // "2025-06-24 16:15:30"
        return <p>{formatted}</p>;
    }

    const fnActionGroup = (message: Message) => {
        return (
            <div>
                <Link href={`/messages/${message.id}`}><EyeIcon className={'text-blue-500'} /></Link>
            </div>
        )
    }

    const rnStatus = (status: string) => {
        return (
            <Badge value={`${status}`} severity={status == 'read' ? 'success' : 'danger'}></Badge>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="">
                    <DataTable value={messages} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
                        <Column field="email" header="Email" sortable style={{ width: '25%' }}></Column>
                        <Column field="title" header="Subject" sortable style={{ width: '25%' }}></Column>
                        <Column field="status" body={(field) => rnStatus(field.status)} header="Status" sortable style={{ width: '25%' }}></Column>
                        <Column field="created_at" body={(field) => dateFormat(field.created_at)} header="createdAt" sortable style={{ width: '25%' }}></Column>
                        <Column field="updated_at" body={(field) => dateFormat(field.updated_at)} header="Updated" sortable style={{ width: '25%' }}></Column>
                        <Column body={fnActionGroup} header="Action" style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>

        </AppLayout>
    );
}
