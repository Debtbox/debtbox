import { Navigate, Route, Routes } from 'react-router-dom';
import { Businesses } from '../views/Businesses';

export const BusinessesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Businesses />} />
      <Route path="*" element={<Navigate to="/businesses" replace />} />
    </Routes>
  );
};
