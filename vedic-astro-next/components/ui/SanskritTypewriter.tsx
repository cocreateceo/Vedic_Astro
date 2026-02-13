'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * SanskritTypewriter — Types out Devanagari text character by character
 * with a blinking golden cursor, triggered on scroll into view.
 * Evokes the feeling of sacred text being inscribed on a palm leaf.
 */
export default function SanskritTypewriter({
  text,
  speed = 80,
  className = '',
  cursorColor,
}: {
  text: string;
  /** Milliseconds per character */
  speed?: number;
  className?: string;
  cursorColor?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -30px 0px' });
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let index = 0;
    const timer = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isInView, text, speed]);

  // Blink cursor
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  // Hide cursor 2s after done
  useEffect(() => {
    if (!done) return;
    const timeout = setTimeout(() => setShowCursor(false), 2000);
    return () => clearTimeout(timeout);
  }, [done]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {displayed}
      {(!done || showCursor) && (
        <span
          className="inline-block w-[2px] h-[1em] ml-[2px] align-middle"
          style={{
            background: cursorColor || 'var(--sign-primary)',
            opacity: showCursor ? 0.8 : 0,
            transition: 'opacity 0.1s',
            boxShadow: showCursor ? `0 0 6px ${cursorColor || 'rgba(var(--sign-glow-rgb), 0.5)'}` : 'none',
          }}
        />
      )}
    </span>
  );
}
