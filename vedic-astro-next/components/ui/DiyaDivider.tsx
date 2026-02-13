'use client';

/**
 * DiyaDivider — Animated oil lamp (diya) row divider between sections.
 * Traditional Hindu diya with flickering flame, ornamental rangoli dots,
 * and a warm saffron glow line.
 */
export default function DiyaDivider({ count = 3 }: { count?: 1 | 3 | 5 | 7 }) {
  return (
    <div className="diya-divider relative flex items-center justify-center py-6 select-none" aria-hidden="true">
      {/* Left ornamental line with animated gradient */}
      <div className="flex-1 relative">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-sign-primary/30 to-sign-primary/50" />
        <div className="gradient-divider absolute inset-x-0 top-0" />
      </div>

      {/* Left rangoli dots with sindoor center */}
      <div className="flex items-center gap-1.5 mx-2">
        <span className="w-1 h-1 rounded-full bg-sign-primary/30" />
        <span className="sindoor-dot sindoor-dot-sm" />
        <span className="w-1 h-1 rounded-full bg-sign-primary/30" />
      </div>

      {/* Diyas */}
      <div className="flex items-end gap-5 mx-3">
        {Array.from({ length: count }).map((_, i) => {
          const isCenter = i === Math.floor(count / 2);
          return (
            <div key={i} className={`diya-unit flex flex-col items-center ${isCenter ? 'scale-110' : ''}`}>
              {/* Flame */}
              <div className="relative w-4 h-6 mb-[-2px]">
                {/* Outer glow */}
                <div
                  className="absolute inset-0 rounded-full blur-md"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,165,0,0.6) 0%, rgba(255,80,0,0.3) 40%, transparent 70%)',
                    animation: `diyaGlow ${1.5 + i * 0.2}s ease-in-out infinite alternate`,
                  }}
                />
                {/* Inner flame */}
                <svg viewBox="0 0 20 32" className="w-full h-full relative z-10" style={{ animation: `flameFlicker ${1.2 + i * 0.15}s ease-in-out infinite alternate` }}>
                  <defs>
                    <linearGradient id={`flameGrad${i}`} x1="0.5" y1="1" x2="0.5" y2="0">
                      <stop offset="0%" stopColor="var(--sign-primary)" />
                      <stop offset="40%" stopColor="#FF8C00" />
                      <stop offset="70%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFFBE6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M10 2 C10 2 4 12 4 18 C4 24 8 28 10 28 C12 28 16 24 16 18 C16 12 10 2 10 2Z"
                    fill={`url(#flameGrad${i})`}
                    opacity="0.9"
                  />
                  {/* Inner bright core */}
                  <ellipse cx="10" cy="20" rx="3" ry="5" fill="#FFFBE6" opacity="0.6" />
                </svg>
              </div>

              {/* Diya body */}
              <svg viewBox="0 0 36 16" className="w-9 h-4 relative z-10">
                <defs>
                  <linearGradient id={`diyaBody${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A843" />
                    <stop offset="50%" stopColor="#B8860B" />
                    <stop offset="100%" stopColor="#8B6914" />
                  </linearGradient>
                </defs>
                {/* Diya bowl shape */}
                <path
                  d="M2 4 Q2 0 8 0 L28 0 Q34 0 34 4 L32 12 Q32 16 18 16 Q4 16 4 12 Z"
                  fill={`url(#diyaBody${i})`}
                  stroke="#D4A843"
                  strokeWidth="0.5"
                />
                {/* Oil shimmer line */}
                <ellipse cx="18" cy="5" rx="12" ry="2" fill="#FFD700" opacity="0.3" />
                {/* Decorative dot */}
                <circle cx="18" cy="10" r="1.5" fill="#FFD700" opacity="0.4" />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Right rangoli dots with sindoor center */}
      <div className="flex items-center gap-1.5 mx-2">
        <span className="w-1 h-1 rounded-full bg-sign-primary/30" />
        <span className="sindoor-dot sindoor-dot-sm" />
        <span className="w-1 h-1 rounded-full bg-sign-primary/30" />
      </div>

      {/* Right ornamental line with animated gradient */}
      <div className="flex-1 relative">
        <div className="h-[1px] bg-gradient-to-l from-transparent via-sign-primary/30 to-sign-primary/50" />
        <div className="gradient-divider absolute inset-x-0 top-0" />
      </div>
    </div>
  );
}
