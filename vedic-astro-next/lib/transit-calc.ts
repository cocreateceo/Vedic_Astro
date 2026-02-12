/**
 * Transit Predictions Calculator
 * Based on Gochara (Transit) principles from BPHS
 *
 * Analyzes current planetary transits and their effects on the natal chart.
 */

import { TransitPrediction, SadeSatiResult } from '@/types';
import { signNames } from '@/lib/vedic-constants';

// Approximate transit sign for slow-moving planets based on date ranges
// These are simplified approximations for demonstration purposes

function getJupiterTransitSign(date: Date): number {
  // Jupiter spends ~1 year in each sign
  // Approximate: Jupiter was in Aries (0) around April 2023
  const refDate = new Date('2023-04-22');
  const daysSinceRef = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  const signsAdvanced = Math.floor(daysSinceRef / 365);
  return (0 + signsAdvanced) % 12;
}

function getSaturnTransitSign(date: Date): number {
  // Saturn spends ~2.5 years in each sign
  // Approximate: Saturn entered Aquarius (10) in Jan 2023, Pisces (11) ~March 2025
  const refDate = new Date('2025-03-29');
  const daysSinceRef = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  const signsAdvanced = Math.floor(daysSinceRef / 912); // ~2.5 years
  return (11 + signsAdvanced) % 12;
}

function getRahuTransitSign(date: Date): number {
  // Rahu spends ~18 months in each sign, moves in REVERSE
  // Approximate: Rahu entered Pisces (11) around Oct 2023
  const refDate = new Date('2023-10-30');
  const daysSinceRef = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  const signsRetro = Math.floor(daysSinceRef / 548); // ~18 months
  return (11 - signsRetro + 120) % 12; // Reverse direction
}

function getSunTransitSign(date: Date): number {
  // Sun spends ~1 month in each sign
  // Approximate based on Vedic (sidereal) Sun positions
  const month = date.getMonth();
  const day = date.getDate();
  // Vedic Sun ingress dates (approximate):
  // Aries: Apr 14, Taurus: May 15, Gemini: Jun 15, Cancer: Jul 16
  // Leo: Aug 17, Virgo: Sep 17, Libra: Oct 17, Scorpio: Nov 16
  // Sagittarius: Dec 16, Capricorn: Jan 14, Aquarius: Feb 13, Pisces: Mar 15
  const ingress = [
    { m: 3, d: 14, sign: 0 }, { m: 4, d: 15, sign: 1 }, { m: 5, d: 15, sign: 2 },
    { m: 6, d: 16, sign: 3 }, { m: 7, d: 17, sign: 4 }, { m: 8, d: 17, sign: 5 },
    { m: 9, d: 17, sign: 6 }, { m: 10, d: 16, sign: 7 }, { m: 11, d: 16, sign: 8 },
    { m: 0, d: 14, sign: 9 }, { m: 1, d: 13, sign: 10 }, { m: 2, d: 15, sign: 11 },
  ];
  let currentSign = 11; // Default Pisces
  for (const entry of ingress) {
    if (month > entry.m || (month === entry.m && day >= entry.d)) {
      currentSign = entry.sign;
    }
  }
  return currentSign;
}

// Gochara effects: transit planet through houses from Moon
const jupiterTransitEffects: Record<number, { positive: boolean; effects: string }> = {
  1: { positive: false, effects: 'Jupiter transiting 1st from Moon: May bring health concerns, increased expenses, and need for caution. Focus on self-improvement.' },
  2: { positive: true, effects: 'Jupiter transiting 2nd from Moon: Excellent for financial gains, family harmony, and improved speech. Wealth accumulation period.' },
  3: { positive: false, effects: 'Jupiter transiting 3rd from Moon: Mixed results. May face challenges with siblings. Good for spiritual growth.' },
  4: { positive: false, effects: 'Jupiter transiting 4th from Moon: Domestic changes possible. May feel restless. Focus on inner peace and home matters.' },
  5: { positive: true, effects: 'Jupiter transiting 5th from Moon: Auspicious for education, children, romance, and creative pursuits. Good period for investments.' },
  6: { positive: false, effects: 'Jupiter transiting 6th from Moon: Challenges from opponents. Health needs attention. Debts may increase.' },
  7: { positive: true, effects: 'Jupiter transiting 7th from Moon: Favorable for marriage, partnerships, and travel. Social life improves. Recognition increases.' },
  8: { positive: false, effects: 'Jupiter transiting 8th from Moon: Caution advised. Unexpected changes. Good for research and occult studies.' },
  9: { positive: true, effects: 'Jupiter transiting 9th from Moon: Highly auspicious! Luck, fortune, spiritual growth, and long-distance travel favored.' },
  10: { positive: false, effects: 'Jupiter transiting 10th from Moon: Career challenges but eventual gains. Hard work needed for professional growth.' },
  11: { positive: true, effects: 'Jupiter transiting 11th from Moon: Excellent for gains, income, and fulfillment of desires. Social circle expands. Very prosperous period.' },
  12: { positive: false, effects: 'Jupiter transiting 12th from Moon: Increased expenses and travel. Spiritual inclination grows. Good for foreign connections.' },
};

