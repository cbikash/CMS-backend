import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {  Slider } from '@/types/posts';
import { Image } from 'primereact/image';
import axios from 'axios';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sliders', href: '/sliders' },
];

export default function PostPage({ sliders }: { sliders: Slider[] }) {
    const fileUploadRef = useRef<FileUpload>(null);
    const toast = useRef<Toast>(null);


    const handleImageDelete = async (imageId: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await axios.delete(`/ajax/sliders/${imageId}`);
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Image deleted', life: 2000 });
            router.reload({ only: ['sliders'] });
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
            await axios.post(`/ajax/sliders`, formData);
            toast.current?.show({ severity: 'success', summary: 'Uploaded', detail: 'Images uploaded successfully', life: 2000 });
            router.reload({ only: ['sliders'] });
            fileUploadRef.current?.clear();
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Upload failed', life: 3000 });
        }
    };


    function handleImageUpdate(id: number) {
        
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sliders`} />
            <Toast ref={toast} />

            <div className="w-full mx-auto mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-10">

                {/* Upload Section */}
                <div
                    className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add Images to Sliders</h3>
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
                {sliders && sliders.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Sliders</h2>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {sliders.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative group rounded-lg overflow-hidden border dark:border-gray-700 hover:shadow-md transition-shadow"
                                >
                                    <Image
                                        className="w-full h-48 object-cover"
                                        src={`/uploads/${image.name}`}
                                        alt={`Post Image ${image.id}`}
                                        preview
                                    />

                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={() => handleImageDelete(image.id)}
                                        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>

                                    {/* Update button */}
                                    <button
                                        type="button"
                                        onClick={() => handleImageUpdate(image.id)} // Define handleImageUpdate function
                                        className="absolute top-10 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-blue-700"
                                    >
                                        Update
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
