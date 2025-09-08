import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types/posts';
import { format } from 'date-fns';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import axios from 'axios';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import { Tooltip } from 'primereact/tooltip';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: '/posts' },
];

export default function PostPage({ post }: { post: Post }) {
    const fileUploadRef = useRef<FileUpload>(null);
    const toast = useRef<Toast>(null);

    const handleImageDelete = async (imageId: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            await axios.delete(`/ajax/posts/${post.id}/${imageId}/remove`);
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Image deleted', life: 2000 });
            router.reload({ only: ['post'] });
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not delete image', life: 3000 });
        }
    };

    const fnSubmit = async (event: FileUploadHandlerEvent) => {
        const formData = new FormData();
        event.files.forEach((img, i) => {
            formData.append(`images[${i}]`, img);
        });

        try {
            await axios.post(`/ajax/posts/${post.id}/images/uploads`, formData);
            toast.current?.show({ severity: 'success', summary: 'Uploaded', detail: 'Images uploaded successfully', life: 2000 });
            router.reload({ only: ['post'] });
            fileUploadRef.current?.clear();
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Upload failed', life: 3000 });
        }
    };

    const handleToggleStatus = async () => {
        try {
            const response = await axios.put(`/ajax/posts/${post.id}/status`);
            toast.current?.show({
                severity: 'success',
                summary: 'Status Updated',
                detail: `Post is now ${response.data.status}`,
                life: 2000,
            });
            router.reload({ only: ['post'] });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'Could not update post status',
                life: 3000,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Post - ${post.title}`} />
            <Toast ref={toast} />

            <div className="max-w-6xl mx-auto mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow p-6 sm:p-10 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Published on{' '}
                            <span className="font-medium text-gray-800 dark:text-gray-300">
                                {format(new Date(post.created_at), 'PPP')}
                            </span>
                        </p>
                    </div>

                    <div className="flex gap-2 flex-wrap items-start sm:items-center">
                        <Tooltip target=".menu" mouseTrack mouseTrackLeft={10} />
                        {post.menu && <Chip className="menu bg-blue-100 text-blue-800" label={post.menu.name} />}
                        {post.category &&
                            <Chip className="menu bg-green-100 text-green-800" label={post.category.name} />}
                    </div>
                </div>

                {/* Toggle Status */}
                <div className={'flex gap-4'}>
                    <Button
                        label={post.status === 'published' ? 'Unpublish' : 'Publish'}
                        icon={post.status === 'published' ? 'pi pi-eye-slash' : 'pi pi-eye'}
                        severity={post.status === 'published' ? 'warning' : 'success'}
                        onClick={handleToggleStatus}
                        className="rounded-md"
                        outlined
                    />
                    <Link href={`/posts/${post.id}/edit`}>
                        <Button
                            label="Edit"
                            icon="pi pi-pencil"
                            severity="success"
                            link
                            className="rounded-md"
                            outlined
                        />
                    </Link>
                </div>

                {/* Featured Image */}
                {post.image && (
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Image
                            src={`/uploads/${post.image}`}
                            alt={post.title}
                            imageClassName="w-full h-[300px] object-cover"
                            preview
                        />
                    </div>
                )}

                {/* Body Content */}
                <div className="prose max-w-none dark:prose-invert prose-lg text-gray-700 dark:text-gray-300">
                    <div dangerouslySetInnerHTML={{ __html: post.body }} />
                </div>

                {/* Upload Images */}
                <div
                    className="p-6 border-2 border-dashed rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add Images to Gallery</h3>
                    <FileUpload
                        ref={fileUploadRef}
                        name="images[]"
                        customUpload
                        uploadHandler={fnSubmit}
                        multiple
                        accept="image/*"
                        chooseLabel="Browse"
                        uploadLabel="Upload"
                        cancelLabel="Cancel"
                        emptyTemplate={
                            <p className="m-0 text-gray-500 dark:text-gray-400">
                                Drag and drop files here or click Browse
                            </p>
                        }
                    />
                </div>

                {/* Image Gallery */}
                {post.images && post.images.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gallery</h2>
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {post.images.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative group overflow-hidden rounded-lg border dark:border-gray-700 hover:shadow-md transition"
                                >
                                    <Image
                                        className="w-full h-48 object-cover"
                                        src={`/uploads/${image.name}`}
                                        alt={`Post Image ${image.id}`}
                                        preview
                                    />
                                    <button
                                        onClick={() => handleImageDelete(image.id)}
                                        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
