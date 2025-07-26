import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useEffect, useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: number[]; // array of permission IDs
}

interface RoleEditPageProps {
    role: Role;
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role',
        href: '/roles',
    },
];

export default function RoleEditPage({ role, permissions }: RoleEditPageProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: role.name,
        permissions: role.permissions, // pre-selected permissions
    });

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        setSelectAll(data.permissions.length === permissions.length);
    }, [data.permissions, permissions]);

    const togglePermission = (id: number) => {
        if (data.permissions.includes(id)) {
            setData('permissions', data.permissions.filter(pid => pid !== id));
        } else {
            setData('permissions', [...data.permissions, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />

            <div className="max-w-4xl mx-auto p-4">
                <Card title="Edit Role">
                    <form onSubmit={handleSubmit} className="p-fluid space-y-4">
                        {/* Role Name */}
                        <div className="field">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Role Name
                            </label>
                            <InputText
                                id="name"
                                value={data.name}
                                readOnly={true}
                                onChange={e => setData('name', e.target.value)}
                                className={errors.name ? 'p-invalid' : ''}
                                placeholder="e.g. Admin"
                            />
                            {errors.name && <small className="p-error">{errors.name}</small>}
                        </div>

                        <Divider />

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium">Permissions</label>
                                <Button
                                    type="button"
                                    label={selectAll ? 'Deselect All' : 'Select All'}
                                    className="p-button-sm p-button-text"
                                    onClick={() =>
                                        setData(
                                            'permissions',
                                            selectAll ? [] : permissions.map(p => p.id)
                                        )
                                    }
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
                                        <label htmlFor={`perm-${permission.id}`} className="ml-2 text-sm">
                                            {permission.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.permissions && (
                                <small className="p-error block mt-2">{errors.permissions}</small>
                            )}
                        </div>

                        <Divider />

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                type="reset"
                                label="Reset"
                                className="p-button-secondary"
                                onClick={() => {
                                    setData({
                                        name: role.name,
                                        permissions: role.permissions,
                                    });
                                    setSelectAll(role.permissions.length === permissions.length);
                                }}
                            />
                            <Button
                                type="submit"
                                label={processing ? 'Updating...' : 'Update Role'}
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
