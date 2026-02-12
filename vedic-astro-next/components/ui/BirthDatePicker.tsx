'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface BirthDatePickerProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const currentYear = new Date().getFullYear();
const YEARS: number[] = [];
for (let y = currentYear; y >= 1920; y--) YEARS.push(y);

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

function formatValue(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDMY(day: number, month: number, year: number) {
  return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
}

/** Parse DD/MM/YYYY typed by user */
function parseDMY(value: string): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const parts = value.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  if (y < 1920 || y > currentYear) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > daysInMonth(m - 1, y)) return null;
  return { year: y, month: m - 1, day: d };
}

/** Parse YYYY-MM-DD from defaultValue */
function parseYMD(value: string): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const parts = value.split('-');
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return { year: y, month: m - 1, day: d };
}

export default function BirthDatePicker({ name, required, defaultValue, className }: BirthDatePickerProps) {
  const parsed = parseYMD(defaultValue || '');
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(parsed?.year ?? 0);
  const [selectedMonth, setSelectedMonth] = useState(parsed?.month ?? 0);
  const [selectedDay, setSelectedDay] = useState(parsed?.day ?? 0);
  const [hasSelection, setHasSelection] = useState(!!parsed);

  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());
  const [viewYear, setViewYear] = useState(parsed?.year ?? 1990);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(parsed ? formatDMY(parsed.day, parsed.month, parsed.year) : '');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function applySelection(year: number, month: number, day: number) {
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
    setHasSelection(true);
    setInputText(formatDMY(day, month, year));
  }

  function selectDay(day: number) {
    applySelection(viewYear, viewMonth, day);
    close();
  }

  function handleInputChange(value: string) {
    setInputText(value);
    // Try to parse as user types — apply when fully valid
    const result = parseDMY(value);
    if (result) {
      applySelection(result.year, result.month, result.day);
      setViewMonth(result.month);
      setViewYear(result.year);
    }
  }

  function handleInputBlur() {
    // On blur, if text doesn't parse, revert to last valid selection
    const result = parseDMY(inputText);
    if (result) {
      applySelection(result.year, result.month, result.day);
    } else if (hasSelection) {
      setInputText(formatDMY(selectedDay, selectedMonth, selectedYear));
    } else {
      setInputText('');
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const result = parseDMY(inputText);
      if (result) {
        applySelection(result.year, result.month, result.day);
        close();
      }
    }
  }

  const totalDays = daysInMonth(viewMonth, viewYear);
  const startDay = firstDayOfMonth(viewMonth, viewYear);
  const prevMonthDays = viewMonth === 0 ? daysInMonth(11, viewYear - 1) : daysInMonth(viewMonth - 1, viewYear);

  const cells: { day: number; currentMonth: boolean }[] = [];
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, currentMonth: false });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, currentMonth: false });
  }
  const rows = Math.ceil(cells.length / 7);
  const totalCells = rows <= 5 ? 35 : 42;

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const hiddenValue = hasSelection ? formatValue(selectedYear, selectedMonth, selectedDay) : '';

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <input type="hidden" name={name} value={hiddenValue} />

      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={inputText}
          onChange={e => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder="DD/MM/YYYY"
          className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-l-lg px-4 py-3 text-text-primary focus-glow transition-colors"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-cosmic-bg/50 border border-l-0 border-sign-primary/20 rounded-r-lg px-3 text-sign-primary/60 hover:text-sign-primary hover:bg-sign-primary/10 transition-colors"
          title="Open calendar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 right-0 min-w-[300px] bg-cosmic-bg border border-sign-primary/30 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <select
              value={viewMonth}
              onChange={e => setViewMonth(Number(e.target.value))}
              className="flex-1 bg-cosmic-bg/80 border border-sign-primary/20 rounded-lg px-2 py-1.5 text-text-primary text-sm focus:outline-none focus:border-sign-primary/50"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select
              value={viewYear}
              onChange={e => setViewYear(Number(e.target.value))}
              className="w-[90px] bg-cosmic-bg/80 border border-sign-primary/20 rounded-lg px-2 py-1.5 text-text-primary text-sm focus:outline-none focus:border-sign-primary/50"
            >
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map((d, i) => (
              <div key={d} className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-sign-primary' : 'text-text-muted'}`}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.slice(0, totalCells).map((cell, idx) => {
              const isSunday = idx % 7 === 0;
              const isSelected = cell.currentMonth && hasSelection &&
                cell.day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
              const isToday = cell.currentMonth &&
                cell.day === todayDay && viewMonth === todayMonth && viewYear === todayYear;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (cell.currentMonth) {
                      selectDay(cell.day);
                    } else if (idx < 7 && cell.day > 15) {
                      if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
                      else setViewMonth(viewMonth - 1);
                    } else {
                      if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
                      else setViewMonth(viewMonth + 1);
                    }
                  }}
                  className={`
                    relative w-full aspect-square flex items-center justify-center text-sm rounded-full transition-all
                    ${!cell.currentMonth ? 'text-text-muted/30 hover:text-text-muted/50' : ''}
                    ${cell.currentMonth && !isSelected ? 'hover:bg-sign-primary/15' : ''}
                    ${cell.currentMonth && isSunday && !isSelected ? 'text-sign-primary font-medium' : ''}
                    ${cell.currentMonth && !isSunday && !isSelected ? 'text-text-primary' : ''}
                    ${isSelected ? 'bg-sign-primary text-cosmic-bg font-semibold shadow-[0_0_12px_rgba(var(--sign-glow-rgb),0.4)]' : ''}
                    ${isToday && !isSelected ? 'ring-1 ring-sign-primary/40' : ''}
                  `}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-sign-primary/10 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setViewMonth(todayMonth);
                setViewYear(todayYear);
                selectDay(todayDay);
              }}
              className="text-xs text-sign-primary/70 hover:text-sign-primary transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
