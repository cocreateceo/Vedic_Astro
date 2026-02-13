'use client';

import { useState, useCallback } from 'react';

interface PetalDot {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
  delay: number;
}

const PETAL_COLORS = ['#FF9933', '#FFB347', '#E84860', '#FF8E9E', '#FFF5BA', '#FFA500'];

interface PetalScatterProps {
  children: React.ReactNode;
  /** Number of petals per burst (default 10) */
  count?: number;
  className?: string;
}

let petalCounter = 0;

export default function PetalScatter({ children, count = 10, className = '' }: PetalScatterProps) {
  const [petals, setPetals] = useState<PetalDot[]>([]);

  const handleMouseEnter = useCallback(() => {
    const newPetals: PetalDot[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360 + (Math.random() - 0.5) * 40;
      newPetals.push({
        id: petalCounter++,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 50 + (Math.random() - 0.5) * 30,
        size: 5 + Math.random() * 7,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        angle,
        distance: 30 + Math.random() * 40,
        delay: Math.random() * 150,
      });
    }
    setPetals(newPetals);
    setTimeout(() => setPetals([]), 900);
  }, [count]);

  return (
    <span className={`petal-scatter-wrap ${className}`} onMouseEnter={handleMouseEnter}>
      {children}
      {petals.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <span
            key={p.id}
            className="petal-dot"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size * 1.4,
              backgroundColor: p.color,
              animationDelay: `${p.delay}ms`,
              '--petal-tx': `${tx}px`,
              '--petal-ty': `${ty}px`,
              '--petal-rot': `${Math.random() * 360}deg`,
            } as React.CSSProperties}
          />
        );
      })}
    </span>
  );
}
