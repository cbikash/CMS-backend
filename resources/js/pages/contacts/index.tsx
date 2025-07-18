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
                <Image  src={field.image ? `/uploads/${field.image}` : '/placeholder.png'} preview={true} className={'w-24 h-24'} />
            </div>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Contact List</h2>
                    <Button icon="pi pi-plus" label="Add Contact" className="p-button-sm" onClick={() => setIsOpen(true)} />
                </div>

                <DataTable value={contacts} tableStyle={{ minWidth: '50rem' }} stripedRows responsiveLayout="scroll">
                    <Column field="image" body={fnImage} header="Image" sortable style={{ width: '120px' }} />
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="phone" header="Phone" sortable />
                    <Column field="created_at" header="Created At" body={(c) => dateFormat(c.created_at)} sortable />
                    <Column field="updated_at" header="Updated At" body={(c) => dateFormat(c.updated_at)} sortable />
                    <Column body={actionGroup} header="Action" style={{ width: '120px' }} />
                </DataTable>
            </div>

            {/* Create/Edit Contact Dialog */}
            <Dialog
                header={contact?.id ? 'Edit Contact' : 'Create New Contact'}
                visible={isOpen}
                style={{ width: '60vw', maxWidth: '700px' }}
                className="p-fluid"
                onHide={() => {
                    setIsOpen(false);
                    setContact({});
                }}
            >
                <div className="mb-6">
                    <FileUpload
                        mode="basic"
                        name="image"
                        accept="image/*"
                        maxFileSize={2000000}
                        customUpload
                        auto={false}
                        chooseLabel="Upload Profile Image"
                        onSelect={(e) => setContact(prev => ({ ...prev, image: e.files[0] }))}
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-4">
                    <FloatLabel>
                        <InputText id="name" value={contact.name || ''} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                        <label htmlFor="name">Full Name</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="email" value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                        <label htmlFor="email">Email Address</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="phone" value={contact.phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                        <label htmlFor="phone">Phone Number</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="designation" value={contact.designation || ''} onChange={(e) => setContact({ ...contact, designation: e.target.value })} />
                        <label htmlFor="designation">Designation</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="facebook" value={contact.facebook || ''} onChange={(e) => setContact({ ...contact, facebook: e.target.value })} />
                        <label htmlFor="facebook">Facebook URL</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="instagram" value={contact.instagram || ''} onChange={(e) => setContact({ ...contact, instagram: e.target.value })} />
                        <label htmlFor="instagram">Instagram URL</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="twitter" value={contact.twitter || ''} onChange={(e) => setContact({ ...contact, twitter: e.target.value })} />
                        <label htmlFor="twitter">Twitter URL</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="linkedin" value={contact.linkedin || ''} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })} />
                        <label htmlFor="linkedin">LinkedIn URL</label>
                    </FloatLabel>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Button label="Cancel" severity="secondary" size="small" onClick={() => setIsOpen(false)} />
                    <Button label="Save Contact" icon="pi pi-check" size="small" onClick={() => contact?.id ? handleUpdate() : handleCreate()} />
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog header="Confirm Delete" visible={isOpenDeleteModel} style={{ width: '30vw' }} onHide={() => setIsOpenDeleteModel(false)}>
                <div className="mb-4 text-sm text-gray-700">
                    Are you sure you want to delete <strong>{contact.name}</strong>?
                </div>
                <div className="flex justify-end gap-2">
                    <Button label="Cancel" severity="secondary" size="small" onClick={() => setIsOpenDeleteModel(false)} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" size="small" onClick={handleDelete} />
                </div>
            </Dialog>
        </AppLayout>
    );

}
