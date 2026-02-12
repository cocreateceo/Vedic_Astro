'use client';

import { useSignTheme } from '@/hooks/useSignTheme';
import dynamic from 'next/dynamic';
import SignMandala from './SignMandala';
import { type SignKey, isSignKey } from '@/lib/sign-themes';

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

export default function SignBackgroundOverlay() {
  const { signKey, palette } = useSignTheme();

  if (!signKey || !isSignKey(signKey)) return null;

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
