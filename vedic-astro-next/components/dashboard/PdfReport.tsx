'use client';

import { forwardRef } from 'react';
import { VedicChart, PlanetAnalysis, HoroscopeData, YogaResult, DoshaResult, GemstoneRecommendation, TransitPrediction, SadeSatiResult, DashaWithAntardasha, PanchangaPrediction, BhavaPrediction, LifeQuestion } from '@/types';
import { generateSouthIndianChart } from '@/lib/chart-svg';
import { generatePlanetAnalysis, nakshatraDetails, getMostMalefic, isBeneficForAscendant } from '@/lib/horoscope-data';
import type { NakshatraRemedy } from '@/lib/nakshatra-remedies';
import type { DasaRemedy } from '@/lib/dasa-remedies';
import type { FavourablePeriodsResult, FavourablePeriod } from '@/lib/favourable-periods';
import type { AshtakavargaResult } from '@/lib/ashtakavarga';
import type { PratyantardashaResult, PratyantardashaEntry } from '@/lib/pratyantardasha';
import type { CombustionEntry, PlanetaryWarEntry, LongitudeEntry } from '@/lib/calc-tables';
import type { GrahavasthaEntry, ShadbalaEntry, IshtaKashtaEntry, BhavabalaEntry, ShodasavargaEntry, SayanaEntry, BhavaTableEntry, KPEntry } from '@/lib/shadbala';
import type { DashaPredictionEntry } from '@/lib/dasha-predictions';
import { getPlanetEmoji } from '@/lib/navagraha';
import { getRashiEmojiByName } from '@/lib/rashi-emoji';

interface PdfReportProps {
  chart: VedicChart;
  horoscope: HoroscopeData | null;
  userName: string;
  dob: string;
  tob: string;
  pob: string;
  photo: string | null;
  yogas?: YogaResult[];
  doshas?: DoshaResult[];
  gemstones?: GemstoneRecommendation[];
  transits?: TransitPrediction[];
  sadeSati?: SadeSatiResult;
  enhancedDashas?: DashaWithAntardasha[];
  lifeQuestions?: LifeQuestion[];
  nakshatraRemedy?: NakshatraRemedy | null;
  dasaRemediesList?: { planet: string; remedy: DasaRemedy }[];
  favourablePeriods?: FavourablePeriodsResult | null;
  ashtakavarga?: AshtakavargaResult | null;
  pratyantardasha?: PratyantardashaResult | null;
  combustion?: CombustionEntry[];
  planetaryWar?: PlanetaryWarEntry[];
  longitudeTable?: LongitudeEntry[];
  grahavastha?: GrahavasthaEntry[];
  shadbala?: ShadbalaEntry[];
  ishtaKashta?: IshtaKashtaEntry[];
  bhavabala?: BhavabalaEntry[];
  shodasavarga?: ShodasavargaEntry[];
  sayanaLongitude?: SayanaEntry[];
  bhavaTable?: BhavaTableEntry[];
  kpTable?: KPEntry[];
  dashaPredictions?: DashaPredictionEntry[];
}

// ── Light print theme colors ──
const GOLD = '#B8860B';
const GOLD_LIGHT = '#D4A843';
const GOLD_BG = '#FDF6E3';
const BG = '#FFFEFA';
const TEXT = '#1a1a1a';
const TEXT_MED = '#444';
const TEXT_LIGHT = '#666';
const GREEN = '#2E7D32';
const RED = '#C62828';
const BLUE = '#1565C0';
const BORDER = '#E8D5A3';

const PAGE_W = '794px';
const PAGE_MIN_H = '1123px';

const pageBase: React.CSSProperties = {
  width: PAGE_W,
  minHeight: PAGE_MIN_H,
  background: BG,
  color: TEXT,
  fontFamily: "'Georgia', 'Times New Roman', serif",
  padding: '48px 52px',
  boxSizing: 'border-box',
  position: 'relative',
};

function decorativeBorder(): React.CSSProperties {
  return {
    position: 'absolute',
    top: '16px',
    left: '16px',
    right: '16px',
    bottom: '16px',
    border: `2px solid ${BORDER}`,
    borderRadius: '4px',
    pointerEvents: 'none',
  };
}

function omWatermark() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
      opacity: 0.06,
    }}>
      <img src="/images/om-mandala.png" alt="" style={{ width: '400px', height: '400px', objectFit: 'contain' }} />
    </div>
  );
}

function sectionTitle(text: string) {
  return (
    <div style={{ margin: '24px 0 14px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '28px', height: '2px', background: GOLD }} />
      <h2 style={{
        fontSize: '15px',
        fontWeight: 700,
        color: GOLD,
        margin: 0,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontFamily: "'Georgia', serif",
      }}>{text}</h2>
      <div style={{ flex: 1, height: '1px', background: BORDER }} />
    </div>
  );
}

function subSectionTitle(text: string) {
  return (
    <div style={{ margin: '16px 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '16px', height: '1px', background: GOLD_LIGHT }} />
      <h3 style={{
        fontSize: '12px',
        fontWeight: 700,
        color: GOLD,
        margin: 0,
        letterSpacing: '0.8px',
        fontFamily: "'Georgia', serif",
      }}>{text}</h3>
      <div style={{ flex: 1, height: '1px', background: '#EEE' }} />
    </div>
  );
}

function badge(label: string, color: string, bg: string): React.ReactElement {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '9px',
      fontWeight: 700,
      background: bg,
      color: color,
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
    }}>{label}</span>
  );
}

function bulletItem(text: string) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
      <span style={{ color: GOLD, fontSize: '10px', marginTop: '2px' }}>&#10022;</span>
      <span style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5' }}>{text}</span>
    </div>
  );
}

const LOGO_IMG_SRC = '/images/logo-ganesh.png';

// Ganesh image + blessing on cover page
function ganeshBlessing() {
  return (
    <div style={{ textAlign: 'center', margin: '0 0 12px 0' }}>
      <img src="/images/ganesh-cover.png" alt="Lord Ganesh" style={{
        width: '140px', height: 'auto', objectFit: 'contain',
        borderRadius: '8px', margin: '0 auto 8px auto', display: 'block',
        border: `2px solid ${GOLD}`, boxShadow: '0 2px 12px rgba(184,134,11,0.15)',
      }} />
      <div style={{ fontSize: '20px', color: GOLD, fontFamily: "'Noto Sans Devanagari', serif", lineHeight: 1 }}>
        &#x0936;&#x094D;&#x0930;&#x0940; &#x0917;&#x0923;&#x0947;&#x0936;&#x093E;&#x092F; &#x0928;&#x092E;&#x0903;
      </div>
      <div style={{ width: '120px', height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '6px auto' }} />
      <p style={{ fontSize: '9px', color: TEXT_LIGHT, fontStyle: 'italic', margin: 0 }}>
        Shri Ganeshaya Namah — Salutations to Lord Ganesh, Remover of Obstacles
      </p>
    </div>
  );
}

