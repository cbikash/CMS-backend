import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useEffect, useState } from 'react';
import { Permission } from '@/types/role';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: '/roles' },
    { title: 'Create Role', href: '/roles/create' },
];

export default function RoleCreatePage({ permissions }: { permissions: Permission[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (selectAll) {
            setData('permissions', permissions.map(p => p.id));
        } else {
            setData('permissions', []);
        }
    }, [selectAll]);

    const togglePermission = (id: number) => {
        const selected = data.permissions.includes(id)
            ? data.permissions.filter(pid => pid !== id)
            : [...data.permissions, id];
        setData('permissions', selected);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles', {
            onSuccess: () => {
                reset();
                setSelectAll(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

            <div className="max-w-4xl mx-auto p-4">
                <Card title="Create New Role">
                    <form onSubmit={handleSubmit} className="p-fluid space-y-4">
                        {/* Role Name */}
                        <div className="field">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Role Name</label>
                            <InputText
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={errors.name ? 'p-invalid' : ''}
                                placeholder="e.g. Admin"
                            />
                            {errors.name && <small className="p-error">{errors.name}</small>}
                        </div>

                        <Divider />

                        {/* Permissions */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium">Permissions</label>
                                <Button
                                    type="button"
                                    label={selectAll ? 'Deselect All' : 'Select All'}
                                    className="p-button-sm p-button-text"
                                    onClick={() => setSelectAll(!selectAll)}
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto border p-3 rounded-md">
                                {permissions.map(permission => (
                                    <div key={permission.id} className="flex align-items-center">
                                        <Checkbox
                                            inputId={`perm-${permission.id}`}
                                            value={permission.id}
                                            checked={data.permissions.includes(permission.id)}
                                            onChange={() => togglePermission(permission.id)}
                                        />
                                        <label htmlFor={`perm-${permission.id}`} className="ml-2 text-sm">{permission.name}</label>
                                    </div>
                                ))}
                            </div>
                            {errors.permissions && <small className="p-error block mt-2">{errors.permissions}</small>}
                        </div>

                        <Divider />

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                type="reset"
                                label="Reset"
                                className="p-button-secondary"
                                onClick={() => {
                                    reset();
                                    setSelectAll(false);
                                }}
                            />
                            <Button
                                type="submit"
                                label={processing ? 'Saving...' : 'Create Role'}
                                icon="pi pi-save"
                                disabled={processing}
                            />
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
