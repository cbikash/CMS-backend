import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Testimonial } from '@/types/menus';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { format } from 'date-fns';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { Image } from 'primereact/image';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimonials',
        href: '/testimonials',
    },
];

const testimonialInitial: Testimonial = {
    name: '',
    description: '',
    designation: '',
    image: '',
    source: '',
}

export default function Testimonials({ testimonials }: {testimonials: Testimonial[]}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false)
    const [testimonial, setTestimonial] = useState<Testimonial >(testimonialInitial)

    const fnCreateMenu = () => {
        const formData = new FormData();
        formData.append('name', testimonial.name);
        formData.append('description', testimonial.description || '');
        formData.append('designation', testimonial.designation || '');
        formData.append('source', testimonial.source || 'web');
        formData.append('image', testimonial.image || '');

        router.post('/testimonials', formData, {
            onSuccess: () => {
                setIsOpen(false)
                router.reload({
                    only: ['testimonials'],
                })
            }
        })
    }

    const fnUpdateMenu = () => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', testimonial.name);
        formData.append('description', testimonial.description || '');
        formData.append('designation', testimonial.designation || '');
        formData.append('source', testimonial.source || 'web');
        formData.append('image', testimonial.image || '');


        router.post(`/testimonials/${testimonial?.id}`, formData, {
            onSuccess: () => {
                setIsOpen(false)
                setTestimonial({
                    name: '',
                    description: '',
                    designation: '',
                    image: '',
                    source: '',
                })

                router.reload({
                    only: ['testimonials'],
                })
            }
        })
    }

    const fnDeleteMenu = () => {
        router.delete(`/testimonials/${testimonial?.id}`, {
            onSuccess: () => {
                setIsOpenDeleteModel(false)
                setTestimonial({
                    name: '',
                    description: '',
                    designation: '',
                    image: '',
                    source: '',
                })
            }
        })
    }

    const dateFormat = (date : string) => {
        const formatted = format(date, 'yyyy-MM-dd HH:mm:ss'); // "2025-06-24 16:15:30"
        return <p>{formatted}</p>;
    }

    const actionGroup = (field: any) => {
        console.log(field)
        const updateM = () => {
            setTestimonial(field)
            setIsOpen(true)
        }

        const deleteModel = () => {
            setTestimonial(field)
            setIsOpenDeleteModel(true)
        }

        return (<>
            <div className={'flex gap-2'}>
                <Button size={'small'} severity="info" icon="pi pi-pencil" onClick={updateM} />
                <Button size={'small'} severity="danger" icon="pi pi-trash" onClick={deleteModel} />
            </div>
        </>)
    }

    const fnImage = (field: any) => {
        return (
            <div className={'flex gap-2'}>
               <Image src={`/uploads/${field.image}`} preview={true} className={'w-24 h-24'} />
            </div>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="">
                    <div className="flex justify-end">
                        <Button size={'small'} onClick={() => setIsOpen(true)}>Testimonial +</Button>
                    </div>
                </div>
                <div className="">
                    <DataTable value={testimonials} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="image" header="Image" body={fnImage} sortable style={{ width: '25%' }}></Column>
                        <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
                        <Column field="designation" header="Designation" sortable style={{ width: '25%' }}></Column>
                        <Column field="source" header="Source" sortable style={{ width: '25%' }}></Column>
                        <Column field="created_at" body={(field) => dateFormat(field.created_at)} header="createdAt" sortable style={{ width: '25%' }}></Column>
                        <Column body={actionGroup} header="Action" style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="card flex justify-content-center">
                <Dialog header="Create Testimonial" visible={isOpen} style={{ width: '50vw' }} onHide={() => {
                    if (!isOpen) return;
                    setIsOpen(false);
                    setTestimonial(testimonialInitial)
                }}>
                    <div className="w-full mb-4">
                        <FileUpload
                            mode="basic"
                            name="image"
                            accept="image/*"
                            maxFileSize={2000000}
                            customUpload
                            auto={false}
                            chooseLabel="Choose Profile"
                            onSelect={(e) => setTestimonial(prev => ({ ...prev, image: e.files[0] }))}
                            className="w-full"
                        />
                    </div>

                    <div className={'flex flex-row gap-2'}>

                        <div className="w-full mb-4">
                            <InputText
                                value={testimonial.name}
                                onChange={(e) => setTestimonial((prev) => ({
                                    ...prev,
                                    ['name']: e.target.value
                                }))}
                                className={'w-full'}
                                placeholder="Name" />
                        </div>
                        <div className="w-full mb-4">
                            <InputText
                                value={testimonial.designation}
                                onChange={(e) => setTestimonial((prev) => ({
                                    ...prev,
                                    ['designation']: e.target.value
                                }))}
                                className={'w-full'}
                                placeholder="Designation" />
                        </div>
                    </div>

                    <div className="w-full mb-4">
                        <InputTextarea placeholder={'Description'} className={'w-full'}
                                       value={testimonial.description || '' }
                                       onChange={(e) => setTestimonial((prev) => ({
                                           ...prev,
                                           ['description']: e.target.value
                                       }))} />
                    </div>

                    <div className="flex justify-start gap-4 items-start">
                        <Button size={'small'} severity="danger" onClick={() => {
                            setIsOpen(false)
                            setTestimonial(testimonialInitial)
                        }}>Cancel</Button>
                        <Button size={'small'} onClick={() => testimonial?.id ? fnUpdateMenu() : fnCreateMenu()}>Save</Button>
                    </div>
                </Dialog>

                <Dialog header="Delete Testimonial" visible={isOpenDeleteModel} style={{ width: '30vw' }} onHide={() => {
                    if (!isOpenDeleteModel) return;
                    setIsOpenDeleteModel(false);
                    setTestimonial(testimonialInitial)
                }}>
                    <div className={'flex flex-col gap-4'}>
                        <div className="w-full mb-4">
                            <p>Are you sure you want to delete testimonial?</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 items-start">
                        <Button size={'small'} onClick={() => {
                            setIsOpenDeleteModel(false);
                            setTestimonial(testimonialInitial)
                        }}>Cancel</Button>
                        <Button size={'small'} severity="danger" onClick={() => fnDeleteMenu()}>Save</Button>
                    </div>
                </Dialog>
            </div>

        </AppLayout>
    );
}
