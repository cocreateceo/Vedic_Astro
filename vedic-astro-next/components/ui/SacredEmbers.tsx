'use client';

import { useEffect, useRef } from 'react';

/**
 * SacredEmbers — Tiny golden particles drifting upward like embers from a havan (sacred fire).
 * Uses lightweight canvas rendering for smooth performance.
 */
export default function SacredEmbers({ count = 35, className = '' }: { count?: number; className?: string }) {
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

    // Particle pool
    interface Ember {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      fadeSpeed: number;
      hue: number; // 25-45 range for saffron/gold
      life: number;
      maxLife: number;
    }

    function spawnEmber(): Ember {
      const maxLife = 180 + Math.random() * 200; // 3-6 seconds at 60fps
      return {
        x: Math.random() * w,
        y: h + 10 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.3 + Math.random() * 0.7),
        size: 1.5 + Math.random() * 2.5,
        opacity: 0,
        fadeSpeed: 0.008 + Math.random() * 0.01,
        hue: 25 + Math.random() * 20, // saffron to gold
        life: 0,
        maxLife,
      };
    }

    const embers: Ember[] = [];
    // Stagger initial spawn
    for (let i = 0; i < count; i++) {
      const ember = spawnEmber();
      ember.y = Math.random() * h;
      ember.life = Math.random() * ember.maxLife;
      ember.opacity = Math.random() * 0.6;
      embers.push(ember);
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life++;
        e.x += e.vx + Math.sin(e.life * 0.02) * 0.15; // gentle sway
        e.y += e.vy;

        // Fade in first 20%, fade out last 30%
        const lifeRatio = e.life / e.maxLife;
        if (lifeRatio < 0.2) {
          e.opacity = Math.min(0.7, e.opacity + e.fadeSpeed * 3);
        } else if (lifeRatio > 0.7) {
          e.opacity = Math.max(0, e.opacity - e.fadeSpeed * 2);
        }

        // Draw ember with glow
        if (e.opacity > 0.01) {
          // Outer glow
          const grd = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 3);
          grd.addColorStop(0, `hsla(${e.hue}, 90%, 60%, ${e.opacity * 0.3})`);
          grd.addColorStop(1, `hsla(${e.hue}, 90%, 60%, 0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Bright core
          ctx.fillStyle = `hsla(${e.hue}, 100%, 75%, ${e.opacity})`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fill();

          // White-hot center
          ctx.fillStyle = `hsla(${e.hue}, 50%, 95%, ${e.opacity * 0.6})`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Respawn when dead
        if (e.life >= e.maxLife || e.y < -20) {
          embers[i] = spawnEmber();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
