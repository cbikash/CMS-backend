import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {Menu } from '@/types/menus';

import { Button } from 'primereact/button';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menus',
        href: '/menus',
    },
];

export default function Menus({menus}: {menus: Menu[]}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false)
    const [name, setName] = useState<string>('');
    const [menu, setMenu] = useState<Menu | null>(null)

    const fnCreateMenu = () => {
        router.post('/menus', {
            name: name,
        }, {
            onSuccess: () => {
                setIsOpen(false)
            }
        })
    }

    const fnUpdateMenu = () => {
        router.put(`/menus/${menu?.id}`, {
            name: name,
        }, {
            onSuccess: () => {
                setIsOpen(false)
                setMenu(null)
                setName('')
            }
        })
    }

    const fnDeleteMenu = () => {
        router.delete(`/menus/${menu?.id}`, {
            onSuccess: () => {
                setIsOpenDeleteModel(false)
                setMenu(null)
            }
        })
    }

    const dateFormat = (date : string) => {
        const formatted = format(date, 'yyyy-MM-dd HH:mm:ss'); // "2025-06-24 16:15:30"
        return <p>{formatted}</p>;
    }

    const actionGroup = (field: any) => {
        const updateM = () => {
            setMenu(field)
            setName(field.name)
            setIsOpen(true)
        }

        const deleteModel = () => {
            setMenu(field)
            setIsOpenDeleteModel(true)
        }

        return (<>
            <div className={'flex gap-2'}>
                <Button size={'small'} severity="info" icon="pi pi-pencil" onClick={updateM} />
                <Button size={'small'} severity="danger" icon="pi pi-trash" onClick={deleteModel} />
            </div>
        </>)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="flex justify-content-start">
                        <Button size={'small'} onClick={() => setIsOpen(true)}>Menu +</Button>
                    </div>
                </div>
                <div className="">
                    <DataTable value={menus} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
                        <Column field="url" header="URL" sortable style={{ width: '25%' }}></Column>
                        <Column field="created_at" body={(field) => dateFormat(field.created_at)} header="createdAt" sortable style={{ width: '25%' }}></Column>
                        <Column field="updated_at" body={(field) => dateFormat(field.updated_at)} header="Updated" sortable style={{ width: '25%' }}></Column>
                        <Column body={actionGroup} header="Action" style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="card flex justify-content-center">
                <Dialog header="Create Menu" visible={isOpen} style={{ width: '50vw' }} onHide={() => {
                    if (!isOpen) return;
                    setIsOpen(false);
                }}>
                    <div className={'flex flex-col gap-4'}>
                        <div className="w-full mb-4">
                            <InputText
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={'w-full'}
                                placeholder="Name" />
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 items-start">
                        <Button size={'small'} severity="danger" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button size={'small'} onClick={() => menu?.id ? fnUpdateMenu() : fnCreateMenu()}>Save</Button>
                    </div>
                </Dialog>

                <Dialog header="Delete Menu" visible={isOpenDeleteModel} style={{ width: '20vw' }} onHide={() => {
                    if (!isOpenDeleteModel) return;
                    setIsOpen(false);
                }}>
                    <div className={'flex flex-col gap-4'}>
                        <div className="w-full mb-4">
                            <p>Are you sure you want to delete menu?</p>
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 items-start">
                        <Button size={'small'} onClick={() => setIsOpenDeleteModel(false)}>Cancel</Button>
                        <Button size={'small'} severity="danger" onClick={() => fnDeleteMenu()}>Save</Button>
                    </div>
                </Dialog>
            </div>

        </AppLayout>
    );
}
