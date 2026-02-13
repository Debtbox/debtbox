import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../Sections/About/HeroSection';
import VisionSection from '../Sections/About/VisionSection';
import HowItWorksSection from '../Sections/About/HowItWorksSection';
import MissionSection from '../Sections/About/MissionSection';
import WhyUsSection from '../Sections/About/WhyUsSection';
import Description from '../Sections/About/Description';
import '../styles/styles.css';
import '../styles/about.css';
import { aboutVector1, aboutVector2, aboutVector3 } from '@/assets/images';

export const About = () => {
  return (
    <div className="about-page">
      <img src={aboutVector1} alt="" className="about-vector-1" loading="lazy" decoding="async" />
      <img src={aboutVector2} alt="" className="about-vector-2" loading="lazy" decoding="async" />
      <img src={aboutVector3} alt="" className="about-vector-3" loading="lazy" decoding="async" />
      <Header />
      <AnimateOnScroll>
        <HeroSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Description />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <VisionSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <HowItWorksSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <MissionSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <WhyUsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Footer />
      </AnimateOnScroll>
    </div>
  );
};
