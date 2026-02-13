import { Route, Routes } from 'react-router-dom';
import { Landing } from '../views/Landing';
import { ContactUs } from '../views/ContactUs';
import { About } from '../views/About';
import PrivacyPolicy from '../views/PrivacyPolicy';
import TermsAndConditions from '../views/TermsAndConditions';
import { NotFound } from '../views/NotFound';

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="contact-us" element={<ContactUs />} />
      <Route path="about" element={<About />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="terms-conditions" element={<TermsAndConditions />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};