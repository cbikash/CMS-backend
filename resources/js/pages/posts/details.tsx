import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
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

            <div className="w-full mx-auto mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-10">

                {/* Title & Date */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Title & Date */}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                            {post.title}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Published on{' '}
                            <span className="font-medium text-gray-800 dark:text-gray-300">
                            {format(new Date(post.created_at), 'PPP')}
                          </span>
                        </p>
                    </div>

                    {/* Tags */}
                    <Tooltip target=".menu"  mouseTrack mouseTrackLeft={10} />
                    <div className="flex gap-2 flex-wrap">
                        {post?.menu && <Chip  data-pr-tooltip={'Menu'} label={post?.menu?.name} className="menu bg-blue-100 text-blue-800" /> }
                        {post?.category && <Chip data-pr-tooltip={'Category'} label={post?.category?.name} className="menu bg-green-100 text-green-800" />}
                    </div>
                </div>

                <div>
                    <Button
                        label={post.status === 'published' ? 'Unpublish' : 'Publish'}
                        icon={post.status === 'published' ? 'pi pi-eye-slash' : 'pi pi-eye'}
                        severity={post.status === 'published' ? 'warning' : 'success'}
                        onClick={handleToggleStatus}
                        outlined
                    />
                </div>

                {/* Main Image */}
                {post.image && (
                    <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                        <Image
                            src={`/uploads/${post.image}`}
                            alt={post.title}
                            imageClassName="w-full h-[300px] object-cover"
                        />
                    </div>
                )}

                {/* Post Body */}
                <div
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: post.body }}
                />

                {/* Upload Section */}
                <div
                    className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
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

                {/* Gallery */}
                {post.images && post.images.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gallery</h2>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {post.images.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative group rounded-lg overflow-hidden border dark:border-gray-700 hover:shadow-md transition-shadow"
                                >

                                    <Image  className="w-full h-48 object-cover" src={`/uploads/${image.name}`} alt={`Post Image ${image.id}`} preview />

                                    {/* Delete on Hover */}
                                    <button
                                        type="button"
                                        onClick={() => handleImageDelete(image.id)}
                                        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-red-700"
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
