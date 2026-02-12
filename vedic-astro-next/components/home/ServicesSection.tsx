import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

const services = [
  { title: 'Free Kundli', icon: '\u{1F4DC}', desc: 'Generate your complete Vedic birth chart with planetary positions, houses, and Dasha periods.', href: '/kundli', link: 'Create Kundli' },
  { title: 'Daily Panchang', icon: '\u{1F319}', desc: 'Check today\'s tithi, nakshatra, yoga, karana, and auspicious timings for important activities.', href: '/panchang', link: 'View Panchang' },
  { title: 'Compatibility', icon: '\u{1F49E}', desc: 'Check your Kundli Milan for marriage compatibility using Ashtakoot and Dashakoot matching.', href: '/compatibility', link: 'Check Match' },
  { title: 'Horoscopes', icon: '\u{2B50}', desc: 'Get daily, weekly, monthly, and yearly predictions based on your Moon sign and planetary transits.', href: '/horoscopes', link: 'Read Horoscope' },
  { title: 'Learn Astrology', icon: '\u{1F4DA}', desc: 'Explore articles on planets, houses, nakshatras, yogas, and remedial measures in Vedic astrology.', href: '/articles', link: 'Start Learning' },
  { title: 'Expert Consultation', icon: '\u{1F52E}', desc: 'Connect with experienced Vedic astrologers for personalized readings and life guidance.', href: '/consultation', link: 'Book Session', highlight: true },
];

export default function ServicesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="सेवाएं" title="Our Sacred Services" description="Explore authentic Vedic astrology tools and insights" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ScrollReveal key={s.title} delay={i}>
              <div className={`glass-card hover-lift p-8 text-center h-full ${s.highlight ? 'shimmer-border border-sign-primary/30 bg-gradient-to-br from-[rgba(139,69,19,0.2)] to-[rgba(var(--sign-glow-rgb),0.1)]' : ''}`}>
                <span className="text-3xl block mb-3">{s.icon}</span>
                <h3 className="font-heading text-xl text-text-primary mb-3">{s.title}</h3>
                <p className="text-text-muted mb-6 leading-relaxed">{s.desc}</p>
                <Link href={s.href} className="text-sign-primary font-medium hover:gap-2 inline-flex items-center gap-1 transition-all">
                  {s.link} &rarr;
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
