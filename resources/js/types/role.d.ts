export interface Role {
    id?: string;
    name: string;
    guard_name: string,
    created_at?: string;
    updated_at?: string;
    permissions: Permission[];
}

export interface Permission {
    id: string;
    name: string;
    guard_name: string,
    created_at?: string;
    updated_at?: string;
}
