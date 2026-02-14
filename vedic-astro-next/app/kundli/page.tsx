'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { usePetalConfetti } from '@/components/ui/PetalConfetti';
import { getPlanetEmoji, getPlanetSanskrit } from '@/lib/navagraha';
import { getRashiEmojiByName } from '@/lib/rashi-emoji';
import { getAuspiciousMarker } from '@/lib/shubh-ashubh';
import BirthDatePicker from '@/components/ui/BirthDatePicker';
import BirthTimePicker from '@/components/ui/BirthTimePicker';
import CityAutocomplete from '@/components/ui/CityAutocomplete';
import {
  computeFullChart, type FullChartResult,
  planetNames, calculateNavamsaSign, calculateNakshatraPada,
  signNames, hindiSignNames, calculateDashaWithRatings,
} from '@/lib/kundli-calc';
import { generateNorthIndianChart, generateSouthIndianChart, generateEastIndianChart, generateWestIndianChart } from '@/lib/chart-svg';
import {
  isBeneficForAscendant, getMostMalefic, getHouseInfo,
  generatePlanetAnalysis, nakshatraDetails, rashiDetails,
  houseSignifications,
} from '@/lib/horoscope-data';
import { identifyYogas } from '@/lib/yoga-calc';
import { analyzeAllDoshas } from '@/lib/dosha-calc';
import { recommendGemstones } from '@/lib/gemstone-calc';
import { analyzeTransits, detectSadeSati } from '@/lib/transit-calc';
import { generateKundliReport, ReportData } from '@/lib/report-generator';
import { Planet, DashaWithAntardasha, PlanetAnalysis, YogaResult, DoshaResult, GemstoneRecommendation, TransitPrediction, SadeSatiResult } from '@/types';

type TabKey = 'chart' | 'profile' | 'personality' | 'houses' | 'planets' | 'dasha' | 'yogas' | 'doshas' | 'remedies';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'chart', label: 'Chart', icon: '☰' },
  { key: 'profile', label: 'Profile', icon: '☉' },
  { key: 'personality', label: 'Personality', icon: '☽' },
  { key: 'houses', label: 'Houses', icon: '⌂' },
  { key: 'planets', label: 'Planets', icon: '♃' },
  { key: 'dasha', label: 'Dasha', icon: '⏳' },
  { key: 'yogas', label: 'Yogas', icon: '✦' },
  { key: 'doshas', label: 'Doshas', icon: '⚠' },
  { key: 'remedies', label: 'Remedies', icon: '💎' },
];

interface KundliResult {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  moonData: FullChartResult['moonData'];
  ascendant: FullChartResult['ascendant'];
  positions: Record<string, Planet>;
  dashas: DashaWithAntardasha[];
  tithi: string;
  yoga: string;
  karana: string;
  sunSign: string;
  chartStyle: string;
  yogas: YogaResult[];
  doshas: DoshaResult[];
  gemstones: GemstoneRecommendation[];
  transits: TransitPrediction[];
  sadeSati: SadeSatiResult;
  planetAnalysis: PlanetAnalysis[];
}

