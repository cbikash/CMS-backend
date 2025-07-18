import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FAQ } from '@/types/faq';
import { InputTextarea } from 'primereact/inputtextarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQs',
        href: '/faqs',
    },
];

export default function Faqs({ faqs }: { faqs: FAQ[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);
    const [faq, setFaq] = useState<FAQ>({
        id: null,
        question: '',
        answer: '',
        created_at: '',
        updated_at: ''
    });

    const resetForm = () => {
        setFaq({
            id: null,
            question: '',
            answer: '',
            created_at: '',
            updated_at: ''
        });
    };

    const fnCreateFaq = () => {
        router.post('/faqs', {
            question: faq.question,
            answer: faq.answer,
        }, {
            onSuccess: () => {
                setIsOpen(false);
                resetForm();
            }
        });
    };

    const fnUpdateFaq = () => {
        if (!faq.id) return;

        router.put(`/faqs/${faq.id}`, {
            question: faq.question,
            answer: faq.answer,
        }, {
            onSuccess: () => {
                setIsOpen(false);
                resetForm();
            }
        });
    };

    const fnDeleteFaq = () => {
        if (!faq.id) return;

        router.delete(`/faqs/${faq.id}`, {
            onSuccess: () => {
                setIsOpenDeleteModel(false);
                resetForm();
            }
        });
    };

    const openEditDialog = (item: FAQ) => {
        setFaq(item);
        setIsOpen(true);
    };

    const openDeleteDialog = (item: FAQ) => {
        setFaq(item);
        setIsOpenDeleteModel(true);
    };

    const actionGroup = (item: FAQ) => (
        <div className="flex gap-2">
            <Button size="small" icon="pi pi-pencil" severity="info" onClick={() => openEditDialog(item)} />
            <Button size="small" icon="pi pi-trash" severity="danger" onClick={() => openDeleteDialog(item)} />
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQs" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">FAQ Management</h2>
                    <Button icon="pi pi-plus" label="Add FAQ" className="p-button-sm" onClick={() => setIsOpen(true)} />
                </div>

                <DataTable value={faqs} stripedRows responsiveLayout="scroll" tableStyle={{ minWidth: '60rem' }}>
                    <Column field="question" header="Question" style={{ width: '35%' }} />
                    <Column field="answer" header="Answer" style={{ width: '55%' }} />
                    <Column body={actionGroup} header="Actions" style={{ width: '10%' }} />
                </DataTable>
            </div>

            {/* Create / Edit Dialog */}
            <Dialog
                header={faq.id ? 'Edit FAQ' : 'Create FAQ'}
                visible={isOpen}
                style={{ width: '50vw' }}
                className="p-fluid"
                onHide={() => {
                    setIsOpen(false);
                    resetForm();
                }}
            >
                <div className="flex flex-col gap-4 mb-4">
                    <InputText
                        value={faq.question}
                        onChange={(e) => setFaq(prev => ({ ...prev, question: e.target.value }))}
                        placeholder="Enter your question"
                        className="w-full"
                    />

                    <InputTextarea
                        rows={5}
                        value={faq.answer}
                        onChange={(e) => setFaq(prev => ({ ...prev, answer: e.target.value }))}
                        placeholder="Enter the answer"
                        className="w-full"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button label="Cancel" severity="secondary" size="small" onClick={() => setIsOpen(false)} />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        size="small"
                        onClick={() => faq?.id ? fnUpdateFaq() : fnCreateFaq()}
                    />
                </div>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                header="Delete FAQ"
                visible={isOpenDeleteModel}
                style={{ width: '30vw' }}
                onHide={() => setIsOpenDeleteModel(false)}
            >
                <div className="text-sm text-gray-700 mb-4">
                    Are you sure you want to delete this FAQ?
                    <p className="mt-2 italic text-gray-500">"{faq.question}"</p>
                </div>

                <div className="flex justify-end gap-2">
                    <Button label="Cancel" severity="secondary" size="small" onClick={() => setIsOpenDeleteModel(false)} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" size="small" onClick={fnDeleteFaq} />
                </div>
            </Dialog>
        </AppLayout>
    );
}
