import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from '../views/Settings';
import { OutstandingFees } from '../views/OutstandingFees';

export const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Settings />} />
      <Route path="/outstanding-fees" element={<OutstandingFees />} />
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
};
