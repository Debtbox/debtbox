import { Outlet, Route, Routes } from 'react-router-dom';
import { Landing } from '../views/Landing';

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="/" element={<Landing />} />
      </Route>
    </Routes>
  );
};
