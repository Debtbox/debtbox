import { Route, Routes } from 'react-router-dom';
import { Settings } from '../views/Settings';

export const SettingsRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Settings />} />
      </Route>
    </Routes>
  );
};
