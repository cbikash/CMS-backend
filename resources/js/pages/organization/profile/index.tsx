import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';

const OrgProfile = ({ organization }) => {
    const toast = useRef(null);
    const [form, setForm] = useState({
        name: organization.name || '',
        slug: organization.slug || '',
        description: organization.description || '',
        address1: organization.address1 || '',
        address2: organization.address2 || '',
        city: organization.city || '',
        state: organization.state || '',
        zip: organization.zip || '',
        country: organization.country || '',
        phone: organization.phone || '',
        phone1: organization.phone1 || '',
        fax: organization.fax || '',
        website: organization.website || '',
        logo: null,
        logo_v1: null,
        logo_v2: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const show = (severity: string,summary: string, detail: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        toast.current.show({ severity,summary, detail});
    };


    const handleChange = (e) => setForm((f) => ({
        ...f,
        [e.target.name]: e.target.value
    }));

    const handleFileChange = (name, file) => {
        setForm((f) => ({ ...f, [name]: file }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
        router.post(`/organizations/${organization.id}`, data, {
            forceFormData: true,
            onSuccess: () => {
                show('info', 'Details updated!.', 'Organization details updated!');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <Toast ref={toast} />
            <Head title="Organization Profile" />
            <SettingsLayout sidebarNavItems={[{title:'Profile',href:'/organization/profile'}, {title:'Token',href:'/organization/token'}]}>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto bg-white border rounded-xl shadow-sm p-8 space-y-8"
                >
                    {/*--- Section: Logo Uploads ---*/}
                    <div className="grid md:grid-cols-3 gap-6">
                        {['logo', 'logo_v1', 'logo_v2'].map((logoKey, idx) => (
                            <div key={logoKey} className="flex flex-col items-center gap-2">
                                <div className="relative w-32 h-32 overflow-hidden rounded-md border">
                                    <Image
                                        src={`/${organization[logoKey] || 'placeholder-logo.png'}`}
                                        className="w-32 h-32 object-cover rounded-md border"
                                        preview
                                        alt={logoKey}
                                    />
                                </div>
                                <FileUpload
                                    mode="basic"
                                    name={logoKey}
                                    accept="image/*"
                                    maxFileSize={5242880}
                                    customUpload
                                    chooseLabel={`${logoKey.replace('_', ' ').toUpperCase()}`}
                                    onSelect={(e) => handleFileChange(logoKey, e.files[0])}
                                />
                            </div>
                        ))}
                    </div>

                    {/*--- Section: Organization Details ---*/}
                    <div>
                        <HeadingSmall title="Basic Info" description="" />
                        <br/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <span className="p-float-label">
                            <InputText id="name" name="name" value={form.name} onChange={handleChange} className="w-full" required />
                            <label htmlFor="name">Organization Name</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="slug" name="slug" value={form.slug} onChange={handleChange} className="w-full" required />
                            <label htmlFor="slug">Slug</label>
                          </span>
                                    </div>
                                    <span className="p-float-label mt-8">
                          <InputTextarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className="w-full" />
                          <label htmlFor="description">Description</label>
                        </span>
                    </div>

                    {/*--- Section: Contact & Location ---*/}
                    <div>
                        <HeadingSmall title="Contact & Location" description="" />
                        <br/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <span className="p-float-label">
                            <InputText id="address1" name="address1" value={form.address1} onChange={handleChange} className="w-full" />
                            <label htmlFor="address1">Address Line 1</label>
                          </span>

                            <span className="p-float-label">
                            <InputText id="address2" name="address2" value={form.address2} onChange={handleChange} className="w-full" />
                            <label htmlFor="address2">Address Line 2</label>
                          </span>
                                        {/* More address & contact fields */}
                                        <span className="p-float-label">
                            <InputText id="city" name="city" value={form.city} onChange={handleChange} className="w-full" />
                            <label htmlFor="city">City</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="state" name="state" value={form.state} onChange={handleChange} className="w-full" />
                            <label htmlFor="state">State</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="zip" name="zip" value={form.zip} onChange={handleChange} className="w-full" />
                            <label htmlFor="zip">ZIP</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="country" name="country" value={form.country} onChange={handleChange} className="w-full" />
                            <label htmlFor="country">Country</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full" />
                            <label htmlFor="phone">Phone</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="phone1" name="phone1" value={form.phone1} onChange={handleChange} className="w-full" />
                            <label htmlFor="phone1">Alternate Phone</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="fax" name="fax" value={form.fax} onChange={handleChange} className="w-full" />
                            <label htmlFor="fax">Fax</label>
                          </span>
                                        <span className="p-float-label">
                            <InputText id="website" name="website" type="url" value={form.website} onChange={handleChange} className="w-full" />
                            <label htmlFor="website">Website</label>
                          </span>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            label={isSubmitting ? 'Saving...' : 'Save Changes'}
                            className="p-button-lg p-button-primary small"
                            disabled={isSubmitting}
                            icon="pi pi-save"
                        />
                    </div>
                </form>
            </SettingsLayout>
        </AppLayout>
    );
};

export default OrgProfile;
