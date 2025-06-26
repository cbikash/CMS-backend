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

export default function Faqs({faqs}: {faqs: FAQ[]}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false)
    const [faq, setFaq] = useState<FAQ>({
        id: null,
        question : '',
        answer: '',
        created_at: '',
        updated_at: ''
    })
    //
    const fnCreateFaq = () => {
        router.post('/faqs', {
            question: faq.question,
            answer: faq.answer,
        }, {
            onSuccess: () => {
                setIsOpen(false)
                setFaq({
                    id: null,
                    question : '',
                    answer: '',
                    created_at: '',
                    updated_at: ''
                });
            }
        })
    }

    const fnUpdateFaq = () => {
        if ('id' in faq) {
            router.put(`/faqs/${faq?.id}`,{
                question: faq.question,
                answer: faq.answer,
            }, {
                onSuccess: () => {
                    setIsOpen(false);
                    setFaq({
                        id: null,
                        question : '',
                        answer: '',
                        created_at: '',
                        updated_at: ''
                    });
                }
            });
        }
    }
    //
    const fnDeleteFaq = () => {
        if ('id' in faq) {
            router.delete(`/faqs/${faq?.id}`, {
                onSuccess: () => {
                    setIsOpenDeleteModel(false);
                    setFaq({
                        id: null,
                        question : '',
                        answer: '',
                        created_at: '',
                        updated_at: ''
                    });
                }
            });
        }
    }

    const actionGroup = (field: any) => {
        const updateM = () => {
            setFaq(field)
            setIsOpen(true)
        }

        const deleteModel = () => {
            setFaq(field)
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
            <Head title="FAQs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="flex justify-content-start">
                        <Button size={'small'} onClick={() => setIsOpen(true)}>FAQs +</Button>
                    </div>
                </div>
                <div className="">
                    <DataTable value={faqs} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="question" header="Question" sortable style={{ width: '30%' }}></Column>
                        <Column field="answer" header="Answer" sortable style={{ width: '75%' }}></Column>
                        <Column body={actionGroup} header="Action" style={{ width: '20%' }}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="card flex justify-content-center">
                <Dialog header="Create FAQs" visible={isOpen} style={{ width: '50vw' }} onHide={() => {
                    if (!isOpen) return;
                    setIsOpen(false);
                }}>
                    <div className={'flex flex-col gap-4'}>
                        <div className="w-full mb-4">
                            <InputText
                                value={faq.question}
                                onChange={(e) => setFaq(item => ({ ...item, question: e.target.value }))}
                                className={'w-full'}
                                placeholder="Question" />
                        </div>
                        <div className="w-full mb-4">
                            <InputTextarea
                                value={faq.answer}
                                rows={4}
                                onChange={(e) => setFaq(item => ({ ...item, answer: e.target.value }))}
                                className={'w-full'}
                                placeholder="Answer" />
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 items-start">
                        <Button size={'small'} severity="danger" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button size={'small'}
                                onClick={() => 'id' in faq && faq?.id ? fnUpdateFaq() : fnCreateFaq()}>Save</Button>
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
                        <Button size={'small'} severity="danger" onClick={() => fnDeleteFaq()}>Save</Button>
                    </div>
                </Dialog>
            </div>

        </AppLayout>
    );
}
