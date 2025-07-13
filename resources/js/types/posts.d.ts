
export interface Image {
    id: number,
    name: string
}

export interface Post {
    id?: string;
    title: string;
    slug?: string;
    body: string;
    image: string;
    status?: string;
    keywords: string;
    seo?: string;
    published_at: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
    published_by?: string;
    organization_id?: string;
    deleted_at?: string;
    images? : Image[]
}

export interface Message {
    id: number; // bigint unsigned
    name: string;
    email: string;
    phone?: string | null;
    title: string;
    body?: string | null;
    status: 'unread' | 'read';
    organization_id: number; // bigint unsigned
    custom_field1?: string | null;
    custom_field2?: string | null;
    custom_field3?: string | null;
    custom_field4?: string | null;
    created_at: string; // or Date if using Date objects
    updated_at: string; // or Date if using Date objects
}
