import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { format } from 'date-fns';
import { Contact } from '@/types/posts';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { FloatLabel } from 'primereact/floatlabel';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contacts',
        href: '/contacts',
    },
];

export default function Contacts({ contacts }: { contacts: Contact[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);
    const [contact, setContact] = useState<Partial<Contact>>({});

    const handleCreate = () => {
        router.post('/contacts', buildFormData(), {
            onSuccess: () => {
                setIsOpen(false);
                setContact({});
            },
        });
    };

    const handleUpdate = () => {
        if (!contact?.id) return;

        router.post(`/contacts/${contact.id}`, buildFormData(), {
            onSuccess: () => {
                setIsOpen(false);
                setContact({});
            },
        });
    };

    const buildFormData = () => {
        const formData = new FormData();
        if(contact.id) formData.append('_method', 'PUT');
        if (contact.name) formData.append('name', contact.name);
        if (contact.email) formData.append('email', contact.email);
        if (contact.phone) formData.append('phone', contact.phone);
        if (contact.designation) formData.append('designation', contact.designation);
        if (contact.facebook) formData.append('facebook', contact.facebook);
        if (contact.twitter) formData.append('twitter', contact.twitter);
        if (contact.instagram) formData.append('instagram', contact.instagram);
        if (contact.linkedin) formData.append('linkedin', contact.linkedin);

         formData.append('image', contact.image || '');
        return formData;
    };


    const handleDelete = () => {
        if (!contact?.id) return;

        router.delete(`/contacts/${contact.id}`, {
            onSuccess: () => {
                setIsOpenDeleteModel(false);
                setContact({});
            },
        });
    };

    const openEdit = (c: Contact) => {
        setContact(c);
        setIsOpen(true);
    };

    const openDelete = (c: Contact) => {
        setContact(c);
        setIsOpenDeleteModel(true);
    };

    const dateFormat = (date: string) => format(date, 'yyyy-MM-dd HH:mm:ss');

    const actionGroup = (c: Contact) => (
        <div className="flex gap-2">
            <Button size="small" severity="info" icon="pi pi-pencil" onClick={() => openEdit(c)} />
            <Button size="small" severity="danger" icon="pi pi-trash" onClick={() => openDelete(c)} />
        </div>
    );


    const fnImage = (field: any) => {
        return (
            <div className={'flex gap-2'}>
                <Image src={`/uploads/${field.image}`} preview={true} className={'w-24 h-24'} />
            </div>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-end">
                    <Button size="small" onClick={() => setIsOpen(true)}>Add Contact +</Button>
                </div>
                <DataTable value={contacts} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="image" body={fnImage} header="Image" sortable />
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="phone" header="Phone" sortable />
                    <Column field="created_at" header="Created At" body={(c) => dateFormat(c.created_at)} sortable />
                    <Column field="updated_at" header="Updated At" body={(c) => dateFormat(c.updated_at)} sortable />
                    <Column body={actionGroup} header="Action" />
                </DataTable>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog
                header={contact?.id ? 'Edit Contact' : 'Create Contact'}
                visible={isOpen}
                style={{ width: '50vw' }}
                onHide={() => setIsOpen(false)}
            >
                <div className="w-full mb-8">
                    <FileUpload
                        mode="basic"
                        name="image"
                        accept="image/*"
                        maxFileSize={2000000}
                        customUpload
                        auto={false}
                        chooseLabel="Choose Profile"
                        onSelect={(e) => setContact(prev => ({ ...prev, image: e.files[0] }))}
                        className="w-full"
                    />
                </div>

                <div className="flex flex-row gap-4 mb-8">
                    <FloatLabel className="w-full">
                        <InputText id="name" value={contact.name || ''} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="w-full" />
                        <label htmlFor="name">Name</label>
                    </FloatLabel>
                    <FloatLabel className="w-full">
                        <InputText id="email" value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="w-full" />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                </div>

                <div className="flex flex-row gap-4 mb-8">
                    <FloatLabel className="w-full">
                        <InputText id="phone" value={contact.phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="w-full" />
                        <label htmlFor="phone">Phone</label>
                    </FloatLabel>
                    <FloatLabel className="w-full">
                        <InputText id="designation" value={contact.designation || ''} onChange={(e) => setContact({ ...contact, designation: e.target.value })} className="w-full" />
                        <label htmlFor="designation">Designation</label>
                    </FloatLabel>
                </div>

                <div className="flex flex-row gap-4 mb-8">
                    <FloatLabel className="w-full">
                        <InputText id="facebook" value={contact.facebook || ''} onChange={(e) => setContact({ ...contact, facebook: e.target.value })} className="w-full" />
                        <label htmlFor="facebook">Facebook</label>
                    </FloatLabel>
                    <FloatLabel className="w-full">
                        <InputText id="instagram" value={contact.instagram || ''} onChange={(e) => setContact({ ...contact, instagram: e.target.value })} className="w-full" />
                        <label htmlFor="instagram">Instagram</label>
                    </FloatLabel>
                </div>

                <div className="flex flex-row gap-4 mb-8">
                    <FloatLabel className="w-full">
                        <InputText id="twitter" value={contact.twitter || ''} onChange={(e) => setContact({ ...contact, twitter: e.target.value })} className="w-full" />
                        <label htmlFor="twitter">Twitter</label>
                    </FloatLabel>
                    <FloatLabel className="w-full">
                        <InputText id="linkedin" value={contact.linkedin || ''} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })} className="w-full" />
                        <label htmlFor="linkedin">LinkedIn</label>
                    </FloatLabel>
                </div>

                <div className="flex justify-start gap-4 mt-8">
                    <Button size="small" severity="danger" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button size="small" onClick={() => contact?.id ? handleUpdate() : handleCreate()}>Save</Button>
                </div>
            </Dialog>


            {/* Delete Dialog */}
            <Dialog header="Delete Contact" visible={isOpenDeleteModel} style={{ width: '20vw' }}
                    onHide={() => setIsOpenDeleteModel(false)}>
                <div className="mb-4">
                    <p>Are you sure you want to delete this contact?</p>
                </div>
                <div className="flex justify-start gap-4">
                    <Button size="small" onClick={() => setIsOpenDeleteModel(false)}>Cancel</Button>
                    <Button size="small" severity="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Dialog>
        </AppLayout>
    );
}
