/**
 * PDF Report Generator — Pure jsPDF (no html2canvas)
 * Generates a comprehensive Vedic astrology birth chart report.
 */
import { jsPDF } from 'jspdf';
import { VedicChart, PlanetAnalysis, HoroscopeData, YogaResult, DoshaResult, GemstoneRecommendation, TransitPrediction, SadeSatiResult, DashaWithAntardasha, PanchangaPrediction, BhavaPrediction, LifeQuestion } from '@/types';
import { signNames, signAbbrev, planetAbbrev, hindiSignNames } from '@/lib/vedic-constants';
import { generatePlanetAnalysis, nakshatraDetails, getMostMalefic, isBeneficForAscendant } from '@/lib/horoscope-data';
import type { NakshatraRemedy } from '@/lib/nakshatra-remedies';
import type { DasaRemedy } from '@/lib/dasa-remedies';
import type { FavourablePeriodsResult, FavourablePeriod } from '@/lib/favourable-periods';
import type { AshtakavargaResult } from '@/lib/ashtakavarga';
import type { PratyantardashaResult } from '@/lib/pratyantardasha';
import type { CombustionEntry, PlanetaryWarEntry, LongitudeEntry } from '@/lib/calc-tables';
import type { GrahavasthaEntry, ShadbalaEntry, IshtaKashtaEntry, BhavabalaEntry, ShodasavargaEntry, SayanaEntry, BhavaTableEntry, KPEntry } from '@/lib/shadbala';
import type { DashaPredictionEntry } from '@/lib/dasha-predictions';

