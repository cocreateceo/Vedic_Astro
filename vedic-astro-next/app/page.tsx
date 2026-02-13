import HeroSection from '@/components/home/HeroSection';
import CosmicTicker from '@/components/home/CosmicTicker';
import PanchangWidget from '@/components/home/PanchangWidget';
import ZodiacWheel from '@/components/home/ZodiacWheel';
import ServicesSection from '@/components/home/ServicesSection';
import QuickKundli from '@/components/home/QuickKundli';
import WhyVedic from '@/components/home/WhyVedic';
import Astrologers from '@/components/home/Astrologers';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import DiyaDivider from '@/components/ui/DiyaDivider';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CosmicTicker />
      <DiyaDivider count={3} />
      <PanchangWidget />
      <DiyaDivider count={5} />
      <ZodiacWheel />
      <DiyaDivider count={3} />
      <ServicesSection />
      <DiyaDivider count={5} />
      <QuickKundli />
      <DiyaDivider count={3} />
      <WhyVedic />
      <DiyaDivider count={5} />
      <Astrologers />
      <DiyaDivider count={3} />
      <Testimonials />
      <DiyaDivider count={7} />
      <CTASection />
    </>
  );
}
