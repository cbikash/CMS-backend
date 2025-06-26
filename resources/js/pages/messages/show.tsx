import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {Message } from '@/types/posts';
import { formatDate } from 'date-fns';
import axios from 'axios';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/messages',
    },
];


export default function Menus({ message }: {message: Message}) {
    useEffect(() => {
        fnUpdateMessageStatus()
    }, [message]);

    const fnUpdateMessageStatus = async () => {
       await axios.put(`/messages/${message.id}/status`)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />
            <div
                className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                {/* Header */}
                <header className="flex justify-between items-center pb-5 border-b mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{message.title}</h1>
                    <div className="text-xl sm:text-2xl font-bold text-gray-800">
                        {formatDate(message.created_at, 'MMMM EEEE, yyyy')}
                    </div>
                </header>

                {/* Sender Info */}
                <section className="mb-6">
                    <h2 className="font-medium text-gray-700 mb-2 flex items-center">
                        From
                    </h2>
                    <div className="flex flex-col space-y-1">
                        <p className="text-gray-900">{message.name} <span
                            className="text-gray-500">({message.email})</span></p>
                        <p className="text-gray-500">{message.phone || 'No phone provided'}</p>
                    </div>
                </section>

                {/* Body */}
                <section className="mb-6">
                    <h2 className="font-medium text-gray-700 mb-2 flex items-center">
                        Message
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {message.body || 'No message body was provided.'}
                    </p>
                </section>
            </div>
        </AppLayout>
    );
}
