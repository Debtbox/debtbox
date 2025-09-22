import { dbBg, topRightVector } from '@/assets/images';
import React from 'react';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import { useSecurityDashboard } from '@/hooks/useSecurityDashboard';
import { isDevelopment } from '@/utils/environment';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, openDashboard, closeDashboard } = useSecurityDashboard();

  return (
    <main className="flex items-center min-w-screen min-h-screen max-w-screen max-h-screen">
      <div className="flex-1 bg-bacground-image-auth h-screen hidden lg:block" />
      <div className="flex-1 h-screen relative bg-light-gray">
        {/* Security Dashboard Button - Only visible in development */}
        {isDevelopment() && (
          <button
            className="absolute top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
            onClick={openDashboard}
            title="Security Dashboard (Ctrl+Shift+S)"
          >
            🔒 Security
          </button>
        )}
        
        <img
          src={topRightVector}
          alt="db-bg"
          className="absolute top-0 end-0"
        />
        <img src={dbBg} alt="db-bg" className="absolute bottom-0 end-0" />
        {children}
      </div>
      
      <SecurityDashboard 
        isOpen={isOpen} 
        onClose={closeDashboard} 
      />
    </main>
  );
};

export default AuthLayout;
