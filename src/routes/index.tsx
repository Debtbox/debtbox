import { Navigate, useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { getCookie } from '@/utils/storage';

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

  return <>{element}</>;
};
