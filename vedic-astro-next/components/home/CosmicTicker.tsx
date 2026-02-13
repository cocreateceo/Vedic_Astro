'use client';

import { usePanchang } from '@/hooks/usePanchang';
import { getRahuKaalTimeString } from '@/lib/panchang';

export default function CosmicTicker() {
  const { panchang } = usePanchang();

  if (!panchang) return null;

  const day = new Date().getDay();
  const items = [
    { label: 'Tithi', value: panchang.tithi },
    { label: 'Nakshatra', value: panchang.nakshatra },
    { label: 'Yoga', value: panchang.yoga },
    { label: 'Karana', value: panchang.karana },
    { label: 'Rahu Kaal', value: getRahuKaalTimeString(day) },
  ];

  return (
    <section className="bg-gradient-to-r from-bg-light/80 via-bg-light/60 to-bg-light/80 border-y border-sign-primary/10 overflow-hidden py-3">
      <div className="flex animate-[tickerScroll_30s_linear_infinite] ticker-animate whitespace-nowrap" style={{ width: 'max-content' }}>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-6">
            <span className="text-sign-primary font-medium text-sm">{item.label}:</span>
            <span className="text-text-primary text-sm">{item.value}</span>
            <span className="mx-2"><span className="sindoor-dot sindoor-dot-sm"></span></span>
          </div>
        ))}
      </div>
    </section>
  );
}
