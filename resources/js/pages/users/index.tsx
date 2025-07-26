import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Role } from '@/types/role';

interface User {
    id: number,
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    roles: Role[]
}

export default function User({ users, roles } : {users: User[], roles: Role[]}) {
    const [isOpen, setIsOpen] = useState(false);
    const toast = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
                toast.current.show({ severity: 'success',  detail: `New user has been created!.`, summary: 'User created', life: 3000 });
            },
            onFinish: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    const formatDate = (date: string) => {
        return format(date, 'yyyy-MM-dd HH:mm');
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await axios.post(`/users/${userId}/assign-role`, {
                role: newRole,
            });

            router.reload({
                only: ['users']
            })

            toast.current.show({
                severity: 'success',
                summary: 'Role updated',
                detail: `User role changed to ${newRole}`,
                life: 3000,
            });

        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update role',
                life: 3000,
            });
        }
    };

    const roleDropdownTemplate = (user) => {
        const currentRoleName = user.roles[0]?.name ?? null;
        return (
            <Dropdown
                value={currentRoleName}
                options={roles}
                optionLabel="name"
                optionValue="name"
                placeholder="Select Role"
                className="w-full"
                onChange={(e) => handleRoleChange(user.id, e.value)}
            />
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/users' }]}>
            <Head title="Users" />
            <Toast ref={toast} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-end">
                    <Button onClick={() => setIsOpen(true)}>+ Add User</Button>
                </div>

                <DataTable value={users} tableStyle={{ minWidth: '60rem' }}>
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column header="Role" body={roleDropdownTemplate} />
                    <Column
                        header="Created"
                        body={(rowData) => formatDate(rowData.created_at)}
                        sortable
                    />
                </DataTable>
            </div>

            <Dialog
                header="Create User"
                visible={isOpen}
                style={{ width: '50vw' }}
                onHide={() => setIsOpen(false)}
            >
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="user@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </div>
                </form>
            </Dialog>
        </AppLayout>
    );
}
