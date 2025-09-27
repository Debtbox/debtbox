import { lazy } from 'react';
import ProtectedRoutes from './ProtectedRoutes';

const DashboardRoutes = lazy(() =>
  import('@/features/dashboard')
    .then((module) => ({ default: module.DashboardRoutes }))
    .catch(() =>
      import('@/features/dashboard').then((module) => ({
        default: module.DashboardRoutes,
      })),
    ),
);

const ClientsRoutes = lazy(() =>
  import('@/features/clients')
    .then((module) => ({ default: module.ClientsRoutes }))
    .catch(() =>
      import('@/features/clients').then((module) => ({
        default: module.ClientsRoutes,
      })),
    ),
);

const SettingsRoutes = lazy(() =>
  import('@/features/settings')
    .then((module) => ({ default: module.SettingsRoutes }))
    .catch(() =>
      import('@/features/settings').then((module) => ({
        default: module.SettingsRoutes,
      })),
    ),
);

const TransactionsRoutes = lazy(() =>
  import('@/features/transactions')
    .then((module) => ({ default: module.TransactionsRoutes }))
    .catch(() =>
      import('@/features/transactions').then((module) => ({
        default: module.TransactionsRoutes,
      })),
    ),
);
export const protectedRoutes = [
  {
    path: '/',
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/',
        element: <DashboardRoutes />,
      },
      {
        path: '/dashboard',
        element: <DashboardRoutes />,
      },
      {
        path: '/clients',
        element: <ClientsRoutes />,
      },
      {
        path: '/transactions',
        element: <TransactionsRoutes />,
      },
      {
        path: '/settings',
        element: <SettingsRoutes />,
      },
    ],
  },
];
