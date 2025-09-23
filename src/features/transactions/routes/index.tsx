import { Route, Routes } from 'react-router-dom';
import { Transactions } from '../views/Transactions';

export const TransactionsRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Transactions />} />
      </Route>
    </Routes>
  );
};
