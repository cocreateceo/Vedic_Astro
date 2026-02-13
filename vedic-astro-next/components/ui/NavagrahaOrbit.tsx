'use client';

/**
 * G2 — Navagraha Planet Orbit Animation
 * Nine planets orbiting around a central Sun with realistic speeds.
 */

const planets = [
  { name: 'Sun', symbol: '☀️', orbit: 0, speed: 0, size: 28 },
  { name: 'Moon', symbol: '🌙', orbit: 38, speed: 3, size: 16 },
  { name: 'Mercury', symbol: '☿️', orbit: 56, speed: 4.5, size: 12 },
  { name: 'Venus', symbol: '♀️', orbit: 72, speed: 6, size: 14 },
  { name: 'Mars', symbol: '♂️', orbit: 88, speed: 8, size: 13 },
  { name: 'Jupiter', symbol: '♃', orbit: 106, speed: 12, size: 18 },
  { name: 'Saturn', symbol: '♄', orbit: 122, speed: 16, size: 16 },
  { name: 'Rahu', symbol: '🐍', orbit: 136, speed: 20, size: 12 },
  { name: 'Ketu', symbol: '☄️', orbit: 148, speed: 20, size: 12 },
];

export default function NavagrahaOrbit({ size = 320 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative select-none notranslate" translate="no" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Orbit rings */}
        {planets.filter(p => p.orbit > 0).map(p => (
          <circle
            key={p.name}
            cx={cx}
            cy={cy}
            r={p.orbit}
            fill="none"
            stroke="rgba(var(--sign-glow-rgb), 0.12)"
            strokeWidth="0.5"
            strokeDasharray="3 6"
          />
        ))}
      </svg>

      {/* Central Sun */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: cy - 14,
          left: cx - 14,
          width: 28,
          height: 28,
          fontSize: 28,
          filter: 'drop-shadow(0 0 8px rgba(255,165,0,0.5))',
        }}
      >
        ☀️
      </div>

      {/* Orbiting planets */}
      {planets.filter(p => p.orbit > 0).map((p, i) => (
        <div
          key={p.name}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            animation: `mandalaRotate ${p.speed}s linear infinite${i % 2 === 0 ? '' : ' reverse'}`,
          }}
        >
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: cy - p.orbit - p.size / 2,
              left: cx - p.size / 2,
              width: p.size,
              height: p.size,
              fontSize: p.size,
              animation: `mandalaRotate ${p.speed}s linear infinite${i % 2 === 0 ? ' reverse' : ''}`,
            }}
          >
            {p.symbol}
          </div>
        </div>
      ))}
    </div>
  );
}
