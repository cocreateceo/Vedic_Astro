'use client';

import { forwardRef } from 'react';
import { VedicChart, PlanetAnalysis, HoroscopeData, YogaResult, DoshaResult, GemstoneRecommendation, TransitPrediction, SadeSatiResult, DashaWithAntardasha, PanchangaPrediction, BhavaPrediction, LifeQuestion } from '@/types';
import { generateSouthIndianChart } from '@/lib/chart-svg';
import { generatePlanetAnalysis, nakshatraDetails, getMostMalefic, isBeneficForAscendant } from '@/lib/horoscope-data';

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
      fontSize: '420px',
      color: GOLD,
      opacity: 0.04,
      fontFamily: "'Noto Sans Devanagari', serif",
      lineHeight: 1,
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
    }}>
      &#x0950;
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

const LOGO_DATA_URI = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F5D77F"/><stop offset="50%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#AA8C2C"/></linearGradient></defs><circle cx="20" cy="20" r="8" fill="url(#g)"/><circle cx="20" cy="20" r="5" fill="#FFFEFA"/><circle cx="20" cy="20" r="3" fill="url(#g)"/><g stroke="url(#g)" stroke-width="1.5" stroke-linecap="round"><line x1="20" y1="5" x2="20" y2="9"/><line x1="20" y1="31" x2="20" y2="35"/><line x1="5" y1="20" x2="9" y2="20"/><line x1="31" y1="20" x2="35" y2="20"/><line x1="9.4" y1="9.4" x2="12.2" y2="12.2"/><line x1="27.8" y1="27.8" x2="30.6" y2="30.6"/><line x1="9.4" y1="30.6" x2="12.2" y2="27.8"/><line x1="27.8" y1="12.2" x2="30.6" y2="9.4"/></g><text x="42" y="26" font-family="Georgia, serif" font-size="14" font-weight="600" fill="#B8860B">Vedic_Astro</text></svg>')}`;

