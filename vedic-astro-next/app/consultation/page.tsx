import SectionHeader from '@/components/ui/SectionHeader';
import TierSelector from '@/components/consultation/TierSelector';
import HowItWorks from '@/components/consultation/HowItWorks';

export default function ConsultationPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader
          sanskrit="परामर्श"
          title="Expert Consultation"
          description="Connect with experienced Vedic astrologers for personalized guidance — choose a tier that fits your needs"
          emoji="🔮"
          kalash
        />

        <TierSelector />

        <div className="mt-12">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
