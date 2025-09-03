import ProtectedRoutes from './ProtectedRoutes';
import { AuthRoutes } from '@/features/auth';

export const protectedRoutes = [
  {
    path: '/',
    element: <ProtectedRoutes />,
    children: [
      {
        path: 'auth',
        element: <AuthRoutes />,
      },
    ],
  },
];
