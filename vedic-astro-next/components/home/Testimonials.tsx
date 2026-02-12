'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  { text: 'The birth chart analysis was incredibly accurate. It helped me understand my career path and relationship patterns in ways I never expected.', name: 'Priya S.', location: 'Mumbai, India', rating: 5 },
  { text: "I've been using Vedic_Astro for daily horoscopes and Panchang. The predictions are remarkably on point. Highly recommended!", name: 'Rajesh K.', location: 'Delhi, India', rating: 5 },
  { text: 'The compatibility report helped us understand our relationship dynamics better. The remedies suggested made a real difference.', name: 'Anita & Vikram', location: 'Bangalore, India', rating: 5 },
  { text: "The Kundli generation was so detailed and insightful. Pt. Ramesh Shastri's consultation changed my perspective on my Saturn transit.", name: 'Amit P.', location: 'Pune, India', rating: 5 },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next, isPaused]);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader title="What Our Users Say" />
        <div
          className="relative min-h-[280px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
            >
              <div className="max-w-2xl mx-auto text-center px-4">
                <div key={`q-${current}`} className="text-6xl text-sign-primary/60 font-heading mb-4 tab-content-enter">&ldquo;</div>
                <div className="text-sign-primary mb-4">{'\u2605'.repeat(t.rating)}</div>
                <p className="text-text-primary text-lg mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <span className="text-sign-primary font-medium block">{t.name}</span>
                <span className="text-text-muted text-sm">{t.location}</span>
              </div>
            </div>
          ))}

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
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-sign-primary scale-125' : 'bg-sign-primary/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
