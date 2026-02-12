'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface BirthTimePickerProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Parse "HH:mm" (24h) into { hour12, minute, period } */
function parse24(value: string): { hour12: number; minute: number; period: 'AM' | 'PM' } | null {
  if (!value) return null;
  const parts = value.split(':');
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return { hour12, minute: m, period };
}

/** Convert 12h -> 24h "HH:mm" string */
function to24(hour12: number, minute: number, period: 'AM' | 'PM') {
  let h = hour12;
  if (period === 'AM' && h === 12) h = 0;
  else if (period === 'PM' && h !== 12) h += 12;
  return `${pad(h)}:${pad(minute)}`;
}

export default function BirthTimePicker({ name, required, defaultValue, className }: BirthTimePickerProps) {
  const parsed = parse24(defaultValue || '');

  const [hour, setHour] = useState(parsed?.hour12 ?? 12);
  const [minute, setMinute] = useState(parsed?.minute ?? 0);
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed?.period ?? 'AM');

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, close]);

  const hiddenValue = to24(hour, minute, period);
  const displayText = `${hour}:${pad(minute)} ${period}`;

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      {/* Hidden input for form submission (24h format) */}
      <input type="hidden" name={name} value={hiddenValue} />

      {/* Display input */}
      <input
        type="text"
        readOnly
        required={required}
        value={displayText}
        placeholder="Select time"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow cursor-pointer transition-colors"
      />

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 right-0 bg-cosmic-bg border border-sign-primary/30 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 animate-fade-up">
          <div className="flex items-center justify-center gap-3">
            {/* Hour */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-text-muted text-[10px] uppercase tracking-wider">Hour</span>
              <select
                value={hour}
                onChange={e => setHour(Number(e.target.value))}
                className="w-16 h-10 text-center bg-cosmic-bg/80 border border-sign-primary/20 rounded-lg text-text-primary text-base font-medium focus:outline-none focus:border-sign-primary/50 cursor-pointer"
              >
                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <span className="text-text-primary text-xl font-medium mt-4">:</span>

            {/* Minute */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-text-muted text-[10px] uppercase tracking-wider">Min</span>
              <select
                value={minute}
                onChange={e => setMinute(Number(e.target.value))}
                className="w-16 h-10 text-center bg-cosmic-bg/80 border border-sign-primary/20 rounded-lg text-text-primary text-base font-medium focus:outline-none focus:border-sign-primary/50 cursor-pointer"
              >
                {MINUTES.map(m => <option key={m} value={m}>{pad(m)}</option>)}
              </select>
            </div>

            {/* AM / PM */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-text-muted text-[10px] uppercase tracking-wider">Period</span>
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as 'AM' | 'PM')}
                className="w-16 h-10 text-center bg-cosmic-bg/80 border border-sign-primary/20 rounded-lg text-text-primary text-base font-medium focus:outline-none focus:border-sign-primary/50 cursor-pointer"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Done button */}
          <div className="mt-3 pt-2 border-t border-sign-primary/10 flex justify-center">
            <button
              type="button"
              onClick={close}
              className="text-xs bg-sign-primary/15 text-sign-primary px-4 py-1.5 rounded-lg hover:bg-sign-primary/25 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
