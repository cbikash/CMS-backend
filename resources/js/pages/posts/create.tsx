import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { Editor } from 'primereact/editor';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { type BreadcrumbItem } from '@/types';
import { Menu } from '@/types/menus';
import { Post } from '@/types/posts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: '/posts' },
    { title: 'Post Create', href: '/posts/create' },
];

export default function Posts({ menus }: { menus: Menu }) {
    const [text, setText] = useState('');
    const [totalSize, setTotalSize] = useState(0);
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);
    const [post, setPost] = useState<Post >({

    });

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
        };
    };

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        let files = e.files;
        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }
        setTotalSize(_totalSize);
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };



    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formattedValue = fileUploadRef?.current?.formatSize(totalSize) || '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formattedValue} / 20 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    {/* @ts-ignore */}
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const emptyTemplate = () => (
        <div className="flex align-items-center flex-column">
            <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
            <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5 flex justify-center">
                Drag and Drop Image Here
            </span>
        </div>
    );

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Toast ref={toast} />
                <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                <form>
                    <div className="flex flex-col gap-4">
                        {/* Title */}
                        <div className={'flex flex-col gap-4'}>
                            <label htmlFor="title">Title</label>
                            <InputText id="title" aria-describedby="title-help" />
                        </div>
                        <div>
                            <FileUpload mode="basic" accept="image/*" auto chooseLabel="Primary Image"></FileUpload>
                        </div>

                        <div>
                            <label htmlFor="content">Content</label>
                            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
                        </div>

                        <div>
                            <FileUpload
                                ref={fileUploadRef}
                                name="demo[]"
                                url="/api/upload"
                                multiple
                                accept="image/*"
                                maxFileSize={20000000}
                                onSelect={onTemplateSelect}
                                onError={onTemplateClear}
                                onClear={onTemplateClear}
                                headerTemplate={headerTemplate}
                                itemTemplate={itemTemplate}
                                emptyTemplate={emptyTemplate}
                                chooseOptions={chooseOptions}
                                cancelOptions={cancelOptions}
                            />
                        </div>

                        <div className={'flex flex-col gap-4'}>
                            <label htmlFor="keywords">Keywords</label>
                            <InputText id="keywords" aria-describedby="keywords-help" />
                        </div>
                    </div>

                    <div className={'mt-4'}>
                        <Button type={'submit'} >Add Post</Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