const saturnTransitEffects: Record<number, { positive: boolean; effects: string }> = {
  1: { positive: false, effects: 'Saturn transiting 1st from Moon: Health and confidence may be affected. Hard work needed. Building inner strength.' },
  2: { positive: false, effects: 'Saturn transiting 2nd from Moon: Financial caution needed. Family matters require patience. Speech should be measured.' },
  3: { positive: true, effects: 'Saturn transiting 3rd from Moon: Favorable! Courage increases, efforts succeed, and short travels bring gains. Good for communication.' },
  4: { positive: false, effects: 'Saturn transiting 4th from Moon: Domestic unrest possible. Property matters need care. Mother\'s health may need attention.' },
  5: { positive: false, effects: 'Saturn transiting 5th from Moon: Challenges in education, romance, and with children. Avoid speculative investments.' },
  6: { positive: true, effects: 'Saturn transiting 6th from Moon: Very favorable! Victory over enemies, debts cleared, health improves. Strong position in conflicts.' },
  7: { positive: false, effects: 'Saturn transiting 7th from Moon: Relationship challenges. Business partnerships need care. Travel may be frequent but stressful.' },
  8: { positive: false, effects: 'Saturn transiting 8th from Moon: Most challenging transit. Health, longevity concerns. Unexpected obstacles. Spiritual transformation.' },
  9: { positive: false, effects: 'Saturn transiting 9th from Moon: Fortune may seem delayed. Father\'s health needs attention. Spiritual tests and growth.' },
  10: { positive: false, effects: 'Saturn transiting 10th from Moon: Career changes. Authority figures may be difficult. Hard work eventually rewarded.' },
  11: { positive: true, effects: 'Saturn transiting 11th from Moon: Very favorable! Financial gains, income increases, desires fulfilled. Good for long-term investments.' },
  12: { positive: false, effects: 'Saturn transiting 12th from Moon: Increased expenses, isolation feeling. Good for spiritual retreats and foreign travel.' },
};

// ---------- Sade Sati Detection ----------

export function detectSadeSati(moonSignIndex: number, date: Date = new Date()): SadeSatiResult {
  const saturnSign = getSaturnTransitSign(date);

  // Sade Sati: Saturn transiting 12th, 1st, or 2nd from Moon sign
  const twelfthFromMoon = (moonSignIndex - 1 + 12) % 12;
  const firstFromMoon = moonSignIndex;
  const secondFromMoon = (moonSignIndex + 1) % 12;

  if (saturnSign === twelfthFromMoon) {
    return {
      active: true,
      phase: 'rising',
      description: `Sade Sati - Rising Phase: Saturn is transiting ${signNames[saturnSign]}, the 12th sign from your Moon sign. This is the beginning phase where expenses, sleep issues, and mental stress may increase. Financial caution is advised.`,
      remedies: [
        'Recite Shani Beej Mantra 108 times daily',
        'Worship Lord Hanuman on Saturdays',
        'Donate black sesame seeds, mustard oil, and dark blue cloth on Saturdays',
        'Light a sesame oil lamp under a Peepal tree on Saturdays',
        'Wear an iron ring on the middle finger',
      ],
    };
  }

  if (saturnSign === firstFromMoon) {
    return {
      active: true,
      phase: 'peak',
      description: `Sade Sati - Peak Phase: Saturn is transiting ${signNames[saturnSign]}, your Moon sign. This is the most intense phase. Health, relationships, and career may face significant challenges. Patience and discipline are essential.`,
      remedies: [
        'Recite Shani Beej Mantra 108 times daily',
        'Perform Shani Shanti Puja',
        'Worship Lord Hanuman and recite Hanuman Chalisa daily',
        'Donate black blankets, iron items, and food to the needy on Saturdays',
        'Serve elderly people and those less fortunate',
        'Consider wearing Blue Sapphire after proper trial (consult an astrologer)',
      ],
    };
  }

  if (saturnSign === secondFromMoon) {
    return {
      active: true,
      phase: 'setting',
      description: `Sade Sati - Setting Phase: Saturn is transiting ${signNames[saturnSign]}, the 2nd sign from your Moon sign. This is the final phase where financial matters and family relationships need attention. The challenges begin to ease.`,
      remedies: [
        'Continue reciting Shani Beej Mantra',
        'Worship Lord Hanuman on Saturdays',
        'Donate food and clothes to the needy',
        'Visit Shani temple on Saturdays',
        'Practice patience — relief is coming',
      ],
    };
  }

  return {
    active: false,
    phase: 'none',
    description: 'Sade Sati is not currently active for you. This is a favorable period free from Saturn\'s most intense influence on your Moon sign.',
    remedies: [],
  };
}

