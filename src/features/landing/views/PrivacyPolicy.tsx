import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../Sections/PrivacyPolicy/HeroSection';
import PrivacyContentSection from '../Sections/PrivacyPolicy/PrivacyContentSection';
import '../styles/styles.css';

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <PrivacyContentSection />
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
