import Mandala from './Mandala';
import ScrollReveal from '@/components/ui/ScrollReveal';

const benefits = [
  { icon: '\u263D', title: 'Moon Sign Based', desc: 'Predictions based on Moon sign for deeper emotional and karmic insights' },
  { icon: '\u23F0', title: 'Precise Timing', desc: 'Dasha system provides accurate timing of life events' },
  { icon: '\uD83D\uDC8E', title: 'Remedial Measures', desc: 'Gemstones, mantras, and rituals to balance planetary influences' },
  { icon: '\uD83D\uDD2E', title: 'Predictive Accuracy', desc: 'Proven system refined over millennia of observation' },
];

export default function WhyVedic() {
  return (
    <section className="py-16 md:py-24 bg-bg-light">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-sign-primary mb-6 drop-shadow-[0_0_20px_rgba(var(--sign-glow-rgb),0.3)]">
              Why Vedic Astrology?
            </h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              Vedic astrology, also known as Jyotish Shastra, is an ancient Indian science dating back over 5,000 years. Unlike Western astrology, Vedic astrology uses the sidereal zodiac, accounting for the precession of equinoxes for more accurate planetary positions.
            </p>
            <div className="space-y-6">
              {benefits.map((b, i) => (
                <ScrollReveal key={b.title} delay={i}>
                  <div className="flex gap-4 items-start hover-lift rounded-lg p-2 -m-2">
                    <span className="text-2xl w-12 h-12 flex items-center justify-center bg-sign-primary/10 rounded-lg shrink-0 hover-glow">{b.icon}</span>
                    <div>
                      <strong className="text-text-primary block mb-1">{b.title}</strong>
                      <p className="text-text-muted text-sm">{b.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Mandala />
          </div>
        </div>
      </div>
    </section>
  );
}