function pageHeader(title: string) {
  return (
    <div style={{ marginBottom: '6px', paddingBottom: '10px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: GOLD, margin: 0, letterSpacing: '2px', fontFamily: "'Georgia', serif" }}>
        {title}
      </h2>
      <img src={LOGO_DATA_URI} alt="Vedic Astro" style={{ height: '28px', width: 'auto' }} />
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
        vedic-astro.vercel.app
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
  ({ chart, horoscope, userName, dob, tob, pob, photo, yogas, doshas, gemstones, transits, sadeSati, enhancedDashas, lifeQuestions }, ref) => {
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
          position: 'absolute',
          left: '-9999px',
          top: 0,
          zIndex: -1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {/* ═══════════════ PAGE 1: Cover + Birth Details ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: `2px solid ${GOLD}`, position: 'relative' }}>
            <img src={LOGO_DATA_URI} alt="Vedic Astro" style={{ position: 'absolute', top: 0, right: 0, height: '32px', width: 'auto' }} />
            <h1 style={{
              fontSize: '30px',
              fontWeight: 700,
              color: GOLD,
              margin: '0 0 2px 0',
              letterSpacing: '4px',
              fontFamily: "'Georgia', serif",
            }}>VEDIC ASTRO</h1>
            <p style={{ fontSize: '13px', color: TEXT_LIGHT, margin: '0 0 16px 0', letterSpacing: '2px' }}>
              BIRTH CHART REPORT
            </p>
            <div style={{ width: '60px', height: '1px', background: GOLD, margin: '0 auto 16px auto' }} />
            {photo && (
              <div style={{ margin: '0 auto 12px auto', width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${GOLD}`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <img src={photo} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <p style={{ fontSize: '22px', color: TEXT, margin: '0 0 6px 0', fontWeight: 600 }}>
              {userName}
            </p>
            <p style={{ fontSize: '11px', color: TEXT_LIGHT, margin: 0 }}>
              Report generated on {generatedDate}
            </p>
          </div>

          {/* Birth Details */}
          {sectionTitle('Birth Details')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 40px', marginBottom: '8px' }}>
            {[
              ['Date of Birth', formatDate(dob)],
              ['Moon Sign', `${chart.moonSign.symbol} ${chart.moonSign.name} (${chart.moonSign.hindi})`],
              ['Time of Birth', formatTime(tob)],
              ['Sun Sign', `${chart.sunSign.symbol} ${chart.sunSign.name} (${chart.sunSign.hindi})`],
              ['Place of Birth', pob],
              ['Ascendant (Lagna)', `${chart.ascendant.symbol} ${chart.ascendant.name} (${chart.ascendant.hindi})`],
              ['Nakshatra', `${chart.nakshatra}${chart.nakshatraPada ? ` — Pada ${chart.nakshatraPada}` : ''}`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: '8px', padding: '4px 0' }}>
                <span style={{ fontSize: '11px', color: TEXT_LIGHT, minWidth: '110px', fontWeight: 500 }}>{label}:</span>
                <span style={{ fontSize: '11px', color: TEXT, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Charts */}
          {sectionTitle('Birth Charts')}
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
          {sectionTitle('Planetary Positions')}
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
                    <td style={{ ...tdStyle, fontWeight: 700, color: malefic ? RED : benefic ? GREEN : TEXT }}>{name}</td>
                    <td style={tdStyle}>{p.sign} ({p.signHindi})</td>
                    <td style={tdStyle}>{p.degree}&deg;</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{p.house}</td>
                    <td style={tdStyle}>{p.nakshatra}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{p.nakshatraPada}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: p.retrograde ? RED : GREEN, fontWeight: 600 }}>
                      {p.retrograde ? 'Yes' : 'No'}
                    </td>
                    <td style={tdStyle}>{p.navamsaSign}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pageFooter(1)}
        </div>

        {/* ═══════════════ PAGE 2: Planet Analysis ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}
          <div style={{ position: 'absolute', top: '20px', right: '24px' }}><img src={LOGO_DATA_URI} alt="" style={{ height: '24px', width: 'auto', opacity: 0.7 }} /></div>

          {sectionTitle('Planet Analysis')}
          <p style={{ fontSize: '11px', color: TEXT_LIGHT, margin: '0 0 16px 0' }}>
            Based on <strong style={{ color: TEXT }}>{chart.ascendant.name}</strong> Ascendant &bull; Most Malefic: <strong style={{ color: RED }}>{dashaMalefic}</strong>
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
                    <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{a.planet}</span>
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
                      {a.isMostMalefic ? 'MOST MALEFIC' : a.isBenefic ? 'BENEFIC' : 'NEUTRAL'}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>{a.sign} &bull; House {a.house} &bull; {a.degree}&deg;</span>
                </div>
                <p style={{ fontSize: '10.5px', color: TEXT_MED, lineHeight: '1.6', margin: 0 }}>{a.interpretation}</p>
              </div>
            );
          })}

          {pageFooter(2)}
        </div>

        {/* ═══════════════ PAGES 3-5: Important Life Questions & Answers ═══════════════ */}
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

              {pageHeader(pageIdx === 0 ? 'Important Life Questions & Answers' : 'Life Questions & Answers (contd.)')}
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

              {pageFooter(3 + pageIdx)}
            </div>
          ));
        })()}

        {/* ═══════════════ Panchanga Predictions ═══════════════ */}
        {panchanga && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('Panchanga Predictions')}
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

            {pageFooter(3 + pOff)}
          </div>
        )}

        {/* ═══════════════ Bhava (12 Houses) ═══════════════ */}
        {bhava && bhava.length > 0 && (
          <>
            {/* Page 4: Houses 1-6 */}
            <div data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {pageHeader('Bhava Predictions (Houses 1-6)')}
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
                      Lord: {b.lordPlanet} in House {b.lordPlacedIn}
                    </span>
                  </div>
                  {b.occupants.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                      {b.occupants.map(occ => badge(occ, GOLD, GOLD_BG))}
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

              {pageFooter(4 + pOff)}
            </div>

            {/* Page 5: Houses 7-12 */}
            <div data-pdf-page style={pageBase}>
              <div style={decorativeBorder()} />
              {omWatermark()}

              {pageHeader('Bhava Predictions (Houses 7-12)')}

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
                      Lord: {b.lordPlanet} in House {b.lordPlacedIn}
                    </span>
                  </div>
                  {b.occupants.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                      {b.occupants.map(occ => badge(occ, GOLD, GOLD_BG))}
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
          </>
        )}

        {/* ═══════════════ PAGE 6: Yogas ═══════════════ */}
        {yogas && yogas.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('Planetary Yogas')}
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
                      {badge(y.type.replace('_', ' '), typeColor, typeBg)}
                      {badge(y.strength, strengthColor, strengthBg)}
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: TEXT_MED, lineHeight: '1.5', margin: '0 0 3px 0' }}>{y.description}</p>
                  <p style={{ fontSize: '10px', color: TEXT, lineHeight: '1.5', margin: '0 0 4px 0', fontWeight: 500 }}>{y.effects}</p>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {y.planets.map(p => (
                      <span key={p} style={{ fontSize: '9px', padding: '2px 6px', background: GOLD_BG, color: GOLD, borderRadius: '8px', border: `1px solid ${BORDER}` }}>{p}</span>
                    ))}
                  </div>
                </div>
              );
            })}

            {pageFooter(6 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 7: Doshas & Remedies ═══════════════ */}
        {doshas && doshas.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('Dosha Analysis & Remedies')}
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

            {pageFooter(7 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 8: Gemstone Recommendations ═══════════════ */}
        {gemstones && gemstones.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('Gemstone Recommendations')}
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
                  <span style={{ fontSize: '10px', color: TEXT_LIGHT, marginLeft: 'auto' }}>For {g.planet}</span>
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

            {pageFooter(8 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 9: Dasha Timeline ═══════════════ */}
        {enhancedDashas && enhancedDashas.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('Vimshottari Dasha Timeline')}
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
                        {d.planet}
                        {d.isCurrent && <span style={{ fontSize: '8px', color: GOLD, marginLeft: '4px' }}>(Current)</span>}
                      </td>
                      <td style={tdStyle}>{d.startYear} &ndash; {d.endYear}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{d.duration} yrs</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '1px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700, background: ratingBg, color: ratingColor, textTransform: 'capitalize' }}>
                          {d.rating}
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
                {subSectionTitle(`${currentMahadasha.planet} Mahadasha — Antardasha Sub-Periods`)}
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
                          {currentMahadasha.planet}/{ad.planet}
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

            {pageFooter(9 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 10: Transit Predictions ═══════════════ */}
        {transits && transits.length > 0 && (
          <div data-pdf-page style={pageBase}>
            <div style={decorativeBorder()} />
            {omWatermark()}

            {pageHeader('Current Transit Predictions (Gochara)')}
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
                    <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT }}>{t.planet}</span>
                    {badge(t.isPositive ? 'Favourable' : 'Challenging', t.isPositive ? GREEN : RED, t.isPositive ? '#E8F5E9' : '#FDECEA')}
                  </div>
                  <span style={{ fontSize: '10px', color: TEXT_LIGHT }}>
                    {t.transitSign} &bull; {t.houseFromMoon}{t.houseFromMoon === 1 ? 'st' : t.houseFromMoon === 2 ? 'nd' : t.houseFromMoon === 3 ? 'rd' : 'th'} from Moon
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

            {pageFooter(10 + pOff)}
          </div>
        )}

        {/* ═══════════════ PAGE 11: Nakshatra + Recommendations (Final) ═══════════════ */}
        <div data-pdf-page style={pageBase}>
          <div style={decorativeBorder()} />
          {omWatermark()}
          <div style={{ position: 'absolute', top: '20px', right: '24px' }}><img src={LOGO_DATA_URI} alt="" style={{ height: '24px', width: 'auto', opacity: 0.7 }} /></div>

          {/* Nakshatra Details */}
          {nakshatraData && (
            <>
              {sectionTitle(`Nakshatra — ${chart.nakshatra}`)}
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
          {sectionTitle('Current Dasha Period')}
          <div style={{
            padding: '16px 20px',
            background: GOLD_BG,
            borderRadius: '6px',
            border: `1px solid ${BORDER}`,
          }}>
            <p style={{ fontSize: '16px', color: TEXT, fontWeight: 700, margin: '0 0 4px 0' }}>
              {currentDashaLord} Mahadasha
            </p>
            <p style={{ fontSize: '12px', color: TEXT_LIGHT, margin: '0 0 8px 0' }}>
              {dashaOrder[(currentDashaIndex + 1) % 9]} Antardasha
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
              {sectionTitle('Recommendations')}
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
              {sectionTitle('Compatible Signs')}
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
            bottom: '28px',
            left: '52px',
            right: '52px',
            textAlign: 'center',
          }}>
            <div style={{ width: '60px', height: '1px', background: GOLD, margin: '0 auto 10px auto' }} />
            <p style={{ fontSize: '10px', color: TEXT_LIGHT, margin: '0 0 3px 0' }}>
              Generated by <strong style={{ color: GOLD }}>Vedic Astro</strong>
            </p>
            <p style={{ fontSize: '9px', color: '#999', margin: 0 }}>
              vedic-astro.vercel.app
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PdfReport.displayName = 'PdfReport';

export default PdfReport;
