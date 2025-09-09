import AuthLayout from '@/components/layout/AuthLayout';
import { Outlet } from 'react-router-dom';

const PublicRoutes = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export default PublicRoutes;
