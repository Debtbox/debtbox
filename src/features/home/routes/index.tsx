import { Route, Routes } from 'react-router-dom';
import { Home } from '../views/Home';

export const HomeRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};
