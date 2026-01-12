import { Route, Routes } from 'react-router-dom';
import { Businesses } from '../views/Businesses';

export const BusinessesRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Businesses />} />
      </Route>
    </Routes>
  );
};
