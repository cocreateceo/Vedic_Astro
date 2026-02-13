'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { zodiacWheelSigns } from '@/lib/zodiac-data';
import { zodiacData } from '@/lib/zodiac-data';
import SectionHeader from '@/components/ui/SectionHeader';

export default function ZodiacWheel() {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);

  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 220;
  const innerR = 130;
  const decorR = 240;

  const wheelSvg = useMemo(() => {
    let svg = '';

    // Decorative dots on outer ring
    for (let i = 0; i < 36; i++) {
      const angle = (i * 10) * Math.PI / 180;
      const dx = cx + decorR * Math.cos(angle);
      const dy = cy + decorR * Math.sin(angle);
      svg += `<circle cx="${dx}" cy="${dy}" r="${i % 3 === 0 ? 2.5 : 1}" fill="rgba(var(--sign-glow-rgb),${i % 3 === 0 ? 0.6 : 0.3})"/>`;
    }

    return svg;
  }, [cx, cy, decorR]);

  const wedges = useMemo(() => {
    return zodiacWheelSigns.map((sign, i) => {
      const startAngle = (i * 30 - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
      const midAngle = ((i + 0.5) * 30 - 90) * Math.PI / 180;

      const x1 = cx + outerR * Math.cos(startAngle);
      const y1 = cy + outerR * Math.sin(startAngle);
      const x2 = cx + outerR * Math.cos(endAngle);
      const y2 = cy + outerR * Math.sin(endAngle);
      const ix1 = cx + innerR * Math.cos(startAngle);
      const iy1 = cy + innerR * Math.sin(startAngle);
      const ix2 = cx + innerR * Math.cos(endAngle);
      const iy2 = cy + innerR * Math.sin(endAngle);

      const path = `M${ix1} ${iy1} L${x1} ${y1} A${outerR} ${outerR} 0 0 1 ${x2} ${y2} L${ix2} ${iy2} A${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`;
      const textR = (outerR + innerR) / 2;
      const tx = cx + textR * Math.cos(midAngle);
      const ty = cy + textR * Math.sin(midAngle);

      const linePath = `M${ix1} ${iy1} L${x1} ${y1}`;

      return { sign, path, tx, ty, linePath, ix1, iy1, x1, y1 };
    });
  }, [cx, cy, outerR, innerR]);

  const hoveredData = hoveredSign ? zodiacData[hoveredSign] : null;

  return (
    <section className="py-16 md:py-24 sandalwood-bg-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="राशि चक्र" title="Zodiac Signs" description="Explore the 12 Rashis of Vedic Astrology" emoji="✨" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[500px]">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <g className="mandala-layer-slow">
                <circle cx={cx} cy={cy} r={decorR} fill="none" stroke="rgba(var(--sign-glow-rgb),0.25)" strokeWidth="1.5"/>
                <g dangerouslySetInnerHTML={{ __html: wheelSvg }} />
              </g>
              <g className="mandala-layer-medium">
                <circle cx={cx} cy={cy} r={innerR - 10} fill="none" stroke="rgba(var(--sign-glow-rgb),0.2)" strokeWidth="1" strokeDasharray="4 8"/>
              </g>
              {wedges.map(({ sign, path, tx, ty, ix1, iy1, x1, y1 }) => (
                <g key={sign.key}>
                  <g
                    className="zodiac-wedge cursor-pointer"
                    onMouseEnter={() => setHoveredSign(sign.key)}
                    onMouseLeave={() => setHoveredSign(null)}
                  >
                    <path
                      d={path}
                      fill={hoveredSign === sign.key ? 'rgba(var(--sign-glow-rgb),0.25)' : 'rgba(var(--sign-glow-rgb),0.06)'}
                      stroke={hoveredSign === sign.key ? 'rgba(var(--sign-glow-rgb),0.9)' : 'rgba(var(--sign-glow-rgb),0.4)'}
                      strokeWidth={hoveredSign === sign.key ? 2 : 1}
                      filter={hoveredSign === sign.key ? 'url(#glow)' : undefined}
                    />
                    <text x={tx} y={ty - 5} textAnchor="middle" fill="var(--sign-primary)" fontSize="18" dominantBaseline="central">{sign.symbol}</text>
                    <text x={tx} y={ty + 14} textAnchor="middle" fill="rgba(var(--sign-glow-rgb),0.8)" fontSize="8" dominantBaseline="central">{sign.english}</text>
                  </g>
                  <line x1={ix1} y1={iy1} x2={x1} y2={y1} stroke="rgba(var(--sign-glow-rgb),0.35)" strokeWidth="0.5"/>
                </g>
              ))}
              <circle cx={cx} cy={cy} r={innerR - 10} fill="var(--sign-cosmic-bg)" stroke="rgba(var(--sign-glow-rgb),0.5)" strokeWidth="1.5"/>
              <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--sign-primary)" fontSize="40" dominantBaseline="central" fontFamily="'Noto Sans Devanagari', serif" className="om-chakra-pulse" style={{ transformOrigin: `${cx}px ${cy}px` }}>&#x0950;</text>
              <text x={cx} y={cy + 25} textAnchor="middle" fill="rgba(var(--sign-glow-rgb),0.7)" fontSize="10" letterSpacing="2">RASHI CHAKRA</text>
            </svg>
          </div>
          <div className="glass-card hover-lift p-8 min-h-[300px]">
            {hoveredData ? (
              <>
                <h3 className="font-heading text-xl text-sign-primary mb-3">
                  {zodiacData[hoveredSign!].symbol} {hoveredData.name}
                </h3>
                <p className="text-text-muted mb-4">{hoveredData.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Element', value: hoveredData.element },
                    { label: 'Ruler', value: hoveredData.ruler },
                    { label: 'Dates', value: hoveredData.dates },
                    { label: 'Compatible', value: hoveredData.compatible },
                  ].map(item => (
                    <div key={item.label}>
                      <span className="text-sign-primary/80 text-xs block">{item.label}</span>
                      <span className="text-text-primary text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/zodiac#${hoveredSign}`} className="border-2 border-sign-primary text-sign-primary px-4 py-2 rounded-lg text-sm hover:bg-sign-primary hover:text-cosmic-bg transition-all inline-block">
                  Learn More
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="font-heading text-xl text-sign-primary mb-3">Rashi Chakra</h3>
                <p className="text-text-muted mb-4">Hover over a sign on the wheel to see details, or click to explore the full zodiac page.</p>
                <Link href="/zodiac" className="border-2 border-sign-primary text-sign-primary px-4 py-2 rounded-lg text-sm hover:bg-sign-primary hover:text-cosmic-bg transition-all inline-block">
                  Explore All Signs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
