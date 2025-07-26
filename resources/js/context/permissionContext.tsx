import React, {
    createContext,
    useContext,
    ReactNode,
    useMemo,
    Context,
} from "react";

// Define types for context
interface PermissionContextType {
    permissions: string[];
    can: (permission: string | string[]) => boolean;
    cannot: (permission: string | string[]) => boolean;
}

// Create the context with initial undefined value
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// Define props for provider
interface PermissionProviderProps {
    children: ReactNode;
    permissions: string[];
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children, permissions }) => {
    const hasPermission = (permission: string): boolean => {
        if (!permissions || !Array.isArray(permissions)) return false;
        return permissions.includes(permission);
    };

    const can = (permission: string | string[]): boolean => {
        if (typeof permission === "string") {
            return hasPermission(permission);
        }
        if (Array.isArray(permission)) {
            return permission.some((perm) => hasPermission(perm));
        }
        return false;
    };

    const cannot = (permission: string | string[]): boolean => !can(permission);

    const value = useMemo(() => ({
        permissions,
        can,
        cannot,
    }), [permissions]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

// Hook to access context
export const usePermissions = (): PermissionContextType => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("usePermissions must be used within a PermissionProvider");
    }
    return context;
};
