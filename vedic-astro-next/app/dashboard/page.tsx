'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { generateMiniChart } from '@/lib/chart-svg';
import { getMostMalefic, isBeneficForAscendant, nakshatraDetails, rashiDetails, generatePlanetAnalysis, getHouseInfo, houseSignifications, calculateDailyTimings } from '@/lib/horoscope-data';
import { calculateDashaWithRatings, signNames, hindiSignNames } from '@/lib/kundli-calc';
import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import { PlanetAnalysis, YogaResult, DoshaResult, GemstoneRecommendation, TransitPrediction, SadeSatiResult, DashaWithAntardasha, WeeklyPrediction, MonthlyPrediction, BhavaPrediction, PanchangaPrediction, DayHighlight, ActivityRecommendation, MonthlyPhase, AuspiciousDate, InauspiciousDate, MonthlyTransit, LifeQuestion } from '@/types';
import { CITIES, INDIA_CITIES, INTL_CITIES, getCityTimingInfo, detectCity, findCityByName } from '@/lib/city-timings';
import { identifyYogas } from '@/lib/yoga-calc';
import { analyzeAllDoshas } from '@/lib/dosha-calc';
import { recommendGemstones } from '@/lib/gemstone-calc';
import { analyzeTransits, detectSadeSati } from '@/lib/transit-calc';
import { generateLifeQA } from '@/lib/qa-predictions';
import JagadhaKattam from '@/components/dashboard/JagadhaKattam';
import PdfReport from '@/components/dashboard/PdfReport';
import NewsletterPreferences from '@/components/dashboard/NewsletterPreferences';
import { downloadBirthChartPdf } from '@/lib/pdf-download';

