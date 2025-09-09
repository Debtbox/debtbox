import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../Sections/About/HeroSection';
import VisionSection from '../Sections/About/VisionSection';
import HowItWorksSection from '../Sections/About/HowItWorksSection';
import MissionSection from '../Sections/About/MissionSection';
import WhyUsSection from '../Sections/About/WhyUsSection';
import '../styles/styles.css';
import '../styles/about.css';

export const About = () => {
  return (
    <div className="about-page">
      <Header />
      <HeroSection />
      <VisionSection />
      <HowItWorksSection />
      <MissionSection />
      <WhyUsSection />
      <Footer />
    </div>
  );
};
