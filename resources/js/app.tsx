import '../css/app.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // or another theme
import 'primereact/resources/primereact.min.css';                // core styles
import 'primeicons/primeicons.css';                                // utility CSS (optional)

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { PrimeReactProvider } from 'primereact/api';
import { PermissionProvider } from '@/context/permissionContext';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const permissions = props.initialPage.props.auth?.permissions || [];
        const App1 =
            <PrimeReactProvider>
                <PermissionProvider permissions={permissions}>
                    <App {...props} />
                </PermissionProvider>
            </PrimeReactProvider>

        root.render(App1);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