// ─── Data interface ───
export interface PdfReportData {
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

// ─── Color constants (RGB tuples) ───
type RGB = [number, number, number];
const C = {
  gold:     [184, 134, 11]  as RGB,
  goldLt:   [212, 168, 67]  as RGB,
  goldBg:   [253, 246, 227] as RGB,
  bg:       [255, 254, 250] as RGB,
  text:     [26, 26, 26]    as RGB,
  textMed:  [68, 68, 68]    as RGB,
  textLt:   [102, 102, 102] as RGB,
  green:    [46, 125, 50]   as RGB,
  red:      [198, 40, 40]   as RGB,
  blue:     [21, 101, 192]  as RGB,
  orange:   [230, 81, 0]    as RGB,
  border:   [232, 213, 163] as RGB,
  white:    [255, 255, 255] as RGB,
  rowAlt:   [250, 250, 245] as RGB,
  highlight:[253, 246, 227] as RGB,
};

// ─── Page constants ───
const PW = 210;       // A4 width mm
const PH = 297;       // A4 height mm
const M  = 20;        // margin
const CW = PW - 2*M;  // content width (170mm)
const FOOTER_ZONE = 18; // reserved for footer

// ─── Helpers ───
function fmtDate(d: string): string {
  if (!d) return '-';
  const [y, mo, dy] = d.split('-').map(Number);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[mo - 1]} ${dy}, ${y}`;
}

function fmtTime(t: string): string {
  if (!t) return '-';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text || '';
  return text.substring(0, max).replace(/\s+\S*$/, '') + '...';
}

// South Indian chart sign→cell mapping: signIndex → [row, col]
const SI_LAYOUT: Record<number, [number, number]> = {
  0:[0,1], 1:[0,2], 2:[0,3], 3:[1,3], 4:[2,3], 5:[3,3],
  6:[3,2], 7:[3,1], 8:[3,0], 9:[2,0], 10:[1,0], 11:[0,0],
};

const PLANET_ORDER = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];

const HOUSE_NAMES: Record<number, string> = {
  1:'Tanu Bhava', 2:'Dhana Bhava', 3:'Sahaja Bhava', 4:'Sukha Bhava',
  5:'Putra Bhava', 6:'Ripu Bhava', 7:'Kalatra Bhava', 8:'Ayu Bhava',
  9:'Dharma Bhava', 10:'Karma Bhava', 11:'Labha Bhava', 12:'Vyaya Bhava',
};

// ─── PDF Report Builder ───
class PdfReportBuilder {
  private doc: jsPDF;
  private y: number;
  private pg: number;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.y = M;
    this.pg = 1;
  }

  // ─── Page management ───

  private pageBg() {
    this.doc.setFillColor(...C.bg);
    this.doc.rect(0, 0, PW, PH, 'F');
  }

  private footer() {
    const fy = PH - 10;
    this.doc.setDrawColor(...C.border);
    this.doc.setLineWidth(0.3);
    this.doc.line(M, fy - 4, PW - M, fy - 4);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.textLt);
    this.doc.text('Generated by Vedic Astro', M, fy);
    this.doc.text(`Page ${this.pg}`, PW / 2, fy, { align: 'center' });
    this.doc.text('vedicastro.co', PW - M, fy, { align: 'right' });
  }

  private newPage() {
    this.footer();
    this.doc.addPage();
    this.pg++;
    this.y = M;
    this.pageBg();
  }

  private ensureSpace(needed: number) {
    if (this.y + needed > PH - FOOTER_ZONE) {
      this.newPage();
    }
  }

  // ─── Drawing helpers ───

  private goldLine(x: number, y: number, w: number) {
    this.doc.setDrawColor(...C.gold);
    this.doc.setLineWidth(0.5);
    this.doc.line(x, y, x + w, y);
  }

  private borderLine(x: number, y: number, w: number) {
    this.doc.setDrawColor(...C.border);
    this.doc.setLineWidth(0.2);
    this.doc.line(x, y, x + w, y);
  }

  private sectionTitle(title: string) {
    this.ensureSpace(14);
    this.y += 4;
    // Gold line segment
    this.goldLine(M, this.y, 12);
    // Title text
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...C.gold);
    this.doc.text(title.toUpperCase(), M + 16, this.y + 1);
    // Trailing border line
    const tw = this.doc.getTextWidth(title.toUpperCase());
    this.borderLine(M + 18 + tw, this.y, CW - 18 - tw);
    this.y += 10;
  }

  private chapterHeader(num: number, title: string) {
    // Chapter circle badge
    this.doc.setFillColor(...C.goldBg);
    this.doc.setDrawColor(...C.border);
    this.doc.circle(M + 6, this.y + 3, 5, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.gold);
    this.doc.text(String(num), M + 6, this.y + 4.5, { align: 'center' });
    // Title
    this.doc.setFontSize(14);
    this.doc.text(title, M + 15, this.y + 5);
    this.y += 8;
    this.borderLine(M, this.y, CW);
    this.y += 6;
  }

  private pageHeader(title: string) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(...C.gold);
    this.doc.text(title, M, this.y + 5);
    this.y += 8;
    this.borderLine(M, this.y, CW);
    this.y += 6;
  }

  // ─── Text helpers ───

  private text(s: string, x: number, size: number, color: RGB, bold = false) {
    this.doc.setFont('helvetica', bold ? 'bold' : 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
    this.doc.text(s, x, this.y);
  }

  private textAt(s: string, x: number, yy: number, size: number, color: RGB, bold = false, align: 'left'|'center'|'right' = 'left') {
    this.doc.setFont('helvetica', bold ? 'bold' : 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
    this.doc.text(s, x, yy, { align });
  }

  private row(label: string, value: string, labelW = 45) {
    this.ensureSpace(6);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text(label, M, this.y);
    this.doc.setTextColor(...C.text);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(value, M + labelW, this.y);
    this.y += 5;
  }

  private bodyText(s: string, maxW = CW, size = 9) {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...C.text);
    const lines = this.doc.splitTextToSize(s, maxW);
    this.ensureSpace(lines.length * 4 + 2);
    this.doc.text(lines, M, this.y);
    this.y += lines.length * 4 + 2;
  }

  private mutedText(s: string, maxW = CW, size = 8) {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...C.textLt);
    const lines = this.doc.splitTextToSize(s, maxW);
    this.ensureSpace(lines.length * 3.5 + 2);
    this.doc.text(lines, M, this.y);
    this.y += lines.length * 3.5 + 2;
  }

  private bullet(s: string, indent = 4) {
    this.ensureSpace(6);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.gold);
    this.doc.text('\u2022', M + indent, this.y);
    this.doc.setTextColor(...C.textMed);
    const lines = this.doc.splitTextToSize(s, CW - indent - 6);
    this.doc.text(lines, M + indent + 4, this.y);
    this.y += lines.length * 3.5 + 1.5;
  }

  private badge(label: string, color: RGB, x: number, yy: number) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    const tw = this.doc.getTextWidth(label) + 4;
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.roundedRect(x, yy - 3, tw, 4.5, 1, 1, 'F');
    this.doc.setTextColor(...C.white);
    this.doc.text(label, x + 2, yy);
  }

  // ─── Table helper ───

  private tableHeader(headers: string[], widths: number[]) {
    this.ensureSpace(8);
    let x = M;
    this.doc.setFillColor(...C.goldBg);
    this.doc.rect(M, this.y - 3, CW, 7, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.gold);
    for (let i = 0; i < headers.length; i++) {
      this.doc.text(headers[i], x + 1, this.y);
      x += widths[i];
    }
    this.y += 2;
    this.doc.setDrawColor(...C.gold);
    this.doc.setLineWidth(0.4);
    this.doc.line(M, this.y, PW - M, this.y);
    this.y += 3;
  }

  private tableRow(cells: string[], widths: number[], colors?: (RGB | null)[], bg?: RGB | null) {
    this.ensureSpace(6);
    if (bg) {
      this.doc.setFillColor(...bg);
      this.doc.rect(M, this.y - 3.5, CW, 5.5, 'F');
    }
    let x = M;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    for (let i = 0; i < cells.length; i++) {
      this.doc.setTextColor(...(colors?.[i] || C.text));
      this.doc.text(truncate(cells[i], 40), x + 1, this.y);
      x += widths[i];
    }
    this.y += 5;
  }

  // ─── South Indian Chart Drawing ───

  private drawChart(
    planets: Record<string, { signIndex: number; navamsaSign?: string }>,
    ascSignIdx: number,
    type: 'rashi' | 'navamsa',
    ox: number, oy: number, size: number
  ) {
    const cell = size / 4;
    // Draw grid
    this.doc.setDrawColor(...C.border);
    this.doc.setLineWidth(0.4);
    this.doc.rect(ox, oy, size, size);
    // Internal lines
    for (let i = 1; i < 4; i++) {
      this.doc.line(ox + i * cell, oy, ox + i * cell, oy + size);
      this.doc.line(ox, oy + i * cell, ox + size, oy + i * cell);
    }
    // Clear center 2x2
    this.doc.setFillColor(...C.bg);
    this.doc.rect(ox + cell, oy + cell, cell * 2, cell * 2, 'F');
    this.doc.setDrawColor(...C.border);
    this.doc.rect(ox + cell, oy + cell, cell * 2, cell * 2);
    // Center label
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...C.textLt);
    this.doc.text(type === 'rashi' ? 'Rashi' : 'Navamsa', ox + size / 2, oy + size / 2 + 1, { align: 'center' });

    // Group planets by signIndex
    const bySign: Record<number, string[]> = {};
    for (const [name, p] of Object.entries(planets)) {
      let idx: number;
      if (type === 'rashi') {
        idx = p.signIndex;
      } else {
        const nav = (p as { navamsaSign?: string }).navamsaSign;
        idx = nav ? signNames.indexOf(nav) : -1;
        if (idx < 0) continue;
      }
      if (!bySign[idx]) bySign[idx] = [];
      bySign[idx].push(planetAbbrev[name] || name.substring(0, 2));
    }

    // Draw signs and planets
    for (let si = 0; si < 12; si++) {
      const pos = SI_LAYOUT[si];
      if (!pos) continue;
      const [r, c] = pos;
      const cx = ox + c * cell;
      const cy = oy + r * cell;
      // Sign abbreviation
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(6.5);
      this.doc.setTextColor(...C.gold);
      this.doc.text(signAbbrev[si], cx + 1.5, cy + 3.5);
      // Ascendant marker
      if (si === ascSignIdx) {
        this.doc.setDrawColor(...C.gold);
        this.doc.setLineWidth(0.5);
        this.doc.line(cx, cy, cx + 4, cy);
        this.doc.line(cx, cy, cx, cy + 4);
      }
      // Planets
      const pl = bySign[si];
      if (pl && pl.length > 0) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.text);
        const joined = pl.join(' ');
        if (joined.length <= 8) {
          this.doc.text(joined, cx + cell / 2, cy + cell / 2 + 2, { align: 'center' });
        } else {
          this.doc.setFontSize(6);
          this.doc.text(pl.slice(0, 3).join(' '), cx + cell / 2, cy + cell / 2, { align: 'center' });
          if (pl.length > 3) {
            this.doc.text(pl.slice(3).join(' '), cx + cell / 2, cy + cell / 2 + 3.5, { align: 'center' });
          }
        }
      }
    }
  }

  // ═══════════════════════════════════════════
  //  CHAPTERS
  // ═══════════════════════════════════════════

  private coverPage(d: PdfReportData) {
    this.pageBg();
    // Decorative border
    this.doc.setDrawColor(...C.border);
    this.doc.setLineWidth(0.8);
    this.doc.rect(12, 12, PW - 24, PH - 24);
    this.doc.setLineWidth(0.3);
    this.doc.rect(14, 14, PW - 28, PH - 28);

    // Title block
    this.y = 60;
    this.goldLine(PW / 2 - 20, this.y, 40);
    this.y += 10;
    this.textAt('VEDIC ASTRO', PW / 2, this.y, 28, C.gold, true, 'center');
    this.y += 8;
    this.textAt('BIRTH CHART REPORT', PW / 2, this.y, 12, C.textLt, false, 'center');
    this.y += 6;
    this.goldLine(PW / 2 - 20, this.y, 40);

    // User name
    this.y += 18;
    this.textAt(d.userName, PW / 2, this.y, 22, C.text, true, 'center');

    // Generation date
    this.y += 10;
    const genDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    this.textAt(`Report generated on ${genDate}`, PW / 2, this.y, 10, C.textLt, false, 'center');

    // Summary block
    this.y += 18;
    const summaryItems = [
      `Moon Sign: ${d.chart.moonSign.name}`,
      `Sun Sign: ${d.chart.sunSign.name}`,
      `Ascendant (Lagna): ${d.chart.ascendant.name}`,
      `Nakshatra: ${d.chart.nakshatra}${d.chart.nakshatraPada ? ` — Pada ${d.chart.nakshatraPada}` : ''}`,
    ];
    for (const item of summaryItems) {
      this.textAt(item, PW / 2, this.y, 10, C.text, false, 'center');
      this.y += 6;
    }

    // Birth details
    this.y += 8;
    this.textAt(`Born: ${fmtDate(d.dob)}`, PW / 2, this.y, 10, C.textMed, false, 'center');
    this.y += 5;
    this.textAt(`Time: ${fmtTime(d.tob)} | Place: ${d.pob}`, PW / 2, this.y, 10, C.textMed, false, 'center');

    // Bottom blessing
    this.y = PH - 60;
    this.goldLine(PW / 2 - 30, this.y, 60);
    this.y += 8;
    this.textAt('Shri Ganeshaya Namah', PW / 2, this.y, 10, C.gold, true, 'center');
    this.y += 5;
    this.textAt('Salutations to Lord Ganesh, Remover of Obstacles', PW / 2, this.y, 8, C.textLt, false, 'center');

    this.footer();
  }

  private ch1BirthDetails(d: PdfReportData) {
    this.newPage();

    this.sectionTitle('Birth Details');
    // Two-column detail grid
    const details: [string, string][] = [
      ['Date of Birth', fmtDate(d.dob)],
      ['Moon Sign', `${d.chart.moonSign.name}`],
      ['Time of Birth', fmtTime(d.tob)],
      ['Sun Sign', `${d.chart.sunSign.name}`],
      ['Place of Birth', d.pob],
      ['Ascendant (Lagna)', `${d.chart.ascendant.name}`],
      ['Nakshatra', `${d.chart.nakshatra}${d.chart.nakshatraPada ? ` — Pada ${d.chart.nakshatraPada}` : ''}`],
      ['Ayanamsa', 'Lahiri (Chitrapaksha)'],
    ];
    const panchanga = d.horoscope?.panchanga as PanchangaPrediction | undefined;
    if (panchanga) {
      if (panchanga.birthTithi?.name) details.push(['Tithi', panchanga.birthTithi.name]);
      if (panchanga.birthKaranam?.name) details.push(['Karanam', panchanga.birthKaranam.name]);
      if (panchanga.birthNithyaYoga?.name) details.push(['Nithya Yoga', panchanga.birthNithyaYoga.name]);
    }
    for (let i = 0; i < details.length; i += 2) {
      this.ensureSpace(6);
      // Left column
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textLt);
      this.doc.text(details[i][0] + ':', M, this.y);
      this.doc.setTextColor(...C.text);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(details[i][1], M + 35, this.y);
      // Right column
      if (i + 1 < details.length) {
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(...C.textLt);
        this.doc.text(details[i + 1][0] + ':', M + CW / 2, this.y);
        this.doc.setTextColor(...C.text);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(details[i + 1][1], M + CW / 2 + 35, this.y);
      }
      this.y += 5;
    }

    // Charts
    this.sectionTitle('Birth Charts');
    const chartSize = 58;
    const chartGap = 20;
    const chartX1 = M + (CW / 2 - chartSize - chartGap / 2);
    const chartX2 = M + CW / 2 + chartGap / 2;
    // Labels
    this.textAt('Rashi Chart', chartX1 + chartSize / 2, this.y, 9, C.gold, true, 'center');
    this.textAt('Navamsa Chart (D-9)', chartX2 + chartSize / 2, this.y, 9, C.gold, true, 'center');
    this.y += 3;
    this.drawChart(d.chart.planets, d.chart.ascendant.index, 'rashi', chartX1, this.y, chartSize);
    this.drawChart(d.chart.planets, d.chart.ascendant.index, 'navamsa', chartX2, this.y, chartSize);
    this.y += chartSize + 6;

    // Planetary Positions Table
    this.sectionTitle('Planetary Positions');
    const pw = [22, 22, 16, 14, 24, 12, 14, 22, 24]; // 170 total
    this.tableHeader(['Planet', 'Sign', 'Degree', 'House', 'Nakshatra', 'Pada', 'Retro', 'Navamsa', 'Status'], pw);

    const dashaMalefic = getMostMalefic(d.chart.ascendant.index);
    for (const [i, name] of PLANET_ORDER.entries()) {
      const p = d.chart.planets[name];
      if (!p) continue;
      const benefic = isBeneficForAscendant(name, d.chart.ascendant.index);
      const malefic = name === dashaMalefic;
      const statusText = malefic ? 'Malefic' : benefic ? 'Benefic' : 'Neutral';
      const statusColor = malefic ? C.red : benefic ? C.green : C.textMed;
      const nameColor = malefic ? C.red : benefic ? C.green : C.text;
      this.tableRow(
        [name, p.sign, `${p.degree}°`, String(p.house), p.nakshatra, String(p.nakshatraPada), p.retrograde ? 'R' : '-', p.navamsaSign || '-', statusText],
        pw,
        [nameColor, null, null, null, null, null, p.retrograde ? C.red : C.green, null, statusColor],
        i % 2 === 1 ? C.rowAlt : null,
      );
    }
  }

  private tocPage(d: PdfReportData) {
    this.newPage();
    this.pageHeader('Table of Contents');
    this.y += 2;

    const tocEntries = [
      { ch: 1, title: 'Your Birth Profile', desc: 'Birth details, charts, and planetary positions' },
      { ch: 2, title: 'Planet Analysis', desc: 'Detailed analysis of each planet in your chart' },
      { ch: 3, title: 'Important Life Questions & Answers', desc: '15 personalized questions from your birth chart' },
      { ch: 4, title: 'Your Characteristics & Behaviour', desc: 'Panchanga-based personality predictions' },
      { ch: 5, title: 'Influences on Your Life', desc: 'Bhava (house) predictions for all 12 houses' },
      { ch: 6, title: 'Planetary Yogas', desc: 'Auspicious and inauspicious planetary combinations' },
      { ch: 7, title: 'Dosha Analysis', desc: 'Assessment of Manglik, Kaal Sarp, and other doshas' },
      { ch: 8, title: 'Gemstone Recommendations', desc: 'Recommended gemstones with wearing instructions' },
      { ch: 9, title: 'Dasha Timeline', desc: 'Vimshottari Mahadasha and Antardasha periods' },
      { ch: 10, title: '35-Year Prediction Summary', desc: 'Predictions for each Dasha/Antardasha period' },
      { ch: 11, title: 'Transit Predictions', desc: 'Current planetary transit effects on your chart' },
      { ch: 12, title: 'Nakshatra Remedies', desc: 'Remedies based on your birth star' },
      { ch: 13, title: 'Dasa Period Remedies', desc: 'Remedies for challenging Mahadasha periods' },
      { ch: 14, title: 'Favourable Periods', desc: 'Best periods for career, business, and property' },
      { ch: 15, title: 'AshtakaVarga Analysis', desc: 'Planetary strength and bindu distribution' },
      { ch: 16, title: 'Pratyantardasha Predictions', desc: 'Sub-sub-period predictions' },
      { ch: 17, title: 'Calculations & Tables', desc: 'Longitude, combustion, strength tables' },
    ];

    for (const [i, e] of tocEntries.entries()) {
      this.ensureSpace(10);
      const rowY = this.y;
      if (i % 2 === 1) {
        this.doc.setFillColor(...C.rowAlt);
        this.doc.rect(M, rowY - 3, CW, 10, 'F');
      }
      // Chapter circle badge
      this.doc.setFillColor(...C.goldBg);
      this.doc.setDrawColor(...C.border);
      this.doc.circle(M + 5, rowY + 1, 4, 'FD');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...C.gold);
      this.doc.text(String(e.ch), M + 5, rowY + 2.5, { align: 'center' });
      // Title
      this.doc.setFontSize(10);
      this.doc.setTextColor(...C.text);
      this.doc.text(e.title, M + 14, rowY + 1);
      // Description
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...C.textLt);
      this.doc.text(e.desc, M + 14, rowY + 5.5);
      this.y += 10;
    }
  }

  private howToReadPage() {
    this.newPage();
    this.pageHeader('How to Read This Report');
    this.y += 2;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textMed);
    const intro = 'This report is based on the Parashari system of Vedic astrology using Lahiri (Chitrapaksha) ayanamsa. It analyzes the planetary positions at the time of your birth to provide insights into various aspects of your life.';
    const introLines = this.doc.splitTextToSize(intro, CW);
    this.doc.text(introLines, M, this.y);
    this.y += introLines.length * 4 + 4;

    const items = [
      ['Birth Charts (Rashi & Navamsa)', 'The Rashi chart shows where each planet was placed at birth. The Navamsa (D-9) chart reveals deeper spiritual and marital dimensions. Planets are shown as two-letter abbreviations (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke).'],
      ['Planetary Dignity', 'Planets can be Exalted (strongest), in Own Sign, in a Friend\'s sign, Neutral, in an Enemy\'s sign, or Debilitated (weakest). A planet\'s dignity significantly affects its ability to deliver results.'],
      ['Mahadasha & Antardasha', 'The Vimshottari Dasha system divides your life into planetary periods (Mahadasha) of 6-20 years each. Each is further divided into sub-periods (Antardasha). The ruling planet influences events during that time.'],
      ['Yogas & Doshas', 'Yogas are auspicious planetary combinations that bestow specific results. Doshas are afflictions that may create challenges. Both are identified by analyzing planetary positions, aspects, and house lordships.'],
      ['AshtakaVarga', 'Each planet receives "bindhus" (points) from other planets in each sign. More bindhus mean stronger positive results when planets transit that sign. The Sarvashtakavarga total shows the overall strength of each sign.'],
      ['Remedies', 'Remedies for challenging periods include mantras, gemstones, fasting, charity, and worship. They are based on classical Vedic texts and should be adopted with faith and consistency.'],
      ['Favourable Periods', 'Based on Dasha lords\' relationship with specific houses, periods are rated as Excellent, Favourable, or Less Favourable for career, business, and house construction.'],
    ];

    for (const [title, desc] of items) {
      this.ensureSpace(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9);
      this.doc.setTextColor(...C.gold);
      this.doc.text(title, M, this.y);
      this.y += 4;
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textMed);
      const lines = this.doc.splitTextToSize(desc, CW);
      this.doc.text(lines, M, this.y);
      this.y += lines.length * 3.5 + 4;
    }

    // Disclaimer box
    this.ensureSpace(20);
    this.doc.setFillColor(...C.goldBg);
    this.doc.roundedRect(M, this.y, CW, 16, 2, 2, 'F');
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(...C.textLt);
    const disc = 'Note: This report is generated for educational and self-awareness purposes based on classical Vedic astrology principles. Planetary positions are calculated using sidereal (Nirayana) coordinates with Lahiri ayanamsa. Individual results depend on the complete interaction of all chart factors and should be interpreted holistically.';
    const discLines = this.doc.splitTextToSize(disc, CW - 8);
    this.doc.text(discLines, M + 4, this.y + 5);
    this.y += 20;
  }

  private ch2PlanetAnalysis(d: PdfReportData) {
    this.newPage();
    this.chapterHeader(2, 'Planet Analysis');

    const analysis = generatePlanetAnalysis(d.chart);
    const dashaMalefic = getMostMalefic(d.chart.ascendant.index);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text(`Ascendant: ${d.chart.ascendant.name}  |  Most Malefic: ${dashaMalefic}`, M, this.y);
    this.y += 6;

    for (const a of analysis) {
      this.ensureSpace(24);
      const isMalefic = a.planet === dashaMalefic || a.isMostMalefic;
      const isBenefic = a.isBenefic;
      const color = isMalefic ? C.red : isBenefic ? C.green : C.textMed;
      const bgColor = isMalefic ? [255, 245, 245] as RGB : isBenefic ? [245, 255, 245] as RGB : C.rowAlt;
      const borderColor = isMalefic ? [238, 206, 206] as RGB : isBenefic ? [200, 230, 201] as RGB : C.border;

      // Card background
      this.doc.setFillColor(...bgColor);
      this.doc.setDrawColor(...borderColor);
      this.doc.roundedRect(M, this.y - 2, CW, 20, 1.5, 1.5, 'FD');

      // Planet name + status
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...color);
      this.doc.text(a.planet, M + 4, this.y + 2);

      const statusLabel = isMalefic ? 'MALEFIC' : isBenefic ? 'BENEFIC' : 'NEUTRAL';
      this.badge(statusLabel, color, M + 30, this.y + 2);

      // Sign / House / Degree
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textMed);
      this.doc.text(`${a.sign} | House ${a.house} | ${a.degree}°`, PW - M - 4, this.y + 2, { align: 'right' });

      // Interpretation
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.text);
      const interp = truncate(a.interpretation, 300);
      const lines = this.doc.splitTextToSize(interp, CW - 8);
      this.doc.text(lines, M + 4, this.y + 7);

      const cardH = Math.max(20, 10 + lines.length * 3.5);
      // Re-draw card if taller
      if (cardH > 20) {
        this.doc.setFillColor(...bgColor);
        this.doc.setDrawColor(...borderColor);
        this.doc.roundedRect(M, this.y - 2, CW, cardH, 1.5, 1.5, 'FD');
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(10);
        this.doc.setTextColor(...color);
        this.doc.text(a.planet, M + 4, this.y + 2);
        this.badge(statusLabel, color, M + 30, this.y + 2);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.textMed);
        this.doc.text(`${a.sign} | House ${a.house} | ${a.degree}°`, PW - M - 4, this.y + 2, { align: 'right' });
        this.doc.setTextColor(...C.text);
        this.doc.text(lines, M + 4, this.y + 7);
      }

      this.y += cardH + 3;
    }
  }

  private ch3LifeQuestions(d: PdfReportData) {
    const qs = d.lifeQuestions;
    if (!qs || qs.length === 0) return;

    const perPage = 5;
    const pages = Math.ceil(qs.length / perPage);

    for (let pg = 0; pg < pages; pg++) {
      this.newPage();
      if (pg === 0) {
        this.chapterHeader(3, 'Important Life Questions & Answers');
      } else {
        this.pageHeader('Life Questions & Answers (contd.)');
      }

      const start = pg * perPage;
      const end = Math.min(start + perPage, qs.length);

      for (let i = start; i < end; i++) {
        const q = qs[i];
        this.ensureSpace(30);
        const isAlt = (i - start) % 2 === 1;
        if (isAlt) {
          this.doc.setFillColor(...C.rowAlt);
          this.doc.rect(M, this.y - 2, CW, 6, 'F');
        }

        // Question number + question
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(9);
        this.doc.setTextColor(...C.gold);
        this.doc.text(`Q${i + 1}.`, M, this.y + 1);
        this.doc.setTextColor(...C.text);
        const qLines = this.doc.splitTextToSize(q.question, CW - 12);
        this.doc.text(qLines, M + 10, this.y + 1);
        this.y += qLines.length * 4 + 2;

        // Category badge
        if (q.category) {
          this.badge(q.category.toUpperCase(), C.blue, M + 10, this.y);
          this.y += 3;
        }

        // Answer
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.textMed);
        const answer = truncate(q.answer, 500);
        const aLines = this.doc.splitTextToSize(answer, CW - 12);
        this.ensureSpace(aLines.length * 3.5 + 2);
        this.doc.text(aLines, M + 10, this.y);
        this.y += aLines.length * 3.5 + 5;
      }
    }
  }

  private ch4Characteristics(d: PdfReportData) {
    const panchanga = d.horoscope?.panchanga as PanchangaPrediction | undefined;
    if (!panchanga) return;

    this.newPage();
    this.chapterHeader(4, 'Your Characteristics & Behaviour');

    const sections: { title: string; badge?: string; text: string }[] = [];
    if (panchanga.weekdayOfBirth) {
      sections.push({
        title: `Weekday of Birth: ${panchanga.weekdayOfBirth.day}`,
        badge: `Ruling Planet: ${panchanga.weekdayOfBirth.planet}`,
        text: panchanga.weekdayOfBirth.prediction,
      });
    }
    if (panchanga.birthNakshatra) {
      sections.push({ title: `Birth Nakshatra: ${panchanga.birthNakshatra.name}`, text: panchanga.birthNakshatra.prediction });
    }
    if (panchanga.birthTithi) {
      sections.push({ title: `Birth Tithi: ${panchanga.birthTithi.name}`, text: panchanga.birthTithi.prediction });
    }
    if (panchanga.birthKaranam) {
      sections.push({ title: `Birth Karanam: ${panchanga.birthKaranam.name}`, badge: 'Half-Tithi', text: panchanga.birthKaranam.prediction });
    }
    if (panchanga.birthNithyaYoga) {
      sections.push({ title: `Nithya Yoga: ${panchanga.birthNithyaYoga.name}`, badge: 'Sun-Moon Yoga', text: panchanga.birthNithyaYoga.prediction });
    }

    for (const sec of sections) {
      this.ensureSpace(30);
      // Box
      this.doc.setFillColor(...C.rowAlt);
      this.doc.setDrawColor(...C.border);
      this.doc.roundedRect(M, this.y - 1, CW, 4, 1, 1, 'F');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...C.gold);
      this.doc.text(sec.title, M + 4, this.y + 2);
      if (sec.badge) {
        this.badge(sec.badge.toUpperCase(), C.blue, M + 4 + this.doc.getTextWidth(sec.title) + 4, this.y + 2);
      }
      this.y += 7;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(...C.text);
      const text = truncate(sec.text, 600);
      const lines = this.doc.splitTextToSize(text, CW - 8);
      this.ensureSpace(lines.length * 4);
      this.doc.text(lines, M + 4, this.y);
      this.y += lines.length * 4 + 6;
    }
  }

  private ch5Houses(d: PdfReportData) {
    const bhava = d.horoscope?.bhava as BhavaPrediction[] | undefined;
    if (!bhava || bhava.length === 0) return;

    // Page 1: Houses 1-6
    this.newPage();
    this.chapterHeader(5, 'Influences on Your Life (Houses)');
    this.renderHouses(bhava.slice(0, 6), d.chart.ascendant.index);

    // Page 2: Houses 7-12
    if (bhava.length > 6) {
      this.newPage();
      this.pageHeader('Houses 7-12');
      this.renderHouses(bhava.slice(6, 12), d.chart.ascendant.index);
    }
  }

  private renderHouses(houses: BhavaPrediction[], ascIdx: number) {
    for (const h of houses) {
      this.ensureSpace(22);
      const hasOccupants = h.occupants && h.occupants.length > 0;
      const borderCol = hasOccupants ? C.gold : C.border;

      this.doc.setDrawColor(...borderCol);
      this.doc.setFillColor(...(hasOccupants ? C.goldBg : C.rowAlt));
      this.doc.roundedRect(M, this.y - 1, CW, 4, 1, 1, 'F');

      // House number and name
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...C.gold);
      this.doc.text(`House ${h.house}`, M + 3, this.y + 2);
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textMed);
      this.doc.text(`(${HOUSE_NAMES[h.house] || h.houseName})`, M + 25, this.y + 2);
      // Lord
      this.doc.setTextColor(...C.textLt);
      this.doc.text(`Lord: ${h.lordPlanet} in House ${h.lordPlacedIn}`, PW - M - 3, this.y + 2, { align: 'right' });
      this.y += 6;

      // Occupants
      if (hasOccupants) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.gold);
        this.doc.text(`Planets: ${h.occupants.join(', ')}`, M + 3, this.y);
        this.y += 4;
      }

      // Prediction
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.text);
      const pred = truncate(h.prediction, 250);
      const lines = this.doc.splitTextToSize(pred, CW - 6);
      this.ensureSpace(lines.length * 3.5);
      this.doc.text(lines, M + 3, this.y);
      this.y += lines.length * 3.5 + 2;

      // Aspects
      if (h.aspects && h.aspects.length > 0) {
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.textLt);
        this.doc.text(`Aspected by: ${h.aspects.join(', ')}`, M + 3, this.y);
        this.y += 3.5;
      }
      this.y += 3;
    }
  }

  private ch6Yogas(d: PdfReportData) {
    if (!d.yogas || d.yogas.length === 0) return;

    this.newPage();
    this.chapterHeader(6, 'Planetary Yogas');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text(`${d.yogas.length} yoga(s) identified in your birth chart`, M, this.y);
    this.y += 6;

    for (const y of d.yogas) {
      this.ensureSpace(28);
      const isStrong = y.strength === 'strong';
      const bgCol = isStrong ? [245, 255, 245] as RGB : C.rowAlt;
      const borderCol = isStrong ? [200, 230, 201] as RGB : C.border;

      this.doc.setFillColor(...bgCol);
      this.doc.setDrawColor(...borderCol);

      // Name + type + strength
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...C.gold);
      this.doc.text(y.name, M, this.y);
      if (y.sanskrit) {
        this.doc.setFont('helvetica', 'italic');
        this.doc.setFontSize(8);
        this.doc.text(y.sanskrit, M + this.doc.getTextWidth(y.name) + 4, this.y);
      }
      // Type badge
      const typeColor = y.type === 'raja' ? C.gold : y.type === 'dhana' ? C.green : C.blue;
      this.badge(y.type.toUpperCase(), typeColor, PW - M - 30, this.y);
      // Strength badge
      const strColor = isStrong ? C.green : y.strength === 'moderate' ? C.blue : C.textLt;
      this.badge(y.strength.toUpperCase(), strColor, PW - M - 15, this.y);
      this.y += 5;

      // Description
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.text);
      const descLines = this.doc.splitTextToSize(y.description, CW - 4);
      this.doc.text(descLines, M + 2, this.y);
      this.y += descLines.length * 3.5 + 1;

      // Effects
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textMed);
      const effLines = this.doc.splitTextToSize(y.effects, CW - 4);
      this.doc.text(effLines, M + 2, this.y);
      this.y += effLines.length * 3.5 + 1;

      // Planets
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...C.textLt);
      this.doc.text(`Planets: ${y.planets.join(', ')}`, M + 2, this.y);
      this.y += 6;
    }
  }

  private ch7Doshas(d: PdfReportData) {
    if (!d.doshas) return;

    this.newPage();
    this.chapterHeader(7, 'Dosha Analysis & Remedies');

    for (const dosha of d.doshas) {
      this.ensureSpace(30);
      const detected = dosha.detected;
      const color = detected ? (dosha.severity === 'severe' ? C.red : C.orange) : C.green;
      const statusLabel = detected ? dosha.severity?.toUpperCase() || 'DETECTED' : 'NOT PRESENT';

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(11);
      this.doc.setTextColor(...color);
      this.doc.text(dosha.name, M, this.y);
      this.badge(statusLabel, color, M + this.doc.getTextWidth(dosha.name) + 4, this.y);
      this.y += 5;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.text);
      const descLines = this.doc.splitTextToSize(dosha.description, CW);
      this.doc.text(descLines, M, this.y);
      this.y += descLines.length * 3.5 + 2;

      if (detected && dosha.details) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.textMed);
        const detLines = this.doc.splitTextToSize(dosha.details, CW);
        this.doc.text(detLines, M, this.y);
        this.y += detLines.length * 3.5 + 2;
      }

      if (detected && dosha.remedies.length > 0) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.gold);
        this.doc.text('Remedies:', M, this.y);
        this.y += 4;
        for (const r of dosha.remedies) {
          this.bullet(r);
        }
      }
      this.y += 4;
    }

    // Sade Sati
    if (d.sadeSati) {
      this.ensureSpace(20);
      this.sectionTitle('Sade Sati Status');
      const active = d.sadeSati.active;
      const ssColor = active ? C.red : C.green;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...ssColor);
      this.doc.text(active ? `ACTIVE (${d.sadeSati.phase} phase)` : 'NOT ACTIVE', M, this.y);
      this.y += 5;
      this.mutedText(d.sadeSati.description);
      if (d.sadeSati.remedies.length > 0) {
        for (const r of d.sadeSati.remedies) {
          this.bullet(r);
        }
      }
    }
  }

  private ch8Gemstones(d: PdfReportData) {
    if (!d.gemstones || d.gemstones.length === 0) return;

    this.newPage();
    this.chapterHeader(8, 'Gemstone Recommendations');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text('Personalized gemstone prescriptions based on your birth chart', M, this.y);
    this.y += 6;

    for (const [gi, g] of d.gemstones.entries()) {
      this.ensureSpace(40);
      const isPrimary = gi === 0;
      const borderCol = isPrimary ? C.gold : C.border;

      this.doc.setDrawColor(...borderCol);
      this.doc.setLineWidth(isPrimary ? 0.6 : 0.3);
      this.doc.roundedRect(M, this.y - 1, CW, 2, 1, 1);

      // Gem name + planet
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(11);
      this.doc.setTextColor(...C.gold);
      this.doc.text(g.primaryGem, M + 3, this.y + 3);
      if (isPrimary) this.badge('PRIMARY', C.gold, M + 3 + this.doc.getTextWidth(g.primaryGem) + 3, this.y + 3);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textMed);
      this.doc.text(`For ${g.planet}`, PW - M - 3, this.y + 3, { align: 'right' });
      this.y += 7;

      // Reason
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.text);
      const rLines = this.doc.splitTextToSize(g.reason, CW - 6);
      this.doc.text(rLines, M + 3, this.y);
      this.y += rLines.length * 3.5 + 3;

      // Details grid
      const detailItems = [
        ['Weight', g.weight], ['Metal', g.metal],
        ['Finger', g.finger], ['Starting Day', g.startingDay],
        ['Alternative', g.alternativeGem], ['Mantra', truncate(g.mantra, 60)],
      ];
      for (let di = 0; di < detailItems.length; di += 2) {
        this.ensureSpace(5);
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.textLt);
        this.doc.text(detailItems[di][0] + ':', M + 3, this.y);
        this.doc.setTextColor(...C.text);
        this.doc.text(detailItems[di][1], M + 28, this.y);
        if (di + 1 < detailItems.length) {
          this.doc.setTextColor(...C.textLt);
          this.doc.text(detailItems[di + 1][0] + ':', M + CW / 2, this.y);
          this.doc.setTextColor(...C.text);
          this.doc.text(detailItems[di + 1][1], M + CW / 2 + 25, this.y);
        }
        this.y += 4;
      }

      // Precautions
      if (g.precautions && g.precautions.length > 0) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.orange);
        this.doc.text('Precautions:', M + 3, this.y);
        this.y += 3;
        for (const p of g.precautions) {
          this.bullet(p, 6);
        }
      }
      this.y += 4;
    }
  }

  private ch9DashaTimeline(d: PdfReportData) {
    if (!d.enhancedDashas || d.enhancedDashas.length === 0) return;

    this.newPage();
    this.chapterHeader(9, 'Dasha Timeline');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text('Complete Mahadasha timeline with period assessments', M, this.y);
    this.y += 6;

    // Mahadasha table
    const dw = [24, 32, 16, 22, 76]; // 170
    this.tableHeader(['Planet', 'Period', 'Years', 'Rating', 'Assessment'], dw);

    const ratingColors: Record<string, RGB> = {
      excellent: C.green, favourable: C.blue, mixed: C.orange, challenging: C.red,
    };

    for (const dash of d.enhancedDashas) {
      this.ensureSpace(6);
      const rc = ratingColors[dash.rating] || C.text;
      const bg = dash.isCurrent ? C.highlight : null;
      this.tableRow(
        [
          dash.planet + (dash.isCurrent ? ' *' : ''),
          `${dash.startYear}–${dash.endYear}`,
          String(dash.endYear - dash.startYear),
          dash.rating.toUpperCase(),
          truncate(dash.ratingReason, 90),
        ],
        dw,
        [rc, null, null, rc, null],
        bg,
      );
    }

    // Current Antardasha sub-periods
    const currentMaha = d.enhancedDashas.find(dd => dd.isCurrent);
    if (currentMaha && currentMaha.antardashas && currentMaha.antardashas.length > 0) {
      this.y += 4;
      this.sectionTitle(`${currentMaha.planet} Antardasha Sub-Periods`);
      const aw = [34, 28, 28, 24, 56]; // 170
      this.tableHeader(['Sub-Period', 'Start', 'End', 'Duration', 'Status'], aw);

      for (const ad of currentMaha.antardashas) {
        this.ensureSpace(6);
        const isCurr = ad.isCurrent;
        const fmtStart = ad.startMonth && ad.startYear ? `${ad.startMonth}/${ad.startYear}` : '-';
        const fmtEnd = ad.endMonth && ad.endYear ? `${ad.endMonth}/${ad.endYear}` : '-';
        const durYears = Math.floor(ad.duration);
        const durMonths = Math.round((ad.duration - durYears) * 12);
        const durStr = `${durYears}y ${durMonths}m`;
        this.tableRow(
          [`${currentMaha.planet}/${ad.planet}`, fmtStart, fmtEnd, durStr, isCurr ? 'Active' : ''],
          aw,
          [null, null, null, null, isCurr ? C.green : null],
          isCurr ? C.highlight : null,
        );
      }
    }
  }

  private ch10Predictions(d: PdfReportData) {
    if (!d.dashaPredictions || d.dashaPredictions.length === 0) return;

    const perPage = 4;
    const pages = Math.ceil(d.dashaPredictions.length / perPage);

    for (let pg = 0; pg < pages; pg++) {
      this.newPage();
      if (pg === 0) {
        this.chapterHeader(10, '35-Year Prediction Summary');
      } else {
        this.pageHeader('Prediction Summary (contd.)');
      }

      const start = pg * perPage;
      const end = Math.min(start + perPage, d.dashaPredictions.length);

      for (let i = start; i < end; i++) {
        const pred = d.dashaPredictions[i];
        this.ensureSpace(35);

        const isCurrent = pred.isCurrent;
        const bg = isCurrent ? C.highlight : (i - start) % 2 === 1 ? C.rowAlt : null;
        if (bg) {
          this.doc.setFillColor(...bg);
          this.doc.rect(M, this.y - 2, CW, 4, 'F');
        }

        // Header: Mahadasha/Antardasha + rating
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(10);
        this.doc.setTextColor(...C.text);
        this.doc.text(`${pred.mahadasha} / ${pred.antardasha}`, M + 2, this.y + 1);
        if (isCurrent) this.badge('CURRENT', C.gold, M + 50, this.y + 1);

        const ratingColor = pred.rating === 'Excellent' ? C.green : pred.rating === 'Favourable' ? C.blue : pred.rating === 'Mixed' ? C.orange : C.red;
        this.badge(pred.rating.toUpperCase(), ratingColor, PW - M - 20, this.y + 1);
        this.y += 5;

        // Date range
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.textLt);
        this.doc.text(`${pred.startMonth}/${pred.startYear} — ${pred.endMonth}/${pred.endYear}`, M + 2, this.y);
        this.y += 4;

        // Prediction text
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.text);
        const predText = truncate(pred.prediction, 400);
        const lines = this.doc.splitTextToSize(predText, CW - 4);
        this.ensureSpace(lines.length * 3.5);
        this.doc.text(lines, M + 2, this.y);
        this.y += lines.length * 3.5 + 6;
      }
    }
  }

  private ch11Transits(d: PdfReportData) {
    if (!d.transits || d.transits.length === 0) return;

    this.newPage();
    this.chapterHeader(11, 'Transit Predictions');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text(`Current planetary transits from ${d.chart.moonSign.name} Moon Sign`, M, this.y);
    this.y += 6;

    for (const t of d.transits) {
      this.ensureSpace(22);
      const color = t.isPositive ? C.green : C.red;
      const bgCol = t.isPositive ? [245, 255, 245] as RGB : [255, 245, 245] as RGB;
      const borderCol = t.isPositive ? [200, 230, 201] as RGB : [238, 206, 206] as RGB;

      this.doc.setFillColor(...bgCol);
      this.doc.setDrawColor(...borderCol);
      this.doc.roundedRect(M, this.y - 1, CW, 3, 1, 1, 'FD');

      // Planet + status
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...color);
      this.doc.text(t.planet, M + 3, this.y + 2);
      this.badge(t.isPositive ? 'FAVOURABLE' : 'CHALLENGING', color, M + 25, this.y + 2);

      // Transit info
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textMed);
      this.doc.text(`${t.transitSign} | ${t.houseFromMoon}th from Moon`, PW - M - 3, this.y + 2, { align: 'right' });
      this.y += 6;

      // Effects
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.text);
      const lines = this.doc.splitTextToSize(t.effects, CW - 6);
      this.doc.text(lines, M + 3, this.y);
      this.y += lines.length * 3.5 + 2;

      // Date range
      if (t.startDate || t.endDate) {
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.textLt);
        this.doc.text(`${t.startDate ? 'From: ' + t.startDate : ''} ${t.endDate ? 'To: ' + t.endDate : ''}`, M + 3, this.y);
        this.y += 4;
      }
      this.y += 3;
    }
  }

  private ch12NakshatraRemedies(d: PdfReportData) {
    if (!d.nakshatraRemedy) return;
    const nr = d.nakshatraRemedy;

    this.newPage();
    this.chapterHeader(12, 'Nakshatra Remedies');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text(`${nr.nakshatra} (${nr.sign})`, M, this.y);
    this.y += 5;

    // Characteristics
    if (nr.characteristics) {
      this.ensureSpace(16);
      this.doc.setFillColor(...C.goldBg);
      this.doc.roundedRect(M, this.y - 1, CW, 4, 1, 1, 'F');
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.text);
      const cLines = this.doc.splitTextToSize(nr.characteristics, CW - 8);
      const boxH = cLines.length * 3.5 + 6;
      this.doc.setFillColor(...C.goldBg);
      this.doc.roundedRect(M, this.y - 1, CW, boxH, 1, 1, 'F');
      this.doc.text(cLines, M + 4, this.y + 3);
      this.y += boxH + 3;
    }

    // Star details grid
    this.sectionTitle('Star Details');
    const starDetails = [
      ['Star Lord', nr.starLord], ['Sign Lord', nr.signLord], ['Element', nr.element],
      ['Animal', nr.animal], ['Tree', nr.tree], ['Bird', nr.bird],
    ];
    for (let i = 0; i < starDetails.length; i += 3) {
      this.ensureSpace(5);
      for (let j = 0; j < 3 && i + j < starDetails.length; j++) {
        const x = M + j * (CW / 3);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.textLt);
        this.doc.text(starDetails[i + j][0], x, this.y);
        this.doc.setTextColor(...C.text);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(starDetails[i + j][1], x, this.y + 3.5);
      }
      this.y += 8;
    }

    // Hostile periods
    if (nr.hostileDasas.length > 0) {
      this.sectionTitle('Hostile Periods');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.red);
      this.doc.text(`Hostile Dasa: ${nr.hostileDasas.join(', ')}`, M, this.y);
      this.y += 4;
      if (nr.hostileNakshatras.length > 0) {
        this.doc.setTextColor(...C.orange);
        this.doc.text(`Avoid on: ${nr.hostileNakshatras.join(', ')}`, M, this.y);
        this.y += 5;
      }
    }

    // General Advice
    if (nr.generalAdvice) {
      this.sectionTitle('General Advice');
      this.mutedText(nr.generalAdvice);
    }

    // Remedies
    this.sectionTitle('Remedies');
    const remedyItems = [
      ['Prayer', nr.remedies.prayer],
      ['Fasting', nr.remedies.fasting],
      ['Dress', nr.remedies.dress],
      ['Deity Worship', nr.remedies.deity],
      ['Nurturing', nr.remedies.nurturing],
    ];
    for (const [label, text] of remedyItems) {
      if (!text) continue;
      this.ensureSpace(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.gold);
      this.doc.text(label + ':', M, this.y);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...C.text);
      this.doc.text(text, M + 25, this.y);
      this.y += 4;
    }

    // Mantras
    if (nr.remedies.mantras && nr.remedies.mantras.length > 0) {
      this.sectionTitle('Sacred Mantras');
      this.doc.setFillColor(...C.goldBg);
      const mantrasH = nr.remedies.mantras.length * 5 + 6;
      this.ensureSpace(mantrasH);
      this.doc.roundedRect(M, this.y - 1, CW, mantrasH, 1, 1, 'F');
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(9);
      this.doc.setTextColor(...C.gold);
      for (const mantra of nr.remedies.mantras) {
        this.y += 4;
        this.doc.text(truncate(mantra, 100), PW / 2, this.y, { align: 'center' });
      }
      this.y += 5;
    }
  }

  private ch13DasaRemedies(d: PdfReportData) {
    if (!d.dasaRemediesList || d.dasaRemediesList.length === 0) return;

    const perPage = 3;
    const pages = Math.ceil(d.dasaRemediesList.length / perPage);

    for (let pg = 0; pg < pages; pg++) {
      this.newPage();
      if (pg === 0) {
        this.chapterHeader(13, 'Dasa Period Remedies');
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(9);
        this.doc.setTextColor(...C.textLt);
        this.doc.text('Remedies for unfavorable dasa periods', M, this.y);
        this.y += 6;
      } else {
        this.pageHeader('Dasa Period Remedies (contd.)');
      }

      const start = pg * perPage;
      const end = Math.min(start + perPage, d.dasaRemediesList.length);

      for (let i = start; i < end; i++) {
        const { planet, remedy } = d.dasaRemediesList[i];
        this.ensureSpace(40);

        // Header
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(11);
        this.doc.setTextColor(...C.gold);
        this.doc.text(`${planet} Dasa`, M, this.y);
        if (remedy.sanskrit) {
          this.doc.setFont('helvetica', 'italic');
          this.doc.setFontSize(8);
          this.doc.setTextColor(...C.textMed);
          this.doc.text(remedy.sanskrit, M + this.doc.getTextWidth(`${planet} Dasa  `) + 2, this.y);
        }
        this.badge('REMEDY NEEDED', C.red, PW - M - 25, this.y);
        this.y += 5;

        // Unfavorable effects
        if (remedy.unfavorableEffects) {
          this.doc.setFont('helvetica', 'normal');
          this.doc.setFontSize(8);
          this.doc.setTextColor(...C.text);
          const eff = truncate(remedy.unfavorableEffects, 250);
          const lines = this.doc.splitTextToSize(eff, CW);
          this.doc.text(lines, M, this.y);
          this.y += lines.length * 3.5 + 3;
        }

        // Details grid
        const gridItems = [
          ['Dress Colors', remedy.dress?.colors?.join(', ') || '-'],
          ['Fasting Day', remedy.fasting?.day || '-'],
          ['Deity', remedy.deity?.primary || '-'],
          ['Gemstone', remedy.gemstone || '-'],
        ];
        for (let gi = 0; gi < gridItems.length; gi += 2) {
          this.ensureSpace(5);
          this.doc.setFontSize(7);
          this.doc.setTextColor(...C.textLt);
          this.doc.text(gridItems[gi][0] + ':', M, this.y);
          this.doc.setTextColor(...C.text);
          this.doc.text(gridItems[gi][1], M + 25, this.y);
          if (gi + 1 < gridItems.length) {
            this.doc.setTextColor(...C.textLt);
            this.doc.text(gridItems[gi + 1][0] + ':', M + CW / 2, this.y);
            this.doc.setTextColor(...C.text);
            this.doc.text(gridItems[gi + 1][1], M + CW / 2 + 22, this.y);
          }
          this.y += 4;
        }

        // Key Mantra
        if (remedy.generalMantras && remedy.generalMantras.length > 0) {
          this.ensureSpace(10);
          this.doc.setFillColor(...C.goldBg);
          this.doc.roundedRect(M, this.y, CW, 9, 1, 1, 'F');
          this.doc.setFont('helvetica', 'bold');
          this.doc.setFontSize(7);
          this.doc.setTextColor(...C.gold);
          this.doc.text('KEY MANTRA:', M + 3, this.y + 3.5);
          this.doc.setFont('helvetica', 'italic');
          this.doc.setFontSize(8);
          this.doc.text(truncate(remedy.generalMantras[0], 80), M + 25, this.y + 3.5);
          this.y += 12;
        }
        this.y += 4;
      }
    }
  }

  private ch14FavourablePeriods(d: PdfReportData) {
    if (!d.favourablePeriods) return;
    const fp = d.favourablePeriods;

    const renderTable = (title: string, periods: FavourablePeriod[]) => {
      this.sectionTitle(title);
      if (periods.length === 0) {
        this.mutedText('No periods identified.');
        return;
      }
      const fw = [28, 56, 42, 44]; // 170
      this.tableHeader(['Rating', 'Period', 'Age', 'Duration'], fw);

      const ratingColors: Record<string, RGB> = {
        excellent: C.green, favourable: C.blue, less_favourable: C.orange,
      };
      for (const p of periods.slice(0, 15)) {
        this.ensureSpace(6);
        const rc = ratingColors[p.rating] || C.text;
        this.tableRow(
          [p.rating.replace('_', ' ').toUpperCase(), `${p.startDate} – ${p.endDate}`, `${p.startAge} – ${p.endAge}`, p.duration],
          fw,
          [rc, null, null, null],
        );
      }
    };

    // Page 1: Career + Business
    this.newPage();
    this.chapterHeader(14, 'Favourable Periods');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text('Analysis of Dasa/Antardasha periods for optimal timing', M, this.y);
    this.y += 6;

    renderTable('Favourable Periods for Career', fp.career);
    renderTable('Favourable Periods for Business', fp.business);

    // Page 2: House Construction + Legend
    this.newPage();
    this.pageHeader('Favourable Periods (contd.)');
    renderTable('Favourable Periods for House Construction', fp.houseConstruction);

    // Legend box
    this.y += 4;
    this.ensureSpace(25);
    this.doc.setFillColor(...C.goldBg);
    this.doc.roundedRect(M, this.y, CW, 22, 2, 2, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.gold);
    this.doc.text('How to Read', M + 4, this.y + 5);
    const legendItems = [
      ['EXCELLENT', 'Highly auspicious period — best time to act', C.green],
      ['FAVOURABLE', 'Good period — suitable for progress', C.blue],
      ['LESS FAVOURABLE', 'Challenging period — proceed with caution', C.orange],
    ] as [string, string, RGB][];
    let ly = this.y + 10;
    for (const [label, desc, color] of legendItems) {
      this.badge(label, color, M + 6, ly);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...C.textMed);
      this.doc.text(desc, M + 40, ly);
      ly += 4;
    }
    this.y += 26;
  }

  private ch15AshtakaVarga(d: PdfReportData) {
    if (!d.ashtakavarga) return;
    const av = d.ashtakavarga;

    // Page 1: Sarvashtakavarga table + planet strength
    this.newPage();
    this.chapterHeader(15, 'AshtakaVarga Predictions');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...C.textLt);
    this.doc.text('Planetary strength analysis based on eightfold bindu system', M, this.y);
    this.y += 6;

    this.sectionTitle('Sarvashtakavarga Table');
    // Header: Planet + 12 signs + Total
    const signAbbrShort = signAbbrev;
    const avW = [18, ...Array(12).fill(11), 16]; // 18 + 132 + 16 = 166 ~close to 170
    this.tableHeader(['Planet', ...signAbbrShort, 'Total'], avW as number[]);

    // Planet rows
    for (const pl of av.planets) {
      this.ensureSpace(5);
      const cells = [
        pl.planet,
        ...pl.bindhus.map(String),
        String(pl.total),
      ];
      const colors: (RGB | null)[] = [C.text];
      for (const b of pl.bindhus) {
        colors.push(b >= 5 ? C.green : b >= 4 ? C.blue : b < 3 ? C.red : null);
      }
      colors.push(C.gold);
      this.tableRow(cells, avW as number[], colors);
    }

    // Sarvashtakavarga totals row
    if (av.sarvashtakavarga) {
      this.ensureSpace(6);
      const totCells = ['Total', ...av.sarvashtakavarga.totals.map(String), String(av.sarvashtakavarga.grandTotal)];
      const totColors: (RGB | null)[] = [C.gold];
      for (const t of av.sarvashtakavarga.totals) {
        totColors.push(t >= 30 ? C.green : t >= 25 ? C.blue : t < 22 ? C.red : null);
      }
      totColors.push(C.gold);
      this.tableRow(totCells, avW as number[], totColors, C.goldBg);
    }

    // Planet strength predictions
    this.y += 4;
    this.sectionTitle('Planet Strength Predictions');
    for (const pl of av.planets) {
      this.ensureSpace(12);
      const isStrong = pl.total >= 30;
      const isWeak = pl.total < 20;
      const color = isStrong ? C.green : isWeak ? C.red : C.text;

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9);
      this.doc.setTextColor(...color);
      this.doc.text(pl.planet, M, this.y);
      this.badge(`${pl.total} BINDHUS`, color, M + 22, this.y);
      this.y += 4;

      if (pl.prediction) {
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.textMed);
        const lines = this.doc.splitTextToSize(truncate(pl.prediction, 200), CW);
        this.doc.text(lines, M, this.y);
        this.y += lines.length * 3.5 + 2;
      }
    }

    // Page 2: Sarvashtakavarga analysis
    if (av.sarvashtakavarga) {
      this.newPage();
      this.pageHeader('Sarvashtakavarga Analysis');
      const sv = av.sarvashtakavarga;

      // Collective influence
      if (sv.prediction) {
        this.doc.setFillColor(...C.goldBg);
        const pLines = this.doc.splitTextToSize(sv.prediction, CW - 8);
        const boxH = pLines.length * 3.5 + 8;
        this.doc.roundedRect(M, this.y, CW, boxH, 2, 2, 'F');
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.gold);
        this.doc.text('Collective Influence', M + 4, this.y + 4);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(...C.text);
        this.doc.text(pLines, M + 4, this.y + 8);
        this.y += boxH + 4;
      }

      // Sign-wise strength
      this.sectionTitle('Sign-wise Strength');
      for (let si = 0; si < 12; si++) {
        this.ensureSpace(6);
        const total = sv.totals[si];
        const barW = Math.max(2, (total / 45) * 80); // max ~80mm bar
        const color = total >= 30 ? C.green : total >= 25 ? C.blue : total < 22 ? C.red : C.textMed;

        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.text);
        this.doc.text(`${signAbbrev[si]} (${signNames[si]})`, M, this.y);
        // Bar
        this.doc.setFillColor(...color);
        this.doc.rect(M + 40, this.y - 2.5, barW, 3, 'F');
        this.doc.setTextColor(...color);
        this.doc.text(String(total), M + 42 + barW, this.y);
        this.y += 5;
      }

      // Key insights
      this.y += 2;
      this.ensureSpace(14);
      const strongest = sv.strongestSign;
      const weakest = sv.weakestSign;
      // Strongest
      this.doc.setFillColor(245, 255, 245);
      this.doc.roundedRect(M, this.y, CW / 2 - 3, 10, 1, 1, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.green);
      this.doc.text(`Strongest: ${signNames[strongest]} (${sv.totals[strongest]})`, M + 3, this.y + 5);
      // Weakest
      this.doc.setFillColor(255, 245, 245);
      this.doc.roundedRect(M + CW / 2 + 3, this.y, CW / 2 - 3, 10, 1, 1, 'F');
      this.doc.setTextColor(...C.red);
      this.doc.text(`Weakest: ${signNames[weakest]} (${sv.totals[weakest]})`, M + CW / 2 + 6, this.y + 5);
      this.y += 14;

      // Grand total
      this.doc.setFillColor(...C.goldBg);
      this.doc.roundedRect(M, this.y, CW, 8, 1, 1, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9);
      this.doc.setTextColor(...C.gold);
      this.doc.text(`Grand Total: ${sv.grandTotal}`, M + 4, this.y + 5);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...C.textMed);
      this.doc.text(sv.grandTotal >= 337 ? '(Meets standard threshold of 337)' : `(Below standard threshold of 337)`, M + 45, this.y + 5);
      this.y += 12;
    }
  }

  private ch16Pratyantardasha(d: PdfReportData) {
    if (!d.pratyantardasha?.periods || d.pratyantardasha.periods.length === 0) return;

    const periods = d.pratyantardasha.periods;
    const perPage = 8;
    const maxPages = 10;
    const totalShow = Math.min(periods.length, maxPages * perPage);
    const pages = Math.ceil(totalShow / perPage);

    for (let pg = 0; pg < pages; pg++) {
      this.newPage();
      if (pg === 0) {
        this.chapterHeader(16, 'Pratyantardasha Predictions');
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(9);
        this.doc.setTextColor(...C.textLt);
        this.doc.text('Sub-sub-period predictions based on Vimshottari Dasa system', M, this.y);
        this.y += 6;
      } else {
        this.pageHeader('Pratyantardasha (contd.)');
      }

      const start = pg * perPage;
      const end = Math.min(start + perPage, totalShow);

      for (let i = start; i < end; i++) {
        const p = periods[i];
        this.ensureSpace(20);
        const bg = p.isCurrent ? C.highlight : C.rowAlt;

        this.doc.setFillColor(...bg);
        this.doc.roundedRect(M, this.y - 1, CW, 3, 1, 1, 'F');

        // Period names
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(9);
        this.doc.setTextColor(...C.text);
        this.doc.text(`${p.mahadasha} / ${p.antardasha} / ${p.pratyantardasha}`, M + 2, this.y + 1.5);
        if (p.isCurrent) this.badge('CURRENT', C.gold, PW - M - 18, this.y + 1.5);
        // Duration
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.textLt);
        this.doc.text(p.duration, PW - M - 2, this.y + 1.5, { align: 'right' });
        this.y += 5;

        // Date range + age
        this.doc.setFontSize(7);
        this.doc.setTextColor(...C.textMed);
        this.doc.text(`${p.startDate} — ${p.endDate} | Age ${p.startAge} to ${p.endAge}`, M + 2, this.y);
        this.y += 3.5;

        // Prediction
        this.doc.setFontSize(7.5);
        this.doc.setTextColor(...C.text);
        const pred = truncate(p.prediction, 220);
        const lines = this.doc.splitTextToSize(pred, CW - 4);
        this.doc.text(lines, M + 2, this.y);
        this.y += lines.length * 3 + 4;
      }
    }

    if (periods.length > totalShow) {
      this.ensureSpace(8);
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.textLt);
      this.doc.text(`Showing ${totalShow} of ${periods.length} total periods. Full predictions available on the website.`, M, this.y);
      this.y += 6;
    }
  }

  private ch17Calculations(d: PdfReportData) {
    // Page 1: Longitude + Combustion + Planetary War
    this.newPage();
    this.chapterHeader(17, 'Calculations & Tables');

    // Nirayana Longitude Table
    if (d.longitudeTable && d.longitudeTable.length > 0) {
      this.sectionTitle('Nirayana Longitude');
      const lw = [22, 28, 24, 22, 26, 12, 10]; // ~144, adjust
      this.tableHeader(['Planet', 'Longitude', 'Sign', 'Deg in Sign', 'Nakshatra', 'Pada', 'R'], lw);

      for (const [i, l] of d.longitudeTable.entries()) {
        this.tableRow(
          [l.planet, l.longitude, `${l.sign}`, l.degreeInSign, l.nakshatra, String(l.pada), l.retrograde ? 'R' : '-'],
          lw,
          [null, null, null, null, null, null, l.retrograde ? C.red : C.green],
          i % 2 === 1 ? C.rowAlt : null,
        );
      }
    }

    // Combustion
    if (d.combustion && d.combustion.length > 0) {
      this.y += 2;
      this.sectionTitle('Combustion Status');
      const cw = [22, 30, 30, 24, 64]; // 170
      this.tableHeader(['Planet', 'Dist from Sun', 'Threshold', 'Status', 'Effect'], cw);

      for (const c of d.combustion) {
        const isCombust = c.isCombust;
        this.tableRow(
          [c.planet, `${c.distanceFromSun.toFixed(1)}°`, `${c.combustionThreshold.toFixed(1)}°`, isCombust ? 'Combust' : 'Safe', truncate(c.effect, 70)],
          cw,
          [null, null, null, isCombust ? C.red : C.green, null],
          isCombust ? [255, 245, 245] as RGB : null,
        );
      }
    }

    // Planetary War
    if (d.planetaryWar && d.planetaryWar.length > 0) {
      this.y += 2;
      this.sectionTitle('Planetary War (Graha Yuddha)');
      for (const w of d.planetaryWar) {
        this.ensureSpace(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(9);
        this.doc.setTextColor(...C.text);
        this.doc.text(`${w.planet1} vs ${w.planet2}`, M, this.y);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.textMed);
        this.doc.text(`(${w.distance.toFixed(1)}° apart)`, M + 35, this.y);
        this.badge(`${w.winner} WINS`, C.green, M + 60, this.y);
        this.y += 4;
        this.mutedText(w.effect);
      }
    } else {
      this.y += 2;
      this.sectionTitle('Planetary War');
      this.doc.setFillColor(245, 255, 245);
      this.doc.roundedRect(M, this.y, CW, 8, 1, 1, 'F');
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...C.green);
      this.doc.text('No planetary war detected in your birth chart.', M + 4, this.y + 5);
      this.y += 12;
    }

    // Page 2: Grahavastha + Shadbala + Ishta-Kashta
    if (d.grahavastha || d.shadbala || d.ishtaKashta) {
      this.newPage();
      this.pageHeader('Calculations & Tables (contd.)');

      if (d.grahavastha && d.grahavastha.length > 0) {
        this.sectionTitle('Grahavastha (Planetary Status)');
        const gw = [22, 24, 20, 30, 24, 14]; // ~134
        this.tableHeader(['Planet', 'Sign', 'Degree', 'Dignity', 'Status', 'Retro'], gw);
        const dignityColors: Record<string, RGB> = {
          exalted: C.green, debilitated: C.red, own: C.blue, moolatrikona: C.gold, friend: C.green, enemy: C.red, neutral: C.textMed,
        };
        for (const g of d.grahavastha) {
          const dc = dignityColors[g.status] || C.text;
          this.tableRow(
            [g.planet, g.sign, g.degree, g.dignity, g.status.charAt(0).toUpperCase() + g.status.slice(1), g.retrograde ? 'R' : '-'],
            gw,
            [null, null, null, dc, dc, g.retrograde ? C.red : null],
          );
        }
      }

      if (d.shadbala && d.shadbala.length > 0) {
        this.y += 2;
        this.sectionTitle('Shadbala (Planetary Strength)');
        const sw = [22, 22, 20, 26, 22, 28, 18]; // ~158
        this.tableHeader(['Planet', 'Sthana', 'Dig', 'Naisargika', 'Total', 'Strength', '%'], sw);
        const strColors: Record<string, RGB> = {
          very_strong: C.green, strong: C.blue, moderate: C.gold, weak: C.orange, very_weak: C.red,
        };
        for (const s of d.shadbala) {
          const sc = strColors[s.strength] || C.text;
          this.tableRow(
            [s.planet, s.sthanaBala.toFixed(1), s.digBala.toFixed(1), s.naisargikaBala.toFixed(1), s.totalBala.toFixed(1), s.strength.replace('_', ' '), `${s.percentage}%`],
            sw,
            [null, null, null, null, null, sc, null],
          );
        }
      }

      if (d.ishtaKashta && d.ishtaKashta.length > 0) {
        this.y += 2;
        this.sectionTitle('Ishta-Kashta (Favorable/Unfavorable Effects)');
        const iw = [30, 40, 40, 40]; // ~150
        this.tableHeader(['Planet', 'Ishta Phala', 'Kashta Phala', 'Net Effect'], iw);
        for (const ik of d.ishtaKashta) {
          const nc = ik.netEffect === 'favorable' ? C.green : ik.netEffect === 'unfavorable' ? C.red : C.textMed;
          this.tableRow(
            [ik.planet, ik.ishtaPhala.toFixed(2), ik.kashtaPhala.toFixed(2), ik.netEffect.charAt(0).toUpperCase() + ik.netEffect.slice(1)],
            iw,
            [null, C.green, C.red, nc],
          );
        }
      }
    }

    // Page 3: Bhavabala + Shodasavarga
    if (d.bhavabala || d.shodasavarga) {
      this.newPage();
      this.pageHeader('Calculations & Tables (contd.)');

      if (d.bhavabala && d.bhavabala.length > 0) {
        this.sectionTitle('Bhavabala (House Strength)');
        const bw = [20, 28, 28, 28, 28]; // ~132
        this.tableHeader(['House', 'Sign', 'Lord', 'Strength', 'Rating'], bw);
        for (const b of d.bhavabala) {
          const rc = b.category === 'strong' ? C.green : b.category === 'weak' ? C.red : C.textMed;
          this.tableRow(
            [String(b.house), b.sign, b.signLord, b.strength.toFixed(1), b.category.charAt(0).toUpperCase() + b.category.slice(1)],
            bw,
            [null, null, null, null, rc],
          );
        }
      }

      if (d.shodasavarga && d.shodasavarga.length > 0) {
        this.y += 2;
        this.sectionTitle('Shodasavarga (Divisional Charts)');
        const dvNames = ['D1','D2','D3','D4','D7','D9','D10','D12','D16','D20','D24','D27','D30','D60'];
        const sdw = [18, ...Array(14).fill(10.5)]; // 18 + 147 = 165
        this.tableHeader(['Planet', ...dvNames], sdw as number[]);
        for (const s of d.shodasavarga) {
          this.tableRow(
            [s.planet, s.d1, s.d2, s.d3, s.d4, s.d7, s.d9, s.d10, s.d12, s.d16, s.d20, s.d24, s.d27, s.d30, s.d60],
            sdw as number[],
          );
        }
      }
    }

    // Page 4: Sayana + Bhava Cusps + KP
    if (d.sayanaLongitude || d.bhavaTable || d.kpTable) {
      this.newPage();
      this.pageHeader('Calculations & Tables (contd.)');

      if (d.sayanaLongitude && d.sayanaLongitude.length > 0) {
        this.sectionTitle('Western (Sayana) Longitude');
        const syw = [22, 38, 28, 38, 34]; // ~160
        this.tableHeader(['Planet', 'Nirayana', 'Ayanamsa', 'Sayana', 'Tropical Sign'], syw);
        for (const sy of d.sayanaLongitude) {
          this.tableRow([sy.planet, sy.nirayana, sy.ayanamsa, sy.sayana, sy.tropicalSign], syw);
        }
      }

      if (d.bhavaTable && d.bhavaTable.length > 0) {
        this.y += 2;
        this.sectionTitle('Bhava (House Cusp) Table');
        const btw = [18, 22, 30, 28, 28, 44]; // ~170
        this.tableHeader(['House', 'Sign', 'Start Degree', 'Mid Degree', 'End Degree', 'Planets'], btw);
        for (const bt of d.bhavaTable) {
          this.tableRow(
            [String(bt.house), bt.sign, bt.startDegree, bt.midDegree, bt.endDegree, bt.planetsInHouse.join(', ') || '-'],
            btw,
          );
        }
      }

      if (d.kpTable && d.kpTable.length > 0) {
        this.y += 2;
        this.sectionTitle('Star Lord / Sub-Lord Table (KP System)');
        const kw = [22, 28, 26, 24, 24, 28]; // ~152
        this.tableHeader(['Planet', 'Position', 'Nakshatra', 'Star Lord', 'Sub Lord', 'Sub-Sub Lord'], kw);
        for (const k of d.kpTable) {
          this.tableRow([k.planet, k.signDegree, k.nakshatra, k.nakshatraLord, k.subLord, k.subSubLord], kw);
        }
      }
    }
  }

  private finalPage(d: PdfReportData) {
    this.newPage();

    // Nakshatra summary
    const nkData = nakshatraDetails[d.chart.nakshatra];
    if (nkData) {
      this.sectionTitle(`Nakshatra — ${d.chart.nakshatra}`);
      const nkItems = [
        ['Deity', nkData.deity], ['Symbol', nkData.symbol],
        ['Ruler', nkData.ruler], ['Nature', nkData.nature],
      ];
      for (let i = 0; i < nkItems.length; i += 2) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.textLt);
        this.doc.text(nkItems[i][0] + ':', M, this.y);
        this.doc.setTextColor(...C.text);
        this.doc.text(nkItems[i][1], M + 18, this.y);
        if (i + 1 < nkItems.length) {
          this.doc.setTextColor(...C.textLt);
          this.doc.text(nkItems[i + 1][0] + ':', M + CW / 2, this.y);
          this.doc.setTextColor(...C.text);
          this.doc.text(nkItems[i + 1][1], M + CW / 2 + 18, this.y);
        }
        this.y += 5;
      }
      if (nkData.qualities) {
        this.y += 2;
        this.mutedText(nkData.qualities);
      }
      if (nkData.careers && nkData.careers.length > 0) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.gold);
        this.doc.text('Suited Careers:', M, this.y);
        this.y += 4;
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(...C.text);
        this.doc.text(nkData.careers.join(', '), M, this.y);
        this.y += 6;
      }
    }

    // Current Dasha Period
    const dashaOrder = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
    const birthYear = new Date(d.dob).getFullYear();
    const currentDashaIdx = (new Date().getFullYear() - birthYear) % 9;
    const currentDashaLord = dashaOrder[currentDashaIdx];
    const dashaBenefic = isBeneficForAscendant(currentDashaLord, d.chart.ascendant.index);
    const dashaMalefic = currentDashaLord === getMostMalefic(d.chart.ascendant.index);

    this.y += 4;
    this.ensureSpace(25);
    this.doc.setFillColor(...C.goldBg);
    this.doc.roundedRect(M, this.y, CW, 22, 2, 2, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13);
    this.doc.setTextColor(...C.gold);
    this.doc.text(`${currentDashaLord} Mahadasha`, M + 4, this.y + 7);

    const currentAD = d.enhancedDashas?.find(dd => dd.isCurrent)?.antardashas?.find(ad => ad.isCurrent);
    if (currentAD) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.setTextColor(...C.textMed);
      this.doc.text(`${currentAD.planet} Antardasha`, M + 4, this.y + 12);
    }

    const statusColor = dashaBenefic ? C.green : dashaMalefic ? C.red : C.gold;
    const statusText = dashaBenefic ? 'Benefic Period — Favorable time for growth' : dashaMalefic ? 'Challenging Period — Remedies advised' : 'Neutral Period — Steady progress expected';
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...statusColor);
    this.doc.text(statusText, M + 4, this.y + 18);
    this.y += 28;

    // Recommendations
    if (d.horoscope) {
      this.sectionTitle('Recommendations');
      const recItems = [
        ['Gemstone', d.horoscope.gem || '-'],
        ['Deity', d.horoscope.deity || '-'],
        ['Element', d.horoscope.element || '-'],
        ['Ruler', d.horoscope.ruler || '-'],
      ];
      for (let i = 0; i < recItems.length; i += 2) {
        this.ensureSpace(8);
        for (let j = 0; j < 2 && i + j < recItems.length; j++) {
          const x = M + j * (CW / 2);
          this.doc.setFillColor(...C.goldBg);
          this.doc.roundedRect(x, this.y, CW / 2 - 4, 8, 1, 1, 'F');
          this.doc.setFont('helvetica', 'normal');
          this.doc.setFontSize(7);
          this.doc.setTextColor(...C.textLt);
          this.doc.text(recItems[i + j][0], x + 3, this.y + 3);
          this.doc.setFont('helvetica', 'bold');
          this.doc.setTextColor(...C.gold);
          this.doc.text(recItems[i + j][1], x + 3, this.y + 6.5);
        }
        this.y += 12;
      }

      // Compatible Signs
      if (d.horoscope.compatibility && d.horoscope.compatibility.length > 0) {
        this.ensureSpace(8);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...C.gold);
        this.doc.text('Compatible Signs:', M, this.y);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(...C.text);
        this.doc.text(d.horoscope.compatibility.join(', '), M + 30, this.y);
        this.y += 6;
      }
    }

    // Final footer block
    this.y = PH - 40;
    this.goldLine(PW / 2 - 15, this.y, 30);
    this.y += 6;
    this.textAt('Generated by Vedic Astro', PW / 2, this.y, 9, C.gold, true, 'center');
    this.y += 4;
    this.textAt('vedicastro.co', PW / 2, this.y, 8, C.textLt, false, 'center');
  }

  // ═══════════════════════════════════════════
  //  MAIN GENERATOR
  // ═══════════════════════════════════════════

  generate(data: PdfReportData): jsPDF {
    // Page 1: Cover
    this.coverPage(data);
    // Page 2: Ch.1 Birth Details
    this.ch1BirthDetails(data);
    // Page 3: Table of Contents
    this.tocPage(data);
    // Page 4: How to Read
    this.howToReadPage();
    // Ch.2: Planet Analysis
    this.ch2PlanetAnalysis(data);
    // Ch.3: Life Questions & Answers
    this.ch3LifeQuestions(data);
    // Ch.4: Characteristics & Behaviour
    this.ch4Characteristics(data);
    // Ch.5: Houses
    this.ch5Houses(data);
    // Ch.6: Yogas
    this.ch6Yogas(data);
    // Ch.7: Doshas & Remedies
    this.ch7Doshas(data);
    // Ch.8: Gemstones
    this.ch8Gemstones(data);
    // Ch.9: Dasha Timeline
    this.ch9DashaTimeline(data);
    // Ch.10: 35-Year Predictions
    this.ch10Predictions(data);
    // Ch.11: Transit Predictions
    this.ch11Transits(data);
    // Ch.12: Nakshatra Remedies
    this.ch12NakshatraRemedies(data);
    // Ch.13: Dasa Remedies
    this.ch13DasaRemedies(data);
    // Ch.14: Favourable Periods
    this.ch14FavourablePeriods(data);
    // Ch.15: AshtakaVarga
    this.ch15AshtakaVarga(data);
    // Ch.16: Pratyantardasha
    this.ch16Pratyantardasha(data);
    // Ch.17: Calculations & Tables
    this.ch17Calculations(data);
    // Final page
    this.finalPage(data);

    // Last footer
    this.footer();

    // PDF page labels for Adobe Reader
    const pdfInternal = this.doc.internal as Record<string, unknown>;
    const events = pdfInternal.events as { subscribe: (event: string, cb: () => void) => void };
    events.subscribe('putCatalog', function (this: void) {
      const out = pdfInternal.out as (s: string) => void;
      out('/PageLabels << /Nums [0 << /S /D /St 1 >>] >>');
    });

    return this.doc;
  }
}

// ─── Export function ───
export async function downloadBirthChartPdf(data: PdfReportData): Promise<void> {
  const builder = new PdfReportBuilder();
  const doc = builder.generate(data);
  const safeName = data.userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  doc.save(`${safeName}_Birth_Chart.pdf`);
}
