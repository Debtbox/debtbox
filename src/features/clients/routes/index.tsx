import { Route, Routes } from 'react-router-dom';
import { Clients } from '../views/Clients';

export const ClientsRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Clients />} />
      </Route>
    </Routes>
  );
};
