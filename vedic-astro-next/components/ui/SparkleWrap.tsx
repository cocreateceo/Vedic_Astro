'use client';

import { useState, useCallback, useRef } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

const SPARKLE_COLORS = ['#FFD700', '#FFA500', '#FFE4B5', '#FF6347', '#FFFFFF'];

interface SparkleWrapProps {
  children: React.ReactNode;
  /** Number of sparkles per burst (default 6) */
  count?: number;
  className?: string;
}

let sparkleCounter = 0;

export default function SparkleWrap({ children, count = 6, className = '' }: SparkleWrapProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: sparkleCounter++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 8,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        delay: Math.random() * 200,
      });
    }
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 800);
  }, [count]);

  return (
    <span ref={wrapRef} className={`sparkle-wrap ${className}`} onMouseEnter={handleMouseEnter}>
      {children}
      {sparkles.map(s => (
        <span
          key={s.id}
          className="sparkle-particle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            animationDelay: `${s.delay}ms`,
          }}
        />
      ))}
    </span>
  );
}
