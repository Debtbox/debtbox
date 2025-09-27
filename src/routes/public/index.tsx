import { lazy } from 'react';
import PublicRoutes from './PublicRoutes';

const AuthRoutes = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.AuthRoutes })),
);
const LandingRoutes = lazy(() =>
  import('@/features/landing').then((module) => ({
    default: module.LandingRoutes,
  })),
);

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
        path: '*',
        element: <LandingRoutes />,
      },
    ],
  },
];
