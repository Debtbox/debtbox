import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../Sections/ContactUs/HeroSection';
import '../styles/styles.css';
import '../styles/contact-us.css';
import ContactUsForm from '../Sections/ContactUs/ContactUsForm';

export const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <Header />
      <HeroSection />
      <ContactUsForm />
      <Footer />
    </div>
  );
};