// Sanskrit opening verse
function sanskritVerse() {
  return (
    <div style={{ textAlign: 'center', margin: '12px 0', padding: '12px 24px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
      <p style={{ fontSize: '13px', color: GOLD, fontFamily: "'Noto Sans Devanagari', serif", margin: '0 0 6px 0', lineHeight: 1.6 }}>
        &#x0926;&#x0943;&#x0937;&#x094D;&#x091F;&#x093F;&#x0903; &#x091C;&#x094D;&#x092F;&#x094B;&#x0924;&#x093F;&#x0937;&#x0902; &#x0936;&#x093E;&#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x092E;&#x094D; | &#x0928;&#x0947;&#x0924;&#x094D;&#x0930;&#x0917;&#x094B;&#x091A;&#x0930;&#x092E;&#x094D; &#x092D;&#x093E;&#x0938;&#x094D;&#x0935;&#x0924;&#x093E;&#x092E;&#x094D; ||
      </p>
      <p style={{ fontSize: '9px', color: TEXT_LIGHT, fontStyle: 'italic', margin: 0 }}>
        &quot;The eye of the Vedas is the science of Jyotish — it illuminates that which is unseen.&quot;
      </p>
    </div>
  );
}

// Chapter-numbered page header
function chapterHeader(chapter: number, title: string) {
  return (
    <div style={{ marginBottom: '6px', paddingBottom: '10px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: GOLD_BG, color: GOLD, fontSize: '12px', fontWeight: 700, border: `1px solid ${BORDER}` }}>{chapter}</span>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: GOLD, margin: 0, letterSpacing: '2px', fontFamily: "'Georgia', serif" }}>
          {title}
        </h2>
      </div>
      <img src={LOGO_IMG_SRC} alt="Vedic Astro" style={{ height: '28px', width: 'auto' }} />
    </div>
  );
}

function pageHeader(title: string) {
  return (
    <div style={{ marginBottom: '6px', paddingBottom: '10px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: GOLD, margin: 0, letterSpacing: '2px', fontFamily: "'Georgia', serif" }}>
        {title}
      </h2>
      <img src={LOGO_IMG_SRC} alt="Vedic Astro" style={{ height: '28px', width: 'auto' }} />
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return '-';
  const [year, month, day] = d.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[month - 1]} ${day}, ${year}`;
}

function formatTime(t: string) {
  if (!t) return '-';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

/** Convert chart SVGs from dark theme to light print colors */
function lightSvg(svg: string): string {
  return svg
    .replace(/rgba\(22,33,62,0\.9\)/g, '#FFFFFF')
    .replace(/var\(--sign-primary\)/g, GOLD)
    .replace(/#888/g, '#777')
    .replace(/#B8B8B8/g, TEXT_MED);
}

function pageFooter(pageNum?: number) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '52px',
      right: '52px',
      textAlign: 'center',
      borderTop: `1px solid ${BORDER}`,
      paddingTop: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: '9px', color: TEXT_LIGHT }}>
        Generated by Vedic Astro
      </span>
      {pageNum && (
        <span style={{ fontSize: '9px', color: TEXT_LIGHT }}>
          Page {pageNum}
        </span>
      )}
      <span style={{ fontSize: '9px', color: TEXT_LIGHT }}>
        vedicastro.co
      </span>
    </div>
  );
}

/** Truncate long text to maxLen characters */
function truncate(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text || '';
  return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

const PdfReport = forwardRef<HTMLDivElement, PdfReportProps>(
  ({ chart, horoscope, userName, dob, tob, pob, photo, yogas, doshas, gemstones, transits, sadeSati, enhancedDashas, lifeQuestions, nakshatraRemedy, dasaRemediesList, favourablePeriods, ashtakavarga, pratyantardasha, combustion, planetaryWar, longitudeTable, grahavastha, shadbala, ishtaKashta, bhavabala, shodasavarga, sayanaLongitude, bhavaTable, kpTable, dashaPredictions }, ref) => {
    const rashiSvg = lightSvg(generateSouthIndianChart(
      chart.planets as unknown as Record<string, import('@/types').Planet>,
      chart.ascendant.index, 'rashi'
    ));
    const navamsaSvg = lightSvg(generateSouthIndianChart(
      chart.planets as unknown as Record<string, import('@/types').Planet>,
      chart.ascendant.index, 'navamsa'
    ));

    const planetAnalysis = generatePlanetAnalysis(chart);
    const nakshatraData = nakshatraDetails[chart.nakshatra];
    const dashaMalefic = getMostMalefic(chart.ascendant.index);

    const dashaOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const today = new Date();
    const currentDashaIndex = (today.getFullYear() - new Date(dob).getFullYear()) % 9;
    const currentDashaLord = dashaOrder[currentDashaIndex];
    const dashaBenefic = isBeneficForAscendant(currentDashaLord, chart.ascendant.index);
    const generatedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const panchanga = horoscope?.panchanga as PanchangaPrediction | undefined;
    const bhava = horoscope?.bhava as BhavaPrediction[] | undefined;
    const currentMahadasha = enhancedDashas?.find(d => d.isCurrent);
    const qaPageCount = lifeQuestions && lifeQuestions.length > 0 ? Math.ceil(lifeQuestions.length / 5) : 0;
    const pOff = qaPageCount; // page offset for pages after Q&A

    // Dynamic page number calculation for TOC
    const tocPages = (() => {
      let pg = 1; // Page 1 = Cover, Page 2 = Birth Details (Ch.1)
      // Page 3 = TOC, Page 4 = How to Read
      const ch1 = pg; pg = 5; // Ch.2 starts at page 5
      const ch2 = pg; pg += 1; // Planet Analysis = 1 page
      const ch3 = pg; pg += qaPageCount; // Q&A pages
      const ch4 = pg; pg += 1; // Panchanga
      if (panchanga?.birthKaranam || panchanga?.birthNithyaYoga) pg += 1; // Karanam/Yoga continuation
      const ch5 = pg; pg += bhava && bhava.length > 0 ? 2 : 0; // Houses 1-6 + 7-12
      const ch6 = pg; pg += yogas && yogas.length > 0 ? 1 : 0;
      const ch7 = pg; pg += doshas ? 1 : 0;
      const ch8 = pg; pg += gemstones && gemstones.length > 0 ? 1 : 0;
      const ch9 = pg; pg += enhancedDashas && enhancedDashas.length > 0 ? 1 : 0;
      const ch10 = pg; pg += dashaPredictions && dashaPredictions.length > 0 ? Math.ceil(dashaPredictions.length / 4) : 0;
      const ch11 = pg; pg += transits && transits.length > 0 ? 1 : 0;
      const ch12 = pg; pg += nakshatraRemedy ? 1 : 0;
      const ch13 = pg; pg += dasaRemediesList && dasaRemediesList.length > 0 ? Math.ceil(dasaRemediesList.length / 3) : 0;
      const ch14 = pg; pg += favourablePeriods ? 2 : 0;
      const ch15 = pg; pg += ashtakavarga ? 2 : 0;
      const ch16 = pg; pg += pratyantardasha?.periods ? Math.min(Math.ceil(pratyantardasha.periods.length / 8), 10) : 0;
      const ch17 = pg;
      return { 1: ch1, 2: ch2, 3: ch3, 4: ch4, 5: ch5, 6: ch6, 7: ch7, 8: ch8, 9: ch9, 10: ch10, 11: ch11, 12: ch12, 13: ch13, 14: ch14, 15: ch15, 16: ch16, 17: ch17 } as Record<number, number>;
    })();

    // Table row styles
    const thStyle: React.CSSProperties = {
      background: GOLD_BG,
      color: GOLD,
      padding: '8px 8px',
      textAlign: 'left',
      fontWeight: 700,
      fontSize: '10px',
      borderBottom: `2px solid ${BORDER}`,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    };
    const tdStyle: React.CSSProperties = {
      padding: '7px 8px',
      borderBottom: `1px solid #EEE`,
      color: TEXT,
      fontSize: '11px',
    };

    return (
      <div
        ref={ref}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          zIndex: -1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {/* ═══════════════ PAGE 1: Cover Page ═══════════════ */}
        <div data-pdf-page style={{ ...pageBase, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={decorativeBorder()} />
          {omWatermark()}

          {/* Ganesh Blessing — larger for full-page cover */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/images/ganesh-cover.png" alt="Lord Ganesh" style={{
              width: '200px', height: 'auto', objectFit: 'contain',
              borderRadius: '10px', margin: '0 auto 12px auto', display: 'block',
              border: `3px solid ${GOLD}`, boxShadow: '0 4px 20px rgba(184,134,11,0.2)',
            }} />
            <div style={{ fontSize: '24px', color: GOLD, fontFamily: "'Noto Sans Devanagari', serif", lineHeight: 1 }}>
              &#x0936;&#x094D;&#x0930;&#x0940; &#x0917;&#x0923;&#x0947;&#x0936;&#x093E;&#x092F; &#x0928;&#x092E;&#x0903;
            </div>
            <div style={{ width: '140px', height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '8px auto' }} />
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, fontStyle: 'italic', margin: 0 }}>
              Shri Ganeshaya Namah — Salutations to Lord Ganesh, Remover of Obstacles
            </p>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '2px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '0 auto 20px auto' }} />
            <h1 style={{
              fontSize: '38px',
              fontWeight: 700,
              color: GOLD,
              margin: '0 0 4px 0',
              letterSpacing: '6px',
              fontFamily: "'Georgia', serif",
            }}>VEDIC ASTRO ✨</h1>
            <p style={{ fontSize: '15px', color: TEXT_LIGHT, margin: '0 0 16px 0', letterSpacing: '3px' }}>
              🕉️ BIRTH CHART REPORT
            </p>
            <div style={{ width: '80px', height: '2px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '0 auto' }} />
          </div>

          {/* User Info */}
          <div style={{ textAlign: 'center' }}>
            {photo && (
              <div style={{ margin: '0 auto 14px auto', width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${GOLD}`, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
                <img src={photo} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <p style={{ fontSize: '26px', color: TEXT, margin: '0 0 6px 0', fontWeight: 600 }}>
              {userName}
            </p>
            <p style={{ fontSize: '12px', color: TEXT_LIGHT, margin: 0 }}>
              Report generated on {generatedDate}
            </p>
          </div>

          {pageFooter()}
        </div>

        {/* ═══════════════ PAGE 2: Birth Details + Charts + Positions ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}

          {/* Sanskrit Verse */}
          {sanskritVerse()}

          {/* Birth Details */}
          {sectionTitle('📜 Birth Details')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 40px', marginBottom: '8px' }}>
            {[
              ['Date of Birth', formatDate(dob)],
              ['Moon Sign', `${chart.moonSign.symbol} ${chart.moonSign.name} (${chart.moonSign.hindi})`],
              ['Time of Birth', formatTime(tob)],
              ['Sun Sign', `${chart.sunSign.symbol} ${chart.sunSign.name} (${chart.sunSign.hindi})`],
              ['Place of Birth', pob],
              ['Ascendant (Lagna)', `${chart.ascendant.symbol} ${chart.ascendant.name} (${chart.ascendant.hindi})`],
              ['Nakshatra', `${chart.nakshatra}${chart.nakshatraPada ? ` — Pada ${chart.nakshatraPada}` : ''}`],
              ['Ayanamsa', 'Lahiri (Chitrapaksha)'],
              ...(panchanga ? [
                ['Tithi (Lunar Day)', panchanga.birthTithi?.name || '—'],
                ['Karanam', panchanga.birthKaranam?.name || '—'],
                ['Nithya Yoga', panchanga.birthNithyaYoga?.name || '—'],
              ] as [string, string][] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: '8px', padding: '4px 0' }}>
                <span style={{ fontSize: '11px', color: TEXT_LIGHT, minWidth: '110px', fontWeight: 500 }}>{label}:</span>
                <span style={{ fontSize: '11px', color: TEXT, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Charts */}
          {sectionTitle('📜 Birth Charts')}
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', margin: '12px 0 16px 0' }}>
            <div style={{ width: '300px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: GOLD, fontWeight: 700, marginBottom: '8px', letterSpacing: '0.5px' }}>
                Jagadha Kattam (Rashi)
              </p>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '4px', padding: '4px', background: '#FFFFFF' }}
                dangerouslySetInnerHTML={{ __html: rashiSvg }} />
            </div>
            <div style={{ width: '300px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: GOLD, fontWeight: 700, marginBottom: '8px', letterSpacing: '0.5px' }}>
                Navamsa Chart (D-9)
              </p>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '4px', padding: '4px', background: '#FFFFFF' }}
                dangerouslySetInnerHTML={{ __html: navamsaSvg }} />
            </div>
          </div>

          {/* Planetary Positions Table */}
          {sectionTitle('📜 Planetary Positions')}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr>
                {['Planet', 'Sign', 'Degree', 'House', 'Nakshatra', 'Pada', 'Retro', 'Navamsa'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(chart.planets).map(([name, p], i) => {
                const benefic = isBeneficForAscendant(name, chart.ascendant.index);
                const malefic = name === dashaMalefic;
                return (
                  <tr key={name} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: malefic ? RED : benefic ? GREEN : TEXT }}>{getPlanetEmoji(name)} {name}</td>
                    <td style={tdStyle}>{getRashiEmojiByName(p.sign)} {p.sign} ({p.signHindi})</td>
                    <td style={tdStyle}>{p.degree}&deg;</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{p.house}</td>
                    <td style={tdStyle}>{p.nakshatra}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{p.nakshatraPada}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: p.retrograde ? RED : GREEN, fontWeight: 600 }}>
                      {p.retrograde ? '🔄 Yes' : 'No'}
                    </td>
                    <td style={tdStyle}>{p.navamsaSign}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pageFooter(2)}
        </div>

        {/* ═══════════════ PAGE 3: Table of Contents ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}

          {pageHeader('Table of Contents')}
          <div style={{ marginTop: '16px' }}>
            {[
              { ch: 1, title: '📜 Your Birth Profile', desc: 'Birth details, charts, and planetary positions' },
              { ch: 2, title: '🪐 Planet Analysis', desc: 'Detailed analysis of each planet in your chart' },
              { ch: 3, title: '🔮 Important Life Questions & Answers', desc: '15 personalized questions answered from your birth chart' },
              { ch: 4, title: '🌙 Your Characteristics & Behaviour', desc: 'Panchanga-based personality predictions' },
              { ch: 5, title: '🏛️ Influences on Your Life', desc: 'Bhava (house) predictions for all 12 houses' },
              { ch: 6, title: '⭐ Planetary Yogas', desc: 'Auspicious and inauspicious planetary combinations' },
              { ch: 7, title: '🔴 Dosha Analysis', desc: 'Assessment of Manglik, Kaal Sarp, and other doshas' },
              { ch: 8, title: '💎 Gemstone Recommendations', desc: 'Recommended gemstones with wearing instructions' },
              { ch: 9, title: '⏳ Dasha Timeline', desc: 'Vimshottari Mahadasha and Antardasha periods' },
              { ch: 10, title: '📊 35-Year Prediction Summary', desc: 'Detailed predictions for each Dasha/Antardasha period' },
              { ch: 11, title: '🔄 Transit Predictions', desc: 'Current planetary transit effects on your chart' },
              { ch: 12, title: '✨ Nakshatra Remedies', desc: 'Remedies based on your birth star' },
              { ch: 13, title: '🙏 Dasa Period Remedies', desc: 'Remedies for challenging Mahadasha periods' },
              { ch: 14, title: '📅 Favourable Periods', desc: 'Best periods for career, business, and property' },
              { ch: 15, title: '📐 AshtakaVarga Analysis', desc: 'Planetary strength and bindu distribution' },
              { ch: 16, title: '🔄 Pratyantardasha Predictions', desc: 'Detailed sub-sub-period predictions' },
              { ch: 17, title: '🧮 Calculations & Tables', desc: 'Longitude, combustion, planetary war, divisional charts, strength tables' },
            ].map(item => (
              <div key={item.ch} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 12px', marginBottom: '3px',
                background: item.ch % 2 === 0 ? '#FAFAF5' : 'transparent',
                borderRadius: '3px',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: GOLD_BG, color: GOLD, fontSize: '10px', fontWeight: 700,
                  border: `1px solid ${BORDER}`, flexShrink: 0,
                }}>{item.ch}</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT }}>{item.title}</span>
                    <span style={{ fontSize: '9px', color: TEXT_LIGHT, display: 'block', marginTop: '1px' }}>{item.desc}</span>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: GOLD,
                    minWidth: '28px', textAlign: 'right', flexShrink: 0,
                  }}>{tocPages[item.ch]}</span>
                </div>
              </div>
            ))}
          </div>

          {pageFooter(3)}
        </div>

        {/* ═══════════════ PAGE 4: How to Read This Report ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}

          {pageHeader('How to Read This Report')}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <img src="/images/navagraha-wheel.png" alt="Navagraha" style={{
              width: '100px', height: '100px', objectFit: 'contain', borderRadius: '50%',
              border: `2px solid ${BORDER}`, flexShrink: 0,
            }} />
            <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>
              This report is based on the Parashari system of Vedic astrology using Lahiri (Chitrapaksha) ayanamsa.
              It analyzes the planetary positions at the time of your birth to provide insights into various aspects of your life.
              The Navagraha (nine celestial bodies) form the foundation of all Jyotish analysis.
            </p>
          </div>

          {[
            { title: 'Birth Charts (Rashi & Navamsa)', text: 'The Rashi chart shows where each planet was placed at birth. The Navamsa (D-9) chart reveals the deeper spiritual and marital dimensions. Planets are shown as two-letter abbreviations (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke).' },
            { title: 'Planetary Dignity', text: 'Planets can be Exalted (strongest), in Own Sign, in a Friend\'s sign, Neutral, in an Enemy\'s sign, or Debilitated (weakest). A planet\'s dignity significantly affects its ability to deliver results.' },
            { title: 'Mahadasha & Antardasha', text: 'The Vimshottari Dasha system divides your life into planetary periods (Mahadasha) of 6-20 years each. Each Mahadasha is further divided into sub-periods (Antardasha). The planet ruling each period influences events during that time.' },
            { title: 'Yogas & Doshas', text: 'Yogas are auspicious planetary combinations that bestow specific results. Doshas are afflictions that may create challenges. Both are identified by analyzing planetary positions, aspects, and house lordships.' },
            { title: 'AshtakaVarga', text: 'Each planet receives "bindhus" (points) from other planets in each sign. More bindhus mean stronger positive results when planets transit through that sign. The Sarvashtakavarga total shows the overall strength of each sign.' },
            { title: 'Remedies', text: 'Remedies are suggested for challenging periods. These include mantras, gemstones, fasting, charity, and worship. They are based on classical Vedic texts and should be adopted with faith and consistency.' },
            { title: 'Favourable Periods', text: 'Based on the Dasha lords\' relationship with specific houses, periods are rated as Excellent, Favourable, or Less Favourable for career, business, and house construction.' },
          ].map(item => (
            <div key={item.title} style={{ marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: GOLD, margin: '0 0 3px 0' }}>{item.title}</p>
              <p style={{ fontSize: '9.5px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{item.text}</p>
            </div>
          ))}

          <div style={{ marginTop: '16px', padding: '10px 14px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: '9px', color: TEXT_LIGHT, lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
              Note: This report is generated for educational and self-awareness purposes based on classical Vedic astrology principles.
              Planetary positions are calculated using sidereal (Nirayana) coordinates with Lahiri ayanamsa.
              Individual results depend on the complete interaction of all chart factors and should be interpreted holistically.
            </p>
          </div>

          {pageFooter(4)}
        </div>

        {/* ═══════════════ PAGE 5: Planet Analysis ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}

          {chapterHeader(2, '🪐 Planet Analysis')}
          <p style={{ fontSize: '11px', color: TEXT_LIGHT, margin: '0 0 16px 0' }}>
            Based on <strong style={{ color: TEXT }}>{chart.ascendant.name}</strong> Ascendant &bull; Most Malefic: <strong style={{ color: RED }}>{getPlanetEmoji(dashaMalefic)} {dashaMalefic}</strong>
          </p>

          {planetAnalysis.map((a: PlanetAnalysis) => {
            const borderColor = a.isMostMalefic ? '#EECECE' : a.isBenefic ? '#C8E6C9' : BORDER;
            const bgColor = a.isMostMalefic ? '#FFF5F5' : a.isBenefic ? '#F5FFF5' : '#FAFAF5';
            const badgeBg = a.isMostMalefic ? '#FDECEA' : a.isBenefic ? '#E8F5E9' : GOLD_BG;
            const badgeColor = a.isMostMalefic ? RED : a.isBenefic ? GREEN : GOLD;
            return (
              <div key={a.planet} style={{
                padding: '10px 14px',
                marginBottom: '8px',
                borderRadius: '4px',
                border: `1px solid ${borderColor}`,
                background: bgColor,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{getPlanetEmoji(a.planet)} {a.planet}</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '9px',
                      fontWeight: 700,
                      background: badgeBg,
                      color: badgeColor,
                      letterSpacing: '0.3px',
                    }}>
                      {a.isMostMalefic ? '🔴 MOST MALEFIC' : a.isBenefic ? '🟢 BENEFIC' : '🟡 NEUTRAL'}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>{getRashiEmojiByName(a.sign)} {a.sign} &bull; House {a.house} &bull; {a.degree}&deg;</span>
                </div>
                <p style={{ fontSize: '10.5px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{a.interpretation}</p>
              </div>
            );
          })}

          {pageFooter(5)}
        </div>

        {/* ═══════════════ PAGES 6+: Important Life Questions & Answers ═══════════════ */}
        {lifeQuestions && lifeQuestions.length > 0 && (() => {
          const questionsPerPage = 5;
          const pages: LifeQuestion[][] = [];
          for (let i = 0; i < lifeQuestions.length; i += questionsPerPage) {
            pages.push(lifeQuestions.slice(i, i + questionsPerPage));
          }
          return pages.map((pageQuestions, pageIdx) => (
            <div key={`qa-${pageIdx}`} data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {pageIdx === 0 ? chapterHeader(3, '🔮 Important Life Questions & Answers') : pageHeader('🔮 Life Questions & Answers (contd.)')}
              {pageIdx === 0 && (
                <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
                  15 personalized questions about your life answered from your birth chart
                </p>
              )}

              {pageQuestions.map((q, qi) => {
                const globalIdx = pageIdx * questionsPerPage + qi;
                return (
                  <div key={globalIdx} style={{
                    padding: '10px 14px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${BORDER}`,
                    background: globalIdx % 2 === 0 ? '#FAFAF5' : '#FFFFFF',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: GOLD_BG, color: GOLD, fontSize: '10px', fontWeight: 700,
                        border: `1px solid ${BORDER}`, flexShrink: 0,
                      }}>{globalIdx + 1}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: TEXT }}>{q.question}</span>
                      <span style={{
                        marginLeft: 'auto', fontSize: '8px', padding: '2px 6px',
                        borderRadius: '8px', background: GOLD_BG, color: GOLD,
                        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', flexShrink: 0,
                      }}>{q.category}</span>
                    </div>
                    <p style={{ fontSize: '9.5px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>
                      {truncate(q.answer, 500)}
                    </p>
                  </div>
                );
              })}

              {pageFooter(6 + pageIdx)}
            </div>
          ));
        })()}

        {/* ═══════════════ Panchanga Predictions ═══════════════ */}
        {panchanga && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(4, '🌙 Your Characteristics & Behaviour')}
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 16px 0' }}>
              Birth-time Panchanga analysis based on classical Vedic texts
            </p>

            {/* Weekday of Birth */}
            {subSectionTitle(`Birth Day: ${panchanga.weekdayOfBirth.day}`)}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {badge(panchanga.weekdayOfBirth.planet, GOLD, GOLD_BG)}
              <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>Ruling Planet</span>
            </div>
            <div style={{ padding: '10px 14px', background: '#FAFAF5', borderRadius: '4px', border: `1px solid ${BORDER}`, marginBottom: '16px' }}>
              {truncate(panchanga.weekdayOfBirth.prediction, 600).split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: i === 0 ? 0 : '6px 0 0 0' }}>{para}</p>
              ))}
            </div>

            {/* Birth Nakshatra */}
            {subSectionTitle(`Birth Nakshatra: ${panchanga.birthNakshatra.name}`)}
            <div style={{ padding: '10px 14px', background: '#FAFAF5', borderRadius: '4px', border: `1px solid ${BORDER}`, marginBottom: '16px' }}>
              {truncate(panchanga.birthNakshatra.prediction, 600).split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: i === 0 ? 0 : '6px 0 0 0' }}>{para}</p>
              ))}
            </div>

            {/* Birth Tithi */}
            {subSectionTitle(`Birth Tithi: ${panchanga.birthTithi.name || 'Based on birth date'}`)}
            <div style={{ padding: '10px 14px', background: '#FAFAF5', borderRadius: '4px', border: `1px solid ${BORDER}` }}>
              {truncate(panchanga.birthTithi.prediction, 600).split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: i === 0 ? 0 : '6px 0 0 0' }}>{para}</p>
              ))}
            </div>

            {pageFooter(4 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE: Karanam & Nithya Yoga ═══════════════ */}
        {panchanga && (panchanga.birthKaranam || panchanga.birthNithyaYoga) && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('🌙 Your Characteristics & Behaviour (contd.)')}

            {/* Birth Karanam */}
            {panchanga.birthKaranam && (
              <>
                {subSectionTitle(`Birth Karanam: ${panchanga.birthKaranam.name}`)}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  {badge('Half-Tithi', GOLD, GOLD_BG)}
                </div>
                <div style={{ padding: '10px 14px', background: '#FAFAF5', borderRadius: '4px', border: `1px solid ${BORDER}`, marginBottom: '16px' }}>
                  {truncate(panchanga.birthKaranam.prediction, 600).split('\n\n').map((para, i) => (
                    <p key={i} style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: i === 0 ? 0 : '6px 0 0 0' }}>{para}</p>
                  ))}
                </div>
              </>
            )}

            {/* Nithya Yoga */}
            {panchanga.birthNithyaYoga && (
              <>
                {subSectionTitle(`Birth Nithya Yoga: ${panchanga.birthNithyaYoga.name}`)}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  {badge('Sun-Moon Yoga', GOLD, GOLD_BG)}
                </div>
                <div style={{ padding: '10px 14px', background: '#FAFAF5', borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                  {truncate(panchanga.birthNithyaYoga.prediction, 600).split('\n\n').map((para, i) => (
                    <p key={i} style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: i === 0 ? 0 : '6px 0 0 0' }}>{para}</p>
                  ))}
                </div>
              </>
            )}

            {pageFooter()}
          </div>
        )}

        {/* ═══════════════ Bhava (12 Houses) ═══════════════ */}
        {bhava && bhava.length > 0 && (
          <>
            {/* Page 4: Houses 1-6 */}
            <div data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {chapterHeader(5, '🏛️ Influences on Your Life (Houses 1-6)')}
              <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
                House analysis for {chart.ascendant.name} Ascendant
              </p>

              {bhava.filter(b => b.house <= 6).map(b => (
                <div key={b.house} style={{
                  padding: '10px 14px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: `1px solid ${b.occupants.length > 0 ? GOLD_LIGHT : BORDER}`,
                  background: b.occupants.length > 0 ? '#FDFBF5' : '#FAFAF5',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: GOLD }}>House {b.house}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: TEXT }}>{b.houseName}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>
                      Lord: {getPlanetEmoji(b.lordPlanet)} {b.lordPlanet} in House {b.lordPlacedIn}
                    </span>
                  </div>
                  {b.occupants.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                      {b.occupants.map(occ => badge(`${getPlanetEmoji(occ)} ${occ}`, GOLD, GOLD_BG))}
                    </div>
                  )}
                  <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{truncate(b.prediction, 250)}</p>
                  {b.aspects.length > 0 && (
                    <p style={{ fontSize: '9px', color: TEXT_LIGHT, marginTop: '4px', margin: '4px 0 0 0' }}>
                      Aspected by: {b.aspects.join(', ')}
                    </p>
                  )}
                </div>
              ))}

              {pageFooter(5 + pOff)}
            </div>

            {/* Page 6: Houses 7-12 */}
            <div data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {pageHeader('🏛️ Influences on Your Life (Houses 7-12)')}

              {bhava.filter(b => b.house > 6).map(b => (
                <div key={b.house} style={{
                  padding: '10px 14px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: `1px solid ${b.occupants.length > 0 ? GOLD_LIGHT : BORDER}`,
                  background: b.occupants.length > 0 ? '#FDFBF5' : '#FAFAF5',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: GOLD }}>House {b.house}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: TEXT }}>{b.houseName}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>
                      Lord: {getPlanetEmoji(b.lordPlanet)} {b.lordPlanet} in House {b.lordPlacedIn}
                    </span>
                  </div>
                  {b.occupants.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                      {b.occupants.map(occ => badge(`${getPlanetEmoji(occ)} ${occ}`, GOLD, GOLD_BG))}
                    </div>
                  )}
                  <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{truncate(b.prediction, 250)}</p>
                  {b.aspects.length > 0 && (
                    <p style={{ fontSize: '9px', color: TEXT_LIGHT, marginTop: '4px', margin: '4px 0 0 0' }}>
                      Aspected by: {b.aspects.join(', ')}
                    </p>
                  )}
                </div>
              ))}

              {pageFooter(6 + pOff)}
            </div>
          </>
        )}

        {/* ═══════════════ PAGE 6: Yogas ═══════════════ */}
        {yogas && yogas.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(6, '⭐ Planetary Yogas')}
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
              {yogas.length} yoga{yogas.length !== 1 ? 's' : ''} identified in your birth chart
            </p>

            {yogas.map((y, i) => {
              const strengthColor = y.strength === 'strong' ? GREEN : y.strength === 'moderate' ? BLUE : GOLD;
              const strengthBg = y.strength === 'strong' ? '#E8F5E9' : y.strength === 'moderate' ? '#E3F2FD' : GOLD_BG;
              const typeBg = y.type === 'raja' ? '#FFF3E0' : y.type === 'dhana' ? '#FFF8E1' : '#F3E5F5';
              const typeColor = y.type === 'raja' ? '#E65100' : y.type === 'dhana' ? '#F57F17' : '#7B1FA2';
              return (
                <div key={`${y.name}-${i}`} style={{
                  padding: '10px 14px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: `1px solid ${y.strength === 'strong' ? '#C8E6C9' : BORDER}`,
                  background: y.strength === 'strong' ? '#F5FFF5' : '#FAFAF5',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT }}>{y.name}</span>
                      {y.sanskrit !== y.name && (
                        <span style={{ fontSize: '9px', color: TEXT_LIGHT }}>({y.sanskrit})</span>
                      )}
                      {badge(`${y.type === 'raja' ? '👑 ' : y.type === 'dhana' ? '💰 ' : ''}${y.type.replace('_', ' ')}`, typeColor, typeBg)}
                      {badge(y.strength, strengthColor, strengthBg)}
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5', margin: '0 0 3px 0' }}>{y.description}</p>
                  <p style={{ fontSize: '10px', color: TEXT, lineHeight: '1.5', margin: '0 0 4px 0', fontWeight: 500 }}>{y.effects}</p>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {y.planets.map(p => (
                      <span key={p} style={{ fontSize: '9px', padding: '2px 6px', background: GOLD_BG, color: GOLD, borderRadius: '8px', border: `1px solid ${BORDER}` }}>{getPlanetEmoji(p)} {p}</span>
                    ))}
                  </div>
                </div>
              );
            })}

            {pageFooter(7 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 7: Doshas & Remedies ═══════════════ */}
        {doshas && doshas.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(7, '🔴 Dosha Analysis & Remedies')}
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
              Assessment of major doshas in your birth chart with remedial measures
            </p>

            {doshas.map(d => {
              const sevColor = !d.detected ? GREEN : d.severity === 'severe' ? RED : d.severity === 'moderate' ? '#E65100' : GOLD;
              const sevBg = !d.detected ? '#E8F5E9' : d.severity === 'severe' ? '#FDECEA' : d.severity === 'moderate' ? '#FFF3E0' : GOLD_BG;
              const borderC = !d.detected ? '#C8E6C9' : d.severity === 'severe' ? '#EECECE' : '#E8D5A3';
              const bgC = !d.detected ? '#F5FFF5' : d.severity === 'severe' ? '#FFF5F5' : '#FAFAF5';
              return (
                <div key={d.name} style={{
                  padding: '12px 14px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: `1px solid ${borderC}`,
                  background: bgC,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{d.name}</span>
                    {badge(d.detected ? d.severity : 'Not Present', sevColor, sevBg)}
                  </div>
                  <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5', margin: '0 0 4px 0' }}>{d.description}</p>
                  {d.detected && d.details && (
                    <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5', margin: '0 0 6px 0' }}>{d.details}</p>
                  )}
                  {d.detected && d.remedies.length > 0 && (
                    <div style={{ paddingTop: '6px', borderTop: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: '9px', color: GOLD, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Remedies</span>
                      <div style={{ marginTop: '4px' }}>
                        {d.remedies.map((r, i) => bulletItem(r))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Sade Sati */}
            {sadeSati && (
              <>
                {subSectionTitle('Sade Sati Status')}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '4px',
                  border: `1px solid ${sadeSati.active ? '#EECECE' : '#C8E6C9'}`,
                  background: sadeSati.active ? '#FFF5F5' : '#F5FFF5',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT }}>
                      {sadeSati.active ? `Sade Sati Active — ${sadeSati.phase} phase` : 'Sade Sati Not Active'}
                    </span>
                    {badge(sadeSati.active ? 'Active' : 'Inactive', sadeSati.active ? RED : GREEN, sadeSati.active ? '#FDECEA' : '#E8F5E9')}
                  </div>
                  <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5', margin: 0 }}>{sadeSati.description}</p>
                  {sadeSati.remedies.length > 0 && (
                    <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${BORDER}` }}>
                      {sadeSati.remedies.map((r, i) => bulletItem(r))}
                    </div>
                  )}
                </div>
              </>
            )}

            {pageFooter(8 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 8: Gemstone Recommendations ═══════════════ */}
        {gemstones && gemstones.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(8, '💎 Gemstone Recommendations')}
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
              Personalized gemstone prescriptions based on your planetary positions
            </p>

            {gemstones.map((g, i) => (
              <div key={g.planet} style={{
                padding: '12px 14px',
                marginBottom: '10px',
                borderRadius: '4px',
                border: `1px solid ${i === 0 ? GOLD_LIGHT : BORDER}`,
                background: i === 0 ? '#FDFBF5' : '#FAFAF5',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{g.primaryGem}</span>
                  {i === 0 && badge('Primary', GOLD, GOLD_BG)}
                  <span style={{ fontSize: '10px', color: TEXT_LIGHT, marginLeft: 'auto' }}>For {getPlanetEmoji(g.planet)} {g.planet}</span>
                </div>
                <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5', margin: '0 0 8px 0' }}>{g.reason}</p>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  {[
                    ['Weight', g.weight],
                    ['Metal', g.metal],
                    ['Finger', g.finger],
                    ['Starting Day', g.startingDay],
                  ].map(([label, val]) => (
                    <div key={label} style={{ padding: '6px 8px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: '8px', color: TEXT_LIGHT, textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block' }}>{label}</span>
                      <span style={{ fontSize: '10px', color: TEXT, fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: TEXT_LIGHT, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Alternative Gem</span>
                    <p style={{ fontSize: '10px', color: TEXT, fontWeight: 600, margin: '2px 0 0 0' }}>{g.alternativeGem}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '9px', color: TEXT_LIGHT, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Activation Mantra</span>
                    <p style={{ fontSize: '10px', color: GOLD, fontWeight: 600, margin: '2px 0 0 0' }}>{g.mantra}</p>
                  </div>
                </div>

                {g.precautions.length > 0 && (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${BORDER}` }}>
                    <span style={{ fontSize: '9px', color: '#E65100', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Precautions</span>
                    <div style={{ marginTop: '3px' }}>
                      {g.precautions.map((p, j) => (
                        <div key={j} style={{ display: 'flex', gap: '5px', marginBottom: '2px' }}>
                          <span style={{ color: '#E65100', fontSize: '8px', marginTop: '3px' }}>&#9679;</span>
                          <span style={{ fontSize: '9px', color: TEXT_MED, lineHeight: '1.5' }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {pageFooter(9 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 9: Dasha Timeline ═══════════════ */}
        {enhancedDashas && enhancedDashas.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(9, '⏳ Dasha Timeline')}
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
              Complete Mahadasha timeline with period assessments
            </p>

            {/* Mahadasha Timeline Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '16px' }}>
              <thead>
                <tr>
                  {['Planet', 'Period', 'Duration', 'Rating', 'Assessment'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enhancedDashas.map((d, i) => {
                  const ratingColor = d.rating === 'excellent' ? GREEN : d.rating === 'favourable' ? BLUE : d.rating === 'mixed' ? '#E65100' : RED;
                  const ratingBg = d.rating === 'excellent' ? '#E8F5E9' : d.rating === 'favourable' ? '#E3F2FD' : d.rating === 'mixed' ? '#FFF3E0' : '#FDECEA';
                  return (
                    <tr key={d.planet} style={{
                      background: d.isCurrent ? '#FDF6E3' : i % 2 === 0 ? '#FFFFFF' : '#FAFAF5',
                      fontWeight: d.isCurrent ? 600 : 400,
                    }}>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>
                        {getPlanetEmoji(d.planet)} {d.planet}
                        {d.isCurrent && <span style={{ fontSize: '8px', color: GOLD, marginLeft: '4px' }}>(Current)</span>}
                      </td>
                      <td style={tdStyle}>{d.startYear} &ndash; {d.endYear}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{d.duration} yrs</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '1px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700, background: ratingBg, color: ratingColor, textTransform: 'capitalize' }}>
                          {d.rating === 'excellent' ? '🌟 ' : d.rating === 'favourable' ? '✅ ' : d.rating === 'mixed' ? '⚖️ ' : '⚠️ '}{d.rating}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontSize: '9px', color: TEXT_MED }}>{truncate(d.ratingReason, 100)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Current Mahadasha Antardashas */}
            {currentMahadasha && currentMahadasha.antardashas && currentMahadasha.antardashas.length > 0 && (
              <>
                {subSectionTitle(`${getPlanetEmoji(currentMahadasha.planet)} ${currentMahadasha.planet} Mahadasha — Antardasha Sub-Periods`)}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr>
                      {['Sub-Period', 'Start', 'End', 'Duration', 'Status'].map(h => (
                        <th key={h} style={{ ...thStyle, fontSize: '9px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentMahadasha.antardashas.map((ad, i) => (
                      <tr key={`${ad.planet}-${i}`} style={{
                        background: ad.isCurrent ? '#FDF6E3' : i % 2 === 0 ? '#FFFFFF' : '#FAFAF5',
                      }}>
                        <td style={{ ...tdStyle, fontWeight: 600, fontSize: '10px' }}>
                          {getPlanetEmoji(currentMahadasha.planet)} {currentMahadasha.planet}/{getPlanetEmoji(ad.planet)} {ad.planet}
                        </td>
                        <td style={tdStyle}>{ad.startMonth}/{ad.startYear}</td>
                        <td style={tdStyle}>{ad.endMonth}/{ad.endYear}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          {ad.duration > 0 ? `${Math.floor(ad.duration / 12)}y ${ad.duration % 12}m` : '<1m'}
                        </td>
                        <td style={tdStyle}>
                          {ad.isCurrent && badge('Active', GOLD, GOLD_BG)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {pageFooter(10 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGES: 35-Year Dasha Prediction Summary ═══════════════ */}
        {dashaPredictions && dashaPredictions.length > 0 && (() => {
          const perPage = 4;
          const pages: DashaPredictionEntry[][] = [];
          for (let i = 0; i < dashaPredictions.length; i += perPage) {
            pages.push(dashaPredictions.slice(i, i + perPage));
          }
          return pages.map((pagePreds, pageIdx) => (
            <div key={`dasha-pred-${pageIdx}`} data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {pageIdx === 0 ? chapterHeader(10, '📊 35-Year Prediction Summary') : pageHeader('📊 Prediction Summary (contd.)')}
              {pageIdx === 0 && (
                <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 10px 0' }}>
                  Detailed predictions for each Mahadasha/Antardasha period based on planetary influences
                </p>
              )}

              {pagePreds.map((pred, i) => (
                <div key={i} style={{
                  padding: '10px 14px', marginBottom: '8px', borderRadius: '4px',
                  border: `1px solid ${pred.isCurrent ? GOLD : BORDER}`,
                  background: pred.isCurrent ? '#FFF8E7' : (i % 2 === 0 ? '#FAFAF5' : '#FFFFFF'),
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT }}>{getPlanetEmoji(pred.mahadasha)} {pred.mahadasha} / {getPlanetEmoji(pred.antardasha)} {pred.antardasha}</span>
                      {pred.isCurrent && badge('Current', '#FFF', GOLD)}
                      {badge(`${pred.rating === 'excellent' ? '🌟 ' : pred.rating === 'favourable' ? '✅ ' : pred.rating === 'mixed' ? '⚖️ ' : '⚠️ '}${pred.rating}`, pred.rating === 'excellent' ? GREEN : pred.rating === 'favourable' ? BLUE : pred.rating === 'mixed' ? '#B8860B' : RED, pred.rating === 'excellent' ? '#E8F5E9' : pred.rating === 'favourable' ? '#E3F2FD' : pred.rating === 'mixed' ? GOLD_BG : '#FFEBEE')}
                    </div>
                    <span style={{ fontSize: '9px', color: TEXT_LIGHT }}>{pred.startMonth}/{pred.startYear} — {pred.endMonth}/{pred.endYear}</span>
                  </div>
                  <p style={{ fontSize: '9px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{truncate(pred.prediction, 400)}</p>
                </div>
              ))}

              {pageFooter()}
            </div>
          ));
        })()}

        {/* ═══════════════ Transit Predictions ═══════════════ */}
        {transits && transits.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(11, '🔄 Transit Predictions')}
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
              Current planetary transits from {chart.moonSign.name} Moon Sign
            </p>

            {transits.map(t => (
              <div key={t.planet} style={{
                padding: '10px 14px',
                marginBottom: '8px',
                borderRadius: '4px',
                border: `1px solid ${t.isPositive ? '#C8E6C9' : '#EECECE'}`,
                background: t.isPositive ? '#F5FFF5' : '#FFF5F5',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT }}>{getPlanetEmoji(t.planet)} {t.planet}</span>
                    {badge(t.isPositive ? '✅ Favourable' : '⚠️ Challenging', t.isPositive ? GREEN : RED, t.isPositive ? '#E8F5E9' : '#FDECEA')}
                  </div>
                  <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>
                    {getRashiEmojiByName(t.transitSign)} {t.transitSign} &bull; {t.houseFromMoon}{t.houseFromMoon === 1 ? 'st' : t.houseFromMoon === 2 ? 'nd' : t.houseFromMoon === 3 ? 'rd' : 'th'} from Moon
                  </span>
                </div>
                <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{t.effects}</p>
                {(t.startDate || t.endDate) && (
                  <p style={{ fontSize: '9px', color: TEXT_LIGHT, marginTop: '4px', margin: '4px 0 0 0' }}>
                    {t.startDate && `From: ${t.startDate}`}{t.startDate && t.endDate && ' — '}{t.endDate && `To: ${t.endDate}`}
                  </p>
                )}
              </div>
            ))}

            {pageFooter(11 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 11: Nakshatra Remedies ═══════════════ */}
        {nakshatraRemedy && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(12, '✨ Nakshatra Remedies')}
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
              Nakshatra Remedies — {nakshatraRemedy.nakshatra} ({nakshatraRemedy.sign})
            </p>

            {/* Characteristics */}
            <div style={{ padding: '10px 14px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}`, marginBottom: '12px' }}>
              <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{nakshatraRemedy.characteristics}</p>
            </div>

            {/* Star Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
              {[
                ['Star Lord', nakshatraRemedy.starLord],
                ['Sign Lord', nakshatraRemedy.signLord],
                ['Element', nakshatraRemedy.element],
                ['Animal', nakshatraRemedy.animal],
                ['Tree', nakshatraRemedy.tree],
                ['Bird', nakshatraRemedy.bird],
              ].map(([label, val]) => (
                <div key={label} style={{ padding: '6px 8px', background: '#FAFAF5', borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: '8px', color: TEXT_LIGHT, textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block' }}>{label}</span>
                  <span style={{ fontSize: '10px', color: TEXT, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Hostile Periods */}
            {subSectionTitle('Hostile Dasa Periods')}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {nakshatraRemedy.hostileDasas.map(d => badge(d, RED, '#FDECEA'))}
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: TEXT_LIGHT, marginRight: '4px' }}>Avoid on:</span>
              {nakshatraRemedy.hostileNakshatras.map(n => (
                <span key={n} style={{ fontSize: '9px', padding: '2px 6px', background: '#FFF3E0', color: '#E65100', borderRadius: '8px', border: '1px solid #FFCC80' }}>{n}</span>
              ))}
            </div>

            {/* General Advice */}
            {subSectionTitle('General Advice')}
            <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', marginBottom: '12px' }}>{nakshatraRemedy.generalAdvice}</p>

            {/* Remedies */}
            {subSectionTitle('Remedies')}
            {[
              ['Prayer', nakshatraRemedy.remedies.prayer],
              ['Fasting', nakshatraRemedy.remedies.fasting],
              ['Dress', nakshatraRemedy.remedies.dress],
              ['Deity Worship', nakshatraRemedy.remedies.deity],
              ['Sacred Activities', nakshatraRemedy.remedies.nurturing],
            ].map(([label, text]) => (
              <div key={label} style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', color: GOLD, fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{label}</span>
                <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5', margin: '2px 0 0 0' }}>{text}</p>
              </div>
            ))}

            {/* Mantras */}
            {subSectionTitle('Sacred Mantras')}
            <div style={{ padding: '10px 14px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
              {nakshatraRemedy.remedies.mantras.map((m, i) => (
                <p key={i} style={{ fontSize: '11px', color: GOLD, fontWeight: 600, fontStyle: 'italic', margin: i === 0 ? 0 : '6px 0 0 0', textAlign: 'center' }}>{m}</p>
              ))}
            </div>

            {pageFooter(12 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGES 12+: Dasa Remedies ═══════════════ */}
        {dasaRemediesList && dasaRemediesList.length > 0 && (() => {
          // 3 remedies per page
          const remediesPerPage = 3;
          const pages: { planet: string; remedy: DasaRemedy }[][] = [];
          for (let i = 0; i < dasaRemediesList.length; i += remediesPerPage) {
            pages.push(dasaRemediesList.slice(i, i + remediesPerPage));
          }
          const nrOff = nakshatraRemedy ? 1 : 0; // offset for nakshatra remedy page
          return pages.map((pageRemedies, pageIdx) => (
            <div key={`dasa-rem-${pageIdx}`} data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {pageHeader(pageIdx === 0 ? '🙏 Dasa Period Remedies' : '🙏 Dasa Remedies (contd.)')}
              {pageIdx === 0 && (
                <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>
                  Remedies for unfavorable dasa periods to mitigate negative planetary influences
                </p>
              )}

              {pageRemedies.map(({ planet, remedy }) => (
                <div key={planet} style={{
                  padding: '12px 14px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: `1px solid ${BORDER}`,
                  background: '#FAFAF5',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{getPlanetEmoji(remedy.planet)} {remedy.planet} Dasa</span>
                    <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>({remedy.sanskrit})</span>
                    {badge('Remedy Needed', RED, '#FDECEA')}
                  </div>

                  <p style={{ fontSize: '9.5px', color: TEXT_MED, lineHeight: '1.5', margin: '0 0 8px 0' }}>
                    {truncate(remedy.unfavorableEffects, 250)}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ padding: '6px 8px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: '8px', color: TEXT_LIGHT, textTransform: 'uppercase', display: 'block' }}>Dress Colors</span>
                      <span style={{ fontSize: '9px', color: TEXT, fontWeight: 600 }}>{remedy.dress.colors.join(', ')}</span>
                    </div>
                    <div style={{ padding: '6px 8px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: '8px', color: TEXT_LIGHT, textTransform: 'uppercase', display: 'block' }}>Fasting Day</span>
                      <span style={{ fontSize: '9px', color: TEXT, fontWeight: 600 }}>{remedy.fasting.day}</span>
                    </div>
                    <div style={{ padding: '6px 8px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: '8px', color: TEXT_LIGHT, textTransform: 'uppercase', display: 'block' }}>Deity</span>
                      <span style={{ fontSize: '9px', color: TEXT, fontWeight: 600 }}>{remedy.deity.primary}</span>
                    </div>
                    <div style={{ padding: '6px 8px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: '8px', color: TEXT_LIGHT, textTransform: 'uppercase', display: 'block' }}>Gemstone</span>
                      <span style={{ fontSize: '9px', color: TEXT, fontWeight: 600 }}>{remedy.gemstone}</span>
                    </div>
                  </div>

                  {/* Key mantras */}
                  <div style={{ padding: '6px 10px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}` }}>
                    <span style={{ fontSize: '8px', color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Key Mantra</span>
                    <p style={{ fontSize: '10px', color: GOLD, fontWeight: 600, fontStyle: 'italic', margin: '2px 0 0 0' }}>
                      {remedy.generalMantras[0]}
                    </p>
                  </div>
                </div>
              ))}

              {pageFooter(12 + nrOff + pageIdx + 1 + pOff)}
            </div>
          ));
        })()}

        {/* ═══════════════ Favourable Periods ═══════════════ */}
        {favourablePeriods && (() => {
          const nrOff = nakshatraRemedy ? 1 : 0;
          const drOff = dasaRemediesList && dasaRemediesList.length > 0 ? Math.ceil(dasaRemediesList.length / 3) : 0;
          const fpBasePageNum = 12 + nrOff + drOff + pOff;

          function periodsTable(periods: FavourablePeriod[], title: string, pageNum: number) {
            const ratingColor = (r: string) => r === 'excellent' ? GREEN : r === 'favourable' ? BLUE : '#E65100';
            const ratingBg = (r: string) => r === 'excellent' ? '#E8F5E9' : r === 'favourable' ? '#E3F2FD' : '#FFF3E0';
            return (
              <div key={title}>
                {subSectionTitle(title)}
                {periods.length === 0 ? (
                  <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '4px 0 12px 0' }}>No significant periods identified for analysis range.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '16px' }}>
                    <thead>
                      <tr>
                        {['Rating', 'Period', 'Age', 'Duration'].map(h => (
                          <th key={h} style={{ ...thStyle, fontSize: '9px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {periods.slice(0, 15).map((p, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                          <td style={tdStyle}>
                            <span style={{
                              padding: '1px 6px', borderRadius: '8px', fontSize: '8px', fontWeight: 700,
                              background: ratingBg(p.rating), color: ratingColor(p.rating), textTransform: 'capitalize',
                            }}>{p.rating.replace('_', ' ')}</span>
                          </td>
                          <td style={{ ...tdStyle, fontSize: '9px' }}>{p.startDate} — {p.endDate}</td>
                          <td style={{ ...tdStyle, fontSize: '9px' }}>{p.startAge} — {p.endAge}</td>
                          <td style={{ ...tdStyle, fontSize: '9px', textAlign: 'center' }}>{p.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          }

          return (
            <>
              {/* Page 1: Career + Business */}
              <div data-pdf-page style={pageBase}>
                <div style={decorativeBorder()} />
                {omWatermark()}

                {chapterHeader(14, '📅 Favourable Periods')}
                <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 8px 0' }}>
                  Analysis of Dasa/Antardasha periods for optimal timing of major life activities
                </p>

                {periodsTable(favourablePeriods.career, 'Favourable Periods for Career', fpBasePageNum + 1)}
                {periodsTable(favourablePeriods.business, 'Favourable Periods for Business', fpBasePageNum + 1)}

                {pageFooter(fpBasePageNum + 1)}
              </div>

              {/* Page 2: House Construction */}
              <div data-pdf-page style={pageBase}>
                <div style={decorativeBorder()} />
                {omWatermark()}

                {pageHeader('📅 Favourable Periods (contd.)')}

                {periodsTable(favourablePeriods.houseConstruction, 'Favourable Periods for House Construction', fpBasePageNum + 2)}

                <div style={{ padding: '12px 14px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}`, marginTop: '12px' }}>
                  <span style={{ fontSize: '9px', color: GOLD, fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}>How to Read This Table</span>
                  <div style={{ marginTop: '6px' }}>
                    {[
                      { label: 'Excellent', desc: 'Highly auspicious period — both Mahadasha and Antardasha lords strongly support this activity', color: GREEN, bg: '#E8F5E9' },
                      { label: 'Favourable', desc: 'Good period — planetary influences are supportive. Proceed with confidence', color: BLUE, bg: '#E3F2FD' },
                      { label: 'Less Favourable', desc: 'Challenging period — proceed with caution and consider remedial measures', color: '#E65100', bg: '#FFF3E0' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ padding: '1px 6px', borderRadius: '8px', fontSize: '8px', fontWeight: 700, background: item.bg, color: item.color, flexShrink: 0, marginTop: '2px' }}>{item.label}</span>
                        <span style={{ fontSize: '9px', color: TEXT_MED, lineHeight: '1.5' }}>{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {pageFooter(fpBasePageNum + 2)}
              </div>
            </>
          );
        })()}

        {/* ═══════════════ AshtakaVarga Predictions ═══════════════ */}
        {ashtakavarga && (() => {
          const avPlanets = ashtakavarga.planets;
          const sarva = ashtakavarga.sarvashtakavarga;
          const signAbbrs = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
          const hindiAbbrs = ['Me', 'Vr', 'Mi', 'Ka', 'Si', 'Kn', 'Tu', 'Vs', 'Dh', 'Mk', 'Ku', 'Mn'];

          function binduColor(b: number): string {
            if (b >= 5) return GREEN;
            if (b >= 4) return BLUE;
            if (b >= 3) return TEXT;
            return RED;
          }

          return (
            <>
              {/* Page 1: AshtakaVarga Table + Individual predictions */}
              <div data-pdf-page style={pageBase}>
                <div style={decorativeBorder()} />
                {omWatermark()}

                {chapterHeader(15, '📐 AshtakaVarga Predictions')}
                <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 8px 0' }}>
                  Planetary strength analysis based on eightfold bindhu system (Lagna in {chart.ascendant.name})
                </p>

                {/* Full AshtakaVarga Table */}
                {subSectionTitle('Sarvashtakavarga Table')}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', marginBottom: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, fontSize: '8px', padding: '5px 4px' }}></th>
                      {signAbbrs.map((s, i) => (
                        <th key={s} style={{ ...thStyle, fontSize: '8px', padding: '5px 3px', textAlign: 'center', minWidth: '32px' }}>
                          <div>{hindiAbbrs[i]}</div>
                          <div style={{ color: TEXT_LIGHT, fontWeight: 400, fontSize: '7px' }}>{s}</div>
                        </th>
                      ))}
                      <th style={{ ...thStyle, fontSize: '8px', padding: '5px 4px', textAlign: 'center' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avPlanets.map((p, pi) => {
                      const natalSign = chart.planets[p.planet]?.signIndex ?? 0;
                      return (
                        <tr key={p.planet} style={{ background: pi % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                          <td style={{ ...tdStyle, fontWeight: 700, fontSize: '9px', padding: '4px 6px' }}>{getPlanetEmoji(p.planet)} {p.planet.slice(0, 3)}</td>
                          {p.bindhus.map((b, si) => (
                            <td key={si} style={{
                              ...tdStyle,
                              textAlign: 'center',
                              fontSize: '9px',
                              fontWeight: si === natalSign ? 700 : 400,
                              color: binduColor(b),
                              padding: '4px 2px',
                              background: si === natalSign ? GOLD_BG : undefined,
                            }}>
                              {b}{si === natalSign ? '*' : ''}
                            </td>
                          ))}
                          <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, fontSize: '9px', padding: '4px 4px' }}>{p.total}</td>
                        </tr>
                      );
                    })}
                    {/* Sarvashtakavarga totals row */}
                    <tr style={{ background: GOLD_BG }}>
                      <td style={{ ...tdStyle, fontWeight: 700, fontSize: '9px', padding: '5px 6px', color: GOLD }}>Total</td>
                      {sarva.totals.map((t, si) => (
                        <td key={si} style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, fontSize: '9px', padding: '5px 2px', color: GOLD }}>{t}</td>
                      ))}
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, fontSize: '10px', padding: '5px 4px', color: GOLD }}>{sarva.grandTotal}</td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ fontSize: '8px', color: TEXT_LIGHT, margin: '0 0 12px 0' }}>* Planetary natal position</p>

                {/* Individual planet predictions */}
                {subSectionTitle('Planet Strength Predictions')}
                {avPlanets.map(p => {
                  const isStrong = p.natalSignBindhus >= 5;
                  const isWeak = p.natalSignBindhus <= 2;
                  return (
                    <div key={p.planet} style={{
                      padding: '8px 12px',
                      marginBottom: '6px',
                      borderRadius: '4px',
                      border: `1px solid ${isWeak ? '#EECECE' : isStrong ? '#C8E6C9' : BORDER}`,
                      background: isWeak ? '#FFF5F5' : isStrong ? '#F5FFF5' : '#FAFAF5',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: TEXT }}>{getPlanetEmoji(p.planet)} {p.planet}</span>
                        <span style={{
                          fontSize: '9px', padding: '1px 6px', borderRadius: '8px', fontWeight: 700,
                          background: isWeak ? '#FDECEA' : isStrong ? '#E8F5E9' : GOLD_BG,
                          color: isWeak ? RED : isStrong ? GREEN : GOLD,
                        }}>{p.natalSignBindhus} Bindhus</span>
                      </div>
                      <p style={{ fontSize: '9px', color: TEXT_MED, lineHeight: '1.5', margin: 0 }}>{truncate(p.prediction, 200)}</p>
                    </div>
                  );
                })}

                {pageFooter()}
              </div>

              {/* Page 2: Sarvashtakavarga Analysis */}
              <div data-pdf-page style={pageBase}>
                <div style={decorativeBorder()} />
                {omWatermark()}

                {pageHeader('📐 Sarvashtakavarga Analysis')}

                {subSectionTitle('Collective Influence of Planets')}
                <div style={{ padding: '12px 14px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}`, marginBottom: '16px' }}>
                  <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{sarva.prediction}</p>
                </div>

                {/* Sign-wise strength visualization */}
                {subSectionTitle('Sign-wise Strength')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  {sarva.totals.map((total, si) => {
                    const avg = sarva.grandTotal / 12;
                    const isStrong = total >= avg + 3;
                    const isWeak = total <= avg - 3;
                    const barWidth = Math.round((total / 45) * 100);
                    return (
                      <div key={si} style={{ padding: '6px 8px', background: '#FAFAF5', borderRadius: '4px', border: `1px solid ${isStrong ? '#C8E6C9' : isWeak ? '#EECECE' : BORDER}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 600, color: TEXT }}>
                            {signAbbrs[si]} ({hindiAbbrs[si]})
                          </span>
                          <span style={{ fontSize: '9px', fontWeight: 700, color: isStrong ? GREEN : isWeak ? RED : GOLD }}>{total}</span>
                        </div>
                        <div style={{ height: '4px', background: '#EEE', borderRadius: '2px' }}>
                          <div style={{ height: '100%', width: `${barWidth}%`, background: isStrong ? GREEN : isWeak ? RED : GOLD, borderRadius: '2px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Key insights */}
                {subSectionTitle('Key Insights')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px 14px', background: '#F5FFF5', borderRadius: '4px', border: '1px solid #C8E6C9' }}>
                    <span style={{ fontSize: '9px', color: GREEN, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Strongest Sign</span>
                    <p style={{ fontSize: '12px', color: TEXT, fontWeight: 700, margin: '4px 0 2px 0' }}>
                      {signAbbrs[sarva.strongestSign]} — {sarva.totals[sarva.strongestSign]} bindhus
                    </p>
                    <p style={{ fontSize: '9px', color: TEXT_MED, margin: 0 }}>
                      Transits through this sign bring the most favorable results
                    </p>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#FFF5F5', borderRadius: '4px', border: '1px solid #EECECE' }}>
                    <span style={{ fontSize: '9px', color: RED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Weakest Sign</span>
                    <p style={{ fontSize: '12px', color: TEXT, fontWeight: 700, margin: '4px 0 2px 0' }}>
                      {signAbbrs[sarva.weakestSign]} — {sarva.totals[sarva.weakestSign]} bindhus
                    </p>
                    <p style={{ fontSize: '9px', color: TEXT_MED, margin: 0 }}>
                      Transits through this sign may bring challenges — remedies advised
                    </p>
                  </div>
                </div>

                <div style={{ padding: '10px 14px', background: GOLD_BG, borderRadius: '4px', border: `1px solid ${BORDER}`, marginTop: '12px' }}>
                  <span style={{ fontSize: '9px', color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Grand Total</span>
                  <p style={{ fontSize: '14px', color: GOLD, fontWeight: 700, margin: '4px 0 2px 0' }}>{sarva.grandTotal}</p>
                  <p style={{ fontSize: '9px', color: TEXT_MED, margin: 0 }}>
                    Standard total is 337. {sarva.grandTotal >= 337 ? 'Your chart meets or exceeds the standard.' : 'Variations are normal and reflect individual planetary placements.'}
                  </p>
                </div>

                {pageFooter()}
              </div>
            </>
          );
        })()}

        {/* ═══════════════ Paryanthar Dasa (Pratyantardasha) Predictions ═══════════════ */}
        {pratyantardasha && pratyantardasha.periods.length > 0 && (() => {
          // Show ~8 entries per page
          const entriesPerPage = 8;
          const entries = pratyantardasha.periods;
          const pages: PratyantardashaEntry[][] = [];
          for (let i = 0; i < entries.length; i += entriesPerPage) {
            pages.push(entries.slice(i, i + entriesPerPage));
          }
          // Limit to reasonable number of PDF pages (max 10 pages = 80 entries)
          const maxPages = Math.min(pages.length, 10);

          return pages.slice(0, maxPages).map((pageEntries, pageIdx) => (
            <div key={`prat-${pageIdx}`} data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {pageHeader(pageIdx === 0 ? '🔄 Detailed Period Predictions (Paryanthar Dasa)' : '🔄 Period Predictions (contd.)')}
              {pageIdx === 0 && (
                <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 8px 0' }}>
                  Sub-sub-period predictions based on Vimshottari Dasa system ({entries.length} periods analyzed)
                </p>
              )}

              {pageEntries.map((entry, ei) => {
                const isPositive = !entry.prediction.toLowerCase().includes('challenging') && !entry.prediction.toLowerCase().includes('difficult');
                return (
                  <div key={`${entry.mahadasha}-${entry.antardasha}-${entry.pratyantardasha}-${ei}`} style={{
                    padding: '8px 12px',
                    marginBottom: '6px',
                    borderRadius: '4px',
                    border: `1px solid ${entry.isCurrent ? GOLD_LIGHT : BORDER}`,
                    background: entry.isCurrent ? GOLD_BG : '#FAFAF5',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: TEXT }}>
                          {getPlanetEmoji(entry.mahadasha)} {entry.mahadasha}/{getPlanetEmoji(entry.antardasha)} {entry.antardasha}/{getPlanetEmoji(entry.pratyantardasha)} {entry.pratyantardasha}
                        </span>
                        {entry.isCurrent && badge('Current', GOLD, GOLD_BG)}
                      </div>
                      <span style={{ fontSize: '9px', color: TEXT_LIGHT }}>{entry.duration}</span>
                    </div>
                    <div style={{ fontSize: '9px', color: TEXT_LIGHT, marginBottom: '4px' }}>
                      {entry.startDate} — {entry.endDate} &bull; Age {entry.startAge} to {entry.endAge}
                    </div>
                    <p style={{ fontSize: '9px', color: TEXT_MED, lineHeight: '1.5', margin: 0 }}>
                      {truncate(entry.prediction, 220)}
                    </p>
                  </div>
                );
              })}

              {pageIdx === maxPages - 1 && pages.length > maxPages && (
                <p style={{ fontSize: '9px', color: TEXT_LIGHT, textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}>
                  Showing {maxPages * entriesPerPage} of {entries.length} total periods. Full predictions available on the website.
                </p>
              )}

              {pageFooter()}
            </div>
          ));
        })()}

        {/* ═══════════════ Calculation Tables ═══════════════ */}
        {longitudeTable && longitudeTable.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {chapterHeader(17, '🧮 Calculations & Tables')}

            {/* Nirayana Longitude Table */}
            {subSectionTitle('Nirayana Longitude of Planets')}
            <p style={{ fontSize: '9px', color: TEXT_LIGHT, margin: '0 0 6px 0' }}>
              Indian system longitudes based on Chitrapaksha Ayanamsa
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '16px' }}>
              <thead>
                <tr>
                  {['Planet', 'Longitude', 'Sign', 'Deg in Sign', 'Nakshatra', 'Pada', 'R'].map(h => (
                    <th key={h} style={{ ...thStyle, fontSize: '9px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {longitudeTable.map((l, i) => (
                  <tr key={l.planet} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{getPlanetEmoji(l.planet)} {l.planet}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '9px' }}>{l.longitude}</td>
                    <td style={tdStyle}>{getRashiEmojiByName(l.sign)} {l.sign} ({l.hindi})</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '9px' }}>{l.degreeInSign}</td>
                    <td style={tdStyle}>{l.nakshatra}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{l.pada}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: l.retrograde ? RED : GREEN, fontWeight: 600 }}>
                      {l.retrograde ? '🔄 R' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Combustion */}
            {combustion && combustion.length > 0 && (
              <>
                {subSectionTitle('Planets in Sun\'s Proximity (Moudhyam / Combustion)')}
                <p style={{ fontSize: '9px', color: TEXT_LIGHT, margin: '0 0 6px 0' }}>
                  A planet is combust when too close to the Sun, weakening its significations
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '16px' }}>
                  <thead>
                    <tr>
                      {['Planet', 'Dist from Sun', 'Threshold', 'Status', 'Effect'].map(h => (
                        <th key={h} style={{ ...thStyle, fontSize: '9px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {combustion.map((c, i) => (
                      <tr key={c.planet} style={{ background: c.isCombust ? '#FFF5F5' : i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{getPlanetEmoji(c.planet)} {c.planet}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{c.distanceFromSun}°</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{c.combustionThreshold}°</td>
                        <td style={tdStyle}>
                          {c.isCombust
                            ? badge('🔥 Combust', RED, '#FDECEA')
                            : badge('Safe', GREEN, '#E8F5E9')
                          }
                        </td>
                        <td style={{ ...tdStyle, fontSize: '9px', color: TEXT_MED }}>{truncate(c.effect, 80)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Planetary War */}
            {planetaryWar && planetaryWar.length > 0 && (
              <>
                {subSectionTitle('Planetary War (Graha Yuddha)')}
                <p style={{ fontSize: '9px', color: TEXT_LIGHT, margin: '0 0 6px 0' }}>
                  When non-luminary planets are within 1° of each other
                </p>
                {planetaryWar.map(w => (
                  <div key={`${w.planet1}-${w.planet2}`} style={{
                    padding: '8px 12px', marginBottom: '6px', borderRadius: '4px',
                    border: `1px solid ${BORDER}`, background: '#FFF3E0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: TEXT }}>{getPlanetEmoji(w.planet1)} {w.planet1} vs {getPlanetEmoji(w.planet2)} {w.planet2}</span>
                      <span style={{ fontSize: '9px', color: TEXT_LIGHT }}>({w.distance}° apart)</span>
                      {badge(`${getPlanetEmoji(w.winner)} ${w.winner} Wins`, GREEN, '#E8F5E9')}
                    </div>
                    <p style={{ fontSize: '9px', color: TEXT_MED, lineHeight: '1.5', margin: 0 }}>{w.effect}</p>
                  </div>
                ))}
              </>
            )}

            {/* No planetary war note */}
            {(!planetaryWar || planetaryWar.length === 0) && (
              <>
                {subSectionTitle('Planetary War (Graha Yuddha)')}
                <div style={{ padding: '8px 12px', borderRadius: '4px', border: `1px solid #C8E6C9`, background: '#F5FFF5' }}>
                  <p style={{ fontSize: '10px', color: GREEN, fontWeight: 600, margin: 0 }}>
                    No planetary war detected in this chart. All planets maintain safe distances from each other.
                  </p>
                </div>
              </>
            )}

            {pageFooter()}
          </div>
        )}

        {/* ═══════════════ Additional Tables Page 2: Grahavastha + Shadbala ═══════════════ */}
        {grahavastha && grahavastha.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('🧮 Calculations & Tables (contd.)')}

            {subSectionTitle('Planetary Status (Grahavastha)')}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>{['Planet', 'Sign', 'Degree', 'Dignity', 'Status', 'Retro'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {grahavastha.map((g, i) => (
                  <tr key={g.planet} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{getPlanetEmoji(g.planet)} {g.planet}</td>
                    <td style={tdStyle}>{getRashiEmojiByName(g.sign)} {g.sign}</td>
                    <td style={tdStyle}>{g.degree}°</td>
                    <td style={tdStyle}>{g.dignity}</td>
                    <td style={tdStyle}>
                      {g.status === 'exalted' ? badge('⬆️ Exalted', GREEN, '#E8F5E9') :
                       g.status === 'debilitated' ? badge('⬇️ Debilitated', RED, '#FFEBEE') :
                       g.status === 'own' ? badge('Own', BLUE, '#E3F2FD') :
                       g.status === 'moolatrikona' ? badge('Moola.', GOLD, GOLD_BG) :
                       badge(g.status, TEXT_MED, '#F5F5F5')}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: g.retrograde ? RED : GREEN }}>{g.retrograde ? '🔄 R' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {shadbala && shadbala.length > 0 && (
              <>
                {subSectionTitle('Planetary Strength (Shadbala — Simplified)')}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>{['Planet', 'Sthana', 'Dig', 'Naisargika', 'Total', 'Strength', '%'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {shadbala.map((s, i) => (
                      <tr key={s.planet} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{getPlanetEmoji(s.planet)} {s.planet}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{s.sthanaBala}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{s.digBala}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{s.naisargikaBala}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600 }}>{s.totalBala}</td>
                        <td style={tdStyle}>
                          {s.strength === 'very_strong' ? badge('Very Strong', GREEN, '#E8F5E9') :
                           s.strength === 'strong' ? badge('Strong', BLUE, '#E3F2FD') :
                           s.strength === 'moderate' ? badge('Moderate', GOLD, GOLD_BG) :
                           s.strength === 'weak' ? badge('Weak', '#E65100', '#FFF3E0') :
                           badge('Very Weak', RED, '#FFEBEE')}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600 }}>{s.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {ishtaKashta && ishtaKashta.length > 0 && (
              <>
                {subSectionTitle('Favourable/Unfavourable Effects (Ishta-Kashta Phala)')}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Planet', 'Ishta Phala', 'Kashta Phala', 'Net Effect'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {ishtaKashta.map((ik, i) => (
                      <tr key={ik.planet} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{getPlanetEmoji(ik.planet)} {ik.planet}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', color: GREEN }}>{ik.ishtaPhala}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', color: RED }}>{ik.kashtaPhala}</td>
                        <td style={tdStyle}>
                          {ik.netEffect === 'favorable' ? badge('Favorable', GREEN, '#E8F5E9') :
                           ik.netEffect === 'unfavorable' ? badge('Unfavorable', RED, '#FFEBEE') :
                           badge('Neutral', GOLD, GOLD_BG)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {pageFooter()}
          </div>
        )}

        {/* ═══════════════ Additional Tables Page 3: Bhavabala + Shodasavarga ═══════════════ */}
        {bhavabala && bhavabala.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('🧮 Calculations & Tables (contd.)')}

            {subSectionTitle('House Strength (Bhavabala)')}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>{['House', 'Sign', 'Lord', 'Strength', 'Rating'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {bhavabala.map((b, i) => (
                  <tr key={b.house} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{b.house}</td>
                    <td style={tdStyle}>{getRashiEmojiByName(b.sign)} {b.sign}</td>
                    <td style={tdStyle}>{getPlanetEmoji(b.signLord)} {b.signLord}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{b.strength}</td>
                    <td style={tdStyle}>
                      {b.category === 'strong' ? badge('Strong', GREEN, '#E8F5E9') :
                       b.category === 'moderate' ? badge('Moderate', GOLD, GOLD_BG) :
                       badge('Weak', RED, '#FFEBEE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {shodasavarga && shodasavarga.length > 0 && (
              <>
                {subSectionTitle('Divisional Chart Positions (Shodasavarga)')}
                <div style={{ overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
                    <thead>
                      <tr>
                        {['Planet', 'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D60'].map(h => (
                          <th key={h} style={{ ...thStyle, fontSize: '8px', padding: '5px 3px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {shodasavarga.map((s, i) => (
                        <tr key={s.planet} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                          <td style={{ ...tdStyle, fontWeight: 700, fontSize: '9px', padding: '5px 3px' }}>{getPlanetEmoji(s.planet)} {s.planet}</td>
                          {[s.d1, s.d2, s.d3, s.d4, s.d7, s.d9, s.d10, s.d12, s.d16, s.d20, s.d24, s.d27, s.d30, s.d60].map((v, j) => (
                            <td key={j} style={{ ...tdStyle, fontSize: '8px', padding: '5px 3px', textAlign: 'center' }}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {pageFooter()}
          </div>
        )}

        {/* ═══════════════ Additional Tables Page 4: Sayana + Bhava + KP ═══════════════ */}
        {sayanaLongitude && sayanaLongitude.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('🧮 Calculations & Tables (contd.)')}

            {subSectionTitle('Western (Sayana/Tropical) Longitude')}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>{['Planet', 'Nirayana', 'Ayanamsa', 'Sayana', 'Tropical Sign'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {sayanaLongitude.map((s, i) => (
                  <tr key={s.planet} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{getPlanetEmoji(s.planet)} {s.planet}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '10px' }}>{s.nirayana}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '10px', color: TEXT_LIGHT }}>{s.ayanamsa}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '10px' }}>{s.sayana}</td>
                    <td style={tdStyle}>{getRashiEmojiByName(s.tropicalSign)} {s.tropicalSign}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bhavaTable && bhavaTable.length > 0 && (
              <>
                {subSectionTitle('Bhava (House Cusp) Table')}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>{['House', 'Sign', 'Start', 'Mid', 'End', 'Planets'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {bhavaTable.map((b, i) => (
                      <tr key={b.house} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                        <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{b.house}</td>
                        <td style={tdStyle}>{getRashiEmojiByName(b.sign)} {b.sign}</td>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '10px' }}>{b.startDegree}</td>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '10px' }}>{b.midDegree}</td>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '10px' }}>{b.endDegree}</td>
                        <td style={tdStyle}>{b.planetsInHouse.map(p => `${getPlanetEmoji(p)} ${p}`).join(', ') || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {kpTable && kpTable.length > 0 && (
              <>
                {subSectionTitle('Star Lord / Sub-Lord Table (KP System)')}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Planet', 'Position', 'Nakshatra', 'Star Lord', 'Sub Lord', 'Sub-Sub Lord'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {kpTable.map((k, i) => (
                      <tr key={k.planet} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF5' }}>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{getPlanetEmoji(k.planet)} {k.planet}</td>
                        <td style={{ ...tdStyle, fontSize: '10px' }}>{k.signDegree}</td>
                        <td style={tdStyle}>{k.nakshatra}</td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{getPlanetEmoji(k.nakshatraLord)} {k.nakshatraLord}</td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{getPlanetEmoji(k.subLord)} {k.subLord}</td>
                        <td style={tdStyle}>{getPlanetEmoji(k.subSubLord)} {k.subSubLord}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {pageFooter()}
          </div>
        )}

        {/* ═══════════════ FINAL PAGE: Nakshatra + Recommendations ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}
          <div style={{ position: 'absolute', top: '20px', right: '24px' }}><img src={LOGO_IMG_SRC} alt="" style={{ height: '24px', width: 'auto', opacity: 0.7 }} /></div>

          {/* Nakshatra Details */}
          {nakshatraData && (
            <>
              {sectionTitle(`✨ Nakshatra — ${chart.nakshatra}`)}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 40px',
                padding: '14px 18px',
                background: GOLD_BG,
                borderRadius: '6px',
                border: `1px solid ${BORDER}`,
              }}>
                {[
                  ['Deity', nakshatraData.deity],
                  ['Symbol', nakshatraData.symbol],
                  ['Planetary Ruler', nakshatraData.ruler],
                  ['Nature', nakshatraData.nature],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: '8px', padding: '3px 0' }}>
                    <span style={{ fontSize: '11px', color: TEXT_LIGHT, minWidth: '95px', fontWeight: 500 }}>{label}:</span>
                    <span style={{ fontSize: '11px', color: TEXT, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: TEXT_MED, marginTop: '10px', lineHeight: '1.6' }}>
                {nakshatraData.qualities}
              </p>
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '10px', color: TEXT_LIGHT, fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Suited Careers
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {nakshatraData.careers.map(c => (
                    <span key={c} style={{
                      fontSize: '10px',
                      padding: '3px 10px',
                      background: GOLD_BG,
                      color: GOLD,
                      borderRadius: '12px',
                      border: `1px solid ${BORDER}`,
                      fontWeight: 600,
                    }}>{c}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Current Dasha */}
          {sectionTitle('⏳ Current Dasha Period')}
          <div style={{
            padding: '16px 20px',
            background: GOLD_BG,
            borderRadius: '6px',
            border: `1px solid ${BORDER}`,
          }}>
            <p style={{ fontSize: '16px', color: TEXT, fontWeight: 700, margin: '0 0 4px 0' }}>
              {getPlanetEmoji(currentDashaLord)} {currentDashaLord} Mahadasha
            </p>
            <p style={{ fontSize: '12px', color: TEXT_LIGHT, margin: '0 0 8px 0' }}>
              {getPlanetEmoji(dashaOrder[(currentDashaIndex + 1) % 9])} {dashaOrder[(currentDashaIndex + 1) % 9]} Antardasha
            </p>
            <p style={{
              fontSize: '12px',
              margin: 0,
              fontWeight: 600,
              color: dashaBenefic ? GREEN : currentDashaLord === dashaMalefic ? RED : GOLD,
            }}>
              {dashaBenefic ? 'Benefic Period — Favorable time for growth and success' : currentDashaLord === dashaMalefic ? 'Challenging Period — Remedies advised for this phase' : 'Neutral Period — Steady progress expected'}
            </p>
          </div>

          {/* Recommendations */}
          {(horoscope?.gem || horoscope?.deity || horoscope?.element || horoscope?.ruler) && (
            <>
              {sectionTitle('💎 Recommendations')}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px 40px',
                padding: '14px 18px',
                background: GOLD_BG,
                borderRadius: '6px',
                border: `1px solid ${BORDER}`,
              }}>
                {horoscope?.gem && (
                  <div style={{ display: 'flex', gap: '8px', padding: '3px 0' }}>
                    <span style={{ fontSize: '11px', color: TEXT_LIGHT, minWidth: '70px', fontWeight: 500 }}>Gemstone:</span>
                    <span style={{ fontSize: '11px', color: GOLD, fontWeight: 700 }}>{horoscope.gem}</span>
                  </div>
                )}
                {horoscope?.deity && (
                  <div style={{ display: 'flex', gap: '8px', padding: '3px 0' }}>
                    <span style={{ fontSize: '11px', color: TEXT_LIGHT, minWidth: '70px', fontWeight: 500 }}>Deity:</span>
                    <span style={{ fontSize: '11px', color: GOLD, fontWeight: 700 }}>{horoscope.deity}</span>
                  </div>
                )}
                {horoscope?.element && (
                  <div style={{ display: 'flex', gap: '8px', padding: '3px 0' }}>
                    <span style={{ fontSize: '11px', color: TEXT_LIGHT, minWidth: '70px', fontWeight: 500 }}>Element:</span>
                    <span style={{ fontSize: '11px', color: GOLD, fontWeight: 700 }}>{horoscope.element}</span>
                  </div>
                )}
                {horoscope?.ruler && (
                  <div style={{ display: 'flex', gap: '8px', padding: '3px 0' }}>
                    <span style={{ fontSize: '11px', color: TEXT_LIGHT, minWidth: '70px', fontWeight: 500 }}>Ruler:</span>
                    <span style={{ fontSize: '11px', color: GOLD, fontWeight: 700 }}>{horoscope.ruler}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Compatibility */}
          {horoscope?.compatibility && horoscope.compatibility.length > 0 && (
            <>
              {sectionTitle('🤝 Compatible Signs')}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {horoscope.compatibility.map(s => (
                  <span key={s} style={{
                    fontSize: '10px',
                    padding: '4px 12px',
                    background: GOLD_BG,
                    color: GOLD,
                    borderRadius: '12px',
                    border: `1px solid ${BORDER}`,
                    fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            </>
          )}

          {/* Final Footer */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '52px',
            right: '52px',
            textAlign: 'center',
          }}>
            <img src="/images/lotus.png" alt="" style={{
              width: '60px', height: '40px', objectFit: 'contain',
              margin: '0 auto 6px auto', display: 'block', opacity: 0.7,
            }} />
            <div style={{ width: '60px', height: '1px', background: GOLD, margin: '0 auto 8px auto' }} />
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 3px 0' }}>
              Generated by <strong style={{ color: GOLD }}>Vedic Astro</strong>
            </p>
            <p style={{ fontSize: '9px', color: '#999', margin: 0 }}>
              vedicastro.co
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PdfReport.displayName = 'PdfReport';

export default PdfReport;
