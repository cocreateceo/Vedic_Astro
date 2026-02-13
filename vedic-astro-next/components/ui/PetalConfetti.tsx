'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: 'marigold' | 'rose' | 'jasmine';
  wobble: number;
  wobbleSpeed: number;
}

const PETAL_COLORS = {
  marigold: ['#FF9933', '#FFB347', '#E88B00', '#FFA500'],
  rose: ['#FF6B6B', '#E84860', '#FF8E9E', '#D4456A'],
  jasmine: ['#FFF8DC', '#FFFACD', '#FFF5BA', '#FFEFD5'],
};

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation);
  ctx.globalAlpha = petal.opacity;

  const s = petal.size;

  if (petal.type === 'marigold') {
    // Ruffled marigold petal
    ctx.fillStyle = petal.color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.bezierCurveTo(s * 0.4, -s * 0.4, s * 0.5, 0, s * 0.3, s * 0.3);
    ctx.bezierCurveTo(s * 0.1, s * 0.5, -s * 0.1, s * 0.5, -s * 0.3, s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, 0, -s * 0.4, -s * 0.4, 0, -s * 0.5);
    ctx.fill();
    // Inner detail
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.15, s * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (petal.type === 'rose') {
    // Teardrop rose petal
    ctx.fillStyle = petal.color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.bezierCurveTo(s * 0.5, -s * 0.3, s * 0.4, s * 0.3, 0, s * 0.5);
    ctx.bezierCurveTo(-s * 0.4, s * 0.3, -s * 0.5, -s * 0.3, 0, -s * 0.6);
    ctx.fill();
    // Vein line
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.4);
    ctx.lineTo(0, s * 0.3);
    ctx.stroke();
  } else {
    // Small round jasmine petal
    ctx.fillStyle = petal.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.3, s * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Golden center dot
    ctx.fillStyle = 'rgba(255, 200, 50, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function usePetalConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const petalsRef = useRef<Petal[]>([]);

  const cleanup = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
    }
    if (canvasRef.current) {
      canvasRef.current.remove();
      canvasRef.current = null;
    }
    petalsRef.current = [];
  }, []);

  const trigger = useCallback(() => {
    cleanup();

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create petals — burst from top center area
    const petalCount = 80;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      const types: Petal['type'][] = ['marigold', 'marigold', 'marigold', 'rose', 'rose', 'jasmine'];
      const type = types[Math.floor(Math.random() * types.length)];
      const colors = PETAL_COLORS[type];
      const color = colors[Math.floor(Math.random() * colors.length)];

      petals.push({
        x: canvas.width * 0.3 + Math.random() * canvas.width * 0.4,
        y: -20 - Math.random() * 100,
        size: 8 + Math.random() * 14,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.06,
        speedX: (Math.random() - 0.5) * 3,
        speedY: 1.5 + Math.random() * 2.5,
        opacity: 0.7 + Math.random() * 0.3,
        color,
        type,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
      });
    }
    petalsRef.current = petals;

    let startTime = performance.now();

    function animate(now: number) {
      if (!ctx || !canvasRef.current) return;

      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      for (const petal of petalsRef.current) {
        // Fade out after 3 seconds
        if (elapsed > 3000) {
          petal.opacity -= 0.008;
        }
        if (petal.opacity <= 0) continue;

        alive++;
        petal.wobble += petal.wobbleSpeed;
        petal.x += petal.speedX + Math.sin(petal.wobble) * 0.8;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;

        // Slow down horizontal drift
        petal.speedX *= 0.998;

        drawPetal(ctx, petal);
      }

      if (alive > 0 && elapsed < 6000) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        cleanup();
      }
    }

    animRef.current = requestAnimationFrame(animate);
  }, [cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return trigger;
}
