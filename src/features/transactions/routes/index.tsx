import { Navigate, Route, Routes } from 'react-router-dom';
import { Transactions } from '../views/Transactions';

export const TransactionsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Transactions />} />
      <Route path="*" element={<Navigate to="/transactions" replace />} />
    </Routes>
  );
};
