import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../Sections/TermsAndConditions/HeroSection';
import TermsContentSection from '../Sections/TermsAndConditions/TermsContentSection';
import '../styles/styles.css';

const TermsAndConditions = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <TermsContentSection />
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
