'use client';

import { useSignTheme } from '@/hooks/useSignTheme';
import dynamic from 'next/dynamic';
import SignMandala from './SignMandala';
import { type SignKey, type VisualThemeKey, isSignKey, isVisualThemeKey } from '@/lib/sign-themes';

const signSvgMap: Record<SignKey, React.ComponentType<{ color?: string }>> = {
  aries: dynamic(() => import('./sign-svgs/AriesSvg'), { ssr: false }),
  taurus: dynamic(() => import('./sign-svgs/TaurusSvg'), { ssr: false }),
  gemini: dynamic(() => import('./sign-svgs/GeminiSvg'), { ssr: false }),
  cancer: dynamic(() => import('./sign-svgs/CancerSvg'), { ssr: false }),
  leo: dynamic(() => import('./sign-svgs/LeoSvg'), { ssr: false }),
  virgo: dynamic(() => import('./sign-svgs/VirgoSvg'), { ssr: false }),
  libra: dynamic(() => import('./sign-svgs/LibraSvg'), { ssr: false }),
  scorpio: dynamic(() => import('./sign-svgs/ScorpioSvg'), { ssr: false }),
  sagittarius: dynamic(() => import('./sign-svgs/SagittariusSvg'), { ssr: false }),
  capricorn: dynamic(() => import('./sign-svgs/CapricornSvg'), { ssr: false }),
  aquarius: dynamic(() => import('./sign-svgs/AquariusSvg'), { ssr: false }),
  pisces: dynamic(() => import('./sign-svgs/PiscesSvg'), { ssr: false }),
};

const SIGN_MANDALA_CONFIG: Record<SignKey, { petals: number; speed: number }> = {
  aries: { petals: 8, speed: 50 },
  taurus: { petals: 10, speed: 70 },
  gemini: { petals: 12, speed: 60 },
  cancer: { petals: 14, speed: 65 },
  leo: { petals: 16, speed: 45 },
  virgo: { petals: 12, speed: 75 },
  libra: { petals: 8, speed: 55 },
  scorpio: { petals: 10, speed: 40 },
  sagittarius: { petals: 9, speed: 50 },
  capricorn: { petals: 6, speed: 80 },
  aquarius: { petals: 11, speed: 55 },
  pisces: { petals: 14, speed: 65 },
};

/* ---------- Visual-theme SVG overlays ---------- */

