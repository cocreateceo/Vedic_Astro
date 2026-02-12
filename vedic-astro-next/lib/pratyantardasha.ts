// Pratyantardasha (Paryanthar Dasa) — 3rd level sub-period calculations and predictions
// Maps to ClickAstro Chapter 7: "34 years detailed predictions"

import { dashaOrder, dashaDurations, DASHA_CYCLE_YEARS } from './vedic-constants';

export interface PratyantardashaEntry {
  mahadasha: string;
  antardasha: string;
  pratyantardasha: string;
  startDate: string;
  endDate: string;
  startAge: string;
  endAge: string;
  duration: string;
  prediction: string;
  isCurrent: boolean;
}

export interface PratyantardashaResult {
  periods: PratyantardashaEntry[];
  analysisYears: string;
  totalPeriods: number;
}

// Planet natures for prediction generation
const PLANET_NATURE: Record<string, {
  nature: 'benefic' | 'malefic' | 'neutral';
  keywords: string[];
  positive: string[];
  negative: string[];
}> = {
  Sun: {
    nature: 'benefic',
    keywords: ['authority', 'government', 'father', 'health', 'vitality'],
    positive: [
      'Your confidence and authority will be at a peak. Government matters proceed favorably.',
      'A time of recognition and respect from others. Your leadership abilities shine brightly.',
      'Father figures or mentors provide guidance. Health and vitality improve significantly.',
    ],
    negative: [
      'Ego conflicts with authority figures may arise. Take care of eye and heart health.',
      'Government-related matters may face delays. Relationship with father needs attention.',
      'Over-confidence could lead to wrong decisions. Practice humility and seek wise counsel.',
    ],
  },
  Moon: {
    nature: 'benefic',
    keywords: ['emotions', 'mother', 'mind', 'public', 'water'],
    positive: [
      'Mental peace and emotional stability prevail. Mother provides comfort and support.',
      'Public dealings bring favorable results. Creative abilities are enhanced during this time.',
      'Emotional connections deepen. Travel over water or to beautiful places is indicated.',
    ],
    negative: [
      'Emotional turbulence and mental restlessness may disturb your peace. Practice meditation.',
      'Concerns about mother\'s health may arise. Be cautious with water-related activities.',
      'Sleep disturbances and anxiety may trouble you. Maintain a calm and peaceful routine.',
    ],
  },
  Mars: {
    nature: 'malefic',
    keywords: ['courage', 'property', 'siblings', 'energy', 'competition'],
    positive: [
      'Your courage and determination bring success in competitive endeavors.',
      'Property matters proceed favorably. Siblings provide support and cooperation.',
      'Physical energy is excellent. Take initiative in new ventures with confidence.',
    ],
    negative: [
      'Be careful of accidents, injuries, and conflicts. Avoid unnecessary arguments.',
      'Property disputes may arise. Relations with siblings need careful handling.',
      'Aggressive impulses need to be controlled. Legal matters require caution.',
    ],
  },
  Mercury: {
    nature: 'benefic',
    keywords: ['intellect', 'communication', 'business', 'education', 'writing'],
    positive: [
      'Intellectual abilities are sharp. Business dealings and communication are highly favorable.',
      'Educational pursuits succeed. Writing and analytical work produce excellent results.',
      'Trade and commerce flourish. New skills and knowledge are easily acquired.',
    ],
    negative: [
      'Communication failures and misunderstandings may create problems in business.',
      'Nervousness and overthinking may affect decision-making. Skin health needs attention.',
      'Be cautious in signing contracts. Verify facts before making important commitments.',
    ],
  },
  Jupiter: {
    nature: 'benefic',
    keywords: ['wisdom', 'fortune', 'children', 'spirituality', 'teaching'],
    positive: [
      'Fortune smiles upon you. Wisdom and good judgment guide your decisions successfully.',
      'Children bring joy and pride. Spiritual growth and philosophical understanding deepen.',
      'Financial gains through righteous means. Teachers and mentors appear when needed.',
    ],
    negative: [
      'Over-expansion and poor judgment in financial matters need attention.',
      'Children may face challenges that cause concern. Spiritual confusion may arise.',
      'Liver and weight-related health issues need monitoring. Avoid excessive indulgence.',
    ],
  },
  Venus: {
    nature: 'benefic',
    keywords: ['love', 'marriage', 'luxury', 'arts', 'beauty'],
    positive: [
      'Love and relationships flourish. Luxury and comfort increase in your life.',
      'Artistic and creative pursuits bring success and recognition. Beauty enhances.',
      'Marriage harmony prevails. Financial gains through arts, beauty, or luxury goods.',
    ],
    negative: [
      'Relationship challenges and marital discord may arise. Practice understanding.',
      'Over-indulgence in pleasures may cause problems. Maintain moderation.',
      'Financial losses through extravagance. Vehicle-related issues need caution.',
    ],
  },
  Saturn: {
    nature: 'malefic',
    keywords: ['discipline', 'hardship', 'longevity', 'service', 'karma'],
    positive: [
      'Disciplined efforts bear fruit. Long-term investments and patient work are rewarded.',
      'Service to others brings karmic rewards. Organizational abilities are at their best.',
      'Chronic issues find resolution. Elderly people provide wisdom and support.',
    ],
    negative: [
      'Obstacles, delays, and hardships test your patience. Chronic health issues may arise.',
      'Career setbacks and financial constraints challenge you. Practice perseverance.',
      'Feelings of isolation and depression need attention. Seek support from trusted friends.',
    ],
  },
  Rahu: {
    nature: 'malefic',
    keywords: ['illusion', 'foreign', 'obsession', 'technology', 'unconventional'],
    positive: [
      'Foreign connections bring opportunities. Technology and unconventional methods succeed.',
      'Sudden gains and unexpected windfalls are possible. Think outside the box.',
      'Research and investigation lead to breakthroughs. Innovation is highly favored.',
    ],
    negative: [
      'Deception and confusion may cloud your judgment. Verify everything carefully.',
      'Obsessive tendencies and addictive behavior need strict control.',
      'Sudden reversals and unexpected losses may occur. Stay grounded and practical.',
    ],
  },
  Ketu: {
    nature: 'malefic',
    keywords: ['spirituality', 'detachment', 'liberation', 'past karma', 'mysticism'],
    positive: [
      'Spiritual insight deepens. Past life wisdom becomes accessible for growth.',
      'Detachment from material concerns brings inner peace and clarity.',
      'Mystical experiences and intuitive abilities are heightened.',
    ],
    negative: [
      'Unexplained losses and mysterious circumstances may trouble you.',
      'Health issues that resist diagnosis may arise. Seek alternative healing.',
      'Sudden separations and endings disrupt your plans. Accept and adapt.',
    ],
  },
};

