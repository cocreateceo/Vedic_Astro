'use client';

/**
 * AartiDiyaRow — Row of decorative brass diyas with flickering flames,
 * like an aarti thali arrangement. Each diya has a unique flicker timing
 * and a warm radial glow pool beneath it.
 */
export default function AartiDiyaRow({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`flex items-end justify-center gap-4 md:gap-8 select-none ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const isCenter = i === Math.floor(count / 2);
        const scale = isCenter ? 1.2 : (i === 0 || i === count - 1) ? 0.85 : 1;
        const flickerDuration = 1.0 + i * 0.18;

        return (
          <div
            key={i}
            className="flex flex-col items-center"
            style={{ transform: `scale(${scale})` }}
          >
            {/* Flame */}
            <svg viewBox="0 0 24 36" className="w-5 h-7 md:w-6 md:h-8 mb-[-3px] relative z-10" style={{ animation: `flameFlicker ${flickerDuration}s ease-in-out infinite alternate` }}>
              <defs>
                <linearGradient id={`aartiFlame${i}`} x1="0.5" y1="1" x2="0.5" y2="0">
                  <stop offset="0%" stopColor="var(--sign-primary)" />
                  <stop offset="30%" stopColor="#FF8C00" />
                  <stop offset="60%" stopColor="#FFD700" />
                  <stop offset="85%" stopColor="#FFFBE6" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id={`aartiGlow${i}`} cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#FFA500" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Glow halo */}
              <circle cx="12" cy="20" r="12" fill={`url(#aartiGlow${i})`} style={{ animation: `diyaGlow ${flickerDuration + 0.3}s ease-in-out infinite alternate` }} />
              {/* Flame body */}
              <path
                d="M12 4 C12 4 6 14 6 20 C6 26 9 30 12 30 C15 30 18 26 18 20 C18 14 12 4 12 4Z"
                fill={`url(#aartiFlame${i})`}
              />
              {/* Bright inner core */}
              <ellipse cx="12" cy="22" rx="3" ry="5" fill="#FFFBE6" opacity="0.5" />
              {/* Wick */}
              <line x1="12" y1="28" x2="12" y2="32" stroke="#8B6914" strokeWidth="1" strokeLinecap="round" />
            </svg>

            {/* Diya bowl */}
            <svg viewBox="0 0 44 20" className="w-9 h-4 md:w-11 md:h-5">
              <defs>
                <linearGradient id={`aartiBody${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8C06A" />
                  <stop offset="30%" stopColor="#D4A843" />
                  <stop offset="70%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#8B6914" />
                </linearGradient>
              </defs>
              {/* Bowl */}
              <path
                d="M4 4 Q2 0 10 0 L34 0 Q42 0 40 4 L38 14 Q36 18 22 18 Q8 18 6 14 Z"
                fill={`url(#aartiBody${i})`}
                stroke="#D4A843"
                strokeWidth="0.4"
              />
              {/* Oil surface reflection */}
              <ellipse cx="22" cy="5" rx="13" ry="2.5" fill="#FFD700" opacity="0.2" />
              {/* Rim highlight */}
              <path d="M8 2 Q22 -1 36 2" fill="none" stroke="#FCEABB" strokeWidth="0.6" opacity="0.4" />
              {/* Decorative dots on bowl */}
              <circle cx="14" cy="11" r="1" fill="#FFD700" opacity="0.25" />
              <circle cx="22" cy="12" r="1" fill="#FFD700" opacity="0.25" />
              <circle cx="30" cy="11" r="1" fill="#FFD700" opacity="0.25" />
            </svg>

            {/* Warm light pool on surface */}
            <div
              className="w-10 h-2 rounded-full mt-[-1px]"
              style={{
                background: `radial-gradient(ellipse, rgba(255,165,0,0.15) 0%, transparent 70%)`,
                animation: `diyaGlow ${flickerDuration + 0.2}s ease-in-out infinite alternate`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
