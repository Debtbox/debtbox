import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Landing = lazy(() =>
  import('../views/Landing').then((module) => ({ default: module.Landing })),
);
const ContactUs = lazy(() =>
  import('../views/ContactUs').then((module) => ({
    default: module.ContactUs,
  })),
);
const About = lazy(() =>
  import('../views/About').then((module) => ({ default: module.About })),
);

export const LandingRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route index element={<Landing />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Suspense>
  );
};
