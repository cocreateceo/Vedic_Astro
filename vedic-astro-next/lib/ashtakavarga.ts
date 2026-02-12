// AshtakaVarga calculation based on classical Parashari system
// Maps to ClickAstro Chapter 12: "AshtakaVarga Predictions"

import type { Planet } from '@/types';
import { signNames, hindiSignNames } from './vedic-constants';

export interface PlanetAshtakavarga {
  planet: string;
  bindhus: number[];       // 12 values, one per sign (0-8)
  total: number;           // sum of all bindhus (max 56 for 7 contributors, or 48 with standard)
  natalSignBindhus: number; // bindhus in the sign where this planet is placed
  prediction: string;
}

export interface SarvashtakavargaResult {
  totals: number[];         // 12 values, one per sign
  grandTotal: number;       // should be 337
  strongestSign: number;    // sign index with highest total
  weakestSign: number;      // sign index with lowest total
  prediction: string;
}

export interface AshtakavargaResult {
  planets: PlanetAshtakavarga[];
  sarvashtakavarga: SarvashtakavargaResult;
  table: number[][];        // [planet][sign] matrix for display
}

// Standard AshtakaVarga contribution tables
// For each planet, which houses (from each contributor) give a bindu
// Contributors: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Ascendant
// House numbers are 1-based (1 = same sign, 2 = next sign, etc.)

const CONTRIBUTIONS: Record<string, number[][]> = {
  Sun: [
    [1, 2, 4, 7, 8, 9, 10, 11],          // from Sun
    [3, 6, 10, 11],                        // from Moon
    [1, 2, 4, 7, 8, 9, 10, 11],          // from Mars
    [3, 5, 6, 9, 10, 11, 12],            // from Mercury
    [5, 6, 9, 11],                         // from Jupiter
    [6, 7, 12],                            // from Venus
    [1, 2, 4, 7, 8, 9, 10, 11],          // from Saturn
    [3, 4, 6, 10, 11, 12],               // from Ascendant
  ],
  Moon: [
    [3, 6, 7, 8, 10, 11],                // from Sun
    [1, 3, 6, 7, 10, 11],                // from Moon
    [2, 3, 5, 6, 9, 10, 11],             // from Mars
    [1, 3, 4, 5, 7, 8, 10, 11],          // from Mercury
    [1, 4, 7, 8, 10, 11, 12],            // from Jupiter
    [3, 4, 5, 7, 9, 10, 11],             // from Venus
    [3, 5, 6, 11],                         // from Saturn
    [3, 6, 10, 11],                        // from Ascendant
  ],
  Mars: [
    [3, 5, 6, 10, 11],                   // from Sun
    [3, 6, 11],                            // from Moon
    [1, 2, 4, 7, 8, 10, 11],             // from Mars
    [3, 5, 6, 11],                         // from Mercury
    [6, 10, 11, 12],                       // from Jupiter
    [6, 8, 11, 12],                        // from Venus
    [1, 4, 7, 8, 9, 10, 11],             // from Saturn
    [1, 3, 6, 10, 11],                    // from Ascendant
  ],
  Mercury: [
    [5, 6, 9, 11, 12],                   // from Sun
    [2, 4, 6, 8, 10, 11],                // from Moon
    [1, 2, 4, 7, 8, 9, 10, 11],          // from Mars
    [1, 3, 5, 6, 9, 10, 11, 12],         // from Mercury
    [6, 8, 11, 12],                        // from Jupiter
    [1, 2, 3, 4, 5, 8, 9, 11],           // from Venus
    [1, 2, 4, 7, 8, 9, 10, 11],          // from Saturn
    [1, 2, 4, 6, 8, 10, 11],             // from Ascendant
  ],
  Jupiter: [
    [1, 2, 3, 4, 7, 8, 9, 10, 11],      // from Sun
    [2, 5, 7, 9, 11],                     // from Moon
    [1, 2, 4, 7, 8, 10, 11],             // from Mars
    [1, 2, 4, 5, 6, 9, 10, 11],          // from Mercury
    [1, 2, 3, 4, 7, 8, 10, 11],          // from Jupiter
    [2, 5, 6, 9, 10, 11],                // from Venus
    [3, 5, 6, 12],                         // from Saturn
    [1, 2, 4, 5, 6, 7, 9, 10, 11],       // from Ascendant
  ],
  Venus: [
    [8, 11, 12],                           // from Sun
    [1, 2, 3, 4, 5, 8, 9, 11, 12],       // from Moon
    [3, 5, 6, 9, 11, 12],                // from Mars
    [3, 5, 6, 9, 11],                     // from Mercury
    [5, 8, 9, 10, 11],                    // from Jupiter
    [1, 2, 3, 4, 5, 8, 9, 10, 11],       // from Venus
    [3, 4, 5, 8, 9, 10, 11],             // from Saturn
    [1, 2, 3, 4, 5, 8, 9, 11],           // from Ascendant
  ],
  Saturn: [
    [1, 2, 4, 7, 8, 10, 11],             // from Sun
    [3, 6, 11],                            // from Moon
    [3, 5, 6, 10, 11, 12],               // from Mars
    [6, 8, 9, 10, 11, 12],               // from Mercury
    [5, 6, 11, 12],                        // from Jupiter
    [6, 11, 12],                           // from Venus
    [3, 5, 6, 11],                         // from Saturn
    [1, 3, 4, 6, 10, 11],                // from Ascendant
  ],
};