function DashboardContent() {
  const { user, updateBirthDetails, logout, refreshHoroscope } = useAuth();
  const [activeTab, setActiveTab] = useState('daily');
  const [editing, setEditing] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState('Delhi');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [expandedDasha, setExpandedDasha] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vedic-muhurat-city');
    if (saved && findCityByName(saved)) {
      setSelectedCityName(saved);
    } else {
      setSelectedCityName(detectCity().name);
    }
    const savedPhoto = localStorage.getItem('vedic-profile-photo');
    if (savedPhoto) setProfilePhoto(savedPhoto);

    const onStorage = () => {
      setProfilePhoto(localStorage.getItem('vedic-profile-photo'));
    };
    window.addEventListener('profile-photo-updated', onStorage);
    return () => window.removeEventListener('profile-photo-updated', onStorage);
  }, []);

  if (!user) return null;

  const chart = user.vedicChart;
  const horoscope = user.horoscope;
  const today = new Date();
  const miniChartSvg = generateMiniChart(chart.ascendant.index);

  const dashaOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const currentDashaIndex = (today.getFullYear() - new Date(user.dob).getFullYear()) % 9;
  const currentDashaLord = dashaOrder[currentDashaIndex];
  const dashaMalefic = getMostMalefic(chart.ascendant.index);
  const dashaBenefic = isBeneficForAscendant(currentDashaLord, chart.ascendant.index);

  const nakshatraData = nakshatraDetails[chart.nakshatra];
  const moonRashiData = rashiDetails[chart.moonSign.index];
  const ascRashiData = rashiDetails[chart.ascendant.index];
  const planetAnalysis = generatePlanetAnalysis(chart);

  // Convert chart.planets to format expected by calculators
  const planetPositions = useMemo(() => {
    if (!chart.planets) return {};
    const pos: Record<string, { sign: string; signIndex: number; house: number; degree: string; retrograde: boolean }> = {};
    Object.entries(chart.planets).forEach(([name, data]) => {
      pos[name] = {
        sign: data.sign,
        signIndex: data.signIndex,
        house: data.house,
        degree: data.degree,
        retrograde: data.retrograde,
      };
    });
    return pos;
  }, [chart.planets]);

  // New calculations
  const yogas = useMemo(() => identifyYogas(planetPositions, chart.ascendant.index), [planetPositions, chart.ascendant.index]);
  const doshas = useMemo(() => analyzeAllDoshas(planetPositions), [planetPositions]);
  const gemstones = useMemo(() => recommendGemstones(planetPositions, chart.ascendant.index), [planetPositions, chart.ascendant.index]);
  const transits = useMemo(() => analyzeTransits(chart.moonSign.index), [chart.moonSign.index]);
  const sadeSati = useMemo(() => detectSadeSati(chart.moonSign.index), [chart.moonSign.index]);
  const enhancedDashas = useMemo(() => {
    if (!user.dob || !chart.nakshatra) return [];
    return calculateDashaWithRatings(user.dob, chart.nakshatra, chart.ascendant.index);
  }, [user.dob, chart.nakshatra, chart.ascendant.index]);

  const lifeQuestions = useMemo(() => generateLifeQA(chart, yogas, doshas, gemstones, enhancedDashas), [chart, yogas, doshas, gemstones, enhancedDashas]);

  const activeDoshas = doshas.filter(d => d.detected);
  const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  // City-aware Muhurat timings
  const selectedCity = findCityByName(selectedCityName) || CITIES[0];
  const cityTiming = getCityTimingInfo(selectedCity);
  const liveDailyTimings = calculateDailyTimings(today.getDay(), chart.moonSign.index, cityTiming.sunriseMin, cityTiming.sunsetMin);

  const handleCityChange = (name: string) => {
    setSelectedCityName(name);
    localStorage.setItem('vedic-muhurat-city', name);
  };

  function handleBirthEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const dob = (form.elements.namedItem('edit-dob') as HTMLInputElement).value;
    const tob = (form.elements.namedItem('edit-tob') as HTMLInputElement).value;
    const pob = (form.elements.namedItem('edit-pob') as HTMLInputElement).value;
    const tz = (form.elements.namedItem('edit-timezone') as HTMLSelectElement).value;
    if (dob && tob && pob && tz) {
      updateBirthDetails(dob, tob, pob, tz);
      setEditing(false);
    }
  }

  async function handleDownloadPdf() {
    if (!pdfRef.current || pdfLoading || !user) return;
    setPdfLoading(true);
    try {
      await downloadBirthChartPdf(pdfRef.current, user.name);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
    }
  }

  const formatDate = (d: string) => {
    if (!d) return '-';
    const [year, month, day] = d.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month - 1]} ${day}, ${year}`;
  };
  const formatTime = (t: string) => {
    if (!t) return '-';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const allTabs = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'panchanga', label: 'Panchanga' },
    { key: 'houses', label: 'Houses' },
    { key: 'planets', label: 'Planets' },
    { key: 'transits', label: 'Transits' },
    { key: 'yogas', label: 'Yogas' },
    { key: 'doshas', label: 'Doshas' },
    { key: 'dasha', label: 'Dasha' },
    { key: 'gems', label: 'Gems' },
  ];

  return (
    <div className="py-16 md:py-20">
      <PdfReport
        ref={pdfRef}
        chart={chart}
        horoscope={horoscope}
        userName={user.name}
        dob={user.dob}
        tob={user.tob}
        pob={user.pob}
        photo={profilePhoto}
        yogas={yogas}
        doshas={doshas}
        gemstones={gemstones}
        transits={transits}
        sadeSati={sadeSati}
        enhancedDashas={enhancedDashas}
        lifeQuestions={lifeQuestions}
      />
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ===== LEFT SIDEBAR ===== */}
          <div className="space-y-6">
            <div className="glass-card hover-lift p-4 text-center">
              <JagadhaKattam chart={chart} />
              <p className="text-sign-primary text-lg mt-2">{chart.moonSign.symbol}</p>
              <p className="text-text-primary text-sm">{chart.moonSign.hindi} ({chart.moonSign.name})</p>
            </div>

            <div className="glass-card hover-lift p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sign-primary text-sm">Birth Details</h3>
                <button onClick={() => setEditing(!editing)} className="text-sign-primary text-xs">{editing ? '\u2715' : '\u270F\uFE0F'}</button>
              </div>
              {!editing ? (
                <div className="space-y-2 text-sm">
                  <div><span className="text-text-muted">DOB:</span> <span className="text-text-primary ml-2">{formatDate(user.dob)}</span></div>
                  <div><span className="text-text-muted">Time:</span> <span className="text-text-primary ml-2">{formatTime(user.tob)}</span></div>
                  <div><span className="text-text-muted">Place:</span> <span className="text-text-primary ml-2">{user.pob}</span></div>
                  <div className="pt-2 border-t border-sign-primary/10 mt-3 space-y-2">
                    <div><span className="text-text-muted">Moon:</span> <span className="text-text-primary ml-2">{chart.moonSign.name}</span></div>
                    <div><span className="text-text-muted">Sun:</span> <span className="text-text-primary ml-2">{chart.sunSign.name}</span></div>
                    <div><span className="text-text-muted">Asc:</span> <span className="text-text-primary ml-2">{chart.ascendant.name}</span></div>
                    <div><span className="text-text-muted">Nakshatra:</span> <span className="text-text-primary ml-2">{chart.nakshatra}{chart.nakshatraPada ? ` (Pada ${chart.nakshatraPada})` : ''}</span></div>
                  </div>
                  {moonRashiData && (
                    <div className="pt-2 border-t border-sign-primary/10 mt-3 space-y-2">
                      <div><span className="text-text-muted">Element:</span> <span className="text-sign-primary ml-2">{moonRashiData.element}</span></div>
                      <div><span className="text-text-muted">Gemstone:</span> <span className="text-sign-primary ml-2">{moonRashiData.gem}</span></div>
                      <div><span className="text-text-muted">Deity:</span> <span className="text-sign-primary ml-2">{moonRashiData.deity}</span></div>
                      <div><span className="text-text-muted">Ruler:</span> <span className="text-sign-primary ml-2">{moonRashiData.ruler}</span></div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleBirthEdit} className="space-y-3">
                  <input type="date" name="edit-dob" defaultValue={user.dob} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary" />
                  <input type="time" name="edit-tob" defaultValue={user.tob} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary" />
                  <input type="text" name="edit-pob" defaultValue={user.pob} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary" />
                  <select name="edit-timezone" defaultValue={user.timezone} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary">
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="America/New_York">US Eastern</option>
                    <option value="Europe/London">UK (GMT)</option>
                  </select>
                  <button type="submit" className="w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-2 rounded text-sm font-medium">Save</button>
                </form>
              )}
            </div>

            {nakshatraData && (
              <div className="glass-card hover-lift p-6">
                <h3 className="font-heading text-sign-primary text-sm mb-3">Nakshatra Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-text-muted">Star:</span> <span className="text-text-primary ml-2">{chart.nakshatra}{chart.nakshatraPada ? ` - Pada ${chart.nakshatraPada}` : ''}</span></div>
                  <div><span className="text-text-muted">Deity:</span> <span className="text-text-primary ml-2">{nakshatraData.deity}</span></div>
                  <div><span className="text-text-muted">Symbol:</span> <span className="text-text-primary ml-2">{nakshatraData.symbol}</span></div>
                  <div><span className="text-text-muted">Ruler:</span> <span className="text-text-primary ml-2">{nakshatraData.ruler}</span></div>
                  <div><span className="text-text-muted">Nature:</span> <span className="text-text-primary ml-2">{nakshatraData.nature}</span></div>
                  <p className="text-text-muted text-xs mt-2 italic">{nakshatraData.qualities}</p>
                  <div className="pt-2 border-t border-sign-primary/10 mt-2">
                    <span className="text-text-muted text-xs block mb-1">Suited Careers:</span>
                    <div className="flex gap-1 flex-wrap">
                      {nakshatraData.careers.map(c => (
                        <span key={c} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personality Snapshot */}
            {moonRashiData && (
              <div className="glass-card hover-lift p-6">
                <h3 className="font-heading text-sign-primary text-sm mb-3">Personality</h3>
                <p className="text-text-muted text-xs mb-3">{moonRashiData.characteristics}</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-green-400 text-xs font-medium">Strengths</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {moonRashiData.strengths.map(s => (
                        <span key={s} className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-yellow-400 text-xs font-medium">Challenges</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {moonRashiData.challenges.map(c => (
                        <span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sade Sati Alert */}
            {sadeSati.active && (
              <div className="glass-card hover-lift p-6 border border-red-500/30">
                <h3 className="font-heading text-red-400 text-sm mb-2">Sade Sati Active</h3>
                <p className="text-text-muted text-xs mb-2">{sadeSati.phase} phase</p>
                <p className="text-text-muted text-xs">{sadeSati.description.substring(0, 150)}...</p>
                <button onClick={() => setActiveTab('doshas')} className="text-red-400 text-xs mt-2 underline">View remedies</button>
              </div>
            )}

            {/* Current Dasha */}
            <div className="glass-card hover-lift p-6">
              <h3 className="font-heading text-sign-primary text-sm mb-3">Current Dasha</h3>
              <p className="text-text-primary text-sm">{currentDashaLord} Mahadasha</p>
              <p className="text-text-muted text-xs mb-2">{dashaOrder[(currentDashaIndex + 1) % 9]} Antardasha</p>
              <p className={`text-xs ${dashaBenefic ? 'text-green-400' : currentDashaLord === dashaMalefic ? 'text-red-400' : 'text-yellow-400'}`}>
                {dashaBenefic ? 'Benefic period' : currentDashaLord === dashaMalefic ? 'Challenging period - remedies advised' : 'Neutral period'}
              </p>
              <button onClick={() => setActiveTab('dasha')} className="text-sign-primary text-xs mt-2 underline">View full timeline</button>
            </div>

            {/* Quick Dosha Summary */}
            {activeDoshas.length > 0 && (
              <div className="glass-card hover-lift p-6 border border-yellow-500/20">
                <h3 className="font-heading text-yellow-400 text-sm mb-3">Doshas Detected</h3>
                <div className="space-y-2">
                  {activeDoshas.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${d.severity === 'severe' ? 'bg-red-400' : d.severity === 'moderate' ? 'bg-yellow-400' : 'bg-yellow-300'}`} />
                      <span className="text-text-primary text-xs">{d.name.split('(')[0].trim()}</span>
                      <span className={`text-xs ml-auto ${d.severity === 'severe' ? 'text-red-400' : 'text-yellow-400'}`}>{d.severity}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('doshas')} className="text-yellow-400 text-xs mt-2 underline">View details & remedies</button>
              </div>
            )}

            {/* Lucky Elements */}
            {moonRashiData && (
              <div className="glass-card hover-lift p-6">
                <h3 className="font-heading text-sign-primary text-sm mb-3">Lucky Elements</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-text-muted">Numbers:</span> <span className="text-sign-primary ml-2">{moonRashiData.luckyNumbers.join(', ')}</span></div>
                  <div><span className="text-text-muted">Colors:</span> <span className="text-sign-primary ml-2">{moonRashiData.luckyColors.join(', ')}</span></div>
                  <div><span className="text-text-muted">Days:</span> <span className="text-sign-primary ml-2">{moonRashiData.luckyDays.join(', ')}</span></div>
                  <div><span className="text-text-muted">Direction:</span> <span className="text-sign-primary ml-2">{moonRashiData.direction}</span></div>
                </div>
              </div>
            )}

            {horoscope?.daily?.remedies && horoscope.daily.remedies.length > 0 && (
              <div className="glass-card hover-lift p-6">
                <h3 className="font-heading text-sign-primary text-sm mb-3">Daily Remedies</h3>
                <ul className="space-y-2">
                  {horoscope.daily.remedies.map((r, i) => (
                    <li key={i} className="text-text-muted text-xs flex gap-2"><span className="text-sign-primary">&#10022;</span>{r}</li>
                  ))}
                </ul>
                {horoscope.daily.mantra && (
                  <div className="mt-3 pt-3 border-t border-sign-primary/10">
                    <span className="text-sign-primary/60 text-xs block mb-1">Daily Mantra</span>
                    <p className="text-sign-primary text-xs font-devanagari">{horoscope.daily.mantra}</p>
                  </div>
                )}
              </div>
            )}

            <NewsletterPreferences />
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h1 className="font-heading text-xl text-sign-primary">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-text-muted text-xs">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="btn-premium px-4 py-2 rounded-lg text-sm transition-all bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {pdfLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 bg-cosmic-bg/50 rounded-xl p-1.5 border border-sign-primary/10">
              {allTabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-sign-primary/20 text-sign-primary border border-sign-primary/40 shadow-sm' : 'text-text-muted hover:text-text-primary hover:bg-sign-primary/5'}`}>
                  {tab.label}
                  {tab.key === 'yogas' && yogas.length > 0 && <span className="ml-1 text-xs text-sign-primary/60">({yogas.length})</span>}
                  {tab.key === 'doshas' && activeDoshas.length > 0 && <span className="ml-1 text-xs text-red-400">({activeDoshas.length})</span>}
                </button>
              ))}
            </div>

            {/* ===== DAILY TAB ===== */}
            {activeTab === 'daily' && horoscope?.daily && (
              <div className="space-y-6 tab-content-enter" key="daily">
                <div className="glass-card p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-sign-primary">Daily Report</h3>
                    <span className="text-text-muted text-xs">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>

                  {horoscope.daily.ratings && (
                    <div className="grid grid-cols-5 gap-3 mb-6">
                      {Object.entries(horoscope.daily.ratings).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <div className="text-sign-primary text-lg font-heading">{val}%</div>
                          <div className="text-text-muted text-xs capitalize">{key}</div>
                          <div className="mt-1 h-1.5 bg-cosmic-bg rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-sign-primary to-sign-dark rounded-full rating-bar-fill-animate" style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div><h4 className="text-text-primary font-medium mb-1">General</h4><p className="text-text-muted text-sm">{horoscope.daily.general}</p></div>
                    <div><h4 className="text-text-primary font-medium mb-1">Career</h4><p className="text-text-muted text-sm">{horoscope.daily.career}</p></div>
                    <div><h4 className="text-text-primary font-medium mb-1">Love</h4><p className="text-text-muted text-sm">{horoscope.daily.love}</p></div>
                    <div><h4 className="text-text-primary font-medium mb-1">Health</h4><p className="text-text-muted text-sm">{horoscope.daily.health}</p></div>
                  </div>

                  {horoscope.daily.mantra && (
                    <div className="mt-4 p-3 bg-sign-primary/5 border border-sign-primary/10 rounded-lg">
                      <span className="text-sign-primary/60 text-xs block mb-1">Today&apos;s Mantra</span>
                      <p className="text-sign-primary text-sm font-devanagari">{horoscope.daily.mantra}</p>
                    </div>
                  )}
                </div>

                <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-1 text-sm">Shubh &amp; Ashubh Muhurat</h3>
                    <p className="text-text-muted text-xs mb-4">Plan your day — know the best and worst times for important activities</p>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 p-3 bg-sign-primary/5 rounded-lg border border-sign-primary/10">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted text-xs">Location:</span>
                        <select value={selectedCityName} onChange={(e) => handleCityChange(e.target.value)}
                          className="bg-cosmic-bg border border-sign-primary/30 text-text-primary text-sm rounded px-2 py-1 focus:outline-none focus:border-sign-primary">
                          <optgroup label="India">
                            {INDIA_CITIES.map(c => (<option key={c.name} value={c.name}>{c.name}</option>))}
                          </optgroup>
                          <optgroup label="International">
                            {INTL_CITIES.map(c => (<option key={c.name} value={c.name}>{c.name}, {c.region}</option>))}
                          </optgroup>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="bg-sign-primary/10 text-sign-primary px-2 py-0.5 rounded">{cityTiming.tzLabel}</span>
                        <span>Sunrise: <span className="text-text-primary">{cityTiming.sunriseText}</span></span>
                        <span>Sunset: <span className="text-text-primary">{cityTiming.sunsetText}</span></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-green-400 text-xs font-medium uppercase tracking-wider mb-2">Shubh (Good Times)</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                            <span className="text-lg">&#9733;</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-text-primary text-sm font-medium">Abhijit Muhurat</span>
                                <span className="text-green-400 text-xs font-medium">{liveDailyTimings.abhijitMuhurat.start} – {liveDailyTimings.abhijitMuhurat.end}</span>
                              </div>
                              <p className="text-text-muted text-xs mt-0.5">Best time for any important activity</p>
                            </div>
                          </div>
                          {liveDailyTimings.bestHours.map((bh, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                              <span className="text-sm text-green-400">&#10003;</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-text-primary text-sm">{bh.activity}</span>
                                  <span className="text-green-400/80 text-xs">{bh.start} – {bh.end}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-red-400 text-xs font-medium uppercase tracking-wider mb-2">Ashubh (Avoid These Times)</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/15">
                            <span className="text-lg">&#9888;</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-text-primary text-sm font-medium">Rahu Kaal</span>
                                <span className="text-red-400 text-xs font-medium">{liveDailyTimings.rahuKaal.start} – {liveDailyTimings.rahuKaal.end}</span>
                              </div>
                              <p className="text-text-muted text-xs mt-0.5">Avoid starting new work, travel, or interviews</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                            <span className="text-sm text-red-400">&#10007;</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-text-primary text-sm">Yamagandam</span>
                                <span className="text-red-400/80 text-xs">{liveDailyTimings.yamagandam.start} – {liveDailyTimings.yamagandam.end}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                            <span className="text-sm text-red-400">&#10007;</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-text-primary text-sm">Gulika Kaal</span>
                                <span className="text-red-400/80 text-xs">{liveDailyTimings.gulikaKaal.start} – {liveDailyTimings.gulikaKaal.end}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Lucky Elements Grid */}
                {horoscope.daily.lucky && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Lucky Numbers', value: moonRashiData?.luckyNumbers?.join(', ') || String(horoscope.daily.lucky.number) },
                      { label: 'Lucky Colors', value: moonRashiData?.luckyColors?.join(', ') || horoscope.daily.lucky.color },
                      { label: 'Lucky Days', value: moonRashiData?.luckyDays?.join(', ') || horoscope.daily.lucky.day },
                      { label: 'Direction', value: horoscope.daily.lucky.direction },
                    ].map(h => (
                      <div key={h.label} className="glass-card hover-lift p-4 text-center">
                        <span className="text-sign-primary/60 text-xs block">{h.label}</span>
                        <span className="text-text-primary text-sm font-medium">{h.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Star Ratings */}
                {horoscope.daily.ratings && (
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-4">Ratings</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(horoscope.daily.ratings).filter(([key]) => ['love', 'career', 'health', 'finance'].includes(key)).map(([label, val]) => (
                        <div key={label} className="text-center">
                          <span className="text-text-muted text-sm block capitalize">{label}</span>
                          <span className="text-sign-primary text-lg">{'\u2605'.repeat(Math.min(5, Math.floor((val as number) / 20) + 1))}{'\u2606'.repeat(5 - Math.min(5, Math.floor((val as number) / 20) + 1))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sign Details + Remedies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {moonRashiData && (
                    <div className="glass-card p-6">
                      <h3 className="font-heading text-sign-primary text-sm mb-3">Sign Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-text-muted">Nature:</span> <span className="text-text-primary ml-2">{moonRashiData.nature}</span></div>
                        <div><span className="text-text-muted">Gemstone:</span> <span className="text-sign-primary ml-2">{moonRashiData.gem}</span></div>
                        <div><span className="text-text-muted">Deity:</span> <span className="text-sign-primary ml-2">{moonRashiData.deity}</span></div>
                        <div><span className="text-text-muted">Body Part:</span> <span className="text-text-primary ml-2">{moonRashiData.bodyPart}</span></div>
                      </div>
                    </div>
                  )}

                  {horoscope.daily.remedies && horoscope.daily.remedies.length > 0 && (
                    <div className="glass-card p-6">
                      <h3 className="font-heading text-sign-primary text-sm mb-3">Remedies</h3>
                      <ul className="space-y-2">
                        {horoscope.daily.remedies.slice(0, 4).map((r, i) => (
                          <li key={i} className="text-text-muted text-xs flex gap-2"><span className="text-sign-primary">&#10022;</span>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Mantra */}
                {moonRashiData && (
                  <div className="glass-card p-6 text-center">
                    <span className="text-sign-primary/60 text-xs block mb-1">Mantra for {moonRashiData.sanskrit}</span>
                    <p className="text-sign-primary text-sm font-devanagari">{moonRashiData.mantra}</p>
                  </div>
                )}
              </div>
            )}

            {/* ===== TRANSITS TAB ===== */}
            {activeTab === 'transits' && (
              <div className="space-y-6 tab-content-enter" key="transits">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4 text-sm">Current Transit Effects (Gochara)</h3>
                  <div className="space-y-3">
                    {transits.map(t => (
                      <div key={t.planet} className={`p-3 rounded-lg border ${t.isPositive ? 'border-green-500/20 bg-green-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-primary text-sm font-medium">{t.planet} Transit</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${t.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {t.isPositive ? 'Favourable' : 'Challenging'}
                          </span>
                          <span className="text-text-muted text-xs ml-auto">{t.transitSign} ({t.houseFromMoon}th from Moon)</span>
                        </div>
                        <p className="text-text-muted text-xs">{t.effects}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== PLANETS TAB ===== */}
            {activeTab === 'planets' && (
              <div className="space-y-6 tab-content-enter" key="planets">
                {chart.planets && (
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-4 text-sm">Planetary Positions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(chart.planets).map(([planet, data]) => {
                        const benefic = isBeneficForAscendant(planet, chart.ascendant.index);
                        const malefic = planet === dashaMalefic;
                        const houseInfo = getHouseInfo(data.house);
                        return (
                          <div key={planet} className="p-3 rounded-lg bg-cosmic-bg/30 hover-glow transition-all">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full ${malefic ? 'bg-red-400' : benefic ? 'bg-green-400' : 'bg-yellow-400'}`} />
                              <span className="text-text-primary text-sm font-medium">{planet}{data.retrograde ? ' (R)' : ''}</span>
                            </div>
                            <span className="text-text-muted text-xs block">{data.sign} {data.degree}&deg; &bull; House {data.house}</span>
                            {data.nakshatra && <span className="text-text-muted text-xs block">{data.nakshatra}{data.nakshatraPada ? ` Pada ${data.nakshatraPada}` : ''}</span>}
                            {houseInfo && <span className="text-sign-primary/50 text-xs block mt-1">{houseInfo.keywords.slice(0, 2).join(', ')}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {planetAnalysis.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-2 text-sm">Planet Analysis</h3>
                    <p className="text-text-muted text-xs mb-4">Based on {chart.ascendant.name} Ascendant &bull; Most Malefic: <span className="text-red-400">{dashaMalefic}</span></p>
                    <div className="space-y-3">
                      {planetAnalysis.map((a: PlanetAnalysis) => (
                        <div key={a.planet} className={`p-3 rounded-lg border hover-lift transition-all ${a.isMostMalefic ? 'border-red-500/30 bg-red-500/5' : a.isBenefic ? 'border-green-500/20 bg-green-500/5' : 'border-sign-primary/10 bg-cosmic-bg/30'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-text-primary font-medium text-sm">{a.planet}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: a.isMostMalefic ? 'rgba(239,68,68,0.15)' : a.isBenefic ? 'rgba(34,197,94,0.15)' : 'rgba(var(--sign-glow-rgb),0.1)',
                                       color: a.isMostMalefic ? '#f87171' : a.isBenefic ? '#4ade80' : 'var(--sign-primary)' }}>
                              {a.isMostMalefic ? 'Most Malefic' : a.isBenefic ? 'Benefic' : 'Neutral'}
                            </span>
                            <span className="text-text-muted text-xs ml-auto">{a.sign} &bull; House {a.house}</span>
                          </div>
                          <p className="text-text-muted text-xs">{a.interpretation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== WEEKLY TAB ===== */}
            {activeTab === 'weekly' && (
              <div className="space-y-6 tab-content-enter" key="weekly">
                {horoscope?.weekly ? (() => {
                  const w = horoscope.weekly as WeeklyPrediction;
                  return (
                    <>
                      {/* Week Overview */}
                      <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading text-sign-primary">Weekly Report</h3>
                          <span className="text-text-muted text-xs">{w.weekStart} &ndash; {w.weekEnd}</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-sign-primary text-xs font-medium uppercase tracking-wider">Theme: {w.theme}</span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed mb-6">{w.overview}</p>

                        {w.ratings && (
                          <div className="grid grid-cols-5 gap-3">
                            {Object.entries(w.ratings).map(([key, val]) => (
                              <div key={key} className="text-center">
                                <div className="text-sign-primary text-lg font-heading">{val}%</div>
                                <div className="text-text-muted text-xs capitalize">{key}</div>
                                <div className="mt-1 h-1.5 bg-cosmic-bg rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-sign-primary to-sign-dark rounded-full rating-bar-fill-animate" style={{ width: `${val}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Day-by-Day Timeline */}
                      {w.dayHighlights && w.dayHighlights.length > 0 && (
                        <div className="glass-card p-6">
                          <h3 className="font-heading text-sign-primary mb-4 text-sm">Day-by-Day Outlook</h3>
                          <div className="space-y-3">
                            {w.dayHighlights.map((d: DayHighlight, i: number) => {
                              const moodColors: Record<string, string> = {
                                excellent: 'bg-green-400', good: 'bg-blue-400', mixed: 'bg-yellow-400', challenging: 'bg-red-400'
                              };
                              const moodBorders: Record<string, string> = {
                                excellent: 'border-green-500/20 bg-green-500/5', good: 'border-blue-500/20 bg-blue-500/5',
                                mixed: 'border-yellow-500/20 bg-yellow-500/5', challenging: 'border-red-500/20 bg-red-500/5'
                              };
                              return (
                                <div key={i} className={`p-3 rounded-lg border ${moodBorders[d.mood] || 'border-sign-primary/10'}`}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${moodColors[d.mood]}`} />
                                    <span className="text-text-primary font-medium text-sm">{d.dayName}</span>
                                    <span className="text-text-muted text-xs">{d.date}</span>
                                    <span className="text-xs capitalize ml-auto px-2 py-0.5 rounded bg-sign-primary/10 text-sign-primary/80">{d.mood}</span>
                                  </div>
                                  <p className="text-text-muted text-xs mb-2">{d.briefNote}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {d.bestFor.map((a, j) => (
                                      <span key={j} className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{a}</span>
                                    ))}
                                    {d.avoidFor.map((a, j) => (
                                      <span key={`av-${j}`} className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">{a}</span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Best Activities */}
                      {w.bestActivities && w.bestActivities.length > 0 && (
                        <div className="glass-card p-6">
                          <h3 className="font-heading text-sign-primary mb-4 text-sm">Best Days for Activities</h3>
                          <div className="space-y-2">
                            {w.bestActivities.map((a: ActivityRecommendation, i: number) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-cosmic-bg/30 border border-sign-primary/10">
                                <span className="text-sign-primary text-sm">&#10022;</span>
                                <span className="text-text-primary text-sm font-medium min-w-[120px]">{a.activity}</span>
                                <span className="text-sign-primary text-xs px-2 py-0.5 rounded bg-sign-primary/10">{a.bestDay}</span>
                                <span className="text-text-muted text-xs ml-auto">{a.reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Transit Focus + Remedies */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {w.transitFocus && w.transitFocus.length > 0 && (
                          <div className="glass-card p-6">
                            <h3 className="font-heading text-sign-primary mb-3 text-sm">Transit Focus</h3>
                            <ul className="space-y-2">
                              {w.transitFocus.map((t, i) => (
                                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                                  <span className="text-sign-primary mt-0.5">&#9679;</span>{t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {w.remedies && w.remedies.length > 0 && (
                          <div className="glass-card p-6">
                            <h3 className="font-heading text-sign-primary mb-3 text-sm">Weekly Remedies</h3>
                            <ul className="space-y-2">
                              {w.remedies.map((r, i) => (
                                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                                  <span className="text-sign-primary/40 mt-0.5">&#8226;</span>{r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })() : <div className="glass-card p-8"><p className="text-text-muted text-sm">Weekly report not yet available.</p></div>}
              </div>
            )}

            {/* ===== MONTHLY TAB ===== */}
            {activeTab === 'monthly' && (
              <div className="space-y-6 tab-content-enter" key="monthly">
                {horoscope?.monthly ? (() => {
                  const m = horoscope.monthly as MonthlyPrediction;
                  return (
                    <>
                      {/* Monthly Overview */}
                      <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading text-sign-primary">Monthly Report</h3>
                          <span className="text-text-muted text-xs">{m.month}</span>
                        </div>

                        {m.ratings && (
                          <div className="grid grid-cols-5 gap-3 mb-6">
                            {Object.entries(m.ratings).map(([key, val]) => (
                              <div key={key} className="text-center">
                                <div className="text-sign-primary text-lg font-heading">{val}%</div>
                                <div className="text-text-muted text-xs capitalize">{key}</div>
                                <div className="mt-1 h-1.5 bg-cosmic-bg rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-sign-primary to-sign-dark rounded-full rating-bar-fill-animate" style={{ width: `${val}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {m.overview && (
                          <div className="space-y-4">
                            <div><h4 className="text-text-primary font-medium mb-1">General Overview</h4><p className="text-text-muted text-sm leading-relaxed">{m.overview.general}</p></div>
                            <div><h4 className="text-text-primary font-medium mb-1">Career &amp; Profession</h4><p className="text-text-muted text-sm leading-relaxed">{m.overview.career}</p></div>
                            <div><h4 className="text-text-primary font-medium mb-1">Love &amp; Relationships</h4><p className="text-text-muted text-sm leading-relaxed">{m.overview.love}</p></div>
                            <div><h4 className="text-text-primary font-medium mb-1">Health &amp; Wellness</h4><p className="text-text-muted text-sm leading-relaxed">{m.overview.health}</p></div>
                            <div><h4 className="text-text-primary font-medium mb-1">Finance &amp; Wealth</h4><p className="text-text-muted text-sm leading-relaxed">{m.overview.finance}</p></div>
                          </div>
                        )}

                        {m.mantra && (
                          <div className="mt-4 p-3 bg-sign-primary/5 border border-sign-primary/10 rounded-lg">
                            <span className="text-sign-primary/60 text-xs block mb-1">Monthly Mantra</span>
                            <p className="text-sign-primary text-sm font-devanagari">{m.mantra}</p>
                          </div>
                        )}
                      </div>

                      {/* Monthly Phases */}
                      {m.phases && m.phases.length > 0 && (
                        <div className="glass-card p-6">
                          <h3 className="font-heading text-sign-primary mb-4 text-sm">Monthly Phases</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {m.phases.map((p: MonthlyPhase, i: number) => {
                              const phaseColors = ['border-blue-500/20 bg-blue-500/5', 'border-sign-primary/20 bg-sign-primary/5', 'border-purple-500/20 bg-purple-500/5'];
                              return (
                                <div key={i} className={`p-4 rounded-lg border ${phaseColors[i] || phaseColors[0]}`}>
                                  <h4 className="text-text-primary font-medium text-sm mb-1">{p.label}</h4>
                                  <span className="text-text-muted text-xs block mb-2">{p.period}</span>
                                  <span className="text-xs px-2 py-0.5 rounded bg-sign-primary/10 text-sign-primary/80 capitalize mb-2 inline-block">{p.energy}</span>
                                  <p className="text-text-muted text-xs leading-relaxed mt-2">{p.prediction}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Auspicious & Inauspicious Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {m.auspiciousDates && m.auspiciousDates.length > 0 && (
                          <div className="glass-card p-6">
                            <h3 className="font-heading text-green-400 mb-3 text-sm">Auspicious Dates</h3>
                            <div className="space-y-2">
                              {m.auspiciousDates.map((d: AuspiciousDate, i: number) => (
                                <div key={i} className="p-3 rounded-lg border border-green-500/15 bg-green-500/5">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-green-400 text-sm">&#10003;</span>
                                    <span className="text-text-primary text-sm font-medium">{d.date}</span>
                                    <span className="text-text-muted text-xs">({d.dayOfWeek})</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-1">
                                    {d.goodFor.map((g, j) => (
                                      <span key={j} className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{g}</span>
                                    ))}
                                  </div>
                                  <p className="text-text-muted text-xs">{d.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {m.inauspiciousDates && m.inauspiciousDates.length > 0 && (
                          <div className="glass-card p-6">
                            <h3 className="font-heading text-red-400 mb-3 text-sm">Inauspicious Dates</h3>
                            <div className="space-y-2">
                              {m.inauspiciousDates.map((d: InauspiciousDate, i: number) => (
                                <div key={i} className="p-3 rounded-lg border border-red-500/15 bg-red-500/5">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-red-400 text-sm">&#9888;</span>
                                    <span className="text-text-primary text-sm font-medium">{d.date}</span>
                                    <span className="text-text-muted text-xs">({d.dayOfWeek})</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-1">
                                    {d.avoidFor.map((a, j) => (
                                      <span key={j} className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">{a}</span>
                                    ))}
                                  </div>
                                  <p className="text-text-muted text-xs">{d.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Key Transits + Remedies */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {m.keyTransits && m.keyTransits.length > 0 && (
                          <div className="glass-card p-6">
                            <h3 className="font-heading text-sign-primary mb-3 text-sm">Key Transits This Month</h3>
                            <div className="space-y-2">
                              {m.keyTransits.map((t: MonthlyTransit, i: number) => (
                                <div key={i} className={`p-3 rounded-lg border ${t.isPositive ? 'border-green-500/15 bg-green-500/5' : 'border-yellow-500/15 bg-yellow-500/5'}`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-text-primary text-sm font-medium">{t.planet}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${t.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                      {t.isPositive ? 'Favourable' : 'Challenging'}
                                    </span>
                                  </div>
                                  <p className="text-text-muted text-xs mb-1">{t.event}</p>
                                  <p className="text-text-muted text-xs">{t.impact}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {m.remedies && m.remedies.length > 0 && (
                          <div className="glass-card p-6">
                            <h3 className="font-heading text-sign-primary mb-3 text-sm">Monthly Remedies</h3>
                            <ul className="space-y-2">
                              {m.remedies.map((r, i) => (
                                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                                  <span className="text-sign-primary/40 mt-0.5">&#8226;</span>{r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })() : <div className="glass-card p-8"><p className="text-text-muted text-sm">Monthly report not yet available.</p></div>}
              </div>
            )}

            {/* ===== PANCHANGA TAB ===== */}
            {activeTab === 'panchanga' && (
              <div className="space-y-6 tab-content-enter" key="panchanga">
                {horoscope?.panchanga ? (() => {
                  const p = horoscope.panchanga as PanchangaPrediction;
                  return (
                    <>
                      <div className="glass-card p-8">
                        <h3 className="font-heading text-sign-primary mb-2">Panchanga Predictions</h3>
                        <p className="text-text-muted text-xs mb-6">Birth-time Panchanga analysis based on classical Vedic texts (BPHS, Phaladeepika)</p>

                        {/* Weekday of Birth */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-text-primary font-medium">Birth Day: {p.weekdayOfBirth.day}</h4>
                            <span className="text-xs px-2 py-0.5 rounded bg-sign-primary/10 text-sign-primary">Ruling Planet: {p.weekdayOfBirth.planet}</span>
                          </div>
                          <div className="p-4 rounded-lg bg-sign-primary/5 border border-sign-primary/10">
                            {p.weekdayOfBirth.prediction.split('\n\n').map((para, i) => (
                              <p key={i} className="text-text-muted text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                            ))}
                          </div>
                        </div>

                        {/* Birth Nakshatra */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-text-primary font-medium">Birth Nakshatra: {p.birthNakshatra.name}</h4>
                          </div>
                          <div className="p-4 rounded-lg bg-sign-primary/5 border border-sign-primary/10">
                            {p.birthNakshatra.prediction.split('\n\n').map((para, i) => (
                              <p key={i} className="text-text-muted text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                            ))}
                          </div>
                        </div>

                        {/* Birth Tithi */}
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-text-primary font-medium">Birth Tithi: {p.birthTithi.name || 'Based on birth date'}</h4>
                          </div>
                          <div className="p-4 rounded-lg bg-sign-primary/5 border border-sign-primary/10">
                            {p.birthTithi.prediction.split('\n\n').map((para, i) => (
                              <p key={i} className="text-text-muted text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })() : <div className="glass-card p-8"><p className="text-text-muted text-sm">Panchanga predictions not yet available.</p></div>}
              </div>
            )}

            {/* ===== HOUSES TAB ===== */}
            {activeTab === 'houses' && (
              <div className="space-y-4 tab-content-enter" key="houses">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-2">12 Bhava (House) Analysis</h3>
                  <p className="text-text-muted text-xs mb-4">Planetary placements in houses for {chart.ascendant.name} Ascendant</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(houseNum => {
                    const houseInfo = getHouseInfo(houseNum);
                    const houseSignIndex = (chart.ascendant.index + houseNum - 1) % 12;
                    const planetsInHouse = chart.planets ? Object.entries(chart.planets).filter(([, d]) => d.house === houseNum).map(([name]) => name) : [];
                    return (
                      <div key={houseNum} className={`glass-card p-4 ${planetsInHouse.length > 0 ? 'border border-sign-primary/20' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-sign-primary font-medium text-sm">{houseInfo?.name}</h4>
                            <span className="text-text-muted text-xs">{signNames[houseSignIndex]} ({hindiSignNames[houseSignIndex]})</span>
                          </div>
                          {planetsInHouse.length > 0 && (
                            <div className="flex gap-1">
                              {planetsInHouse.map(p => (
                                <span key={p} className={`text-xs px-1.5 py-0.5 rounded ${
                                  p === dashaMalefic ? 'bg-red-500/20 text-red-400' :
                                  isBeneficForAscendant(p, chart.ascendant.index) ? 'bg-green-500/20 text-green-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>{p}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {houseInfo?.keywords.map(kw => (
                            <span key={kw} className="text-xs text-sign-primary/60 bg-sign-primary/5 px-1.5 py-0.5 rounded">{kw}</span>
                          ))}
                        </div>
                        <p className="text-text-muted text-xs">{houseInfo?.description}</p>
                        {planetsInHouse.length > 0 && chart.planets && (
                          <div className="mt-2 pt-2 border-t border-sign-primary/10">
                            {planetsInHouse.map(p => {
                              const pData = chart.planets[p];
                              return (
                                <p key={p} className="text-text-muted text-xs">
                                  <span className="text-text-primary">{p}</span> at {pData.degree}&deg; in {pData.nakshatra} {pData.nakshatraPada ? `(Pada ${pData.nakshatraPada})` : ''}
                                  {pData.retrograde && <span className="text-yellow-400 ml-1">(R)</span>}
                                </p>
                              );
                            })}
                          </div>
                        )}
                        {horoscope?.bhava && (() => {
                          const bhavaForHouse = (horoscope.bhava as BhavaPrediction[]).find(b => b.house === houseNum);
                          if (!bhavaForHouse) return null;
                          return (
                            <div className="mt-2 pt-2 border-t border-sign-primary/10">
                              <p className="text-text-muted text-xs mb-1"><span className="text-sign-primary/60">Lord:</span> {bhavaForHouse.lordPlanet} in House {bhavaForHouse.lordPlacedIn}</p>
                              <p className="text-text-muted text-xs leading-relaxed">{bhavaForHouse.prediction}</p>
                              {bhavaForHouse.aspects.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {bhavaForHouse.aspects.map((a, ai) => (
                                    <span key={ai} className="text-xs text-sign-primary/50 bg-sign-primary/5 px-1 py-0.5 rounded">Aspected by {a}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== YOGAS TAB ===== */}
            {activeTab === 'yogas' && (
              <div className="space-y-6 tab-content-enter" key="yogas">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-2">Planetary Yogas in Your Chart</h3>
                  <p className="text-text-muted text-xs mb-4">{yogas.length} yoga{yogas.length !== 1 ? 's' : ''} identified based on planetary positions</p>

                  {yogas.length === 0 ? (
                    <p className="text-text-muted text-sm">No major yogas identified in this chart configuration.</p>
                  ) : (
                    <div className="space-y-4">
                      {yogas.map((y, i) => (
                        <div key={`${y.name}-${i}`} className={`p-4 rounded-lg border ${
                          y.strength === 'strong' ? 'border-green-500/30 bg-green-500/5' :
                          y.strength === 'moderate' ? 'border-sign-primary/20 bg-sign-primary/5' :
                          'border-sign-primary/10 bg-cosmic-bg/30'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-text-primary font-medium">{y.name}</span>
                            {y.sanskrit !== y.name && <span className="text-sign-primary/60 text-xs">({y.sanskrit})</span>}
                            <span className={`text-xs px-2 py-0.5 rounded ml-auto ${
                              y.strength === 'strong' ? 'bg-green-500/20 text-green-400' :
                              y.strength === 'moderate' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>{y.strength}</span>
                            <span className="text-xs text-text-muted capitalize">{y.type.replace('_', ' ')}</span>
                          </div>
                          <p className="text-text-muted text-sm mb-2">{y.description}</p>
                          <p className="text-text-primary text-sm">{y.effects}</p>
                          <div className="mt-2 flex gap-1.5">
                            {y.planets.map(p => (
                              <span key={p} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-0.5 rounded">{p}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== DOSHAS TAB ===== */}
            {activeTab === 'doshas' && (
              <div className="space-y-6 tab-content-enter" key="doshas">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-2">Dosha Analysis</h3>
                  <p className="text-text-muted text-xs mb-4">Assessment of major doshas in your birth chart</p>
                  <div className="space-y-4">
                    {doshas.map(d => (
                      <div key={d.name} className={`p-4 rounded-lg border ${
                        !d.detected ? 'border-green-500/20 bg-green-500/5' :
                        d.severity === 'severe' ? 'border-red-500/30 bg-red-500/5' :
                        d.severity === 'moderate' ? 'border-yellow-500/20 bg-yellow-500/5' :
                        'border-yellow-500/10 bg-yellow-500/5'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-text-primary font-medium">{d.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            !d.detected ? 'bg-green-500/20 text-green-400' :
                            d.severity === 'severe' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>{d.detected ? d.severity : 'Not Present'}</span>
                        </div>
                        <p className="text-text-muted text-sm mb-2">{d.description}</p>
                        {d.detected && <p className="text-text-muted text-xs mb-3">{d.details}</p>}
                        {d.detected && d.remedies.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-sign-primary/10">
                            <h4 className="text-sign-primary/60 text-xs mb-2">Remedies</h4>
                            <ul className="space-y-1">
                              {d.remedies.map((r, i) => (
                                <li key={i} className="text-text-muted text-xs flex items-start gap-2"><span className="text-sign-primary/40 mt-0.5">&#8226;</span>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sade Sati */}
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-3">Sade Sati Status</h3>
                  <div className={`p-4 rounded-lg border ${sadeSati.active ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/20 bg-green-500/5'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-text-primary font-medium">
                        {sadeSati.active ? `Sade Sati Active — ${sadeSati.phase} phase` : 'Sade Sati Not Active'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${sadeSati.active ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {sadeSati.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm">{sadeSati.description}</p>
                    {sadeSati.remedies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-sign-primary/10">
                        <h4 className="text-sign-primary/60 text-xs mb-2">Remedies</h4>
                        <ul className="space-y-1">
                          {sadeSati.remedies.map((r, i) => (
                            <li key={i} className="text-text-muted text-xs flex items-start gap-2"><span className="text-sign-primary/40 mt-0.5">&#8226;</span>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== DASHA TAB ===== */}
            {activeTab === 'dasha' && (
              <div className="space-y-6 tab-content-enter" key="dasha">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-2">Vimshottari Dasha Timeline</h3>
                  <p className="text-text-muted text-xs mb-4">Click on any Mahadasha to see its Antardasha (sub-periods)</p>
                  <div className="space-y-2">
                    {enhancedDashas.map(d => (
                      <div key={d.planet}>
                        <button onClick={() => setExpandedDasha(expandedDasha === d.planet ? null : d.planet)}
                          className={`w-full text-left p-4 rounded-lg transition-all ${d.isCurrent ? 'bg-sign-primary/10 border border-sign-primary/30' : 'bg-cosmic-bg/30 hover:bg-cosmic-bg/50'}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-text-primary font-medium">{d.planet} Mahadasha</span>
                              {d.isCurrent && <span className="text-xs bg-sign-primary/20 text-sign-primary px-2 py-0.5 rounded">Current</span>}
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                d.rating === 'excellent' ? 'bg-green-500/20 text-green-400' :
                                d.rating === 'favourable' ? 'bg-blue-500/20 text-blue-400' :
                                d.rating === 'mixed' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>{d.rating}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-text-muted text-sm">{d.startYear} - {d.endYear}</span>
                              <span className="text-sign-primary/60">{expandedDasha === d.planet ? '\u25BC' : '\u25B6'}</span>
                            </div>
                          </div>
                          <p className="text-text-muted text-xs mt-1">{d.ratingReason}</p>
                        </button>
                        {expandedDasha === d.planet && d.antardashas && (
                          <div className="ml-6 mt-2 space-y-1 mb-3">
                            <p className="text-sign-primary/60 text-xs mb-2">Antardasha (Sub-periods):</p>
                            {d.antardashas.map(ad => (
                              <div key={`${d.planet}-${ad.planet}`}
                                className={`flex justify-between items-center p-2.5 rounded text-sm ${ad.isCurrent ? 'bg-sign-primary/10 border border-sign-primary/20' : 'bg-cosmic-bg/20'}`}>
                                <div className="flex items-center gap-2">
                                  <span className="text-text-primary text-xs font-medium">{d.planet}/{ad.planet}</span>
                                  {ad.isCurrent && <span className="text-xs bg-sign-primary/20 text-sign-primary px-1.5 py-0.5 rounded">Active</span>}
                                </div>
                                <span className="text-text-muted text-xs">{ad.startMonth}/{ad.startYear} - {ad.endMonth}/{ad.endYear}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Period Assessment Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['excellent', 'favourable', 'mixed', 'challenging'] as const).map(rating => {
                      const count = enhancedDashas.filter(d => d.rating === rating).length;
                      const colors = {
                        excellent: 'bg-green-500/10 text-green-400 border-green-500/20',
                        favourable: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                        mixed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                        challenging: 'bg-red-500/10 text-red-400 border-red-500/20',
                      };
                      return (
                        <div key={rating} className={`p-3 rounded-lg border text-center ${colors[rating]}`}>
                          <span className="text-2xl font-heading">{count}</span>
                          <span className="text-xs block capitalize mt-1">{rating} periods</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ===== GEMSTONES TAB ===== */}
            {activeTab === 'gems' && (
              <div className="space-y-6 tab-content-enter" key="gems">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Gemstone Recommendations</h3>
                  <div className="space-y-4">
                    {gemstones.map((g, i) => (
                      <div key={g.planet} className={`p-4 rounded-lg border ${i === 0 ? 'border-sign-primary/30 bg-sign-primary/5' : 'border-sign-primary/10 bg-cosmic-bg/30'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-text-primary font-medium">{g.primaryGem}</span>
                          {i === 0 && <span className="text-xs bg-sign-primary/20 text-sign-primary px-2 py-0.5 rounded">Primary</span>}
                          <span className="text-text-muted text-xs ml-auto">For {g.planet}</span>
                        </div>
                        <p className="text-text-muted text-sm mb-3">{g.reason}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div><span className="text-text-muted text-xs block">Weight</span><span className="text-text-primary text-sm">{g.weight}</span></div>
                          <div><span className="text-text-muted text-xs block">Metal</span><span className="text-text-primary text-sm">{g.metal}</span></div>
                          <div><span className="text-text-muted text-xs block">Finger</span><span className="text-text-primary text-sm">{g.finger}</span></div>
                          <div><span className="text-text-muted text-xs block">Starting Day</span><span className="text-text-primary text-sm">{g.startingDay}</span></div>
                        </div>
                        <div className="mb-2">
                          <span className="text-text-muted text-xs block mb-1">Alternative</span>
                          <span className="text-text-primary text-sm">{g.alternativeGem}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-text-muted text-xs block mb-1">Activation Mantra</span>
                          <p className="text-sign-primary text-sm font-devanagari">{g.mantra}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-sign-primary/10">
                          <span className="text-yellow-400/60 text-xs block mb-1">Precautions</span>
                          <ul className="space-y-0.5">
                            {g.precautions.map((p, j) => (
                              <li key={j} className="text-text-muted text-xs flex items-start gap-2"><span className="text-yellow-400/40 mt-0.5">&#8226;</span>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mantras */}
                {moonRashiData && nakshatraData && (
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-4">Mantras</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-sign-primary/5 border border-sign-primary/10">
                        <span className="text-sign-primary/60 text-xs block mb-1">Rashi Beej Mantra ({moonRashiData.name})</span>
                        <p className="text-sign-primary font-devanagari text-lg">{moonRashiData.mantra}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-sign-primary/5 border border-sign-primary/10">
                        <span className="text-sign-primary/60 text-xs block mb-1">Nakshatra Mantra ({chart.nakshatra})</span>
                        <p className="text-sign-primary font-devanagari text-lg">{nakshatraData.mantra}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
