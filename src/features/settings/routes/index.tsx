import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from '../views/Settings';

export const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Settings />} />
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
};
