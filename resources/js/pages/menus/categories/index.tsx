import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {Menu, Category } from '@/types/menus';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { format } from 'date-fns';

export default function MenusCategories({menu, categories}: {menu: Menu, categories: Category[]}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false)
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<Category | null>(null)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Menus',
            href: '/menus',
        },
        {
            title: `${menu.name} Categories`,
            href: '/menus/categories',
        },
    ];
    const fnCreateMenu = () => {
        router.post(`/menus/${menu.id}/categories`, {
            name: name,
        }, {
            onSuccess: () => {
                setIsOpen(false)
            }
        })
    }

    const fnUpdateMenu = () => {
        router.put(`/menus/${menu?.id}/categories/${category?.id}`, {
            name: name,
        }, {
            onSuccess: () => {
                setIsOpen(false)
                setCategory(null)
                setName('')
            }
        })
    }

    const fnDeleteMenu = () => {
        router.delete(`/menus/${menu?.id}/categories/${category?.id}`, {
            onSuccess: () => {
                setIsOpenDeleteModel(false)
                setCategory(null)
            }
        })
    }

    const dateFormat = (date : string) => {
        const formatted = format(date, 'yyyy-MM-dd HH:mm:ss'); // "2025-06-24 16:15:30"
        return <p>{formatted}</p>;
    }

    const actionGroup = (field: any) => {
        const updateM = () => {
            setCategory(field)
            setName(field.name)
            setIsOpen(true)
        }

        const deleteModel = () => {
            setCategory(field)
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
            <Head title={`${menu.name} Categories`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Categories of {menu.name}</h2>
                    <Button icon="pi pi-plus" label="Add Category" className="p-button-sm"
                            onClick={() => setIsOpen(true)} />
                </div>
                <div className="">
                    <DataTable value={categories} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
                        <Column field="created_at" body={(field) => dateFormat(field.created_at)} header="createdAt"
                                sortable style={{ width: '25%' }}></Column>
                        <Column field="updated_at" body={(field) => dateFormat(field.updated_at)} header="Updated"
                                sortable style={{ width: '25%' }}></Column>
                        <Column body={actionGroup} header="Action" style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="card flex justify-content-center">
                <Dialog header={`Create ${menu.name} Category`} visible={isOpen} style={{ width: '50vw' }}
                        onHide={() => {
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
                        <Button size={'small'} onClick={() => category?.id ? fnUpdateMenu() : fnCreateMenu()}>Save</Button>
                    </div>
                </Dialog>

                <Dialog header="Delete Category" visible={isOpenDeleteModel} style={{ width: '40vw' }} onHide={() => setIsOpen(false)} >
                    <div className={'flex flex-col gap-4'}>
                        <div className="w-full mb-4">
                            <p>Are you sure you want to delete Category?</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 items-start">
                        <Button size={'small'} onClick={() => setIsOpenDeleteModel(false)}>Cancel</Button>
                        <Button size={'small'} severity="danger" onClick={() => fnDeleteMenu()}>Save</Button>
                    </div>
                </Dialog>
            </div>

        </AppLayout>
    );
}
