import Footer from '../components/Footer';
import Header from '../components/Header';
import SVGBackground from '../components/SVGBackground';
import FeaturesSection from '../Sections/FeaturesSection';
import HeroSection from '../Sections/HeroSection';
import HowItWorksSection from '../Sections/HowItWorksSection';
import ShowCaseSection from '../Sections/ShowCaseSection';
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
