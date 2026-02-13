'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { rashiDetails, dailyPredictions, weeklyThemes, monthlyFocus, calculateDailyTimings } from '@/lib/horoscope-data';
import { getElementEmoji } from '@/lib/rashi-emoji';
import { CITIES, INDIA_CITIES, INTL_CITIES, getCityTimingInfo, detectCity, detectCityAsync, findCityByName } from '@/lib/city-timings';
import type { CityData } from '@/lib/city-timings';

const signKeys = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const signSymbols = ['🐏', '🐂', '👯', '🦀', '🦁', '👩', '⚖️', '🦂', '🏹', '🐐', '🏺', '🐟'];

function SignImg({ index, size = 32, className = '' }: { index: number; size?: number; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="text-sign-primary">{signSymbols[index]}</span>;
  return (
    <Image
      src={`/images/zodiac-signs/${signKeys[index]}.svg`}
      alt={rashiDetails[index].name}
      width={size}
      height={size}
      className={`object-contain drop-shadow-[0_0_8px_rgba(var(--sign-glow-rgb),0.3)] ${className}`}
      onError={() => setErr(true)}
    />
  );
}

function generateStars(rating: number): string {
  return '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);
}

export default function HoroscopesPage() {
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState('daily');
  const [selectedCityName, setSelectedCityName] = useState('Delhi');
  const [citySource, setCitySource] = useState<'default' | 'geo' | 'manual'>('default');

  useEffect(() => {
    const saved = localStorage.getItem('vedic-muhurat-city');
    if (saved && findCityByName(saved)) {
      setSelectedCityName(saved);
      setCitySource('manual');
    } else {
      // Phase 1: instant timezone-based detection
      setSelectedCityName(detectCity().name);
      // Phase 2: async IP geolocation
      detectCityAsync().then(geo => {
        if (!localStorage.getItem('vedic-muhurat-city')) {
          setSelectedCityName(geo.name);
          setCitySource('geo');
        }
      });
    }
  }, []);

  const rashi = rashiDetails[currentSignIndex];
  const predictions = dailyPredictions[currentSignIndex];
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const seed = dayOfYear + currentSignIndex * 7 + today.getDate();
  const isPositiveDay = (seed % 7) < 5;

  let dateText = '';
  if (currentPeriod === 'daily') {
    dateText = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } else if (currentPeriod === 'weekly') {
    const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 6);
    dateText = `${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } else if (currentPeriod === 'monthly') {
    dateText = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } else {
    dateText = `${today.getFullYear()} Yearly Forecast`;
  }

  // Generate daily content from rich data
  const generalPrediction = isPositiveDay
    ? predictions.generalPositive[seed % predictions.generalPositive.length]
    : predictions.generalChallenging[seed % predictions.generalChallenging.length];
  const careerPrediction = isPositiveDay
    ? predictions.careerPositive[seed % predictions.careerPositive.length]
    : predictions.careerChallenging[seed % predictions.careerChallenging.length];
  const lovePrediction = isPositiveDay
    ? predictions.lovePositive[seed % predictions.lovePositive.length]
    : predictions.loveChallenging[seed % predictions.loveChallenging.length];
  const healthPrediction = predictions.healthAdvice[seed % predictions.healthAdvice.length];

  // Calculate daily timings (Muhurat) based on selected city's sunrise/sunset
  const selectedCity = findCityByName(selectedCityName) || CITIES[0];
  const cityTiming = getCityTimingInfo(selectedCity);
  const dailyTimings = calculateDailyTimings(today.getDay(), currentSignIndex, cityTiming.sunriseMin, cityTiming.sunsetMin);

  const handleCityChange = (name: string) => {
    setSelectedCityName(name);
    setCitySource('manual');
    localStorage.setItem('vedic-muhurat-city', name);
  };

  const handleDetectLocation = () => {
    localStorage.removeItem('vedic-muhurat-city');
    sessionStorage.removeItem('vedic-geoip-city');
    setCitySource('default');
    setSelectedCityName(detectCity().name);
    detectCityAsync().then(geo => {
      if (!localStorage.getItem('vedic-muhurat-city')) {
        setSelectedCityName(geo.name);
        setCitySource('geo');
      }
    });
  };

  const baseRating = isPositiveDay ? 65 : 45;
  const ratings = {
    love: Math.min(5, Math.floor((baseRating + ((seed * 3) % 30)) / 20) + 1),
    career: Math.min(5, Math.floor((baseRating + ((seed * 2) % 28)) / 20) + 1),
    health: Math.min(5, Math.floor((baseRating + ((seed * 4) % 22)) / 20) + 1),
    finance: Math.min(5, Math.floor((baseRating + ((seed * 5) % 26)) / 20) + 1),
  };

  // Weekly data
  const weekNum = Math.floor(dayOfYear / 7);
  const weeklyTheme = weeklyThemes[currentSignIndex]?.[weekNum % 5] || '';
  const weeklyFocusAreas = weeklyThemes[currentSignIndex] || [];

  // Monthly data
  const monthNum = today.getMonth();
  const monthFocus = monthlyFocus[currentSignIndex]?.[monthNum % 5] || '';
  const monthThemes = monthlyFocus[currentSignIndex] || [];

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader title="Horoscopes" description="Your daily, weekly, monthly & yearly Vedic predictions" emoji="⭐" />

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {signKeys.map((key, idx) => (
            <button key={key} onClick={() => setCurrentSignIndex(idx)}
              className={`px-3 py-2 rounded-lg text-sm transition-all hover-lift flex items-center gap-1.5 ${currentSignIndex === idx ? 'bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg' : 'glass-card text-text-muted hover:text-sign-primary'}`}>
              <SignImg index={idx} size={22} />
              {rashi && idx === currentSignIndex ? rashi.sanskrit : rashiDetails[idx].name}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
            <button key={p} onClick={() => setCurrentPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${currentPeriod === p ? 'bg-sign-primary/20 text-sign-primary border border-sign-primary/40' : 'text-text-muted hover:text-sign-primary'}`}>
              {p}
            </button>
          ))}
        </div>

        {rashi && (
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 mb-6">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                  <SignImg index={currentSignIndex} size={120} className="rounded-xl" />
                </div>
                <h2 className="font-heading text-xl text-sign-primary mt-2">{signSymbols[currentSignIndex]} {rashi.sanskrit} ({rashi.name})</h2>
                <p className="text-text-muted text-sm mt-1">{dateText}</p>
                <p className="text-text-muted text-xs mt-1">Ruled by {rashi.ruler} &bull; {getElementEmoji(rashi.element)} {rashi.element} &bull; {rashi.quality}</p>
              </div>

              {currentPeriod === 'daily' && (
                <div className="space-y-4 tab-content-enter" key="daily">
                  <div><h4 className="text-text-primary font-medium mb-1">General</h4><p className="text-text-muted text-sm">{generalPrediction}</p></div>
                  <div><h4 className="text-text-primary font-medium mb-1">Career</h4><p className="text-text-muted text-sm">{careerPrediction}</p></div>
                  <div><h4 className="text-text-primary font-medium mb-1">Love</h4><p className="text-text-muted text-sm">{lovePrediction}</p></div>
                  <div><h4 className="text-text-primary font-medium mb-1">Health</h4><p className="text-text-muted text-sm">{healthPrediction}</p></div>

                  {/* Shubh / Ashubh Muhurat */}
                  <div className="border-t border-sign-primary/20 pt-4 mt-4">
                    <h4 className="text-sign-primary font-heading text-base mb-3 text-center">&#x0950; Today&apos;s Muhurat</h4>

                    {/* City / Timezone Selector */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 p-3 bg-sign-primary/5 rounded-lg border border-sign-primary/10">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted text-xs">Location:</span>
                        <select
                          value={selectedCityName}
                          onChange={(e) => handleCityChange(e.target.value)}
                          className={`text-sm rounded px-2 py-1 focus:outline-none ${citySource === 'geo' ? 'bg-cosmic-bg border-2 border-amber-500 text-amber-400 font-medium' : 'bg-cosmic-bg border border-sign-primary/30 text-text-primary'}`}
                        >
                          <optgroup label="India">
                            {INDIA_CITIES.map(c => (
                              <option key={c.name} value={c.name}
                                style={citySource === 'geo' && c.name === selectedCityName ? { color: '#d97706', fontWeight: 'bold', background: '#1a1a2e' } : { color: '#000', background: '#fff' }}>
                                {citySource === 'geo' && c.name === selectedCityName ? `📍 ${c.name}` : c.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="International">
                            {INTL_CITIES.map(c => (
                              <option key={c.name} value={c.name}
                                style={citySource === 'geo' && c.name === selectedCityName ? { color: '#d97706', fontWeight: 'bold', background: '#1a1a2e' } : { color: '#000', background: '#fff' }}>
                                {citySource === 'geo' && c.name === selectedCityName ? `📍 ${c.name}, ${c.region}` : `${c.name}, ${c.region}`}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        {citySource === 'geo' && <span className="text-amber-400 text-xs flex items-center gap-1 font-medium" title="Auto-detected via IP location">&#x1F4CD; Detected</span>}
                        <button type="button" onClick={handleDetectLocation} className="text-sign-primary/70 hover:text-sign-primary text-xs flex items-center gap-0.5 transition-colors" title="Detect my location">&#x1F4CD;</button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="bg-sign-primary/10 text-sign-primary px-2 py-0.5 rounded">{cityTiming.tzLabel}</span>
                        <span>Sunrise: <span className="text-text-primary">{cityTiming.sunriseText}</span></span>
                        <span>Sunset: <span className="text-text-primary">{cityTiming.sunsetText}</span></span>
                      </div>
                    </div>

                    {/* Bad Times - Ashubh */}
                    <div className="mb-4">
                      <h5 className="text-red-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>&#10007;</span> Ashubh Kaal (Inauspicious)
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3 text-center hover-glow">
                          <span className="text-red-400 text-xs block mb-1">Rahu Kaal</span>
                          <span className="text-text-primary text-sm font-medium">{dailyTimings.rahuKaal.start} &ndash; {dailyTimings.rahuKaal.end}</span>
                          <span className="text-text-muted text-[10px] block mt-0.5">Avoid new work & travel</span>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3 text-center hover-glow">
                          <span className="text-red-400 text-xs block mb-1">Yamagandam</span>
                          <span className="text-text-primary text-sm font-medium">{dailyTimings.yamagandam.start} &ndash; {dailyTimings.yamagandam.end}</span>
                          <span className="text-text-muted text-[10px] block mt-0.5">Avoid important decisions</span>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3 text-center hover-glow">
                          <span className="text-red-400 text-xs block mb-1">Gulika Kaal</span>
                          <span className="text-text-primary text-sm font-medium">{dailyTimings.gulikaKaal.start} &ndash; {dailyTimings.gulikaKaal.end}</span>
                          <span className="text-text-muted text-[10px] block mt-0.5">Avoid signing deals</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Time - Abhijit Muhurat */}
                    <div className="mb-4">
                      <h5 className="text-sign-primary text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>&#10038;</span> Abhijit Muhurat (Most Auspicious)
                      </h5>
                      <div className="bg-sign-primary/5 border border-sign-primary/20 rounded-lg p-3 text-center">
                        <span className="text-sign-primary text-lg font-medium">{dailyTimings.abhijitMuhurat.start} &ndash; {dailyTimings.abhijitMuhurat.end}</span>
                        <span className="text-text-muted text-xs block mt-1">Ideal for any important activity &bull; Most powerful muhurat of the day</span>
                      </div>
                    </div>

                    {/* Good Times - Sign Specific Best Hours */}
                    <div>
                      <h5 className="text-green-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>&#10003;</span> Shubh Hora (Favorable for {rashi.name})
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {dailyTimings.bestHours.map((bh, i) => (
                          <div key={i} className="bg-green-500/5 border border-green-500/15 rounded-lg p-3 text-center">
                            <span className="text-green-400 text-xs block mb-1">{bh.activity}</span>
                            <span className="text-text-primary text-sm font-medium">{bh.start} &ndash; {bh.end}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentPeriod === 'weekly' && (
                <div className="space-y-4 tab-content-enter" key="weekly">
                  <p className="text-text-muted text-sm">Weekly theme: <span className="text-sign-primary capitalize">{weeklyTheme}</span></p>
                  <div><h4 className="text-text-primary font-medium mb-2">Focus Areas This Week</h4>
                    <ul className="space-y-1">{weeklyFocusAreas.map((f, i) => <li key={i} className="text-text-muted text-sm flex gap-2"><span className="text-sign-primary">&#10022;</span><span className="capitalize">{f}</span></li>)}</ul>
                  </div>
                  <div><h4 className="text-text-primary font-medium mb-1">Lucky Days</h4>
                    <p className="text-green-400 text-sm">{rashi.luckyDays.join(', ')}</p>
                  </div>
                  <p className="text-text-muted text-sm italic">{rashi.characteristics}</p>
                </div>
              )}

              {currentPeriod === 'monthly' && (
                <div className="space-y-4 tab-content-enter" key="monthly">
                  <p className="text-text-muted text-sm">Monthly focus: <span className="text-sign-primary capitalize">{monthFocus}</span></p>
                  <div><h4 className="text-text-primary font-medium mb-2">Themes This Month</h4>
                    <ul className="space-y-1">{monthThemes.map((t, i) => <li key={i} className="text-text-muted text-sm flex gap-2"><span className="text-sign-primary">&#10022;</span><span className="capitalize">{t}</span></li>)}</ul>
                  </div>
                  <div><h4 className="text-text-primary font-medium mb-1">Career Areas</h4>
                    <div className="flex gap-2 flex-wrap">{rashi.career.map(c => <span key={c} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{c}</span>)}</div>
                  </div>
                  <div><h4 className="text-text-primary font-medium mb-1">Compatible Signs</h4>
                    <p className="text-text-muted text-sm">{rashi.compatibleSigns.map(idx => rashiDetails[idx].name).join(', ')}</p>
                  </div>
                </div>
              )}

              {currentPeriod === 'yearly' && (
                <div className="space-y-4 tab-content-enter" key="yearly">
                  <p className="text-text-muted text-sm">{rashi.characteristics}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><h4 className="text-green-400 font-medium mb-2">Strengths</h4>
                      <ul className="space-y-1">{rashi.strengths.map((s, i) => <li key={i} className="text-text-muted text-sm flex gap-2"><span className="text-green-400">&#10003;</span>{s}</li>)}</ul>
                    </div>
                    <div><h4 className="text-red-400 font-medium mb-2">Challenges</h4>
                      <ul className="space-y-1">{rashi.challenges.map((c, i) => <li key={i} className="text-text-muted text-sm flex gap-2"><span className="text-red-400">&#10007;</span>{c}</li>)}</ul>
                    </div>
                  </div>
                  <div><h4 className="text-text-primary font-medium mb-1">Career Focus</h4>
                    <div className="flex gap-2 flex-wrap">{rashi.career.map(c => <span key={c} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{c}</span>)}</div>
                  </div>
                  <div><h4 className="text-text-primary font-medium mb-1">Body Focus</h4>
                    <p className="text-text-muted text-sm">{rashi.bodyPart}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Lucky Numbers', value: rashi.luckyNumbers.join(', ') },
                { label: 'Lucky Colors', value: rashi.luckyColors.join(', ') },
                { label: 'Lucky Days', value: rashi.luckyDays.join(', ') },
                { label: 'Direction', value: rashi.direction },
              ].map(h => (
                <div key={h.label} className="glass-card hover-lift p-4 text-center">
                  <span className="text-sign-primary/60 text-xs block">{h.label}</span>
                  <span className="text-text-primary text-sm font-medium">{h.value}</span>
                </div>
              ))}
            </div>

            {currentPeriod === 'daily' && (
              <div className="glass-card p-6 mb-6">
                <h3 className="font-heading text-sign-primary mb-4">Ratings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(ratings).map(([label, value]) => (
                    <div key={label} className="text-center">
                      <span className="text-text-muted text-sm block capitalize">{label}</span>
                      <span className="text-sign-primary text-lg">{generateStars(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-6">
                <h3 className="font-heading text-sign-primary text-sm mb-3">Sign Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-text-muted">Nature:</span> <span className="text-text-primary ml-2">{rashi.nature}</span></div>
                  <div><span className="text-text-muted">Gemstone:</span> <span className="text-sign-primary ml-2">{rashi.gem}</span></div>
                  <div><span className="text-text-muted">Deity:</span> <span className="text-sign-primary ml-2">{rashi.deity}</span></div>
                  <div><span className="text-text-muted">Body Part:</span> <span className="text-text-primary ml-2">{rashi.bodyPart}</span></div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-heading text-sign-primary text-sm mb-3">Remedies</h3>
                <ul className="space-y-2">
                  {predictions.remedies.slice(0, 4).map((r, i) => (
                    <li key={i} className="text-text-muted text-xs flex gap-2"><span className="text-sign-primary">&#10022;</span>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="text-sign-primary/60 text-xs block mb-1">Mantra for {rashi.sanskrit}</span>
              <p className="text-sign-primary text-sm font-devanagari">{rashi.mantra}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
