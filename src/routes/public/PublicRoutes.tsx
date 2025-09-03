import AuthLayout from '@/components/layout/AuthLayout';
import { Outlet, useLocation } from 'react-router-dom';

const PublicRoutes = () => {
  const location = useLocation();
  if (
    location.pathname.includes('landing-page') ||
    location.pathname.includes('info')
  ) {
    return <Outlet />;
  } else {
    return (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    );
  }
};

export default PublicRoutes;
