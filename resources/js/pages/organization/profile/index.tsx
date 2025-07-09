import { Head } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, NavItem } from '@/types';
import {Organization} from '@/types/org';
import { useState } from 'react';

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


export default function OrgProfile({ organization }: { organization: Organization }) {
    const [form, setForm] = useState({
        name: organization.name || '',
        description: organization.description || '',
        address1: organization.address1 || '',
        address2: organization.address2 || '',
        city: organization.city || '',
        state: organization.state || '',
        zip: organization.zip || '',
        country: organization.country || '',
        phone: organization.phone || '',
        website: organization.website || '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Organization Profile</title>
            </Head>

            <SettingsLayout sidebarNavItems={sidebarNavItems}>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Organization Profile"
                        description="Update your organization's information."
                    />

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border max-w-3xl">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Organization Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="address1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
                                <input
                                    type="text"
                                    name="address1"
                                    value={form.address1}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="address2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
                                <input
                                    type="text"
                                    name="address2"
                                    value={form.address2}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip</label>
                                <input
                                    type="text"
                                    name="zip"
                                    value={form.zip}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    )
}
