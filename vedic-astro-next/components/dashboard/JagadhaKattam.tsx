'use client';

import { useState } from 'react';
import { signNames, signAbbrev, hindiSignNames, signSymbols } from '@/lib/kundli-calc';
import { houseSignifications } from '@/lib/horoscope-data';
import { VedicChart } from '@/types';

interface Props {
  chart: VedicChart;
}

// South Indian chart: signs are fixed in position (Pisces top-left, clockwise)
const CELLS: { row: number; col: number; signIndex: number }[] = [
  { row: 1, col: 1, signIndex: 11 }, // Pisces
  { row: 1, col: 2, signIndex: 0 },  // Aries
  { row: 1, col: 3, signIndex: 1 },  // Taurus
  { row: 1, col: 4, signIndex: 2 },  // Gemini
  { row: 2, col: 4, signIndex: 3 },  // Cancer
  { row: 3, col: 4, signIndex: 4 },  // Leo
  { row: 4, col: 4, signIndex: 5 },  // Virgo
  { row: 4, col: 3, signIndex: 6 },  // Libra
  { row: 4, col: 2, signIndex: 7 },  // Scorpio
  { row: 4, col: 1, signIndex: 8 },  // Sagittarius
  { row: 3, col: 1, signIndex: 9 },  // Capricorn
  { row: 2, col: 1, signIndex: 10 }, // Aquarius
];

function ChartGrid({ chart, enlarged }: { chart: VedicChart; enlarged?: boolean }) {
  const ascIndex = chart.ascendant.index;

  const signPlanets: Record<number, { name: string; sign: string; signIndex: number; degree: string; house: number; nakshatra: string; nakshatraPada: number; retrograde: boolean }[]> = {};
  if (chart.planets) {
    Object.entries(chart.planets).forEach(([name, data]) => {
      const si = data.signIndex;
      if (!signPlanets[si]) signPlanets[si] = [];
      signPlanets[si].push({ name, ...data });
    });
  }

  const getHouse = (signIndex: number) => ((signIndex - ascIndex + 12) % 12) + 1;

  const abbrevSize = enlarged ? 'text-xs' : 'text-[9px]';
  const planetSize = enlarged ? 'text-sm' : 'text-[9px]';
  const ascLineSize = enlarged ? 'w-4 h-4' : 'w-3 h-3';
  const centerTitleSize = enlarged ? 'text-base' : 'text-xs';
  const centerSubSize = enlarged ? 'text-xs' : 'text-[10px]';

  return (
    <div
      className="grid border border-sign-primary/40 rounded-lg"
      style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', aspectRatio: '1' }}
    >
      {CELLS.map((cell) => {
        const signIndex = cell.signIndex;
        const house = getHouse(signIndex);
        const planets = signPlanets[signIndex] || [];
        const isAsc = signIndex === ascIndex;

        return (
          <div
            key={signIndex}
            className={`relative border border-sign-primary/15 ${enlarged ? 'p-2' : 'p-1'} bg-cosmic-bg/20 ${isAsc ? 'ring-1 ring-sign-primary/30 ring-inset' : ''}`}
            style={{ gridRow: cell.row, gridColumn: cell.col }}
          >
            <span className={`${abbrevSize} leading-none block ${isAsc ? 'text-sign-primary font-bold' : 'text-text-muted/60'}`}>
              {enlarged ? signNames[signIndex] : signAbbrev[signIndex]}
            </span>
            {enlarged && (
              <span className="text-[10px] text-text-muted/40 block">H{house}</span>
            )}

            {isAsc && (
              <svg className={`absolute top-0 right-0 ${ascLineSize}`} viewBox="0 0 12 12">
                <line x1="12" y1="0" x2="0" y2="12" stroke="var(--sign-primary)" strokeWidth="2" />
              </svg>
            )}

            {planets.length > 0 && (
              <div className={`absolute inset-0 flex items-center justify-center ${enlarged ? 'pt-6' : 'pt-2'}`}>
                <div className="text-center leading-tight">
                  {planets.map((p, j) => (
                    <span key={j} className={`${planetSize} font-medium ${p.retrograde ? 'text-red-400' : 'text-sign-primary'}`}>
                      {enlarged ? p.name : p.name.substring(0, 2)}{p.retrograde ? ' (R)' : ''}{j < planets.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div
        className="flex items-center justify-center border border-sign-primary/10 bg-cosmic-bg/40"
        style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
      >
        <div className="text-center">
          <p className={`text-sign-primary/50 ${centerTitleSize} font-heading`}>Rashi</p>
          <p className={`text-text-muted/40 ${centerSubSize}`}>Chart</p>
        </div>
      </div>
    </div>
  );
}

export default function JagadhaKattam({ chart }: Props) {
  const [showEnlarged, setShowEnlarged] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowEnlarged(true)}
      onMouseLeave={() => setShowEnlarged(false)}
    >
      {/* Small inline chart */}
      <ChartGrid chart={chart} />

      {/* Enlarged overlay on hover */}
      {showEnlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="pointer-events-none bg-bg-card border border-sign-primary/40 rounded-xl p-4 shadow-2xl" style={{ width: 'min(90vw, 520px)' }}>
            <p className="text-sign-primary font-heading text-sm mb-2 text-center">Rashi Chart (South Indian)</p>
            <ChartGrid chart={chart} enlarged />
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-text-muted/60">
              <span><span className="text-sign-primary font-bold">Bold</span> = Ascendant</span>
              <span><span className="text-red-400">Red</span> = Retrograde</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