/**
 * Generate prediction text based on three-planet combination
 */
function generatePrediction(
  maha: string, antar: string, pratyantar: string,
  ascSignIndex: number,
): string {
  const m = PLANET_NATURE[maha];
  const a = PLANET_NATURE[antar];
  const p = PLANET_NATURE[pratyantar];
  if (!m || !a || !p) return 'A period of mixed influences requiring balanced approach.';

  // Compute overall positivity: benefic = +1, malefic = -1, neutral = 0
  const scores = { benefic: 1, malefic: -1, neutral: 0 };
  const total = scores[m.nature] + scores[a.nature] + scores[p.nature];

  // Pick a prediction pattern based on the combination score
  const seed = (maha.charCodeAt(0) * 7 + antar.charCodeAt(0) * 3 + pratyantar.charCodeAt(0)) % 3;

  let opening: string;
  let body: string;
  let closing: string;

  if (total >= 2) {
    // Very positive
    opening = 'This is an excellent period filled with opportunities and success.';
    body = `${p.positive[seed]} ` +
      `The combined influence of ${maha}, ${antar}, and ${pratyantar} creates a harmonious energy that supports growth in ${a.keywords[seed % a.keywords.length]} and ${p.keywords[(seed + 1) % p.keywords.length]}. `;
    closing = 'Embrace this favorable time with confidence and gratitude.';
  } else if (total >= 1) {
    // Positive
    opening = 'A generally favorable period with good potential for progress.';
    body = `${a.positive[seed]} ` +
      `While ${maha}\'s influence provides a stable foundation, the ${pratyantar} sub-period brings opportunities related to ${p.keywords[seed % p.keywords.length]}. `;
    closing = 'With careful planning, you can maximize the benefits of this period.';
  } else if (total === 0) {
    // Mixed
    opening = 'A period of mixed influences requiring a balanced and cautious approach.';
    body = `${m.positive[seed]} However, ${p.negative[(seed + 1) % 3]} ` +
      `The interplay between ${antar} and ${pratyantar} creates both opportunities in ${a.keywords[seed % a.keywords.length]} and challenges in ${p.keywords[(seed + 2) % p.keywords.length]}. `;
    closing = 'Navigate this period with awareness and adapt to changing circumstances.';
  } else if (total >= -1) {
    // Challenging
    opening = 'A challenging period that requires patience, determination, and remedial measures.';
    body = `${a.negative[seed]} ` +
      `The combined effect of ${maha} and ${pratyantar} may create difficulties related to ${m.keywords[(seed + 1) % m.keywords.length]} and ${p.keywords[seed % p.keywords.length]}. `;
    closing = 'Practice remedies and maintain faith — better times are ahead.';
  } else {
    // Very challenging
    opening = 'A difficult period requiring strong willpower, remedies, and spiritual support.';
    body = `${m.negative[seed]} ${p.negative[(seed + 1) % 3]} ` +
      `The triple influence of challenging planets brings tests in ${a.keywords[seed % a.keywords.length]}, ${m.keywords[(seed + 1) % m.keywords.length]}, and ${p.keywords[(seed + 2) % p.keywords.length]}. `;
    closing = 'Seek guidance from spiritual teachers and practice patience. This too shall pass.';
  }

  return `${opening} ${body}${closing}`;
}

