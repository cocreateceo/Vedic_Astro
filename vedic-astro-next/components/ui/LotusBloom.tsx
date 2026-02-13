'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * LotusBloom — SVG lotus that unfurls from closed bud to full bloom on scroll.
 * Used as a decorative element between sections or within section headers.
 * Each petal layer animates with staggered timing for a natural opening feel.
 */
export default function LotusBloom({ size = 80, className = '' }: { size?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });

  // Petal animation variants
  const outerPetal = (angle: number, delay: number) => ({
    initial: { rotate: angle, scaleY: 0.3, scaleX: 0.6, opacity: 0 },
    animate: isInView
      ? { rotate: angle, scaleY: 1, scaleX: 1, opacity: 1 }
      : { rotate: angle, scaleY: 0.3, scaleX: 0.6, opacity: 0 },
    transition: { type: 'spring', stiffness: 120, damping: 14, delay: 0.3 + delay },
  });

  const innerPetal = (angle: number, delay: number) => ({
    initial: { rotate: angle, scaleY: 0.2, scaleX: 0.5, opacity: 0 },
    animate: isInView
      ? { rotate: angle, scaleY: 1, scaleX: 1, opacity: 1 }
      : { rotate: angle, scaleY: 0.2, scaleX: 0.5, opacity: 0 },
    transition: { type: 'spring', stiffness: 100, damping: 12, delay: 0.6 + delay },
  });

  const outerAngles = [-75, -45, -15, 15, 45, 75];
  const innerAngles = [-55, -25, 0, 25, 55];

  return (
    <div ref={ref} className={`flex justify-center items-center ${className}`} aria-hidden="true">
      <svg
        viewBox="-50 -60 100 80"
        width={size}
        height={size * 0.8}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lotusPetalOuter" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#E8A0B8" />
            <stop offset="50%" stopColor="#F0C0D0" />
            <stop offset="100%" stopColor="#FFE0EA" />
          </linearGradient>
          <linearGradient id="lotusPetalInner" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#FF8AAE" />
            <stop offset="50%" stopColor="#FFB0C8" />
            <stop offset="100%" stopColor="#FFD8E4" />
          </linearGradient>
          <radialGradient id="lotusCenter" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#E8A020" />
          </radialGradient>
          <linearGradient id="lotusBase" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#4A8C3F" />
            <stop offset="100%" stopColor="#2D6B25" />
          </linearGradient>
        </defs>

        {/* Green base / sepal */}
        <motion.path
          d="M-18 0 Q-20 -8 -12 -12 Q0 -16 12 -12 Q20 -8 18 0 Q10 4 0 4 Q-10 4 -18 0Z"
          fill="url(#lotusBase)"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.7 } : { scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.1 }}
          style={{ transformOrigin: '0px 0px' }}
        />

        {/* Outer petals */}
        {outerAngles.map((angle, i) => (
          <motion.ellipse
            key={`outer-${i}`}
            cx="0"
            cy="-22"
            rx="7"
            ry="20"
            fill="url(#lotusPetalOuter)"
            opacity="0.85"
            {...outerPetal(angle, i * 0.06)}
            style={{ transformOrigin: '0px -2px' }}
          />
        ))}

        {/* Inner petals — smaller, more upright */}
        {innerAngles.map((angle, i) => (
          <motion.ellipse
            key={`inner-${i}`}
            cx="0"
            cy="-18"
            rx="5.5"
            ry="16"
            fill="url(#lotusPetalInner)"
            opacity="0.9"
            {...innerPetal(angle, i * 0.05)}
            style={{ transformOrigin: '0px -2px' }}
          />
        ))}

        {/* Center — golden pollen cluster */}
        <motion.circle
          cx="0"
          cy="-8"
          r="5"
          fill="url(#lotusCenter)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.9 }}
          style={{ transformOrigin: '0px -8px' }}
        />
        {/* Pollen dots */}
        {[
          [-3, -10], [0, -12], [3, -10], [-2, -7], [2, -7], [0, -5],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={cx}
            cy={cy}
            r="0.8"
            fill="#FFF8DC"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }}
            transition={{ delay: 1.0 + i * 0.05, duration: 0.3 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
