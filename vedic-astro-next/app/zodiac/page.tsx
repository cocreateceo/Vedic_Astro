'use client';

import { useState } from 'react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { rashiDetails } from '@/lib/horoscope-data';
import { getElementEmoji } from '@/lib/rashi-emoji';

const signSymbols = ['🐏', '🐂', '👯', '🦀', '🦁', '👩', '⚖️', '🦂', '🏹', '🐐', '🏺', '🐟'];
const signImageKeys = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const vedicDates = [
  'Apr 14 - May 14', 'May 15 - Jun 14', 'Jun 15 - Jul 14', 'Jul 15 - Aug 14',
  'Aug 15 - Sep 15', 'Sep 16 - Oct 15', 'Oct 16 - Nov 14', 'Nov 15 - Dec 14',
  'Dec 15 - Jan 13', 'Jan 14 - Feb 12', 'Feb 13 - Mar 13', 'Mar 14 - Apr 13'
];

function SignImage({ index, size = 64, className = '' }: { index: number; size?: number; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <span className={`text-sign-primary ${size >= 100 ? 'text-6xl' : size >= 48 ? 'text-3xl' : 'text-2xl'}`}>{signSymbols[index]}</span>;
  return (
    <Image
      src={`/images/zodiac-signs/${signImageKeys[index]}.svg`}
      alt={rashiDetails[index].name}
      width={size}
      height={size}
      className={`object-contain drop-shadow-[0_0_12px_rgba(var(--sign-glow-rgb),0.4)] ${className}`}
      onError={() => setErr(true)}
    />
  );
}

export default function ZodiacPage() {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="राशि" title="Zodiac Signs" description="Explore the 12 Rashis of Vedic Astrology" emoji="✨" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-12">
          {Array.from({ length: 12 }, (_, i) => {
            const sign = rashiDetails[i];
            return (
              <button key={i} onClick={() => setSelectedSign(i)}
                className={`glass-card p-3 text-center cursor-pointer transition-all hover-lift ${selectedSign === i ? 'border-sign-primary/60 shadow-[0_0_15px_rgba(var(--sign-glow-rgb),0.2)]' : ''}`}>
                <div className="flex justify-center mb-1">
                  <SignImage index={i} size={40} />
                </div>
                <span className="text-xs text-text-primary block mt-1">{signSymbols[i]} {sign.name}</span>
              </button>
            );
          })}
        </div>

        {selectedSign !== null && (() => {
          const sign = rashiDetails[selectedSign];
          return (
            <div className="glass-card p-8 max-w-3xl mx-auto mb-8 tab-content-enter">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <SignImage index={selectedSign} size={160} className="rounded-xl" />
                </div>
                <h2 className="font-heading text-2xl text-sign-primary mt-2">{signSymbols[selectedSign]} {sign.sanskrit} ({sign.name})</h2>
                <p className="text-text-muted text-sm mt-1">{vedicDates[selectedSign]}</p>
              </div>
              <p className="text-text-muted mb-6 text-center">{sign.characteristics}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Element', value: `${getElementEmoji(sign.element)} ${sign.element}` },
                  { label: 'Ruler', value: sign.ruler },
                  { label: 'Quality', value: sign.quality },
                  { label: 'Nature', value: sign.nature },
                  { label: 'Body Part', value: sign.bodyPart },
                  { label: 'Direction', value: sign.direction },
                  { label: 'Gemstone', value: sign.gem },
                  { label: 'Deity', value: sign.deity },
                ].map(item => (
                  <div key={item.label} className="bg-cosmic-bg/50 rounded-lg p-3">
                    <span className="text-sign-primary/60 text-xs block">{item.label}</span>
                    <span className="text-text-primary text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-green-400 font-medium mb-2 text-sm">Strengths</h4>
                  <ul className="space-y-1">
                    {sign.strengths.map((s, i) => (
                      <li key={i} className="text-text-muted text-sm flex gap-2"><span className="text-green-400">&#10003;</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-medium mb-2 text-sm">Challenges</h4>
                  <ul className="space-y-1">
                    {sign.challenges.map((c, i) => (
                      <li key={i} className="text-text-muted text-sm flex gap-2"><span className="text-red-400">&#10007;</span>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-text-primary font-medium mb-2 text-sm">Career & Profession</h4>
                <div className="flex gap-2 flex-wrap">
                  {sign.career.map(c => (
                    <span key={c} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{c}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-cosmic-bg/50 rounded-lg p-3">
                  <span className="text-sign-primary/60 text-xs block">Lucky Numbers</span>
                  <span className="text-text-primary text-sm">{sign.luckyNumbers.join(', ')}</span>
                </div>
                <div className="bg-cosmic-bg/50 rounded-lg p-3">
                  <span className="text-sign-primary/60 text-xs block">Lucky Colors</span>
                  <span className="text-text-primary text-sm">{sign.luckyColors.join(', ')}</span>
                </div>
                <div className="bg-cosmic-bg/50 rounded-lg p-3">
                  <span className="text-sign-primary/60 text-xs block">Lucky Days</span>
                  <span className="text-text-primary text-sm">{sign.luckyDays.join(', ')}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-text-primary font-medium mb-2 text-sm">Compatible Signs</h4>
                <div className="flex gap-3 flex-wrap">
                  {sign.compatibleSigns.map(idx => (
                    <button key={idx} onClick={() => setSelectedSign(idx)} className="glass-card px-3 py-2 text-sm hover:border-sign-primary/40 transition-all flex items-center gap-2">
                      <SignImage index={idx} size={24} />
                      {rashiDetails[idx].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-sign-primary/5 border border-sign-primary/10 rounded-lg text-center">
                <span className="text-sign-primary/60 text-xs block mb-1">Beej Mantra</span>
                <p className="text-sign-primary text-sm font-devanagari">{sign.mantra}</p>
              </div>
            </div>
          );
        })()}

        {selectedSign === null && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }, (_, i) => {
              const sign = rashiDetails[i];
              return (
                <div key={i} className="glass-card p-6 cursor-pointer hover-lift transition-all group" onClick={() => setSelectedSign(i)}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="shrink-0 w-16 h-16 flex items-center justify-center rounded-xl bg-cosmic-bg/60 border border-sign-primary/15 group-hover:border-sign-primary/40 transition-all overflow-hidden">
                      <SignImage index={i} size={56} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-text-primary">{signSymbols[i]} {sign.sanskrit} ({sign.name})</h3>
                      <p className="text-text-muted text-xs">{vedicDates[i]}</p>
                    </div>
                  </div>
                  <p className="text-text-muted text-sm mb-3">{sign.characteristics}</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{getElementEmoji(sign.element)} {sign.element}</span>
                    <span className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{sign.ruler}</span>
                    <span className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{sign.nature}</span>
                  </div>
                  <div className="flex gap-2 text-xs text-text-muted">
                    <span>Gem: <span className="text-sign-primary">{sign.gem}</span></span>
                    <span>&bull;</span>
                    <span>Deity: <span className="text-sign-primary">{sign.deity}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