function CosmicTempleOverlay({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 800 600" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
      {/* Temple gopuram silhouettes */}
      <defs>
        <linearGradient id="temple-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Central gopuram */}
      <path d="M380 600 L380 280 L390 240 L400 200 L410 240 L420 280 L420 600Z" fill="url(#temple-grad)" />
      <path d="M360 600 L360 340 L400 180 L440 340 L440 600Z" fill={color} fillOpacity="0.04" />
      {/* Side towers */}
      <path d="M200 600 L200 380 L220 320 L240 380 L240 600Z" fill="url(#temple-grad)" />
      <path d="M560 600 L560 380 L580 320 L600 380 L600 600Z" fill="url(#temple-grad)" />
      {/* Stepped tiers */}
      {[340, 380, 420, 460].map((y, i) => (
        <rect key={i} x={350 - i * 15} y={y} width={100 + i * 30} height={8} rx={2} fill={color} fillOpacity={0.06 - i * 0.01} />
      ))}
      {/* Stars */}
      {[
        [100, 80], [250, 50], [500, 30], [650, 90], [720, 150],
        [50, 200], [350, 60], [550, 120], [180, 160], [680, 40],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.2 + (i % 3) * 0.4} fill={color} fillOpacity={0.2 + (i % 4) * 0.05}>
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function SacredFireOverlay({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 800 600" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="fire-grad" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#FFB848" stopOpacity="0.12" />
          <stop offset="50%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Havan kund base */}
      <path d="M300 600 L320 520 L480 520 L500 600Z" fill={color} fillOpacity="0.06" />
      <rect x={310} y={515} width={180} height={10} rx={3} fill={color} fillOpacity="0.08" />
      {/* Flame tongues */}
      {[
        'M400 520 Q380 440 400 350 Q420 440 400 520',
        'M370 520 Q350 460 380 380 Q400 460 370 520',
        'M430 520 Q450 460 420 380 Q400 460 430 520',
        'M355 520 Q340 480 365 420 Q380 480 355 520',
        'M445 520 Q460 480 435 420 Q420 480 445 520',
      ].map((d, i) => (
        <path key={i} d={d} fill="url(#fire-grad)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* Sparks rising */}
      {[
        [390, 300], [410, 280], [380, 320], [420, 310], [400, 260],
        [370, 350], [430, 340], [395, 240], [405, 290], [385, 270],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1 + (i % 3) * 0.5} fill="#FFB848" fillOpacity={0.15 + (i % 4) * 0.05}>
          <animate attributeName="cy" values={`${cy};${cy - 40};${cy}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function CelestialUniverseOverlay({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 800 600" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="nebula1" cx="30%" cy="40%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebula2" cx="70%" cy="60%" r="35%">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#67E8F9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebula3" cx="50%" cy="20%" r="30%">
          <stop offset="0%" stopColor="#A020C0" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#A020C0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Nebula clouds */}
      <rect width="800" height="600" fill="url(#nebula1)" />
      <rect width="800" height="600" fill="url(#nebula2)" />
      <rect width="800" height="600" fill="url(#nebula3)" />
      {/* Stardust field */}
      {[
        [120, 80, 1.0], [250, 150, 0.8], [400, 50, 1.2], [550, 200, 0.7], [700, 100, 1.1],
        [80, 300, 0.9], [320, 400, 0.6], [600, 350, 1.0], [180, 500, 0.8], [500, 480, 1.3],
        [50, 450, 0.7], [750, 400, 0.9], [350, 250, 1.1], [150, 180, 0.6], [650, 50, 0.8],
        [450, 550, 0.7], [280, 30, 1.0], [580, 500, 0.9], [100, 550, 0.5], [700, 280, 0.8],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 3 === 0 ? '#67E8F9' : color} fillOpacity={0.2 + (i % 5) * 0.06}>
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function PalmLeafOverlay({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 800 600" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* Horizontal etched lines — palm leaf manuscript texture */}
      {Array.from({ length: 20 }, (_, i) => (
        <line key={`line-${i}`} x1={40} y1={30 + i * 30} x2={760} y2={30 + i * 30}
          stroke={color} strokeOpacity={0.06 + (i % 3) * 0.02} strokeWidth={0.5} />
      ))}
      {/* Border frame — like a manuscript border */}
      <rect x={30} y={20} width={740} height={560} rx={8} stroke={color} strokeOpacity="0.08" strokeWidth={1.5} fill="none" />
      <rect x={45} y={35} width={710} height={530} rx={4} stroke={color} strokeOpacity="0.05" strokeWidth={0.8} fill="none" />
      {/* Corner ornaments */}
      {[
        [50, 40], [750, 40], [50, 560], [750, 560],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={8} stroke={color} strokeOpacity="0.1" strokeWidth={0.8} fill="none" />
          <circle cx={cx} cy={cy} r={3} fill={color} fillOpacity="0.08" />
        </g>
      ))}
      {/* Faint Om symbol center */}
      <text x="400" y="310" textAnchor="middle" fontSize="80" fontFamily="serif"
        fill={color} fillOpacity="0.04">
        &#x0950;
      </text>
    </svg>
  );
}

function DivineDeityOverlay({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 800 600" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="deity-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="60%" stopColor="#FF7EB3" stopOpacity="0.04" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Central divine aura */}
      <circle cx="400" cy="300" r="250" fill="url(#deity-glow)">
        <animate attributeName="r" values="240;260;240" dur="6s" repeatCount="indefinite" />
      </circle>
      {/* Mandala rings */}
      {[180, 140, 100, 60].map((r, i) => (
        <circle key={i} cx="400" cy="300" r={r} stroke={i % 2 === 0 ? color : '#FF7EB3'} strokeOpacity={0.06 + i * 0.01} strokeWidth={0.8} fill="none">
          <animateTransform attributeName="transform" type="rotate"
            from={`0 400 300`} to={`${i % 2 === 0 ? 360 : -360} 400 300`}
            dur={`${40 + i * 10}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Petal shapes around center */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const cx = 400 + Math.cos(angle) * 200;
        const cy = 300 + Math.sin(angle) * 200;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={12} ry={5}
            transform={`rotate(${i * 30} ${cx} ${cy})`}
            fill={i % 2 === 0 ? color : '#FF7EB3'} fillOpacity={0.06} />
        );
      })}
      {/* Small divine sparks */}
      {[
        [200, 150], [600, 150], [200, 450], [600, 450],
        [100, 300], [700, 300], [400, 80], [400, 520],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2} fill={i % 2 === 0 ? color : '#FF7EB3'} fillOpacity="0.15">
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

const VISUAL_THEME_OVERLAYS: Partial<Record<VisualThemeKey, React.FC<{ color: string }>>> = {
  'cosmic-temple': CosmicTempleOverlay,
  'sacred-fire': SacredFireOverlay,
  'celestial-universe': CelestialUniverseOverlay,
  'palm-leaf': PalmLeafOverlay,
  'divine-deity': DivineDeityOverlay,
};

export default function SignBackgroundOverlay() {
  const { signKey, palette } = useSignTheme();

  if (!signKey) return null;

  /* Visual theme overlay */
  if (isVisualThemeKey(signKey)) {
    const Overlay = VISUAL_THEME_OVERLAYS[signKey];
    if (!Overlay) return null;
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden animate-[fadeIn_0.8s_ease]"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ opacity: 0.9 }}>
          <Overlay color={palette.primary} />
        </div>
      </div>
    );
  }

  /* Zodiac sign overlay */
  if (!isSignKey(signKey)) return null;

  const SignSvg = signSvgMap[signKey];
  const mandalaConfig = SIGN_MANDALA_CONFIG[signKey];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden animate-[fadeIn_0.8s_ease]"
      aria-hidden="true"
    >
      {/* Sign-specific SVG line art - hidden on small screens for performance */}
      <div className="absolute inset-0 hidden md:block" style={{ opacity: 0.08 }}>
        <SignSvg color={palette.primary} />
      </div>

      {/* Parameterized mandala in bottom-right */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
        <SignMandala
          petals={mandalaConfig.petals}
          speed={mandalaConfig.speed}
          color={palette.primary}
        />
      </div>

      {/* Subtle corner mandala top-left */}
      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] hidden lg:block">
        <SignMandala
          petals={mandalaConfig.petals}
          speed={mandalaConfig.speed * 1.5}
          color={palette.primary}
        />
      </div>
    </div>
  );
}
