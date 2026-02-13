'use client';

import { useEffect, useRef } from 'react';

/**
 * IncenseSmoke — Subtle wispy smoke trails rising like temple agarbatti.
 * Canvas-based with bezier curves for organic, flowing smoke shapes.
 * Very subtle opacity to enhance atmosphere without distracting.
 */
export default function IncenseSmoke({
  trails = 3,
  className = '',
}: {
  trails?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    // Each smoke trail is a series of control points that drift upward
    interface SmokePoint {
      x: number;
      y: number;
      baseX: number;
      age: number;
      drift: number;
      speed: number;
    }

    interface SmokeTrail {
      points: SmokePoint[];
      originX: number;
      width: number;
      hue: number;
      spawnTimer: number;
      spawnRate: number;
    }

    const smokeTrails: SmokeTrail[] = [];
    for (let i = 0; i < trails; i++) {
      const originX = (w / (trails + 1)) * (i + 1) + (Math.random() - 0.5) * (w * 0.15);
      smokeTrails.push({
        points: [],
        originX,
        width: 15 + Math.random() * 20,
        hue: 30 + Math.random() * 15, // warm saffron-ish
        spawnTimer: 0,
        spawnRate: 3 + Math.random() * 2, // spawn every N frames
      });
    }

    function spawnPoint(trail: SmokeTrail): SmokePoint {
      return {
        x: trail.originX + (Math.random() - 0.5) * 6,
        y: h + 5,
        baseX: trail.originX,
        age: 0,
        drift: (Math.random() - 0.5) * 0.8,
        speed: 0.4 + Math.random() * 0.4,
      };
    }

    // Pre-populate with some points
    smokeTrails.forEach((trail) => {
      for (let i = 0; i < 40; i++) {
        const pt = spawnPoint(trail);
        pt.y = h - i * (h / 40);
        pt.age = i * trail.spawnRate;
        pt.x = pt.baseX + Math.sin(pt.age * 0.03) * 25 * (pt.age / 150);
        trail.points.push(pt);
      }
    });

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      smokeTrails.forEach((trail) => {
        trail.spawnTimer++;
        if (trail.spawnTimer >= trail.spawnRate) {
          trail.spawnTimer = 0;
          trail.points.push(spawnPoint(trail));
        }

        // Update points
        for (let i = trail.points.length - 1; i >= 0; i--) {
          const p = trail.points[i];
          p.age++;
          p.y -= p.speed;
          // Organic horizontal sway — sinusoidal with growing amplitude
          p.x = p.baseX + Math.sin(p.age * 0.025 + p.drift * 10) * (p.age * 0.18) + p.drift * p.age * 0.1;

          // Remove if off screen or too old
          if (p.y < -30 || p.age > 300) {
            trail.points.splice(i, 1);
          }
        }

        // Draw smoke as connected translucent segments
        if (trail.points.length < 3) return;

        // Sort by age (oldest = highest, for proper layering)
        const sorted = [...trail.points].sort((a, b) => a.y - b.y);

        for (let i = 1; i < sorted.length - 1; i++) {
          const prev = sorted[i - 1];
          const curr = sorted[i];
          const next = sorted[i + 1];

          const lifeRatio = curr.age / 300;
          // Fade: transparent at start, peak at 15%, fade out after 60%
          let alpha: number;
          if (lifeRatio < 0.15) {
            alpha = lifeRatio / 0.15;
          } else if (lifeRatio > 0.6) {
            alpha = 1 - (lifeRatio - 0.6) / 0.4;
          } else {
            alpha = 1;
          }
          alpha *= 0.04; // Very subtle overall

          // Width grows with age then shrinks
          const widthMult = lifeRatio < 0.3
            ? lifeRatio / 0.3
            : lifeRatio > 0.7
              ? 1 - (lifeRatio - 0.7) / 0.3
              : 1;
          const smokeWidth = trail.width * widthMult;

          if (alpha <= 0.001) continue;

          // Draw a soft ellipse at each point
          const midX = (prev.x + curr.x + next.x) / 3;
          const midY = (prev.y + curr.y + next.y) / 3;

          const grd = ctx.createRadialGradient(midX, midY, 0, midX, midY, smokeWidth);
          grd.addColorStop(0, `hsla(${trail.hue}, 15%, 80%, ${alpha})`);
          grd.addColorStop(0.5, `hsla(${trail.hue}, 10%, 75%, ${alpha * 0.5})`);
          grd.addColorStop(1, `hsla(${trail.hue}, 10%, 70%, 0)`);

          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.ellipse(midX, midY, smokeWidth, smokeWidth * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [trails]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
