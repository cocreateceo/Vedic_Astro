'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import StarCanvas from './StarCanvas';
import SacredEmbers from '@/components/ui/SacredEmbers';
import TiltCard from '@/components/ui/TiltCard';
import TemplePillars from '@/components/ui/TemplePillars';
import IncenseSmoke from '@/components/ui/IncenseSmoke';
import SanskritTypewriter from '@/components/ui/SanskritTypewriter';
import SparkleWrap from '@/components/ui/SparkleWrap';
import PetalScatter from '@/components/ui/PetalScatter';

export default function HeroSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (ringsRef.current) {
      ringsRef.current.style.transform = `translate(calc(-50% + ${x * 15}px), calc(-50% + ${y * 15}px))`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    let animated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            const counters = entry.target.querySelectorAll<HTMLSpanElement>('[data-target]');
            counters.forEach((counter) => {
              const target = parseInt(counter.dataset.target || '0');
              const duration = 2000;
              const startTime = performance.now();

              function update(currentTime: number) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * eased).toLocaleString() + '+';
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target.toLocaleString() + '+';
              }

              requestAnimationFrame(update);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 bg-gradient-to-br from-cosmic-bg via-bg-light to-cosmic-bg">
        <StarCanvas />
        <SacredEmbers count={40} />
        <IncenseSmoke trails={3} />
        <div ref={ringsRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-sign-primary/20 rounded-full animate-[rotate_60s_linear_infinite] transition-transform duration-200 ease-out">
          <div className="absolute inset-10 border border-sign-primary/25 rounded-full" />
          <div className="absolute inset-20 border border-sign-primary/30 rounded-full" />
        </div>
      </div>
      <TemplePillars />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] text-sign-primary/10 font-devanagari select-none pointer-events-none om-pulse notranslate" translate="no">
        ॐ
      </div>
      <div className="relative text-center max-w-[800px] mx-auto px-4 z-10">
        <p className="font-devanagari text-sign-primary/70 text-lg mb-4 devanagari-glow">
          <SanskritTypewriter text="|| ज्योतिषां सूर्यश्चन्द्रमसौ ||" speed={90} />
        </p>
        <h1 className="font-heading text-4xl md:text-6xl text-text-primary mb-6 leading-tight drop-shadow-[0_0_40px_rgba(var(--sign-glow-rgb),0.5)]">
          Discover Your <span className="gold-shimmer">Cosmic Destiny</span> <span className="notranslate" translate="no">🪷</span>
        </h1>
        <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
          Unlock the ancient wisdom of Vedic astrology with personalized horoscopes, birth charts, and life predictions based on 5,000 years of Indian astrological tradition.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <PetalScatter count={12}>
            <Link href="/kundli" className="btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-8 py-4 rounded-lg font-medium text-lg btn-glow">
              Get Free Birth Chart
            </Link>
          </PetalScatter>
          <SparkleWrap count={6}>
            <Link href="/horoscopes" className="btn-premium border-2 border-sign-primary text-sign-primary px-8 py-4 rounded-lg font-medium text-lg hover:bg-sign-primary hover:text-cosmic-bg transition-all">
              Today&apos;s Horoscope
            </Link>
          </SparkleWrap>
        </div>
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { target: 5000, label: 'Years of Wisdom' },
            { target: 27, label: 'Nakshatras' },
            { target: 12, label: 'Rashis' },
            { target: 9, label: 'Grahas' },
          ].map((stat) => (
            <TiltCard key={stat.label} maxTilt={12}>
              <div className="text-center glass-card p-4">
                <span className="text-3xl font-heading brass-metallic block" data-target={stat.target}>0</span>
                <span className="text-text-muted text-sm">{stat.label}</span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
