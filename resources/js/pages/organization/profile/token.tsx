import { Head, router } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, NavItem } from '@/types';
import axios from 'axios';
import { Token } from '@/types/org';
import { useState } from 'react';
import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/organization/profile',
        icon: null,
    },
    {
        title: 'Token',
        href: '/organization/token',
        icon: null,
    },
];

export default function OrgProfile({ token }: { token: Token }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const toast = useRef(null);


    const show = (severity: string,summary: string, detail: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        toast.current.show({ severity,summary, detail});
    };

    const fnGenerateToken = () => {
        setIsGenerating(true);
        axios.post('/ajax/generate/organizations/token')
            .then(response => {
                console.log('Token generated:', response.data);
                show('info', 'Token generated!.', 'Token has been generated.')

                router.reload({
                    only: ['token']
                })
            })
            .catch(error => {
                console.error('Error generating token:', error);
            })
            .finally(() => {
                setIsGenerating(false);
            });
    };

     async function copyToClipboard(text: string): Promise<boolean> {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers or insecure context
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed'; // Avoid scrolling to bottom
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                show('info', 'Copied!.', 'Token Copied.')
                return success;

            }

            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Toast ref={toast} />
            <Head title="Password settings" />
            <SettingsLayout sidebarNavItems={sidebarNavItems}>
                <div className="space-y-8 from-gray-50 to-gray-100  w-full">
                    <HeadingSmall
                        title="API Token Management"
                        description="Generate and manage your organization's API tokens with enhanced security."

                    />
                    <div className="flex flex-col gap-6">
                        <button
                            onClick={fnGenerateToken}
                            disabled={isGenerating}
                            className={`inline-flex cursor-pointer items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out transform hover:scale-105 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isGenerating ? (
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            ) : null}
                            {isGenerating ? 'Generating...' : 'Generate New Token'}
                        </button>
                        {token && (
                            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
                                <div className="flex flex-col">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Token</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="font-mono text-gray-800 bg-gray-100 p-3 rounded-md break-all">{token.secret}</span>
                                            <button
                                                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
                                                onClick={() => copyToClipboard(token.secret)}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-5 gap-3">
                                        <div className={''}>
                                            <p className="text-sm font-medium text-gray-500">Created At</p>
                                            <p className="mt-2 text-gray-800">{token.created_at ? new Date(token.created_at).toLocaleString() : 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Expires At</p>
                                            <p className="mt-2 text-gray-800">{token.expires_at ? new Date(token.expires_at).toLocaleString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
