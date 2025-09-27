import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() =>
  import('../views/Dashboard').then((module) => ({
    default: module.Dashboard,
  })),
);

export const DashboardRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