const CONTRIBUTOR_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

// Prediction text based on bindhus count in natal sign
const PREDICTIONS: Record<string, Record<number, string>> = {
  Sun: {
    0: 'The Sun in this position suggests significant challenges in health, authority, and self-esteem. Remedial measures for the Sun are strongly recommended.',
    1: 'Limited solar strength indicates struggles with confidence and recognition. Government-related matters may face delays. Practice Sun worship.',
    2: 'Below average solar strength suggests moderate challenges with authority figures and father. Health needs attention, particularly eyes and heart.',
    3: 'Average solar influence. You may face occasional difficulties with authority and recognition, but can overcome them with determination and effort.',
    4: 'Moderately favorable Sun position. Good potential for government connections, career growth, and self-expression. Health remains stable.',
    5: 'Strong solar presence grants good health, authority, and recognition. Father figure provides support. Government dealings are favorable.',
    6: 'Very favorable solar strength. Excellent for leadership, government positions, and recognition. Strong vitality and confidence throughout life.',
    7: 'Exceptionally strong Sun grants commanding presence, high positions, and excellent health. Father\'s influence is strongly positive.',
    8: 'Maximum solar strength indicates extraordinary authority, fame, and vitality. You will achieve high positions and great recognition.',
  },
  Moon: {
    0: 'Very weak lunar position indicates significant emotional challenges, mental disturbances, and potential issues with mother. Seek emotional support.',
    1: 'Limited emotional stability and potential health issues for mother. Mental peace requires conscious effort. Practice meditation.',
    2: 'Below average emotional strength. Occasional mood swings and maternal concerns. Water-related activities bring solace.',
    3: 'Average lunar influence brings moderate emotional stability. Misfortune and ill health may appear occasionally but you can weather all storms.',
    4: 'Good emotional balance and supportive maternal relationships. Creative abilities are moderately strong. Mental health is generally stable.',
    5: 'Strong lunar influence grants emotional intelligence, good maternal bonds, and creative success. Public favor is likely.',
    6: 'Very favorable Moon position brings peace of mind, prosperity, and strong intuition. Mother and female relatives are supportive.',
    7: 'Exceptional emotional strength and intuitive abilities. Great public popularity and maternal blessings. Creative ventures flourish.',
    8: 'Maximum lunar strength indicates extraordinary emotional wisdom, wealth through public dealings, and deeply nurturing relationships.',
  },
  Mars: {
    0: 'Very weak Mars indicates susceptibility to accidents, property losses, and conflicts with siblings. Extreme caution needed.',
    1: 'Limited courage and energy. Property matters face challenges. Relationship with siblings may be strained.',
    2: 'Below average martial energy. Some challenges in property and courage. Blood-related health issues need monitoring.',
    3: 'Average Mars influence indicates a tendency to remain away from loved ones. Separation from family may occur due to career.',
    4: 'Moderate courage and property potential. Good energy for physical activities. Sibling relationships are manageable.',
    5: 'Strong Mars grants courage, property acquisition, and good health. Siblings are supportive. Physical vitality is excellent.',
    6: 'Very favorable martial strength brings property wealth, leadership in action, and excellent physical health.',
    7: 'Exceptional courage and property fortune. Strong sibling bonds and excellent vitality. Success in competitive fields.',
    8: 'Maximum Mars strength indicates extraordinary courage, abundant property, and unshakeable physical health.',
  },
  Mercury: {
    0: 'Very weak Mercury indicates severe communication challenges, business losses, and educational setbacks. Practice mindfulness.',
    1: 'Limited intellectual capacity and potential speech issues. Business ventures face significant obstacles.',
    2: 'Below average mental agility. Educational pursuits face challenges. Be careful in business transactions.',
    3: 'Average Mercury influence. Communication abilities are functional but need refinement. Business requires careful planning.',
    4: 'Moderate intellectual strength may bring some career challenges. Work on consolidating existing positions and making the most of available opportunities.',
    5: 'Good intellectual and communication abilities. Business ventures show promise. Educational success is likely.',
    6: 'Strong Mercury grants excellent communication, business acumen, and educational success. Writing and speaking abilities shine.',
    7: 'Exceptional intellectual brilliance. Outstanding success in business, education, and communication. Remarkable analytical abilities.',
    8: 'Maximum Mercury strength indicates genius-level intellect, extraordinary business success, and mastery of communication.',
  },
  Jupiter: {
    0: 'Very weak Jupiter indicates loss of fortune, spiritual confusion, and challenges with children. Seek divine guidance.',
    1: 'Limited fortune and wisdom. Financial growth faces obstacles. Children may face difficulties.',
    2: 'Below average Jupiter strength. Moderate financial challenges and spiritual uncertainty. Practice gratitude.',
    3: 'Average Jupiter influence. Fortune and wisdom grow gradually through effort and devotion.',
    4: 'Moderate good fortune and wisdom. Children bring some joy. Spiritual growth is steady.',
    5: 'Strong Jupiter grants good fortune, wisdom, and favorable outcomes. Children prosper. Spiritual awareness deepens.',
    6: 'Very favorable Jupiter brings prosperity, excellent judgment, and spiritual growth. Blessed through teachers and mentors.',
    7: 'Happiness and wealth come together in uncommon blessing. Great fortunes shine through exceptional Jupiter placement.',
    8: 'Maximum Jupiter strength indicates extraordinary wisdom, abundant wealth, and divine grace in all endeavors.',
  },
  Venus: {
    0: 'Very weak Venus indicates marital challenges, loss of comfort, and artistic blocks. Relationship remedies needed urgently.',
    1: 'Limited luxury and relationship difficulties. Creative abilities face blocks. Practice Venus-related remedies.',
    2: 'Below average Venus strength. Moderate relationship challenges and financial constraints regarding comfort.',
    3: 'Average Venus influence. Relationships require work but can be fulfilling. Moderate comfort and artistic expression.',
    4: 'Good Venus strength brings pleasant relationships and comfortable living. Creative abilities show promise.',
    5: 'Strong Venus grants love, luxury, and artistic success. Marriage is harmonious. Financial comfort is assured.',
    6: 'Very favorable Venus brings excellent marital happiness, abundance, and creative mastery.',
    7: 'Exceptional Venus strength grants extraordinary beauty, love, and luxury. Artistic brilliance is remarkable.',
    8: 'An amazing life of abundance awaits. You will acquire land, wealth, vehicles, a beautiful spouse, wonderful children, and great happiness.',
  },
  Saturn: {
    0: 'Very weak Saturn indicates severe hardships, chronic health issues, and karmic debts. Patience and remedies are essential.',
    1: 'Limited discipline and potential chronic issues. Career faces significant delays. Practice Saturn remedies.',
    2: 'Below average Saturn strength. Some career delays and health concerns. Maintain discipline and perseverance.',
    3: 'Relationship problems will be a challenge. Family disharmony, domestic discord, and financial difficulties may occur. Prudent saving habits could reduce your burden.',
    4: 'Moderate Saturn influence. Career grows slowly but steadily. Health needs regular attention.',
    5: 'Good Saturn strength brings disciplined success, longevity, and karmic rewards. Service to others prospers.',
    6: 'Strong Saturn grants excellent longevity, career success through hard work, and organizational abilities.',
    7: 'Exceptional Saturn blessing brings mastery through discipline, high achievements in later life, and karmic fulfillment.',
    8: 'Maximum Saturn strength indicates extraordinary longevity, exceptional career achievements, and complete karmic resolution.',
  },
};

