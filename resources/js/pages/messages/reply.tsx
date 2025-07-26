import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Message } from '@/types/posts';
import { format } from 'date-fns';
import axios from 'axios';
import { useState, FormEvent } from 'react';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/messages',
    },
    {
        title: 'Reply',
        href: null,
    },
];

interface ReplyMessageProps {
    message: Message;
}

export default function ReplyMessage({ message }: ReplyMessageProps) {
    const [replyBody, setReplyBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await axios.post(`/messages/${message.id}/reply`, {
                body: replyBody,
            });
            setSuccess('Reply sent successfully!');
            setReplyBody('');
        } catch (err) {
            setError('Failed to send reply. Please try again.');
            console.error('Failed to send reply:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDiscard = () => {
        setReplyBody('');
        setError(null);
        setSuccess(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reply to: ${message.title}`} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    {/* Header */}
                    <header className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2">
                            <a
                                href={`/messages/${message.id}`}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                aria-label="Back to message"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </a>
                            <h1 className="text-lg sm:text-xl font-medium text-gray-900 truncate">
                                {message.title}
                            </h1>
                        </div>
                        <time
                            className="text-sm text-gray-500"
                            dateTime={message.created_at}
                        >
                            {format(new Date(message.created_at), 'MMM d, yyyy, h:mm a')}
                        </time>
                    </header>

                    {/* Original Message Preview */}
                    <section className="mb-4 border-l-4 border-blue-100 pl-4 py-2 bg-gray-50 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">From:</span>
                            <span className="text-sm text-gray-900">{message.name}</span>
                            <span className="text-sm text-gray-500">({message.email})</span>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                            {message.body || 'No message content provided.'}
                        </p>
                    </section>

                    {/* Success Message */}
                    {success && (
                        <div
                            className="mb-4 p-3 bg-green-100 text-green-800 text-sm rounded flex items-center gap-2"
                            role="alert"
                        >
                            <span>{success}</span>
                            <button
                                onClick={() => setSuccess(null)}
                                className="ml-auto text-green-800 hover:text-green-900"
                                aria-label="Dismiss success message"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div
                            className="mb-4 p-3 bg-red-100 text-red-800 text-sm rounded flex items-center gap-2"
                            role="alert"
                        >
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-800 hover:text-red-900"
                                aria-label="Dismiss error"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Reply Form */}
                    <section>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                <textarea
                    id="replyBody"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    className="w-full p-3 text-sm text-gray-800 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y min-h-[120px]"
                    placeholder="Type your reply here..."
                    required
                    disabled={isSubmitting}
                />
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={handleDiscard}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                                    disabled={isSubmitting || !replyBody}
                                    aria-label="Discard reply"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className={`inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors ${
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    <Send className="h-4 w-4" />
                                    {isSubmitting ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
