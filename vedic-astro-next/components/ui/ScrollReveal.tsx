'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger index — each unit adds 100ms delay */
  delay?: number;
}

/**
 * ScrollReveal — Framer Motion powered scroll-triggered entrance.
 * Cards spring-animate in with physics-based easing and stagger support.
 * Replaces the old IntersectionObserver + CSS class approach.
 */
export default function ScrollReveal({ children, className = '', delay }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        mass: 0.8,
        delay: delay !== undefined ? delay * 0.1 : 0,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
