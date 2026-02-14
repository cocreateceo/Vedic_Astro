'use client';

import { usePanchang } from '@/hooks/usePanchang';

export default function CosmicTicker() {
  const { panchang, rahuKaal, city } = usePanchang();

  if (!panchang) return null;

  const locationLabel = city ? `${city.name}, ${city.region}` : '';

  const items = [
    ...(locationLabel ? [{ label: '\uD83D\uDCCD', value: locationLabel }] : []),
    { label: 'Tithi', value: panchang.tithi },
    { label: 'Nakshatra', value: panchang.nakshatra },
    { label: 'Yoga', value: panchang.yoga },
    { label: 'Karana', value: panchang.karana },
    { label: 'Rahu Kaal', value: rahuKaal ? `${rahuKaal.start} - ${rahuKaal.end}` : '' },
  ];

  return (
    <section className="bg-gradient-to-r from-bg-light/80 via-bg-light/60 to-bg-light/80 border-y border-sign-primary/10 overflow-hidden py-3">
      <div className="flex animate-[tickerScroll_30s_linear_infinite] ticker-animate whitespace-nowrap" style={{ width: 'max-content' }}>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-6">
            <span className="text-sign-primary font-medium text-sm notranslate" translate="no">{item.label}:</span>
            <span className="text-text-primary text-sm">{item.value}</span>
            <span className="mx-2"><span className="sindoor-dot sindoor-dot-sm"></span></span>
          </div>
        ))}
      </div>
    </section>
  );
}
