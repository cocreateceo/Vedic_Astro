'use client';

import { useMemo } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { usePanchang } from '@/hooks/usePanchang';
import { generateMoonPhaseSvg } from '@/lib/moon-phase';
import { calculateSunTimes } from '@/lib/panchang';
import { getAuspiciousMarker } from '@/lib/shubh-ashubh';
import { getBestEventsForDay, calculatePanchaka } from '@/lib/muhurta-calc';

export default function PanchangPage() {
  const { panchang, rahuKaal, dateString } = usePanchang();
  const today = new Date();

  // Hooks MUST be called before any early return (Rules of Hooks)
  const muhurtaRankings = useMemo(() => {
    if (!panchang) return [];
    return getBestEventsForDay(panchang.nakshatra, panchang.tithi, today.getDay(), panchang.tithiIndex);
  }, [panchang?.nakshatra, panchang?.tithi, panchang?.tithiIndex]);

  const panchakaResult = useMemo(() => {
    if (!panchang) return null;
    return calculatePanchaka(panchang.tithiIndex, today.getDay(), panchang.nakshatra);
  }, [panchang?.tithiIndex, panchang?.nakshatra]);

  if (!panchang) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="pooja-thali-loader">
          <div className="pooja-thali-plate" />
          {['\uD83E\uDEB7', '\uD83C\uDF5A', '\uD83E\uDD65', '\uD83E\uDE94', '\uD83C\uDF3A', '\uD83C\uDF4C'].map((item, i) => (
            <div key={i} className="pooja-thali-item notranslate" translate="no">{item}</div>
          ))}
          <div className="pooja-thali-center notranslate" translate="no">{'\uD83D\uDD49\uFE0F'}</div>
        </div>
        <p className="text-text-muted text-sm animate-pulse">Loading Panchang...</p>
      </div>
    </div>
  );

  const moonSvg = generateMoonPhaseSvg(panchang.tithiIndex);
  const sunTimes = calculateSunTimes(new Date());
  const paksha = panchang.tithiIndex < 15 ? 'Shukla' : 'Krishna';

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="पंचांग" title="Daily Panchang" description={dateString} emoji="🪔" kalash />

        <div className="flex justify-center mb-12">
          <div className="glass-card hover-glow p-8 text-center">
            <h3 className="font-heading text-sign-primary mb-4">Moon Phase</h3>
            <div className="w-24 h-24 mx-auto mb-4" dangerouslySetInnerHTML={{ __html: moonSvg }} />
            <p className="text-text-muted text-sm">{panchang.tithi}</p>
            <p className="text-text-muted text-xs mt-1">{paksha} Paksha ({paksha === 'Shukla' ? 'Bright' : 'Dark'} Fortnight)</p>
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

        {/* ===== Panchaka Status ===== */}
        {panchakaResult && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className={`glass-card p-4 border ${panchakaResult.isBad ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl notranslate" translate="no">{panchakaResult.isBad ? '\u26A0\uFE0F' : '\u2705'}</span>
                <div>
                  <h4 className="text-text-primary text-sm font-medium">Panchaka: {panchakaResult.name}</h4>
                  <p className="text-text-muted text-xs">{panchakaResult.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Today's Muhurta — Auspicious Activities ===== */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="font-heading text-sign-primary text-xl mb-2 text-center">Today&apos;s Muhurta &mdash; Auspicious Activities</h2>
          <p className="text-text-muted text-sm mb-6 text-center">
            Based on current Nakshatra ({panchang.nakshatra}), Tithi ({panchang.tithi}), {paksha} Paksha, and Weekday
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {muhurtaRankings.map(({ event, score, verdict }) => (
              <div key={event.id} className="glass-card hover-lift p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-text-primary font-medium text-sm">{event.name}</h4>
                    <span className="text-text-muted text-xs italic">{event.sanskrit}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    score >= 70 ? 'bg-green-500/20 text-green-400' :
                    score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{verdict}</span>
                </div>
                <div className="w-full bg-cosmic-bg/50 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      score >= 70 ? 'bg-green-500' :
                      score >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-text-muted text-xs">{event.description}</p>
                  <span className="text-text-muted text-xs font-mono ml-2">{score}/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 mt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500/60" /><span className="text-text-muted text-xs">Highly Auspicious (70+)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-500/60" /><span className="text-text-muted text-xs">Moderate (50-69)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500/60" /><span className="text-text-muted text-xs">Inauspicious (&lt;50)</span></div>
            </div>
            <p className="text-text-muted text-xs text-center mt-3">Based on classical Muhurta Shastra &bull; Nakshatra, Tithi, Vara, Paksha &amp; Panchaka factors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