export default function KundliPage() {
  const [result, setResult] = useState<KundliResult | null>(null);
  const [chartStyle, setChartStyle] = useState('north');
  const [activeTab, setActiveTab] = useState<TabKey>('chart');
  const [expandedDasha, setExpandedDasha] = useState<string | null>(null);
  const triggerPetals = usePetalConfetti();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const birthDate = (form.elements.namedItem('birth-date') as HTMLInputElement).value;
    const birthTime = (form.elements.namedItem('birth-time') as HTMLInputElement).value;
    const birthPlace = (form.elements.namedItem('birth-place') as HTMLInputElement).value.trim();
    const style = (form.elements.namedItem('chart-style') as HTMLSelectElement).value;

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    const placeOpts = { place: birthPlace };
    const fullChart = computeFullChart(birthDate, birthTime, placeOpts);
    const { moonData, ascendant, positions } = fullChart;
    const dashas = calculateDashaWithRatings(birthDate, moonData.nakshatra, ascendant.signIndex);

    // Build VedicChart for planet analysis
    const vedicChart = {
      moonSign: { name: moonData.sign, hindi: moonData.signHindi, symbol: moonData.symbol, index: moonData.signIndex },
      sunSign: { name: positions['Sun'].sign, hindi: '', symbol: '' },
      ascendant: { name: ascendant.sign, hindi: ascendant.signHindi, symbol: ascendant.symbol, index: ascendant.signIndex },
      nakshatra: moonData.nakshatra,
      nakshatraPada: moonData.nakshatraPada,
      planets: Object.fromEntries(Object.entries(positions).map(([k, v]) => {
        const navSign = calculateNavamsaSign(v.signIndex, v.nakshatraPada);
        return [k, { sign: v.sign, signIndex: v.signIndex, signHindi: v.signHindi, house: v.house, degree: v.degree, nakshatra: v.nakshatra, nakshatraPada: v.nakshatraPada, retrograde: v.retrograde, navamsaSign: signNames[navSign], navamsaSignHindi: hindiSignNames[navSign] }];
      })),
      birthDetails: { date: birthDate, time: birthTime, place: birthPlace },
    };

    const yogas = identifyYogas(positions, ascendant.signIndex);
    const doshas = analyzeAllDoshas(positions, ascendant.signIndex);
    const gemstones = recommendGemstones(positions, ascendant.signIndex);
    const transits = analyzeTransits(moonData.signIndex);
    const sadeSati = detectSadeSati(moonData.signIndex);
    const planetAnalysis = generatePlanetAnalysis(vedicChart);

    setResult({
      name, birthDate, birthTime, birthPlace, moonData, ascendant, positions,
      dashas, tithi: fullChart.tithi,
      yoga: fullChart.yoga,
      karana: fullChart.karana,
      sunSign: positions['Sun'].sign,
      chartStyle: style, yogas, doshas, gemstones, transits, sadeSati, planetAnalysis,
    });
    setChartStyle(style);
    setActiveTab('chart');
    triggerPetals();
  }

  const generateChart = (positions: Record<string, Planet>, ascIdx: number, mode: 'rashi' | 'navamsa') => {
    switch (chartStyle) {
      case 'north': return generateNorthIndianChart(positions, ascIdx, mode);
      case 'east': return generateEastIndianChart(positions, ascIdx, mode);
      case 'west': return generateWestIndianChart(positions, ascIdx, mode);
      default: return generateSouthIndianChart(positions, ascIdx, mode);
    }
  };
  const chartSvg = result ? generateChart(result.positions, result.ascendant.signIndex, 'rashi') : '';

  const moonNakshatraData = result ? nakshatraDetails[result.moonData.nakshatra] : null;
  const moonRashiData = result ? rashiDetails[result.moonData.signIndex] : null;
  const ascRashiData = result ? rashiDetails[result.ascendant.signIndex] : null;

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="कुण्डली" title="Free Kundli Generator" description="Generate your complete Vedic birth chart with detailed analysis" emoji="📜" kalash />

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-text-muted text-sm block mb-1">Full Name</label><input type="text" name="name" required className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow" /></div>
              <div><label className="text-text-muted text-sm block mb-1">Email ID</label><input type="email" name="email" required pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}" title="Enter a valid email address (e.g. name@example.com)" className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-text-muted text-sm block mb-1">Date of Birth</label><BirthDatePicker name="birth-date" required /></div>
              <div><label className="text-text-muted text-sm block mb-1">Time of Birth</label><BirthTimePicker name="birth-time" required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-text-muted text-sm block mb-1">Place of Birth</label><CityAutocomplete name="birth-place" required /></div>
              <div><label className="text-text-muted text-sm block mb-1">Chart Style</label>
                <select name="chart-style" className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow">
                  <option value="north">North Indian</option><option value="south">South Indian</option><option value="east">East Indian</option><option value="west">West Indian</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all">Generate Kundli</button>
          </form>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <h2 className="font-heading text-2xl text-sign-primary">{result.name}&apos;s Vedic Birth Chart</h2>
              <button
                onClick={() => {
                  if (!result || !moonRashiData || !moonNakshatraData || !ascRashiData) return;
                  const reportData: ReportData = {
                    name: result.name,
                    birthDate: result.birthDate,
                    birthTime: result.birthTime,
                    birthPlace: result.birthPlace,
                    moonSign: result.moonData.sign,
                    moonSignHindi: result.moonData.signHindi,
                    ascendant: result.ascendant.sign,
                    ascendantHindi: result.ascendant.signHindi,
                    ascendantSignIndex: result.ascendant.signIndex,
                    nakshatra: result.moonData.nakshatra,
                    nakshatraPada: result.moonData.nakshatraPada,
                    sunSign: result.sunSign,
                    tithi: result.tithi,
                    yoga: result.yoga,
                    karana: result.karana,
                    positions: result.positions,
                    dashas: result.dashas,
                    planetAnalysis: result.planetAnalysis,
                    yogas: result.yogas,
                    doshas: result.doshas,
                    gemstones: result.gemstones,
                    transits: result.transits,
                    sadeSati: result.sadeSati,
                    rashiData: moonRashiData,
                    nakshatraData: moonNakshatraData,
                    ascRashiData: ascRashiData,
                  };
                  generateKundliReport(reportData);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg hover:opacity-90 transition-opacity"
              >
                Download Full Report (PDF)
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 justify-center bg-cosmic-bg/50 rounded-xl p-1.5 border border-sign-primary/10">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-sign-primary/20 text-sign-primary border border-sign-primary/40 shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-sign-primary/5'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>

            {/* ===== CHART TAB ===== */}
            {activeTab === 'chart' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { label: 'Moon Sign', value: `${result.moonData.symbol} ${result.moonData.signHindi}` },
                    { label: 'Nakshatra', value: result.moonData.nakshatra },
                    { label: 'Pada', value: `${result.moonData.nakshatraPada}` },
                    { label: 'Ascendant', value: `${result.ascendant.symbol} ${result.ascendant.signHindi}` },
                    { label: 'Sun Sign', value: `${getRashiEmojiByName(result.sunSign)} ${result.sunSign}` },
                    { label: 'Tithi', value: result.tithi, marker: getAuspiciousMarker('tithi', result.tithi) },
                    { label: 'Yoga', value: result.yoga, marker: getAuspiciousMarker('yoga', result.yoga) },
                    { label: 'Nakshatra Lord', value: moonNakshatraData?.ruler || '-' },
                  ].map((b, i) => (
                    <div key={b.label} className="glass-card hover-lift p-3 text-center animate-fade-up" style={{ '--stagger': i } as React.CSSProperties}>
                      <span className="text-sign-primary/60 text-xs block">{b.label}</span>
                      <span className="text-sign-primary text-sm font-medium">{b.value}</span>
                      {'marker' in b && b.marker && (
                        <span className={`text-[10px] block mt-0.5 ${b.marker.className}`}>{b.marker.emoji} {b.marker.labelHindi}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-center">
                  {['north', 'south', 'east', 'west'].map(s => (
                    <button key={s} onClick={() => setChartStyle(s)}
                      className={`px-4 py-2 rounded text-sm capitalize ${chartStyle === s ? 'bg-sign-primary/20 text-sign-primary border border-sign-primary/40' : 'text-text-muted'}`}>
                      {s} Indian
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-4 text-center">Rashi Chart (D-1)</h3>
                    <div className="max-w-[350px] mx-auto" dangerouslySetInnerHTML={{ __html: chartSvg }} />
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-4 text-center">Navamsa Chart (D-9)</h3>
                    <div className="max-w-[350px] mx-auto" dangerouslySetInnerHTML={{ __html: generateChart(result.positions, result.ascendant.signIndex, 'navamsa') }} />
                  </div>
                </div>
              </div>
            )}

            {/* ===== PROFILE TAB ===== */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Birth Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Name', value: result.name },
                      { label: 'Date of Birth', value: new Date(result.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                      { label: 'Time of Birth', value: result.birthTime },
                      { label: 'Place of Birth', value: result.birthPlace },
                    ].map(item => (
                      <div key={item.label}>
                        <span className="text-text-muted text-xs block">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Panchanga Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: 'Tithi', value: result.tithi },
                      { label: 'Nakshatra', value: `${result.moonData.nakshatra} (Pada ${result.moonData.nakshatraPada})` },
                      { label: 'Yoga', value: result.yoga },
                      { label: 'Karana', value: result.karana },
                      { label: 'Nakshatra Lord', value: moonNakshatraData?.ruler || '-' },
                    ].map(item => (
                      <div key={item.label}>
                        <span className="text-text-muted text-xs block">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6">
                    <h4 className="text-sign-primary text-sm font-medium mb-3">Moon Sign (Rashi)</h4>
                    <p className="text-text-primary text-lg font-heading mb-1">{result.moonData.symbol} {result.moonData.sign} ({result.moonData.signHindi})</p>
                    <p className="text-text-muted text-xs">Ruler: {moonRashiData?.ruler}</p>
                    <p className="text-text-muted text-xs">Element: {moonRashiData?.element}</p>
                    <p className="text-text-muted text-xs">Quality: {moonRashiData?.quality}</p>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="text-sign-primary text-sm font-medium mb-3">Ascendant (Lagna)</h4>
                    <p className="text-text-primary text-lg font-heading mb-1">{result.ascendant.symbol} {result.ascendant.sign} ({result.ascendant.signHindi})</p>
                    <p className="text-text-muted text-xs">Ruler: {ascRashiData?.ruler}</p>
                    <p className="text-text-muted text-xs">Element: {ascRashiData?.element}</p>
                    <p className="text-text-muted text-xs">Quality: {ascRashiData?.quality}</p>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="text-sign-primary text-sm font-medium mb-3">Birth Star (Nakshatra)</h4>
                    <p className="text-text-primary text-lg font-heading mb-1">{result.moonData.nakshatra}</p>
                    <p className="text-text-muted text-xs">Deity: {moonNakshatraData?.deity}</p>
                    <p className="text-text-muted text-xs">Symbol: {moonNakshatraData?.symbol}</p>
                    <p className="text-text-muted text-xs">Nature: {moonNakshatraData?.nature}</p>
                  </div>
                </div>

                {/* Transit Summary */}
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Current Transits</h3>
                  {result.sadeSati.active && (
                    <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                      <span className="text-red-400 font-medium text-sm">Sade Sati Active — {result.sadeSati.phase} phase</span>
                      <p className="text-text-muted text-xs mt-1">{result.sadeSati.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.transits.slice(0, 3).map(t => (
                      <div key={t.planet} className={`p-3 rounded-lg border ${t.isPositive ? 'border-green-500/20 bg-green-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-primary text-sm font-medium">{getPlanetEmoji(t.planet)} {t.planet}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${t.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {t.isPositive ? 'Favourable' : 'Challenging'}
                          </span>
                        </div>
                        <p className="text-text-muted text-xs">In {t.transitSign} ({t.houseFromMoon}th from Moon)</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== PERSONALITY TAB ===== */}
            {activeTab === 'personality' && moonRashiData && moonNakshatraData && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-3">Rashi Characteristics — {moonRashiData.name} ({moonRashiData.sanskrit})</h3>
                  <p className="text-text-muted text-sm mb-4">{moonRashiData.characteristics}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-green-400 text-xs font-medium mb-2">Strengths</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {moonRashiData.strengths.map(s => (
                          <span key={s} className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-yellow-400 text-xs font-medium mb-2">Challenges</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {moonRashiData.challenges.map(c => (
                          <span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-3">Nakshatra Profile — {result.moonData.nakshatra}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div><span className="text-text-muted text-xs block">Deity</span><span className="text-text-primary text-sm">{moonNakshatraData.deity}</span></div>
                    <div><span className="text-text-muted text-xs block">Symbol</span><span className="text-text-primary text-sm">{moonNakshatraData.symbol}</span></div>
                    <div><span className="text-text-muted text-xs block">Nature</span><span className="text-text-primary text-sm">{moonNakshatraData.nature}</span></div>
                    <div><span className="text-text-muted text-xs block">Ruler</span><span className="text-text-primary text-sm">{moonNakshatraData.ruler}</span></div>
                  </div>
                  <p className="text-text-muted text-sm mb-3">{moonNakshatraData.qualities}</p>
                  <div>
                    <h4 className="text-sign-primary/60 text-xs mb-2">Suitable Careers</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {moonNakshatraData.careers.map(c => (
                        <span key={c} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {ascRashiData && ascRashiData !== moonRashiData && (
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-3">Ascendant Personality — {ascRashiData.name} ({ascRashiData.sanskrit})</h3>
                    <p className="text-text-muted text-sm mb-4">{ascRashiData.characteristics}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-green-400 text-xs font-medium mb-2">Strengths</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {ascRashiData.strengths.map(s => (
                            <span key={s} className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-yellow-400 text-xs font-medium mb-2">Challenges</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {ascRashiData.challenges.map(c => (
                            <span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-3">Career Aptitude</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-text-muted text-xs mb-2">Based on Moon Sign ({moonRashiData.name})</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {moonRashiData.career.map(c => (
                          <span key={c} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{c}</span>
                        ))}
                      </div>
                    </div>
                    {ascRashiData && (
                      <div>
                        <h4 className="text-text-muted text-xs mb-2">Based on Ascendant ({ascRashiData.name})</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {ascRashiData.career.map(c => (
                            <span key={c} className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== HOUSES TAB ===== */}
            {activeTab === 'houses' && (
              <div className="space-y-4">
                <p className="text-text-muted text-sm text-center mb-2">12 Bhavas (Houses) with planetary placements for {result.ascendant.sign} Ascendant</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(houseNum => {
                    const houseInfo = getHouseInfo(houseNum);
                    const planetsInHouse = planetNames.filter(p => result.positions[p]?.house === houseNum);
                    const houseSignIndex = (result.ascendant.signIndex + houseNum - 1) % 12;
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
                                  p === getMostMalefic(result.ascendant.signIndex) ? 'bg-red-500/20 text-red-400' :
                                  isBeneficForAscendant(p, result.ascendant.signIndex) ? 'bg-green-500/20 text-green-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>{getPlanetEmoji(p)} {p}</span>
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
                        {planetsInHouse.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-sign-primary/10">
                            {planetsInHouse.map(p => {
                              const pData = result.positions[p];
                              return (
                                <p key={p} className="text-text-muted text-xs">
                                  <span className="text-text-primary">{p}</span> at {pData.degree}&deg; in {pData.nakshatra} (Pada {pData.nakshatraPada})
                                  {pData.retrograde && <span className="text-yellow-400 ml-1">(R)</span>}
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== PLANETS TAB ===== */}
            {activeTab === 'planets' && (
              <div className="space-y-6">
                <div className="glass-card p-6 overflow-x-auto">
                  <h3 className="font-heading text-sign-primary mb-4">Planet Positions</h3>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-sign-primary/20">
                      <th className="text-left py-2 text-sign-primary/80">Planet</th>
                      <th className="text-left py-2 text-sign-primary/80">Sign</th>
                      <th className="text-left py-2 text-sign-primary/80">Degree</th>
                      <th className="text-left py-2 text-sign-primary/80">House</th>
                      <th className="text-left py-2 text-sign-primary/80">Nakshatra</th>
                      <th className="text-left py-2 text-sign-primary/80">Pada</th>
                      <th className="text-left py-2 text-sign-primary/80">Navamsa</th>
                      <th className="text-left py-2 text-sign-primary/80">Nature</th>
                    </tr></thead>
                    <tbody>
                      {planetNames.map(planet => {
                        const d = result.positions[planet];
                        const benefic = isBeneficForAscendant(planet, result.ascendant.signIndex);
                        const malefic = planet === getMostMalefic(result.ascendant.signIndex);
                        const navamsaSign = calculateNavamsaSign(d.signIndex, d.nakshatraPada);
                        return (
                          <tr key={planet} className="border-b border-sign-primary/10">
                            <td className="py-2 text-text-primary font-medium"><span className="mr-1">{getPlanetEmoji(planet)}</span>{planet}{d.retrograde ? ' (R)' : ''}</td>
                            <td className="py-2 text-text-muted">{d.signHindi} ({d.sign})</td>
                            <td className="py-2 text-text-muted">{d.degree}&deg;</td>
                            <td className="py-2 text-text-muted">{d.house}</td>
                            <td className="py-2 text-text-muted">{d.nakshatra}</td>
                            <td className="py-2 text-sign-primary">{d.nakshatraPada}</td>
                            <td className="py-2 text-text-muted">{signNames[navamsaSign]} ({hindiSignNames[navamsaSign]})</td>
                            <td className="py-2">
                              {malefic ? <span className="text-red-400 font-medium">Most Malefic</span>
                                : benefic ? <span className="text-green-400 font-medium">Benefic</span>
                                : <span className="text-yellow-400">Neutral</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {result.planetAnalysis.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-heading text-sign-primary mb-4">Planet Analysis</h3>
                    <p className="text-text-muted text-xs mb-4">Based on {result.ascendant.sign} Ascendant &bull; Most Malefic: <span className="text-red-400">{getMostMalefic(result.ascendant.signIndex)}</span></p>
                    <div className="space-y-3">
                      {result.planetAnalysis.map((a: PlanetAnalysis) => (
                        <div key={a.planet} className={`p-4 rounded-lg border ${a.isMostMalefic ? 'border-red-500/30 bg-red-500/5' : a.isBenefic ? 'border-green-500/20 bg-green-500/5' : 'border-sign-primary/10 bg-cosmic-bg/30'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-text-primary font-medium"><span className="mr-1">{getPlanetEmoji(a.planet)}</span>{a.planet} <span className="text-text-muted text-xs font-normal">({getPlanetSanskrit(a.planet)})</span></span>
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: a.isMostMalefic ? 'rgba(239,68,68,0.15)' : a.isBenefic ? 'rgba(34,197,94,0.15)' : 'rgba(var(--sign-glow-rgb),0.1)',
                                       color: a.isMostMalefic ? '#f87171' : a.isBenefic ? '#4ade80' : 'var(--sign-primary)' }}>
                              {a.isMostMalefic ? 'Most Malefic' : a.isBenefic ? 'Functional Benefic' : 'Neutral'}
                            </span>
                            <span className="text-text-muted text-xs ml-auto">{a.sign} &bull; House {a.house}</span>
                          </div>
                          <p className="text-text-muted text-sm">{a.interpretation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== DASHA TAB ===== */}
            {activeTab === 'dasha' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Vimshottari Dasha Timeline</h3>
                  <p className="text-text-muted text-xs mb-4">Click on any Mahadasha to see its Antardasha (sub-periods)</p>
                  <div className="space-y-2">
                    {result.dashas.map(d => (
                      <div key={d.planet}>
                        <button
                          onClick={() => setExpandedDasha(expandedDasha === d.planet ? null : d.planet)}
                          className={`w-full text-left p-4 rounded-lg transition-all ${
                            d.isCurrent ? 'bg-sign-primary/10 border border-sign-primary/30' : 'bg-cosmic-bg/30 hover:bg-cosmic-bg/50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-text-primary font-medium"><span className="mr-1">{getPlanetEmoji(d.planet)}</span>{d.planet} Mahadasha</span>
                              {d.isCurrent && <span className="text-xs bg-sign-primary/20 text-sign-primary px-2 py-0.5 rounded">Current</span>}
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                d.rating === 'excellent' ? 'bg-green-500/20 text-green-400' :
                                d.rating === 'favourable' ? 'bg-blue-500/20 text-blue-400' :
                                d.rating === 'mixed' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {d.rating}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-text-muted text-sm">{d.startYear} - {d.endYear}</span>
                              <span className="text-sign-primary/60">{expandedDasha === d.planet ? '▼' : '▶'}</span>
                            </div>
                          </div>
                          <p className="text-text-muted text-xs mt-1">{d.ratingReason}</p>
                        </button>

                        {expandedDasha === d.planet && d.antardashas && (
                          <div className="ml-6 mt-2 space-y-1 mb-3">
                            <p className="text-sign-primary/60 text-xs mb-2">Antardasha (Sub-periods):</p>
                            {d.antardashas.map(ad => (
                              <div key={`${d.planet}-${ad.planet}`}
                                className={`flex justify-between items-center p-2.5 rounded text-sm ${
                                  ad.isCurrent ? 'bg-sign-primary/10 border border-sign-primary/20' : 'bg-cosmic-bg/20'
                                }`}>
                                <div className="flex items-center gap-2">
                                  <span className="text-text-primary text-xs font-medium">{getPlanetEmoji(d.planet)} {d.planet}/{getPlanetEmoji(ad.planet)} {ad.planet}</span>
                                  {ad.isCurrent && <span className="text-xs bg-sign-primary/20 text-sign-primary px-1.5 py-0.5 rounded">Active</span>}
                                </div>
                                <span className="text-text-muted text-xs">
                                  {ad.startMonth}/{ad.startYear} - {ad.endMonth}/{ad.endYear}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favourable Periods Summary */}
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Period Assessment Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['excellent', 'favourable', 'mixed', 'challenging'] as const).map(rating => {
                      const count = result.dashas.filter(d => d.rating === rating).length;
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

            {/* ===== YOGAS TAB ===== */}
            {activeTab === 'yogas' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-2">Planetary Yogas in Your Chart</h3>
                  <p className="text-text-muted text-xs mb-4">
                    {result.yogas.length} yoga{result.yogas.length !== 1 ? 's' : ''} identified based on planetary positions
                  </p>

                  {result.yogas.length === 0 ? (
                    <p className="text-text-muted text-sm">No major yogas identified in this chart configuration.</p>
                  ) : (
                    <div className="space-y-4">
                      {result.yogas.map((y, i) => (
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
                            }`}>
                              {y.strength}
                            </span>
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
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-2">Dosha Analysis</h3>
                  <p className="text-text-muted text-xs mb-4">Assessment of major doshas in your birth chart</p>

                  <div className="space-y-4">
                    {result.doshas.map(d => (
                      <div key={d.name} className={`p-4 rounded-lg border ${
                        !d.detected ? 'border-green-500/20 bg-green-500/5' :
                        d.severity === 'severe' ? 'border-red-500/30 bg-red-500/5' :
                        d.severity === 'moderate' ? 'border-yellow-500/20 bg-yellow-500/5' :
                        'border-yellow-500/10 bg-yellow-500/3'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-text-primary font-medium">{d.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            !d.detected ? 'bg-green-500/20 text-green-400' :
                            d.severity === 'severe' ? 'bg-red-500/20 text-red-400' :
                            d.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {d.detected ? d.severity : 'Not Present'}
                          </span>
                        </div>
                        <p className="text-text-muted text-sm mb-2">{d.description}</p>
                        {d.detected && <p className="text-text-muted text-xs mb-3">{d.details}</p>}
                        {d.detected && d.remedies.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-sign-primary/10">
                            <h4 className="text-sign-primary/60 text-xs mb-2">Remedies</h4>
                            <ul className="space-y-1">
                              {d.remedies.map((r, i) => (
                                <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                                  <span className="text-sign-primary/40 mt-0.5">•</span>
                                  {r}
                                </li>
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
                  <div className={`p-4 rounded-lg border ${
                    result.sadeSati.active ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/20 bg-green-500/5'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-text-primary font-medium">
                        {result.sadeSati.active ? `Sade Sati Active — ${result.sadeSati.phase} phase` : 'Sade Sati Not Active'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${result.sadeSati.active ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {result.sadeSati.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm">{result.sadeSati.description}</p>
                    {result.sadeSati.remedies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-sign-primary/10">
                        <h4 className="text-sign-primary/60 text-xs mb-2">Remedies</h4>
                        <ul className="space-y-1">
                          {result.sadeSati.remedies.map((r, i) => (
                            <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                              <span className="text-sign-primary/40 mt-0.5">•</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== REMEDIES TAB ===== */}
            {activeTab === 'remedies' && moonRashiData && moonNakshatraData && (
              <div className="space-y-6">
                {/* Gemstone Recommendations */}
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Gemstone Recommendations</h3>
                  <div className="space-y-4">
                    {result.gemstones.map((g, i) => (
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
                              <li key={j} className="text-text-muted text-xs flex items-start gap-2">
                                <span className="text-yellow-400/40 mt-0.5">•</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mantras */}
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Mantras</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-sign-primary/5 border border-sign-primary/10">
                      <span className="text-sign-primary/60 text-xs block mb-1">Rashi Beej Mantra ({moonRashiData.name})</span>
                      <p className="text-sign-primary font-devanagari text-lg">{moonRashiData.mantra}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-sign-primary/5 border border-sign-primary/10">
                      <span className="text-sign-primary/60 text-xs block mb-1">Nakshatra Mantra ({result.moonData.nakshatra})</span>
                      <p className="text-sign-primary font-devanagari text-lg">{moonNakshatraData.mantra}</p>
                    </div>
                  </div>
                </div>

                {/* Lucky Elements */}
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Lucky Elements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <span className="text-text-muted text-xs block">Lucky Numbers</span>
                      <span className="text-text-primary text-sm font-medium">{moonRashiData.luckyNumbers.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-xs block">Lucky Colors</span>
                      <span className="text-text-primary text-sm font-medium">{moonRashiData.luckyColors.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-xs block">Lucky Days</span>
                      <span className="text-text-primary text-sm font-medium">{moonRashiData.luckyDays.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-xs block">Direction</span>
                      <span className="text-text-primary text-sm font-medium">{moonRashiData.direction}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-xs block">Gemstone</span>
                      <span className="text-text-primary text-sm font-medium">{moonRashiData.gem}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-xs block">Deity</span>
                      <span className="text-text-primary text-sm font-medium">{moonRashiData.deity}</span>
                    </div>
                  </div>
                </div>

                {/* Transits */}
                <div className="glass-card p-6">
                  <h3 className="font-heading text-sign-primary mb-4">Current Transit Effects</h3>
                  <div className="space-y-3">
                    {result.transits.map(t => (
                      <div key={t.planet} className={`p-4 rounded-lg border ${t.isPositive ? 'border-green-500/20 bg-green-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-primary font-medium text-sm">{t.planet} Transit</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${t.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {t.isPositive ? 'Favourable' : 'Challenging'}
                          </span>
                          <span className="text-text-muted text-xs ml-auto">{t.transitSign} ({t.houseFromMoon}th from Moon)</span>
                        </div>
                        <p className="text-text-muted text-sm">{t.effects}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
