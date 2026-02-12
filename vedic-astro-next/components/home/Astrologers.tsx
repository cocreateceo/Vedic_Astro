import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Astrologer } from '@/types';

const astrologers: Astrologer[] = [
  { name: 'Pt. Ramesh Shastri', avatar: '\uD83E\uDDD1', specializations: ['Kundli', 'Muhurta'], rating: 5, experience: '15+ years', consultations: '5000+', ribbon: 'Top Rated' },
  { name: 'Dr. Meera Joshi', avatar: '\uD83D\uDC69', specializations: ['Nadi', 'Remedies'], rating: 4, experience: '12+ years', consultations: '3500+' },
  { name: 'Acharya Vikram Singh', avatar: '\uD83D\uDC68', specializations: ['Prashna', 'Vastu'], rating: 5, experience: '20+ years', consultations: '8000+' },
  { name: 'Jyotishi Ananya Devi', avatar: '\uD83E\uDDD1', specializations: ['Marriage', 'Career'], rating: 4, experience: '10+ years', consultations: '2800+' },
];

export default function Astrologers() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="ज्योतिषी" title="Featured Astrologers" description="Connect with our experienced Vedic astrology experts" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {astrologers.map((a, i) => (
            <ScrollReveal key={a.name} delay={i}>
              <div className="glass-card hover-lift p-6 text-center relative">
                {a.ribbon && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg text-xs px-2 py-1 rounded font-medium">{a.ribbon}</span>
                )}
                <div className="text-4xl mb-3">{a.avatar}</div>
                <h4 className="font-heading text-text-primary mb-2">{a.name}</h4>
                <div className="flex gap-2 justify-center mb-2 flex-wrap">
                  {a.specializations.map(s => (
                    <span key={s} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
                <div className="text-sign-primary mb-2">{'\u2605'.repeat(a.rating)}{'\u2606'.repeat(5 - a.rating)}</div>
                <p className="text-text-muted text-xs mb-4">{a.experience} | {a.consultations} consultations</p>
                <Link href="/consultation" className="btn-premium border border-sign-primary text-sign-primary px-4 py-2 rounded text-sm hover:bg-sign-primary hover:text-cosmic-bg transition-all inline-block">
                  Book Session
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