function formatDate(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatAge(dob: Date, date: Date): string {
  let years = date.getFullYear() - dob.getFullYear();
  let months = date.getMonth() - dob.getMonth();
  if (months < 0) { years--; months += 12; }
  return `${years}y ${months}m`;
}

function formatDuration(days: number): string {
  if (days < 30) return `${Math.round(days)} days`;
  const months = Math.floor(days / 30.44);
  const remDays = Math.round(days - months * 30.44);
  if (months >= 12) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m > 0 ? `${y}y ${m}m` : `${y}y`;
  }
  return remDays > 0 ? `${months}m ${remDays}d` : `${months}m`;
}

/**
 * Calculate all Pratyantardasha periods for the analysis range.
 * Uses the Vimshottari system: each Antardasha is subdivided into 9 sub-sub-periods
 * proportional to the standard dasha durations.
 */
export function calculatePratyantardasha(
  dob: string,
  moonNakshatra: string,
  ascSignIndex: number,
  analysisStartAge: number = 0,
  analysisEndAge: number = 90,
): PratyantardashaResult {
  const dobDate = new Date(dob);
  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
  ];
  const nakIdx = nakshatras.indexOf(moonNakshatra);
  const dashaLordIndex = nakIdx % 9;
  const balanceYears = dashaDurations[dashaLordIndex] * 0.6;

  const now = new Date();
  const nowTime = now.getTime();
  const periods: PratyantardashaEntry[] = [];

  let mahaStart = dobDate.getTime();

  for (let mi = 0; mi < 9; mi++) {
    const mahaIdx = (dashaLordIndex + mi) % 9;
    const mahaP = dashaOrder[mahaIdx];
    const mahaDur = mi === 0 ? balanceYears : dashaDurations[mahaIdx];
    const mahaDurMs = mahaDur * 365.25 * 24 * 60 * 60 * 1000;
    const mahaEnd = mahaStart + mahaDurMs;

    // Antardasha within Mahadasha
    let antarStart = mahaStart;
    for (let ai = 0; ai < 9; ai++) {
      const antarIdx = (mahaIdx + ai) % 9;
      const antarP = dashaOrder[antarIdx];
      const antarDur = (mahaDur * dashaDurations[antarIdx]) / DASHA_CYCLE_YEARS;
      const antarDurMs = antarDur * 365.25 * 24 * 60 * 60 * 1000;
      const antarEnd = antarStart + antarDurMs;

      // Pratyantardasha within Antardasha
      let praStart = antarStart;
      for (let pi = 0; pi < 9; pi++) {
        const praIdx = (antarIdx + pi) % 9;
        const praP = dashaOrder[praIdx];
        const praDur = (antarDur * dashaDurations[praIdx]) / DASHA_CYCLE_YEARS;
        const praDurMs = praDur * 365.25 * 24 * 60 * 60 * 1000;
        const praEnd = praStart + praDurMs;

        const startDate = new Date(praStart);
        const endDate = new Date(praEnd);
        const startAgeDays = (praStart - dobDate.getTime()) / (24 * 60 * 60 * 1000);
        const endAgeDays = (praEnd - dobDate.getTime()) / (24 * 60 * 60 * 1000);
        const startAgeYears = startAgeDays / 365.25;
        const endAgeYears = endAgeDays / 365.25;

        // Only include if within analysis range
        if (endAgeYears >= analysisStartAge && startAgeYears <= analysisEndAge) {
          const durationDays = (praEnd - praStart) / (24 * 60 * 60 * 1000);
          const isCurrent = nowTime >= praStart && nowTime < praEnd;

          periods.push({
            mahadasha: mahaP,
            antardasha: antarP,
            pratyantardasha: praP,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            startAge: formatAge(dobDate, startDate),
            endAge: formatAge(dobDate, endDate),
            duration: formatDuration(durationDays),
            prediction: generatePrediction(mahaP, antarP, praP, ascSignIndex),
            isCurrent,
          });
        }

        praStart = praEnd;
      }
      antarStart = antarEnd;
    }
    mahaStart = mahaEnd;
  }

  return {
    periods,
    analysisYears: `${analysisStartAge} to ${analysisEndAge}`,
    totalPeriods: periods.length,
  };
}
