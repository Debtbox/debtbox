import { DashboardRoutes } from '@/features/dashboard';
import ProtectedRoutes from './ProtectedRoutes';
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
    ],
  },
];
