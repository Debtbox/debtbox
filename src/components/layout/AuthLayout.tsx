import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      Auth Layout
      {children}
    </main>
  );
};

export default AuthLayout;
