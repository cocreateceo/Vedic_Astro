'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { CITIES, type CityData, CITY_ALIASES } from '@/lib/city-timings';

interface CityAutocompleteProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}

function searchCities(query: string): CityData[] {
  if (!query || query.length < 2) return [];
  const lower = query.trim().toLowerCase();

  // Check alias first
  const aliasTarget = CITY_ALIASES[lower];

  const results: CityData[] = [];
  const seen = new Set<string>();

  // Alias match first
  if (aliasTarget) {
    const city = CITIES.find(c => c.name === aliasTarget);
    if (city) { results.push(city); seen.add(city.name); }
  }

  // Starts-with matches
  for (const city of CITIES) {
    if (seen.has(city.name)) continue;
    if (city.name.toLowerCase().startsWith(lower)) {
      results.push(city);
      seen.add(city.name);
    }
  }

  // Partial alias matches
  for (const [alias, target] of Object.entries(CITY_ALIASES)) {
    if (seen.has(target)) continue;
    if (alias.startsWith(lower)) {
      const city = CITIES.find(c => c.name === target);
      if (city) { results.push(city); seen.add(city.name); }
    }
  }

  // Contains matches
  for (const city of CITIES) {
    if (seen.has(city.name)) continue;
    if (city.name.toLowerCase().includes(lower)) {
      results.push(city);
      seen.add(city.name);
    }
  }

  return results.slice(0, 8);
}

export default function CityAutocomplete({ name, required, defaultValue, className }: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => { setIsOpen(false); setHighlightIndex(-1); }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, close]);

  function handleChange(value: string) {
    setInputValue(value);
    const results = searchCities(value);
    setSuggestions(results);
    setIsOpen(results.length > 0);
    setHighlightIndex(-1);
  }

  function selectCity(city: CityData) {
    setInputValue(city.name);
    close();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      selectCity(suggestions[highlightIndex]);
    } else if (e.key === 'Escape') {
      close();
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <input type="hidden" name={name} value={inputValue} />
      <input
        type="text"
        required={required}
        value={inputValue}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder="Type city name..."
        autoComplete="off"
        className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow transition-colors"
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 left-0 right-0 bg-cosmic-bg border border-sign-primary/30 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
          {suggestions.map((city, idx) => (
            <button
              key={city.name}
              type="button"
              onClick={() => selectCity(city)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex justify-between items-center ${
                idx === highlightIndex
                  ? 'bg-sign-primary/15 text-sign-primary'
                  : 'text-text-primary hover:bg-sign-primary/10'
              }`}
            >
              <span>{city.name}</span>
              <span className="text-text-muted text-xs">{city.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
