// Keep all imports as before...
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Editor } from 'primereact/editor';
import { useState, useRef, useEffect } from 'react';
import { Category, Menu } from '@/types/menus';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from 'primereact/floatlabel';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: '/posts' },
    { title: 'Create', href: '/posts/create' },
];

interface FormData {
    title: string;
    body: string;
    image: any;
    keywords: string;
    images: any[];
    description: string,
    meta_title: string,
    meta_description: string
    meta_keywords: string
}

export default function PostCreate({ menus }: { menus: Menu[] }) {
    const [post, setPost] = useState<FormData>({
        title: '',
        body: '',
        image: '',
        keywords: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        images: [],
    });

    const [selectMenu, setMenu] = useState<Menu | null>(null);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [enableComments, setEnableComments] = useState(true);
    const [publish, setPublish] = useState(true);

    const quillRef = useRef<any>(null);

    const onChangeValue = (e: any) => {
        const { name, value } = e.target;
        setPost((prev) => ({ ...prev, [name]: value }));
    };

    const onSelectImage = (e: any) => {
        if (e.files?.length) {
            setPost((prev) => ({ ...prev, image: e.files[0] }));
        }
    };

    const onSelectImages = (e: any) => {
        if (e.files?.length) {
            setPost((prev) => ({ ...prev, images: [...prev.images, ...e.files] }));
        }
    };

    const onTemplateClear = () => {
        setPost((prev) => ({ ...prev, images: [] }));
    };

    const onChangeMenu = (e: any) => {
        const value = e.target.value;
        setMenu(value);
        setCategories(value.categories || []);
        setCategory(null);
    };

    const fnCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', post.image);
        formData.append('title', post.title);
        formData.append('body', post.body);
        formData.append('keywords', post.keywords);
        formData.append('meta_title', post.meta_title)
        formData.append('meta_keywords', post.meta_keywords)
        formData.append('meta_description', post.meta_description)
        formData.append('description', post.description)

        if (selectMenu?.id) formData.append('menu_id', String(selectMenu.id));
        if (category?.id) formData.append('category_id', String(category.id));
        if (enableComments) formData.append('enabled_comment', '1');
        if (publish) formData.append('status', 'published');

        post.images.forEach((img, i) => {
            formData.append(`images[${i}]`, img);
        });

        router.post('/posts', formData);
    };



    useEffect(() => {
        const interval = setInterval(() => {
            if (quillRef.current) {
                const quillInstance = quillRef.current.getQuill?.(); // safe access
                if (quillInstance) {
                    const toolbar = quillInstance.getModule('toolbar');
                    toolbar.addHandler('image', () => {
                        const url = prompt('Enter image URL');
                        if (url) {
                            const range = quillInstance.getSelection();
                            quillInstance.insertEmbed(range?.index || 0, 'image', url, 'user');
                        }
                    });
                    clearInterval(interval); // stop checking once ready
                }
            }
        }, 100); // check every 100ms

        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />

            <div className="w-full bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                <h1 className="text-2xl font-semibold mb-6">Create a new post</h1>

                <form onSubmit={fnCreatePost} className="space-y-10">

                    {/* Details */}
                    <Card title="Details" subTitle="Title, short description, image..." className="bg-white shadow rounded-xl ">
                        <hr/>
                        <br/>
                        <div className="space-y-4 gap-4 mb-6">
                            <FloatLabel>
                                <InputText id={'title'} name="title" value={post.title} onChange={onChangeValue} className="w-full" />
                                <label htmlFor="title">Title</label>
                            </FloatLabel>

                        </div>
                        <div className={'mb-4'}>
                            <FloatLabel>
                                <InputTextarea id={'desc'} name={'description'} value={post.description} onChange={onChangeValue}
                                               placeholder="Description" className="w-full" />
                                <label htmlFor="desc">Description</label>
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
                        <FileUpload
                            mode="basic"
                            name="image"
                            accept="image/*"
                            maxFileSize={2000000}
                            customUpload
                            auto={false}
                            chooseLabel="Select file"
                            onSelect={onSelectImage}
                            className="w-full"
                        />
                        {post.image && <p className="text-sm text-green-600">Selected: {post.image.name}</p>}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ToggleButton
                                checked={enableComments}
                                onChange={(e) => setEnableComments(e.value)}
                                onLabel="Comments enabled"
                                offLabel="Comments disabled"
                                className="w-full"
                            />
                            <ToggleButton
                                checked={publish}
                                onChange={(e) => setPublish(e.value)}
                                onLabel="Publish"
                                offLabel="Draft"
                                className="w-full"
                            />
                        </div>
                    </Card>

                    {/* Gallery Upload */}
                    <Card title={'Gallery'} className="bg-white shadow rounded-xl space-y-4">
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
                        {post.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {post.images.map((img, index) => (
                                    <div key={index} className="border rounded overflow-hidden">
                                        <img src={URL.createObjectURL(img)} alt={`Preview ${index}`} className="w-full h-32 object-cover" />
                                        <span className="block text-center text-xs truncate p-1">{img.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button type="submit" label="Create Post" className="bg-indigo-600 border-none" />
                    </div>
                </form>
            </div>
            </div>
        </AppLayout>
    );
}
