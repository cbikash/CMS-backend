import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Message } from '@/types/posts';
import { format } from 'date-fns';
import axios from 'axios';
import { useEffect, useCallback, useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/messages',
    },
];

interface MessagesProps {
    message: Message;
}

export default function Messages({ message }: MessagesProps) {
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateMessageStatus = useCallback(async () => {
        try {
            await axios.put(`/messages/${message.id}/status`);
            setIsStatusUpdated(true);
        } catch (err) {
            setError('Failed to update message status. Please try again.');
            console.error('Failed to update message status:', err);
        }
    }, [message.id]);

    useEffect(() => {
        updateMessageStatus();
    }, [updateMessageStatus]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Message: ${message.title}`} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <a
                                href="/messages"
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Back to messages"
                            >
                                <ArrowLeftIcon className="h-6 w-6" />
                            </a>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 truncate">
                                {message.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <time
                                className="text-sm sm:text-base text-gray-600"
                                dateTime={message.created_at}
                            >
                                {format(new Date(message.created_at), 'MMMM d, yyyy h:mm a')}
                            </time>
                            {isStatusUpdated && (
                                <CheckCircleIcon
                                    className="h-5 w-5 text-green-500"
                                    // title="Message status updated"
                                />
                            )}
                        </div>
                    </header>

                    {/* Error Message */}
                    {error && (
                        <div
                            className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
                            role="alert"
                        >
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-700 hover:text-red-900"
                                aria-label="Dismiss error"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Sender Info */}
                    <section className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                            Sender Information
                        </h2>
                        <div className="grid gap-3 bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900">
                                <span className="font-medium">Name:</span> {message.name}{' '}
                                <span className="text-gray-500 text-sm">({message.email})</span>
                            </p>
                            <p className="text-gray-900">
                                <span className="font-medium">Phone:</span>{' '}
                                {message.phone || 'Not provided'}
                            </p>
                        </div>
                    </section>

                    {/* Message Body */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Message Content</h2>
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                                {message.body || 'No message content provided.'}
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
