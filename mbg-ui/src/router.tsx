import { createBrowserRouter } from 'react-router-dom';
import NotFoundError from './pages/errors/not-found-error'
// import MaintenanceError from './pages/errors/maintenance-error'
// import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const router = createBrowserRouter([
    // redirect route
    {
        path: '/',
        lazy: async () => ({
            Component: (await import('./pages/new-sppg')).default,
        }),
    },

    // // main routes
    // {
    //     path: '/',
    //     lazy: async () => {
    //         const AppShell = await import('./components/app-shell')
    //         return { Component: AppShell.default }
    //     },
    //     errorElement: <GeneralError />,
    //     children: [
    //         {
    //             index: true,
    //             lazy: async () => ({
    //                 Component: (await import('./pages/dashboard')).default,
    //             }),
    //         },
    //         {
    //             path: '/up-locator',
    //             lazy: async () => ({
    //                 Component: (await import('./pages/up-locator')).default,
    //             }),
    //         },
    //         {
    //             path: '/up-simulator',
    //             lazy: async () => ({
    //                 Component: (await import('./pages/up-simulator')).default,
    //             }),
    //         },
    //     ]
    // },
    // {
    //     path: '/maps',
    //     lazy: async () => ({
    //         Component: (await import('./pages/dashboard')).default,
    //     }),
    // },
    // {
    //     path: '/up-locator',
    //     lazy: async () => ({
    //         Component: (await import('./pages/up-locator')).default,
    //     }),
    // },

    // // Error routes
    // { path: '/500', Component: GeneralError },
    // { path: '/404', Component: NotFoundError },
    // { path: '/503', Component: MaintenanceError },
    // { path: '/401', Component: UnauthorisedError },

    // // Fallback 404 route
    { path: '*', Component: NotFoundError },
])

export default router