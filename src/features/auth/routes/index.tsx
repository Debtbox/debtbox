import { Outlet, Route, Routes } from 'react-router-dom';
import { Login } from '../views/Login';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};
