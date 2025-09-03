const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-screen h-screen">
      Main Layout
      {children}
    </main>
  );
};

export default MainLayout;
