import MainLayout from '@/components/layout/MainLayout';
import { Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoutes;
