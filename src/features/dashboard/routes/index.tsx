import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../views/Dashboard';

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
