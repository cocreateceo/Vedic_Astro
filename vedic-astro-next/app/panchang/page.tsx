'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { usePanchang } from '@/hooks/usePanchang';
import { generateMoonPhaseSvg } from '@/lib/moon-phase';
import { calculateSunTimes } from '@/lib/panchang';
import { getAuspiciousMarker } from '@/lib/shubh-ashubh';

export default function PanchangPage() {
  const { panchang, rahuKaal, dateString } = usePanchang();

  if (!panchang) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="pooja-thali-loader">
          <div className="pooja-thali-plate" />
          {['🪷', '🍚', '🥥', '🪔', '🌺', '🍌'].map((item, i) => (
            <div key={i} className="pooja-thali-item notranslate" translate="no">{item}</div>
          ))}
          <div className="pooja-thali-center notranslate" translate="no">🕉️</div>
        </div>
        <p className="text-text-muted text-sm animate-pulse">Loading Panchang...</p>
      </div>
    </div>
  );

  const moonSvg = generateMoonPhaseSvg(panchang.tithiIndex);
  const sunTimes = calculateSunTimes(new Date());

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="पंचांग" title="Daily Panchang" description={dateString} emoji="🪔" kalash />

        <div className="flex justify-center mb-12">
          <div className="glass-card hover-glow p-8 text-center">
            <h3 className="font-heading text-sign-primary mb-4">Moon Phase</h3>
            <div className="w-24 h-24 mx-auto mb-4" dangerouslySetInnerHTML={{ __html: moonSvg }} />
            <p className="text-text-muted text-sm">{panchang.tithi}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '\uD83C\uDF19', label: 'Tithi (Lunar Day)', value: panchang.tithi, desc: 'The lunar day based on the angle between Sun and Moon', markerType: 'tithi' as const },
            { icon: '\u2B50', label: 'Nakshatra (Star)', value: panchang.nakshatra, desc: 'The lunar mansion the Moon is transiting through', markerType: 'nakshatra' as const },
            { icon: '\u2638', label: 'Yoga', value: panchang.yoga, desc: 'Combined longitude of Sun and Moon', markerType: 'yoga' as const },
            { icon: '\u25D1', label: 'Karana', value: panchang.karana, desc: 'Half of a Tithi, important for muhurta', markerType: 'karana' as const },
            { icon: '\u23F0', label: 'Rahu Kaal', value: rahuKaal ? `${rahuKaal.start} - ${rahuKaal.end}` : '', desc: 'Inauspicious time period ruled by Rahu', extra: rahuKaal?.isActive ? 'Active Now' : 'Not Active', markerType: null },
            { icon: '\u2600', label: 'Sunrise / Sunset', value: `${sunTimes.sunrise} / ${sunTimes.sunset}`, desc: 'Approximate times for New Delhi', markerType: null },
          ].map(card => {
            const marker = card.markerType ? getAuspiciousMarker(card.markerType, card.value) : null;
            return (
              <div key={card.label} className="glass-card hover-lift p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl notranslate" translate="no">{card.icon}</span>
                  <h3 className="font-heading text-sign-primary text-sm">{card.label}</h3>
                  {marker && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${marker.className} bg-current/10`}
                      style={{ backgroundColor: marker.className.includes('green') ? 'rgba(74,222,128,0.1)' : marker.className.includes('red') ? 'rgba(248,113,113,0.1)' : 'rgba(250,204,21,0.1)' }}>
                      <span className="notranslate" translate="no">{marker.emoji} {marker.labelHindi}</span>
                    </span>
                  )}
                </div>
                <p className="text-text-primary text-lg font-medium mb-2">{card.value}</p>
                <p className="text-text-muted text-xs">{card.desc}</p>
                {card.extra && <span className={`text-xs mt-2 inline-block ${card.extra === 'Active Now' ? 'text-red-400' : 'text-green-400'}`}>{card.extra}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
