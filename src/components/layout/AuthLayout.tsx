import { dbBg, topRightVector } from '@/assets/images';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex items-center min-w-screen min-h-screen max-w-screen max-h-screen">
      <div className="flex-1 bg-bacground-image-auth h-screen hidden lg:block" />
      <div className="flex-1 h-screen relative bg-light-gray">
        <img
          src={topRightVector}
          alt="db-bg"
          className="absolute top-0 end-0"
        />
        <img src={dbBg} alt="db-bg" className="absolute bottom-0 end-0" />
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
