'use client';

import Link from 'next/link';
import { usePanchang } from '@/hooks/usePanchang';
import { generateMoonPhaseSvg } from '@/lib/moon-phase';
import { calculateSunTimes } from '@/lib/panchang';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TiltCard from '@/components/ui/TiltCard';
import RangoliCard from '@/components/ui/RangoliCard';
import { getAuspiciousMarker } from '@/lib/shubh-ashubh';
import SparkleWrap from '@/components/ui/SparkleWrap';

export default function PanchangWidget() {
  const { panchang, rahuKaal, dateString } = usePanchang();

  if (!panchang) return null;

  const moonSvg = generateMoonPhaseSvg(panchang.tithiIndex);
  const sunTimes = calculateSunTimes(new Date());

  const cards = [
    { icon: '\uD83C\uDF19', label: 'Tithi', value: panchang.tithi, markerType: 'tithi' as const },
    { icon: '\u2B50', label: 'Nakshatra', value: panchang.nakshatra, markerType: 'nakshatra' as const },
    { icon: '\u2638', label: 'Yoga', value: panchang.yoga, markerType: 'yoga' as const },
    { icon: '\u25D1', label: 'Karana', value: panchang.karana, markerType: 'karana' as const },
    { icon: '\u23F0', label: 'Rahu Kaal', value: rahuKaal ? `${rahuKaal.start} - ${rahuKaal.end}` : '', extra: rahuKaal ? (rahuKaal.isActive ? 'Active Now' : 'Not Active') : '', markerType: null },
    { icon: '\u2600', label: 'Sunrise / Sunset', value: `${sunTimes.sunrise} / ${sunTimes.sunset}`, markerType: null },
  ];

  return (
    <section className="py-16 md:py-24" id="panchang-section">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="आज का पंचांग" title="Today's Panchang" description={dateString} emoji="🪔" typewriter kalash />
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 hover-glow rounded-full" dangerouslySetInnerHTML={{ __html: moonSvg }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {cards.map((card, i) => (
            <ScrollReveal key={card.label} delay={i}>
              <TiltCard maxTilt={10}>
                <RangoliCard size={24}>
                  <div className="glass-card p-4 text-center h-full">
                    <span className="text-2xl block mb-2 notranslate" translate="no">{card.icon}</span>
                    <span className="copper-metallic text-xs block mb-1">{card.label}</span>
                    <span className="text-text-primary text-sm font-medium block">{card.value}</span>
                    {card.markerType && (() => {
                      const m = getAuspiciousMarker(card.markerType, card.value);
                      return <span className={`text-[10px] mt-1 block notranslate ${m.className}`} translate="no">{m.emoji} {m.labelHindi}</span>;
                    })()}
                    {card.extra && (
                      <span className={`text-xs mt-1 block ${card.extra === 'Active Now' ? 'text-red-400' : 'text-green-400'}`}>
                        {card.extra}
                      </span>
                    )}
                  </div>
                </RangoliCard>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center">
          <SparkleWrap count={6}>
            <Link href="/panchang" className="btn-premium border-2 border-sign-primary text-sign-primary px-6 py-3 rounded-lg font-medium hover:bg-sign-primary hover:text-cosmic-bg transition-all inline-block">
              View Full Panchang
            </Link>
          </SparkleWrap>
        </div>
      </div>
    </section>
  );
}
