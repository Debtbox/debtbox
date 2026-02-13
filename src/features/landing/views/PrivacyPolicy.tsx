import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../Sections/PrivacyPolicy/HeroSection';
import PrivacyContentSection from '../Sections/PrivacyPolicy/PrivacyContentSection';
import '../styles/styles.css';

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />
      <AnimateOnScroll>
        <HeroSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <PrivacyContentSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Footer />
      </AnimateOnScroll>
    </div>
  );
};

export default PrivacyPolicy;
