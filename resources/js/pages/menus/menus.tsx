import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {Menu } from '@/types/menus';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { format } from 'date-fns';
import { InputSwitch } from 'primereact/inputswitch';
import { SelectButton } from 'primereact/selectbutton';
import { Tag } from 'primereact/tag';

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
    const [isVisiable, setIsVisiable] = useState(true)
    const options = ['main', 'sub'];
    const [value, setValue] = useState(options[0]);


    const fnCreateMenu = () => {
        router.post('/menus', {
            name: name,
            is_visible: isVisiable,
            type: value
        }, {
            onSuccess: () => {
                setIsOpen(false)
            }
        })
    }

    const fnUpdateMenu = () => {
        router.put(`/menus/${menu?.id}`, {
            name: name,
            is_visible: isVisiable,
            type: value
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
            setIsVisiable(field.is_visible)
            setValue(field.type)
            setIsOpen(true)
        }

        const deleteModel = () => {
            setMenu(field)
            setIsOpenDeleteModel(true)
        }

        return (<>
            <div className={'flex gap-2'}>
                <Button severity="warning" icon="pi pi-chart-bar" onClick={() => router.get(`/menus/${field.id}/categories`)}></Button>
                <Button size={'small'} severity="info" icon="pi pi-pencil" onClick={updateM} />
                <Button size={'small'} severity="danger" icon="pi pi-trash" onClick={deleteModel} />
            </div>
        </>)
    }

    const fnName = (field: any) => {
        return (
            <div className={'flex gap-2'}>
                <Link className={'text-blue-400'} href={`/menus/${field.id}/posts`}>{field.name}</Link>
            </div>
        )
    }

    const fnIsVisible = (field : any) => {
        return (
            <div>
                <Tag value={`${field.is_visible ? 'Yes' : 'No'}`}></Tag>
            </div>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="">
                    <div className="flex justify-end">
                        <Button size={'small'} onClick={() => setIsOpen(true)}>Menu +</Button>
                    </div>
                </div>
                <div className="">
                    <DataTable value={menus} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" body={fnName} header="Name" sortable style={{ width: '25%' }}></Column>
                        <Column field="url"  header="URL" sortable style={{ width: '25%' }}></Column>
                        <Column field="is_visible" body={fnIsVisible} header="Visiable" sortable style={{ width: '25%' }}></Column>
                        <Column field="type" header="Type" sortable style={{ width: '25%' }}></Column>
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

                    <div className="card flex flex-grow justify-content-center mb-5">
                        <div className={'w-1/2 flex flex-col gap-2'}>
                            <span>Menu Type</span>
                            <SelectButton value={value} onChange={(e) => setValue(e.value)} options={options} />
                        </div>
                        <div className={'w-1/2 flex flex-col gap-2'}>
                            <span className={'mr-4'}>Menu Visible</span>
                            <InputSwitch checked={isVisiable} onChange={(e) => setIsVisiable(e.value)} />
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 mt-5 items-start">
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
