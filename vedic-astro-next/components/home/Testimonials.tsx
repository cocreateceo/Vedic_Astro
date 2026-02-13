'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import LotusBloom from '@/components/ui/LotusBloom';
import { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  { text: 'The birth chart analysis was incredibly accurate. It helped me understand my career path and relationship patterns in ways I never expected.', name: 'Priya S.', location: 'Mumbai, India', rating: 5 },
  { text: "I've been using Vedic_Astro for daily horoscopes and Panchang. The predictions are remarkably on point. Highly recommended!", name: 'Rajesh K.', location: 'Delhi, India', rating: 5 },
  { text: 'The compatibility report helped us understand our relationship dynamics better. The remedies suggested made a real difference.', name: 'Anita & Vikram', location: 'Bangalore, India', rating: 5 },
  { text: "The Kundli generation was so detailed and insightful. Pt. Ramesh Shastri's consultation changed my perspective on my Saturn transit.", name: 'Amit P.', location: 'Pune, India', rating: 5 },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [flipState, setFlipState] = useState<'idle' | 'out' | 'in'>('idle');
  const [displayed, setDisplayed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pendingRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    if (index === displayed && flipState === 'idle') return;
    pendingRef.current = index;
    setCurrent(index);
    setFlipState('out');
  }, [displayed, flipState]);

  const next = useCallback(() => {
    goTo((displayed + 1) % testimonials.length);
  }, [displayed, goTo]);

  const prev = useCallback(() => {
    goTo((displayed - 1 + testimonials.length) % testimonials.length);
  }, [displayed, goTo]);

  // Handle flip-out → flip-in transition
  useEffect(() => {
    if (flipState === 'out') {
      const timer = setTimeout(() => {
        setDisplayed(pendingRef.current);
        setFlipState('in');
      }, 450);
      return () => clearTimeout(timer);
    }
    if (flipState === 'in') {
      const timer = setTimeout(() => {
        setFlipState('idle');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [flipState]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      goTo(((pendingRef.current === displayed ? displayed : pendingRef.current) + 1) % testimonials.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [displayed, isPaused, goTo]);

  const t = testimonials[displayed];
  const flipClass = flipState === 'out' ? 'testimonial-flip-out' : flipState === 'in' ? 'testimonial-flip-in' : '';

  return (
    <section className="py-16 md:py-24 sandalwood-bg">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader title="What Our Users Say" emoji="🙏" />
        <div
          className="testimonial-flipper relative min-h-[280px] flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`testimonial-card max-w-2xl mx-auto text-center px-4 ${flipClass}`}>
            <div className="text-6xl text-sign-primary/60 font-heading mb-4">&ldquo;</div>
            <div className="text-sign-primary mb-4 notranslate" translate="no">{'\u2605'.repeat(t.rating)}</div>
            <p className="text-text-primary text-lg mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            <span className="copper-metallic font-medium block text-base">{t.name}</span>
            <span className="text-text-muted text-sm">{t.location}</span>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-sign-primary/30 flex items-center justify-center text-sign-primary hover-glow transition-all hover:border-sign-primary/60"
            aria-label="Previous testimonial"
          >
            &#8249;
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-sign-primary/30 flex items-center justify-center text-sign-primary hover-glow transition-all hover:border-sign-primary/60"
            aria-label="Next testimonial"
          >
            &#8250;
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-sign-primary scale-125' : 'bg-sign-primary/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <LotusBloom size={60} className="mt-6" />
      </div>
    </section>
  );
}