// ---------- Main Transit Analysis ----------

export function analyzeTransits(moonSignIndex: number, date: Date = new Date()): TransitPrediction[] {
  const transits: TransitPrediction[] = [];

  // Jupiter transit
  const jupiterSign = getJupiterTransitSign(date);
  const jupiterHouse = ((jupiterSign - moonSignIndex + 12) % 12) + 1;
  const jupiterEffect = jupiterTransitEffects[jupiterHouse];
  transits.push({
    planet: 'Jupiter',
    transitSign: signNames[jupiterSign],
    transitSignIndex: jupiterSign,
    houseFromMoon: jupiterHouse,
    effects: jupiterEffect?.effects || 'Jupiter transit effects being calculated.',
    isPositive: jupiterEffect?.positive ?? false,
  });

  // Saturn transit
  const saturnSign = getSaturnTransitSign(date);
  const saturnHouse = ((saturnSign - moonSignIndex + 12) % 12) + 1;
  const saturnEffect = saturnTransitEffects[saturnHouse];
  transits.push({
    planet: 'Saturn',
    transitSign: signNames[saturnSign],
    transitSignIndex: saturnSign,
    houseFromMoon: saturnHouse,
    effects: saturnEffect?.effects || 'Saturn transit effects being calculated.',
    isPositive: saturnEffect?.positive ?? false,
  });

  // Rahu transit
  const rahuSign = getRahuTransitSign(date);
  const rahuHouse = ((rahuSign - moonSignIndex + 12) % 12) + 1;
  const rahuPositive = [3, 6, 10, 11].includes(rahuHouse);
  transits.push({
    planet: 'Rahu',
    transitSign: signNames[rahuSign],
    transitSignIndex: rahuSign,
    houseFromMoon: rahuHouse,
    effects: rahuPositive
      ? `Rahu transiting ${rahuHouse}${getOrdinal(rahuHouse)} from Moon: This placement can bring unexpected gains, foreign opportunities, and unconventional success.`
      : `Rahu transiting ${rahuHouse}${getOrdinal(rahuHouse)} from Moon: Caution with illusions, deception, and sudden changes. Avoid shortcuts and maintain ethics.`,
    isPositive: rahuPositive,
  });

  // Ketu transit (always 7 signs from Rahu)
  const ketuSign = (rahuSign + 6) % 12;
  const ketuHouse = ((ketuSign - moonSignIndex + 12) % 12) + 1;
  const ketuPositive = [3, 6, 9, 12].includes(ketuHouse);
  transits.push({
    planet: 'Ketu',
    transitSign: signNames[ketuSign],
    transitSignIndex: ketuSign,
    houseFromMoon: ketuHouse,
    effects: ketuPositive
      ? `Ketu transiting ${ketuHouse}${getOrdinal(ketuHouse)} from Moon: Favorable for spiritual growth, research, and detachment from material concerns. Inner wisdom deepens.`
      : `Ketu transiting ${ketuHouse}${getOrdinal(ketuHouse)} from Moon: May cause confusion, detachment issues, and unexpected separations. Focus on spiritual practice.`,
    isPositive: ketuPositive,
  });

  // Sun transit
  const sunSign = getSunTransitSign(date);
  const sunHouse = ((sunSign - moonSignIndex + 12) % 12) + 1;
  const sunPositive = [3, 6, 10, 11].includes(sunHouse);
  transits.push({
    planet: 'Sun',
    transitSign: signNames[sunSign],
    transitSignIndex: sunSign,
    houseFromMoon: sunHouse,
    effects: sunPositive
      ? `Sun transiting ${sunHouse}${getOrdinal(sunHouse)} from Moon: Authority, recognition, and vitality are enhanced. Good for government matters and leadership roles.`
      : `Sun transiting ${sunHouse}${getOrdinal(sunHouse)} from Moon: Ego conflicts possible. Health needs attention. Be mindful of authority figures.`,
    isPositive: sunPositive,
  });

  return transits;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
