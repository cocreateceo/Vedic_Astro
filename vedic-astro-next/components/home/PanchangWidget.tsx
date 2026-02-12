'use client';

import Link from 'next/link';
import { usePanchang } from '@/hooks/usePanchang';
import { generateMoonPhaseSvg } from '@/lib/moon-phase';
import { calculateSunTimes } from '@/lib/panchang';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function PanchangWidget() {
  const { panchang, rahuKaal, dateString } = usePanchang();

  if (!panchang) return null;

  const moonSvg = generateMoonPhaseSvg(panchang.tithiIndex);
  const sunTimes = calculateSunTimes(new Date());

  const cards = [
    { icon: '\uD83C\uDF19', label: 'Tithi', value: panchang.tithi },
    { icon: '\u2B50', label: 'Nakshatra', value: panchang.nakshatra },
    { icon: '\u2638', label: 'Yoga', value: panchang.yoga },
    { icon: '\u25D1', label: 'Karana', value: panchang.karana },
    { icon: '\u23F0', label: 'Rahu Kaal', value: rahuKaal ? `${rahuKaal.start} - ${rahuKaal.end}` : '', extra: rahuKaal ? (rahuKaal.isActive ? 'Active Now' : 'Not Active') : '' },
    { icon: '\u2600', label: 'Sunrise / Sunset', value: `${sunTimes.sunrise} / ${sunTimes.sunset}` },
  ];

  return (
    <section className="py-16 md:py-24" id="panchang-section">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="आज का पंचांग" title="Today's Panchang" description={dateString} />
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 hover-glow rounded-full" dangerouslySetInnerHTML={{ __html: moonSvg }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {cards.map((card, i) => (
            <ScrollReveal key={card.label} delay={i}>
              <div className="glass-card hover-lift p-4 text-center h-full">
                <span className="text-2xl block mb-2">{card.icon}</span>
                <span className="text-sign-primary/60 text-xs block mb-1">{card.label}</span>
                <span className="text-text-primary text-sm font-medium block">{card.value}</span>
                {card.extra && (
                  <span className={`text-xs mt-1 block ${card.extra === 'Active Now' ? 'text-red-400' : 'text-green-400'}`}>
                    {card.extra}
                  </span>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center">
          <Link href="/panchang" className="btn-premium border-2 border-sign-primary text-sign-primary px-6 py-3 rounded-lg font-medium hover:bg-sign-primary hover:text-cosmic-bg transition-all inline-block">
            View Full Panchang
          </Link>
        </div>
      </div>
    </section>
  );
}