/**
 * Calculate AshtakaVarga for all 7 planets + Sarvashtakavarga
 */
export function calculateAshtakavarga(
  positions: Record<string, Planet>,
  ascSignIndex: number,
): AshtakavargaResult {
  // Get sign indices for all contributors
  const signOf: Record<string, number> = {};
  for (const p of CONTRIBUTOR_ORDER) {
    signOf[p] = positions[p]?.signIndex ?? 0;
  }
  signOf['Ascendant'] = ascSignIndex;

  const table: number[][] = []; // [planetIdx][signIdx]
  const planetResults: PlanetAshtakavarga[] = [];

  for (const planet of CONTRIBUTOR_ORDER) {
    const bindhus = new Array(12).fill(0);
    const contributionTable = CONTRIBUTIONS[planet];
    if (!contributionTable) continue;

    // For each contributor (7 planets + ascendant)
    const contributors = [...CONTRIBUTOR_ORDER, 'Ascendant'];
    for (let c = 0; c < 8; c++) {
      const contributorSign = signOf[contributors[c]] ?? 0;
      const houses = contributionTable[c];
      for (const house of houses) {
        const targetSign = (contributorSign + house - 1) % 12;
        bindhus[targetSign]++;
      }
    }

    const total = bindhus.reduce((a, b) => a + b, 0);
    const natalSign = signOf[planet];
    const natalBindhus = bindhus[natalSign];

    // Clamp bindhus to 0-8 range (shouldn't exceed, but safety)
    const clampedBindhus = bindhus.map(b => Math.min(8, Math.max(0, b)));

    const prediction = PREDICTIONS[planet]?.[natalBindhus] ??
      `${planet} has ${natalBindhus} bindhus in its natal sign, indicating ${natalBindhus >= 4 ? 'favorable' : 'challenging'} results.`;

    table.push(clampedBindhus);
    planetResults.push({
      planet,
      bindhus: clampedBindhus,
      total,
      natalSignBindhus: natalBindhus,
      prediction,
    });
  }

  // Sarvashtakavarga: sum all planet bindhus per sign
  const sarvaTotals = new Array(12).fill(0);
  for (const row of table) {
    for (let s = 0; s < 12; s++) {
      sarvaTotals[s] += row[s];
    }
  }
  const grandTotal = sarvaTotals.reduce((a, b) => a + b, 0);

  let maxSign = 0, minSign = 0;
  for (let s = 1; s < 12; s++) {
    if (sarvaTotals[s] > sarvaTotals[maxSign]) maxSign = s;
    if (sarvaTotals[s] < sarvaTotals[minSign]) minSign = s;
  }

  // Generate sarvashtakavarga prediction
  const strongRange = signNames[maxSign];
  const sarvaPrediction = `The highest concentration of bindhus appears in ${strongRange} (${hindiSignNames[maxSign]}), indicating that transits through this sign bring the most auspicious results. ` +
    `At ages corresponding to the figures in signs occupied by Jupiter, Venus, and Mercury, your fortune turns for the better. ` +
    `Educational ambitions materialize, and the path to wealth, recognition, and professional accomplishment opens up.`;

  return {
    planets: planetResults,
    sarvashtakavarga: {
      totals: sarvaTotals,
      grandTotal,
      strongestSign: maxSign,
      weakestSign: minSign,
      prediction: sarvaPrediction,
    },
    table,
  };
}
