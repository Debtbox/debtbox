import { Navigate, Route, Routes } from 'react-router-dom';
import { Support } from '../views/Support';
import { ContactSupport } from '../views/ContactSupport';
import { TicketDetails } from '../views/TicketDetails';

export const SupportRoutes = () => (
  <Routes>
    <Route path="/" element={<Support />} />
    <Route path="/contact" element={<ContactSupport />} />
    <Route path="/contact/:id" element={<TicketDetails />} />
    <Route path="/faqs" element={<Support />} />
    <Route path="/how-it-works" element={<Support />} />
    <Route path="*" element={<Navigate to="/support" replace />} />
  </Routes>
);
