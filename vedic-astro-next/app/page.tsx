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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CosmicTicker />
      <PanchangWidget />
      <ZodiacWheel />
      <ServicesSection />
      <QuickKundli />
      <WhyVedic />
      <Astrologers />
      <Testimonials />
      <CTASection />
    </>
  );
}
