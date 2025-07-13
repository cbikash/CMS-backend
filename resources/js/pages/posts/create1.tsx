import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Editor } from 'primereact/editor';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: '/posts' },
    { title: 'Post Create', href: '/posts/create' },
];

interface FormData {
    title: string;
    body: string;
    image: any;
    keywords: string;
    images : []
}

export default function PostCreate() {
    const [post, setPost] = useState<FormData>({
        title: '',
        body: '',
        image: '',
        keywords: '',
        images : []
    });

    const onChangeValue = (e: any) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const onSelectImage = (e: any) => {
        if (e.files && e.files.length > 0) {
            setPost(prev => ({ ...prev, image: e.files[0] }));
        }
    };

    const fnCreatePost = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', post.image);
        formData.append('title', post.title);
        formData.append('body', post.body);
        formData.append('keywords', post.keywords);

        post.images.forEach((img, i) => {
            formData.append(`images[${i}]`, img);
        });

        router.post('/posts', formData);
    };


    const onSelectImages = (e) => {
        if (e.files && e.files.length > 0) {
            setPost((prev) => ({
                ...prev,
                images: [...prev.images, ...e.files],
            }));
        }
    };

    const onTemplateClear = () => {
        setPost((prev) => ({ ...prev, images: [] }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />
            <div className="flex flex-1 w-full flex-col rounded-xl bg-white dark:bg-gray-900 p-6 shadow-md mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Create New Post</h1>

                <form onSubmit={fnCreatePost} className="space-y-6">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            id="title"
                            name="title"
                            value={post.title}
                            onChange={onChangeValue}
                            className="w-full"
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Featured Image
                        </label>
                        <FileUpload
                            mode="basic"
                            name="image"
                            accept="image/*"
                            maxFileSize={2000000}
                            customUpload
                            auto={false}
                            chooseLabel="Choose Image"
                            onSelect={onSelectImage}
                            className="w-full"
                        />
                        {post.image && typeof post.image === 'object' && (
                            <p className="text-sm text-green-600 mt-1">Selected: {post.image.name}</p>
                        )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="body" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content
                        </label>
                        <Editor
                            value={post.body}
                            onTextChange={e => setPost(prev => ({ ...prev, body: e.htmlValue || '' }))}
                            style={{ height: '300px' }}
                        />
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="keywords" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Keywords
                        </label>
                        <InputText
                            id="keywords"
                            name="keywords"
                            value={post.keywords}
                            onChange={onChangeValue}
                            className="w-full"
                            placeholder="SEO keywords (comma separated)"
                        />
                    </div>

                    <div>
                        <FileUpload
                            name="images[]"
                            multiple
                            accept="image/*"
                            maxFileSize={2000000}
                            mode="advanced"
                            customUpload
                            uploadLabel="Done"
                            chooseLabel="Browse"
                            cancelLabel="Clear"
                            onSelect={onSelectImages}
                            onClear={onTemplateClear}
                            emptyTemplate={<p className="m-0">Drag and drop images here or click to select.</p>}
                        />
                        {/* Previews */}
                        {post.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {post.images.map((img, index) => (
                                    <div key={index} className="relative border rounded overflow-hidden">
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt={`Preview ${index}`}
                                            className="w-full h-32 object-cover"
                                        />
                                        <span className="block text-center text-xs truncate p-1">{img.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            label="Publish Post"
                            className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 border-none"
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
