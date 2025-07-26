
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Message } from '@/types/posts';
import { format } from 'date-fns';
import axios from 'axios';
import { useEffect, useCallback, useState, useRef } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Editor } from 'primereact/editor';
import { Toast } from 'primereact/toast'; // Import PrimeReact Toast

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/messages' },
];

interface MessagesProps {
    message: Message;
}

export default function Messages({ message }: MessagesProps) {
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reply, setReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useRef<Toast>(null); // Reference for Toast component

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

const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
        await axios.post(`/ajax/messages/${message.id}/reply`, { reply });
        setReply('');
        // Show success toast
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Reply sent successfully.',
            life: 3000,
        });
        // Refresh the page to show new reply
        router.reload({
            only: ['message']
        })
    } catch (e : any) {
        setError('Failed to send reply. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};

return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`Message: ${message.title}`} />
        {/* Add Toast component */}
        <Toast ref={toast} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/messages"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Back to messages list"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 truncate max-w-md">
                            {message.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <time className="text-sm sm:text-base text-gray-600" dateTime={message.created_at}>
                            {format(new Date(message.created_at), 'MMMM d, yyyy h:mm a')}
                        </time>
                        {isStatusUpdated && (
                            <CheckCircleIcon
                                className="h-5 w-5 text-green-500"
                                aria-label="Message status updated"
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
                            aria-label="Dismiss error message"
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Sender Info */}
                <section className="mb-8">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Sender Information</h2>
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
                <section className="mb-8">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Message Content</h2>
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                            {message.body || 'No message content provided.'}
                        </p>
                    </div>
                </section>

                {/* Replies Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Replies</h2>
                    {message.replies && message.replies.length > 0 ? (
                        <div className="space-y-4">
                            {message.replies.map((reply, index) => (
                                <div
                                    key={reply.id}
                                    className="bg-gray-50 rounded-lg p-5 border border-gray-100"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-600">
                                            Reply #{index+1} -{' '}
                                            {format(new Date(reply.created_at), 'MMMM d, yyyy h:mm a')}
                                        </p>
                                    </div>
                                    <div
                                        className="text-gray-700 whitespace-pre-line leading-relaxed text-base"
                                        dangerouslySetInnerHTML={{ __html: reply.body }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No replies yet.</p>
                    )}
                </section>

                {/* Reply Form */}
                <section>
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Reply</h2>
                    <form onSubmit={handleReplySubmit} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <Editor
                            value={reply}
                            onTextChange={(e) => setReply(e.htmlValue || '')}
                            placeholder="Write your reply here..."
                            style={{ minHeight: '120px' }}
                            className={cn('mb-4 border border-gray-300 rounded-lg', isSubmitting && 'opacity-50')}
                            readOnly={isSubmitting}
                            aria-label="Reply to message"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                'bg-blue-600 text-white px-4 py-2 rounded-lg transition',
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            )}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reply'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    </AppLayout>
);
}
