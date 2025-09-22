import { queryClient } from '@/lib/queryClient';
import { clearCookie } from '@/utils/storage';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import { useSecurityDashboard } from '@/hooks/useSecurityDashboard';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, openDashboard, closeDashboard } = useSecurityDashboard();

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className="bg-blue-600 text-white p-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={openDashboard}
          title="Security Dashboard (Ctrl+Shift+S)"
        >
          🔒 Security
        </button>
        <button
          className="bg-primary text-white p-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
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
      </div>
      {children}
      
      <SecurityDashboard 
        isOpen={isOpen} 
        onClose={closeDashboard} 
      />
    </main>
  );
};

export default MainLayout;
