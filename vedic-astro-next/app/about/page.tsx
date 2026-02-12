import SectionHeader from '@/components/ui/SectionHeader';

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4">
        <SectionHeader sanskrit={"परिचय"} title="About Vedic_Astro" description="Your trusted source for authentic Vedic astrology" />

        <div className="glass-card p-8 space-y-6 text-text-muted text-sm leading-relaxed">
          <p>
            Vedic_Astro is dedicated to making the ancient wisdom of Jyotish Shastra accessible to everyone.
            Our platform combines traditional Vedic astrology principles with modern technology to provide
            accurate birth charts, horoscopes, and astrological guidance.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Our Mission</h3>
          <p>
            We believe that Vedic astrology is a powerful tool for self-understanding and life planning.
            Our mission is to provide authentic, trustworthy astrological content and tools that help
            individuals navigate life{"'"}s journey with greater clarity and confidence.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">What We Offer</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Free Kundli (birth chart) generation with detailed planetary positions</li>
            <li>Daily, weekly, and monthly horoscope predictions for all 12 zodiac signs</li>
            <li>Marriage compatibility analysis using the Ashtakoot Milan system</li>
            <li>Daily Panchang with Tithi, Nakshatra, and auspicious timings</li>
            <li>Educational articles on Vedic astrology concepts</li>
            <li>Expert consultation with experienced Vedic astrologers</li>
          </ul>

          <h3 className="font-heading text-lg text-sign-primary">Our Approach</h3>
          <p>
            We follow the Parashari system of Vedic astrology, which is the most widely practiced
            tradition in India. All our calculations are based on the sidereal zodiac (Lahiri Ayanamsha)
            and follow classical texts including Brihat Parashara Hora Shastra and Phaladeepika.
          </p>

          <p className="text-text-muted text-xs border-t border-sign-primary/10 pt-4">
            Disclaimer: Astrology is for entertainment and guidance purposes. Major life decisions should
            be made with professional advice.
          </p>
        </div>
      </div>
    </div>
  );
}
