import { Navigate, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { getCookie } from '@/utils/storage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const AppRoutes = () => {
  const isLoggedIn = getCookie('access_token');
  const routes = isLoggedIn ? protectedRoutes : publicRoutes;

  const element = useRoutes([
    ...routes,
    {
      path: '*',
      element: <Navigate to={isLoggedIn ? '/' : '/auth/login'} replace />,
    },
  ]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
    </ErrorBoundary>
  );
};
