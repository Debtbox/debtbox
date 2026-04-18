import { Navigate, Route, Routes } from 'react-router-dom';
import { Profile } from '../views/Profile';

export const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
};
