export interface Menu {
    id: number,
    name: string,
    url: string,
    created_at : string,
    updated_at : string,
    categories: Category[]
}

export interface Category {
    id: number,
    name: string,
    menu_id: number,
    created_at : string,
    updated_at : string
}

export interface Testimonial {
    id?: number;
    name: string;
    designation?: string | null;
    description?: string | null;
    image?: string | null;
    rating?: string | null; // Or `number` if you change to TINYINT
    source?: string | null;
    organization_id?: number;
    created_at?: string | null; // or Date
    updated_at?: string | null; // or Date
}
