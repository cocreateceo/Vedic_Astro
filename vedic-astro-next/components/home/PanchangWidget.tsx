'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePanchang } from '@/hooks/usePanchang';
import { generateMoonPhaseSvg } from '@/lib/moon-phase';
import { searchCities, type CityData } from '@/lib/city-timings';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TiltCard from '@/components/ui/TiltCard';
import RangoliCard from '@/components/ui/RangoliCard';
import { getAuspiciousMarker } from '@/lib/shubh-ashubh';
import SparkleWrap from '@/components/ui/SparkleWrap';

function InlineCityPicker({ city, onSelect, onReset }: {
  city: CityData | null;
  onSelect: (c: CityData) => void;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (!editing) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        setQuery('');
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [editing]);

  function handleSearch(value: string) {
    setQuery(value);
    setResults(searchCities(value));
  }

  function handleSelect(c: CityData) {
    onSelect(c);
    setEditing(false);
    setQuery('');
    setResults([]);
  }

  if (!city) return null;

  const locationLabel = `${city.name}, ${city.region}`;

  if (editing) {
    return (
      <div ref={containerRef} className="inline-block relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search city or town..."
          className="bg-cosmic-bg/80 border border-sign-primary/30 rounded-lg px-3 py-1.5 text-sm text-text-primary focus-glow w-56"
          onKeyDown={e => {
            if (e.key === 'Escape') { setEditing(false); setQuery(''); setResults([]); }
          }}
        />
        {results.length > 0 && (
          <div className="absolute z-50 mt-1 left-0 right-0 bg-cosmic-bg border border-sign-primary/30 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
            {results.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelect(c)}
                className="w-full text-left px-3 py-2 text-sm transition-colors flex justify-between items-center text-text-primary hover:bg-sign-primary/10"
              >
                <span>{c.name}</span>
                <span className="text-text-muted text-xs">{c.region}</span>
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => { onReset(); setEditing(false); setQuery(''); setResults([]); }}
          className="ml-2 text-xs text-text-muted hover:text-sign-primary transition-colors"
          title="Reset to auto-detect"
        >
          Auto-detect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="inline-flex items-center gap-1.5 text-text-muted hover:text-sign-primary transition-colors group cursor-pointer"
      title="Click to change location"
    >
      <span>{locationLabel}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity">
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
      </svg>
    </button>
  );
}

export default function PanchangWidget() {
  const { panchang, rahuKaal, dateString, city, sunTimes, updateCity, resetCity } = usePanchang();

  if (!panchang) return null;

  const moonSvg = generateMoonPhaseSvg(panchang.tithiIndex);

  const cards = [
    { icon: '\uD83C\uDF19', label: 'Tithi', value: panchang.tithi, markerType: 'tithi' as const },
    { icon: '\u2B50', label: 'Nakshatra', value: panchang.nakshatra, markerType: 'nakshatra' as const },
    { icon: '\u2638', label: 'Yoga', value: panchang.yoga, markerType: 'yoga' as const },
    { icon: '\u25D1', label: 'Karana', value: panchang.karana, markerType: 'karana' as const },
    { icon: '\u23F0', label: 'Rahu Kaal', value: rahuKaal ? `${rahuKaal.start} - ${rahuKaal.end}` : '', extra: rahuKaal ? (rahuKaal.isActive ? 'Active Now' : 'Not Active') : '', markerType: null },
    { icon: '\u2600', label: 'Sunrise / Sunset', value: sunTimes ? `${sunTimes.sunrise} / ${sunTimes.sunset}` : '', markerType: null },
  ];

  return (
    <section className="py-16 md:py-24" id="panchang-section">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader
          sanskrit="\u0906\u091C \u0915\u093E \u092A\u0902\u091A\u093E\u0902\u0917\u0964"
          title="Today's Panchang"
          description={dateString}
          emoji="\uD83E\uDED4"
          typewriter
          kalash
        />
        <div className="flex justify-center mb-6">
          <InlineCityPicker city={city} onSelect={updateCity} onReset={resetCity} />
        </div>
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
