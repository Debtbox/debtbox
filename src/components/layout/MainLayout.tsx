import { queryClient } from '@/lib/queryClient';
import { clearCookie } from '@/utils/storage';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <button
        className="bg-primary text-white p-2 rounded-md cursor-pointer"
        onClick={() => {
          clearCookie('access-token');
          clearCookie('language');
          localStorage.clear();
          window.location.reload();
          queryClient.clear();
          window.location.replace('/auth/login');
        }}
      >
        Logout
      </button>
      {children}
    </main>
  );
};

export default MainLayout;
