'use client';

import { useRef, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees (default 8) */
  maxTilt?: number;
  /** Glow follows cursor (default true) */
  glowFollow?: boolean;
}

/**
 * TiltCard — 3D perspective tilt on hover, like holding a carved temple panel.
 * Cursor position drives tilt angle + optional golden glow that follows the pointer.
 * Pure CSS transforms — no animation library needed.
 */
export default function TiltCard({ children, className = '', maxTilt = 8, glowFollow = true }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalize to -1..1
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Tilt: rotateX is driven by Y position (inverted), rotateY by X
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Move glow to cursor position
    if (glowFollow && glowRef.current) {
      glowRef.current.style.opacity = '1';
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(var(--sign-glow-rgb), 0.15) 0%, transparent 60%)`;
    }
  }, [maxTilt, glowFollow]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transition: 'transform 0.2s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
      {glowFollow && (
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
        />
      )}
    </div>
  );
}
