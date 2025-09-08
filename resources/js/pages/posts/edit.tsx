import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Editor } from 'primereact/editor';
import { useEffect, useRef, useState } from 'react';
import { Category, Menu } from '@/types/menus';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { ToggleButton } from 'primereact/togglebutton';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: '/posts' },
    { title: 'Edit Post', href: '#' },
];

interface ExistingImage {
    id: number;
    url: string;
    name?: string;
}

interface FormData {
    title: string;
    body: string;
    image: File | string | null; // File when replaced, string (URL) when unchanged
    keywords: string;
    existingImages: ExistingImage[];
    newImages: File[];
    menu_id: string | null,
    category_id : string | null
    description: string ,
    meta_title: string,
    meta_description: string,
    meta_keywords: string
}

interface Props {
    post:{
        id: number;
        title: string;
        body: string;
        image: string | null;
        keywords: string;
        images: ExistingImage[];
        category_id: string| null,
        menu_id: string | null,
        description: string ,
        meta_title: string,
        meta_description: string,
        meta_keywords: string
    };
    menus : Menu []
}

export default function PostEdit({ post: initialPost, menus }: Props) {
    const [post, setPost] = useState<FormData>({
        title: initialPost.title,
        body: initialPost.body,
        image: initialPost.image, // URL string or null
        keywords: initialPost.keywords,
        existingImages: initialPost.images || [],
        newImages: [],
        category_id: initialPost.category_id || null,
        menu_id: initialPost.menu_id || null,
        description : initialPost.description,
        meta_title: initialPost.meta_title,
        meta_description: initialPost.meta_description,
        meta_keywords: initialPost.meta_keywords
    });

    const [selectMenu, setMenu] = useState<Menu| null>(null);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [category, setCategory] = useState<Category| null>()
    const quillRef = useRef<any>(null);

    useEffect(() => {
        if (initialPost.menu_id !== undefined) {
            const menu = menus.find(menu => String(menu.id) === String(initialPost.menu_id));
            if (menu) {
                setMenu(menu);
                setCategories(menu.categories);

                const category = menu.categories.find(category => String(category.id) === String(initialPost.category_id));
                if (category) {
                    setCategory(category);
                }
            }
        }
    }, [initialPost.id]);


    // Handle text input change
    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPost((prev) => ({ ...prev, [name]: value }));
    };

    // Handle featured image replacement
    const onSelectFeaturedImage = (e: any) => {
        if (e.files && e.files.length > 0) {
            setPost((prev) => ({ ...prev, image: e.files[0] }));
        }
    };

    // Remove existing image (mark for removal)
    const removeExistingImage = (id: number) => {
        setPost((prev) => ({
            ...prev,
            existingImages: prev.existingImages.filter((img) => img.id !== id),
        }));
    };

    // Add new images for upload
    const onSelectNewImages = (e: any) => {
        if (e.files && e.files.length > 0) {
            setPost((prev) => ({
                ...prev,
                newImages: [...prev.newImages, ...e.files],
            }));
        }
    };

    // Clear new image selection
    const onClearNewImages = () => {
        setPost((prev) => ({ ...prev, newImages: [] }));
    };

    // Editor content change
    const onEditorChange = (e: any) => {
        setPost((prev) => ({ ...prev, body: e.htmlValue || '' }));
    };

    // Submit form to update post
    const fnUpdatePost = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', post.title);
        formData.append('body', post.body);
        formData.append('keywords', post.keywords);
        formData.append('keywords', post.keywords);
        formData.append('meta_title', post.meta_title)
        formData.append('meta_keywords', post.meta_keywords)
        formData.append('meta_description', post.meta_description)
        formData.append('description', post.description)

        // If user replaced featured image with a File, append it; otherwise, send nothing (backend uses old)
        if (post.image && typeof post.image !== 'string') {
            formData.append('image', post.image);
        }

        // IDs of existing images to keep
        post.existingImages.forEach((img) => {
            formData.append('existing_images[]', String(img.id));
        });

        // New images to upload
        post.newImages.forEach((img, i) => {
            formData.append(`new_images[${i}]`, img);
        });

        if (selectMenu?.id !== undefined) {
            formData.append('menu_id', String(selectMenu.id));
        }

        if (category?.id !== undefined) {
            formData.append('category_id', String(category.id));
        }


        formData.append('_method', 'PUT');

        router.post(`/posts/${initialPost.id}`, formData, {
            preserveScroll: true,
        });
    };

    const onChangeMenu = (e) => {
        const value = e.target.value
        setMenu(value)
        setCategories(value.categories)
        setCategory(null)
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Post" />
            <div className="w-full bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Edit a post</h1>

                <form onSubmit={fnUpdatePost} className="space-y-6">

                    <Card title="Details" subTitle="Title, short description, image..."
                          className="bg-white shadow rounded-xl ">
                        <hr />
                        <br />
                        <div className="space-y-4 gap-4 mb-6">
                            <FloatLabel>
                                <InputText id={'title'} name="title" value={post.title}
                                           onChange={onChangeValue} className="w-full" />
                                <label htmlFor="title">Title</label>
                            </FloatLabel>

                        </div>
                        <div className={'mb-4'}>
                            <FloatLabel>
                                <InputTextarea
                                    id="description"
                                    name="description"
                                    value={post.description || ""}
                                    onChange={onChangeValue}
                                    className="w-full"
                                />
                                <label htmlFor="desc">Description</label>
                            </FloatLabel>
                        </div>
                        <div className={'mb-4'}>
                            <FloatLabel>
                                <InputText id={'keywords'} name="keywords" value={post.keywords}
                                           onChange={onChangeValue} className="w-full" />
                                <label htmlFor="desc">Keywords</label>
                            </FloatLabel>
                        </div>
                        {/*<InputText name="keywords" value={post.keywords} onChange={onChangeValue} placeholder="Short description" className="w-full" />*/}

                        <span className={''}>Content</span>
                        <Editor
                            ref={quillRef}
                            value={post.body}
                            onTextChange={(e) => setPost((prev) => ({ ...prev, body: e.htmlValue || '' }))}
                            style={{ height: '400px' }}
                        />
                    </Card>

                    <Card title="Cover" className="bg-white shadow rounded-xl space-y-4">
                        {post.image && typeof post.image === 'string' ? (
                            <div className="mb-3">
                                <img
                                    src={`/uploads/${post.image}`}
                                    alt="Featured"
                                    className="w-48 h-32 object-cover rounded"
                                />
                            </div>
                        ) : null}

                        <FileUpload
                            mode="basic"
                            name="image"
                            accept="image/*"
                            maxFileSize={2000000}
                            customUpload
                            auto={false}
                            chooseLabel="Choose Image"
                            onSelect={onSelectFeaturedImage}
                            className="w-full"
                        />

                        {post.image && typeof post.image !== 'string' && (
                            <p className="text-sm text-green-600 mt-1">Selected: {(post.image as File).name}</p>
                        )}
                    </Card>


                    {/* Properties */}
                    <Card title={'Properties'} subTitle={'Additional functions and attributes...'}
                          className="bg-white shadow rounded-xl space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Dropdown value={selectMenu} onChange={onChangeMenu} options={menus} optionLabel="name"
                                      placeholder="Select menu" className="w-full" />
                            {categories.length > 0 && (
                                <Dropdown value={category} onChange={(e) => setCategory(e.target.value)}
                                          options={categories} optionLabel="name" placeholder="Select category"
                                          className="w-full" />
                            )}
                        </div>

                        <div className="flex flex-col gap-8 mb-4">
                            <FloatLabel>
                                <InputText id={'meta_title'} name="meta_title" value={post.meta_title} onChange={onChangeValue} className="w-full" />
                                <label htmlFor="meta_title">Meta Title</label>
                            </FloatLabel>

                            <FloatLabel>
                                <InputTextarea id={'meta_description'} name="meta_description" value={post.meta_description} onChange={onChangeValue} className="w-full" />
                                <label htmlFor="meta_description">Meta Description</label>
                            </FloatLabel>

                            <FloatLabel>
                                <InputText id={'meta_keywords'} name="meta_keywords" value={post.meta_keywords} onChange={onChangeValue} className="w-full" />
                                <label htmlFor="meta_keywords">Meta Keywords</label>
                            </FloatLabel>
                        </div>
                    </Card>

                    <Card title={'Gallery'} className="bg-white shadow rounded-xl space-y-4">
                        {/* Existing Images */}
                        {post.existingImages.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Existing
                                    Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {post.existingImages.map((img) => (
                                        <div key={img.id} className="relative border rounded overflow-hidden">
                                            <img
                                                src={`/uploads/${img.name}`}
                                                alt={img.name || `Image ${img.id}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(img.id)}
                                                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                                                title="Remove Image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Images */}
                        <div>
                            <FileUpload
                                name="new_images[]"
                                multiple
                                accept="image/*"
                                maxFileSize={2000000}
                                mode="advanced"
                                customUpload
                                uploadLabel="Done"
                                chooseLabel="Browse"
                                cancelLabel="Clear"
                                onSelect={onSelectNewImages}
                                onClear={onClearNewImages}
                                emptyTemplate={<p className="m-0">Drag and drop images here or click to select.</p>}
                            />

                            {/* New image previews */}
                            {post.newImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                    {post.newImages.map((img, idx) => (
                                        <div key={idx} className="relative border rounded overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`Preview ${idx}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <span className="block text-center text-xs truncate p-1">{img.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            label="Update Post"
                            className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 border-none"
                        />
                    </div>
                </form>
            </div>
            </div>
        </AppLayout>
    );
}
