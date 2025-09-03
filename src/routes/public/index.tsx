import { AuthRoutes } from '@/features/auth';
import { LandingRoutes } from '@/features/landing';
import PublicRoutes from './PublicRoutes';

export const publicRoutes = [
  {
    path: '/*',
    element: <PublicRoutes />,
    children: [
      {
        path: 'auth/*',
        element: <AuthRoutes />,
      },
      {
        path: '/*',
        element: <LandingRoutes />,
      },
    ],
  },
];
