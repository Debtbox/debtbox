import { Route, Routes } from 'react-router-dom';
import { Landing } from '../views/Landing';
import { ContactUs } from '../views/ContactUs';
import { About } from '../views/About';

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="contact-us" element={<ContactUs />} />
      <Route path="about" element={<About />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};
