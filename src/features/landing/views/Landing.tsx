import Footer from '../components/Footer';
import Header from '../components/Header';
import SVGBackground from '../components/SVGBackground';
import FeaturesSection from '../Sections/Home/FeaturesSection';
import HeroSection from '../Sections/Home/HeroSection';
import HowItWorksSection from '../Sections/Home/HowItWorksSection';
import ShowCaseSection from '../Sections/Home/ShowCaseSection';

import '../styles/styles.css';

export const Landing = () => {
  return (
    <div className="landing-page">
      <Header />
      <SVGBackground />
      <HeroSection />
      <ShowCaseSection />
      <HowItWorksSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};
