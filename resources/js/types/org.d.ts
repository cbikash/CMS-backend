export interface Token {
    id?: number;
    token: string;
    secret: string;
    expires_at: string;
    organization_id: number;
    domains?: string | null;
    created_by?: number;
    updated_by?: number;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface Organization {
    id: bigint;
    name: string;
    description?: string | null;
    slug: string;
    logo?: string | null;
    logo_v1?: string | null;
    logo_v2?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null; // e.g., 'NP'
    phone?: string | null;
    phone1?: string | null;
    fax?: string | null;
    website?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
