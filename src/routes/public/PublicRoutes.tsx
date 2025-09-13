import AuthLayout from '@/components/layout/AuthLayout';
import { Outlet, useLocation } from 'react-router-dom';

const PublicRoutes = () => {
  const pathname = useLocation();
  return pathname.pathname.includes('auth') ? (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ) : (
    <Outlet />
  );
};

export default PublicRoutes;
