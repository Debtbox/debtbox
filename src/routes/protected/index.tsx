import { DashboardRoutes } from '@/features/dashboard';
import ProtectedRoutes from './ProtectedRoutes';
// import { ClientsRoutes } from '@/features/clients';
// import { SettingsRoutes } from '@/features/settings';
import { TransactionsRoutes } from '@/features/transactions';
import { BusinessesRoutes } from '@/features/businesses';
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
        path: '/dashboard/*',
        element: <DashboardRoutes />,
      },
      {
        path: '/businesses/*',
        element: <BusinessesRoutes />,
      },
      // {
      //   path: '/clients/*',
      //   element: <ClientsRoutes />,
      // },
      {
        path: '/transactions/*',
        element: <TransactionsRoutes />,
      },
      // {
      //   path: '/settings/*',
      //   element: <SettingsRoutes />,
      // },
    ],
  },
];
