import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../Sections/ContactUs/HeroSection';
import ContactUsForm from '../Sections/ContactUs/ContactUsForm';
import '../styles/styles.css';
import '../styles/contact-us.css';
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
