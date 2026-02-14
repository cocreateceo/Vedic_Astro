/**
 * Muhurta (Electional Astrology) Calculator
 * Based on B.V. Raman's "Muhurta — Electional Astrology" and BPHS
 *
 * Determines auspicious timing for life events based on:
 * - Nakshatra suitability per event type
 * - Tithi (lunar day) auspiciousness
 * - Weekday (Vara) recommendations
 * - Tarabala (star compatibility from birth star)
 * - Chandrabala (Moon strength from birth rashi)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MuhurtaEvent {
  id: string;
  name: string;
  sanskrit: string;
  category: 'marriage' | 'travel' | 'education' | 'business' | 'construction' | 'medical' | 'spiritual' | 'general';
  description: string;
}

export interface NakshatraSuitability {
  suitable: string[];
  moderately_suitable: string[];
  avoid: string[];
}

export interface PanchakaResult {
  remainder: number;
  name: string;
  isBad: boolean;
  description: string;
}

export interface MuhurtaAnalysis {
  event: MuhurtaEvent;
  nakshatraVerdict: 'excellent' | 'good' | 'neutral' | 'avoid';
  nakshatraNote: string;
  tithiVerdict: 'excellent' | 'good' | 'neutral' | 'avoid';
  tithiNote: string;
  varaVerdict: 'excellent' | 'good' | 'neutral' | 'avoid';
  varaNote: string;
  tarabalaVerdict: 'excellent' | 'good' | 'neutral' | 'caution';
  tarabalaNote: string;
  chandrabalaVerdict: 'excellent' | 'good' | 'neutral' | 'caution';
  chandrabalaNote: string;
  panchakaResult: PanchakaResult | null;
  paksha: 'shukla' | 'krishna';
  pakshaNote: string;
  overallScore: number; // 0-100
  overallVerdict: 'highly_auspicious' | 'auspicious' | 'moderate' | 'inauspicious';
  recommendations: string[];
  avoidReasons: string[];
}

// ---------------------------------------------------------------------------
// Event Definitions — 18 categories from B.V. Raman's Muhurta
// ---------------------------------------------------------------------------

export const muhurtaEvents: MuhurtaEvent[] = [
  { id: 'marriage', name: 'Marriage', sanskrit: 'Vivāha', category: 'marriage', description: 'Marriage ceremony, engagement, and wedding-related activities' },
  { id: 'travel', name: 'Travel / Journey', sanskrit: 'Yātrā', category: 'travel', description: 'Starting a journey, travel to distant places, migration' },
  { id: 'education', name: 'Education / Learning', sanskrit: 'Vidyārambha', category: 'education', description: 'Starting education, joining school/college, learning new subjects' },
  { id: 'business', name: 'Business Launch', sanskrit: 'Vyāpāra', category: 'business', description: 'Starting a new business, signing contracts, launching ventures' },
  { id: 'construction', name: 'House Construction', sanskrit: 'Gṛhārambha', category: 'construction', description: 'Laying foundation, starting construction, house warming (Griha Pravesh)' },
  { id: 'griha_pravesh', name: 'House Warming', sanskrit: 'Gṛha Praveśa', category: 'construction', description: 'Entering a new house for the first time, house warming ceremony' },
  { id: 'medical', name: 'Medical Treatment', sanskrit: 'Chikitsā', category: 'medical', description: 'Starting medical treatment, surgery, health procedures' },
  { id: 'spiritual', name: 'Spiritual Initiation', sanskrit: 'Dīkṣā', category: 'spiritual', description: 'Receiving spiritual initiation, starting mantra practice, Upanayana' },
  { id: 'naming', name: 'Naming Ceremony', sanskrit: 'Nāmakaraṇa', category: 'general', description: 'Naming a child, Namkaran Sanskar' },
  { id: 'annaprasana', name: 'First Feeding', sanskrit: 'Annaprāśana', category: 'general', description: 'First solid food for a child, Annaprasana ceremony' },
  { id: 'upanayana', name: 'Sacred Thread', sanskrit: 'Upanayana', category: 'spiritual', description: 'Sacred thread ceremony, Janeu, initiation into Vedic studies' },
  { id: 'vehicle', name: 'Vehicle Purchase', sanskrit: 'Vāhana Kraya', category: 'business', description: 'Buying a new vehicle — car, two-wheeler, etc.' },
  { id: 'agriculture', name: 'Agriculture / Sowing', sanskrit: 'Kṛṣi', category: 'general', description: 'Starting agricultural activities, sowing seeds, planting' },
  { id: 'debt_repay', name: 'Debt Repayment', sanskrit: 'Ṛṇa Mukti', category: 'business', description: 'Repaying debts, clearing loans, financial settlements' },
  { id: 'court', name: 'Legal Proceedings', sanskrit: 'Vivāda', category: 'general', description: 'Filing court cases, legal actions, starting litigation' },
  { id: 'jewelry', name: 'Wearing Jewelry', sanskrit: 'Ābharaṇa Dhāraṇa', category: 'general', description: 'First wearing of new jewelry, gemstones, or ornaments' },
  { id: 'mundan', name: 'First Haircut', sanskrit: 'Chūḍākaraṇa', category: 'general', description: 'First haircut of a child, Mundan ceremony' },
  { id: 'property', name: 'Property Purchase', sanskrit: 'Bhūmi Kraya', category: 'business', description: 'Buying land, property, or real estate' },
];

// ---------------------------------------------------------------------------
// Nakshatra Suitability per Event — B.V. Raman's Muhurta
// ---------------------------------------------------------------------------

const nakshatraSuitabilityMap: Record<string, NakshatraSuitability> = {
  marriage: {
    suitable: ['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Mula', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Uttara Bhadrapada', 'Revati'],
    moderately_suitable: ['Ashwini', 'Punarvasu', 'Pushya', 'Purva Phalguni', 'Chitra', 'Vishakha', 'Purva Ashadha'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Jyeshtha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
  travel: {
    suitable: ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Anuradha', 'Shravana', 'Dhanishta', 'Revati'],
    moderately_suitable: ['Rohini', 'Swati', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Chitra', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
  education: {
    suitable: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Revati'],
    moderately_suitable: ['Uttara Phalguni', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada'],
  },
  business: {
    suitable: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Revati'],
    moderately_suitable: ['Magha', 'Vishakha', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Purva Phalguni', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
  construction: {
    suitable: ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Uttara Bhadrapada', 'Revati'],
    moderately_suitable: ['Ashwini', 'Punarvasu', 'Pushya', 'Magha'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Purva Phalguni', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
  griha_pravesh: {
    suitable: ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Uttara Bhadrapada', 'Revati'],
    moderately_suitable: ['Ashwini', 'Punarvasu', 'Pushya'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
  medical: {
    suitable: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Revati'],
    moderately_suitable: ['Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
  spiritual: {
    suitable: ['Ashwini', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Uttara Bhadrapada', 'Revati'],
    moderately_suitable: ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Chitra', 'Uttara Ashadha', 'Dhanishta'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
  general: {
    suitable: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Uttara Bhadrapada', 'Revati'],
    moderately_suitable: ['Magha', 'Vishakha', 'Uttara Ashadha', 'Purva Phalguni'],
    avoid: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada', 'Shatabhisha'],
  },
};

// ---------------------------------------------------------------------------
// Tithi Suitability — B.V. Raman's Muhurta
// ---------------------------------------------------------------------------

// Tithis 1-30 (Shukla 1-15, Krishna 1-15)
// General classification: Nanda (1,6,11), Bhadra (2,7,12), Jaya (3,8,13), Rikta (4,9,14), Purna (5,10,15)
const tithiClassification: Record<string, string> = {
  'Pratipada': 'Nanda',
  'Dwitiya': 'Bhadra',
  'Tritiya': 'Jaya',
  'Chaturthi': 'Rikta',
  'Panchami': 'Purna',
  'Shashthi': 'Nanda',
  'Saptami': 'Bhadra',
  'Ashtami': 'Jaya',
  'Navami': 'Rikta',
  'Dashami': 'Purna',
  'Ekadashi': 'Nanda',
  'Dwadashi': 'Bhadra',
  'Trayodashi': 'Jaya',
  'Chaturdashi': 'Rikta',
  'Purnima': 'Purna',
  'Amavasya': 'Purna',
};

const tithiEventSuitability: Record<string, Record<string, 'excellent' | 'good' | 'neutral' | 'avoid'>> = {
  marriage: {
    Nanda: 'good', Bhadra: 'excellent', Jaya: 'excellent', Rikta: 'avoid', Purna: 'good',
  },
  travel: {
    Nanda: 'good', Bhadra: 'excellent', Jaya: 'good', Rikta: 'avoid', Purna: 'good',
  },
  education: {
    Nanda: 'good', Bhadra: 'excellent', Jaya: 'good', Rikta: 'neutral', Purna: 'excellent',
  },
  business: {
    Nanda: 'good', Bhadra: 'excellent', Jaya: 'good', Rikta: 'avoid', Purna: 'excellent',
  },
  construction: {
    Nanda: 'good', Bhadra: 'excellent', Jaya: 'good', Rikta: 'avoid', Purna: 'good',
  },
  medical: {
    Nanda: 'neutral', Bhadra: 'good', Jaya: 'neutral', Rikta: 'avoid', Purna: 'good',
  },
  spiritual: {
    Nanda: 'excellent', Bhadra: 'good', Jaya: 'good', Rikta: 'neutral', Purna: 'excellent',
  },
  general: {
    Nanda: 'good', Bhadra: 'excellent', Jaya: 'good', Rikta: 'avoid', Purna: 'good',
  },
};

// ---------------------------------------------------------------------------
// Vara (Weekday) Suitability — B.V. Raman's Muhurta
// ---------------------------------------------------------------------------

const varaSuitability: Record<string, Record<number, 'excellent' | 'good' | 'neutral' | 'avoid'>> = {
  // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  marriage: { 0: 'neutral', 1: 'excellent', 2: 'avoid', 3: 'excellent', 4: 'excellent', 5: 'excellent', 6: 'avoid' },
  travel: { 0: 'good', 1: 'good', 2: 'avoid', 3: 'excellent', 4: 'excellent', 5: 'excellent', 6: 'avoid' },
  education: { 0: 'good', 1: 'good', 2: 'neutral', 3: 'excellent', 4: 'excellent', 5: 'good', 6: 'neutral' },
  business: { 0: 'good', 1: 'good', 2: 'neutral', 3: 'excellent', 4: 'excellent', 5: 'excellent', 6: 'avoid' },
  construction: { 0: 'good', 1: 'good', 2: 'neutral', 3: 'good', 4: 'excellent', 5: 'excellent', 6: 'avoid' },
  medical: { 0: 'good', 1: 'excellent', 2: 'avoid', 3: 'good', 4: 'excellent', 5: 'good', 6: 'neutral' },
  spiritual: { 0: 'excellent', 1: 'excellent', 2: 'neutral', 3: 'good', 4: 'excellent', 5: 'good', 6: 'good' },
  general: { 0: 'good', 1: 'good', 2: 'neutral', 3: 'excellent', 4: 'excellent', 5: 'excellent', 6: 'neutral' },
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayRulers = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

// ---------------------------------------------------------------------------
// 27 Nakshatras in order (for Tarabala calculation)
// ---------------------------------------------------------------------------

const nakshatraOrder: string[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

// ---------------------------------------------------------------------------
// Tarabala (Star Compatibility) — from Birth Nakshatra
// ---------------------------------------------------------------------------

/**
 * Calculate Tarabala (stellar compatibility) for a given event date's nakshatra
 * relative to the native's birth nakshatra.
 *
 * Count from birth star to transit star, divide by 9.
 * Remainder: 1=Janma(avoid), 2=Sampat(good), 3=Vipat(avoid),
 * 4=Kshema(good), 5=Pratyari(avoid), 6=Sadhaka(good),
 * 7=Vadha(avoid), 8=Mitra(good), 9/0=Parama Mitra(excellent)
 */
function calculateTarabala(birthNakshatra: string, transitNakshatra: string): {
  tara: number;
  taraName: string;
  verdict: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
} {
  const birthIdx = nakshatraOrder.indexOf(birthNakshatra);
  const transitIdx = nakshatraOrder.indexOf(transitNakshatra);

  if (birthIdx === -1 || transitIdx === -1) {
    return { tara: 0, taraName: 'Unknown', verdict: 'neutral', description: 'Could not determine Tarabala.' };
  }

  const count = ((transitIdx - birthIdx + 27) % 27) + 1;
  const tara = count % 9 || 9;

  const taraData: Record<number, { name: string; verdict: 'excellent' | 'good' | 'neutral' | 'caution'; desc: string }> = {
    1: { name: 'Janma (Birth)', verdict: 'caution', desc: 'This is your birth star position. Activities started now may face personal health or identity challenges. Avoid unless other factors are very strong.' },
    2: { name: 'Sampat (Wealth)', verdict: 'good', desc: 'Favorable for financial and material ventures. Wealth, prosperity, and accumulation are supported.' },
    3: { name: 'Vipat (Danger)', verdict: 'caution', desc: 'This position indicates obstacles and difficulties. Postpone important activities if possible.' },
    4: { name: 'Kshema (Well-being)', verdict: 'good', desc: 'Excellent for health, comfort, and general well-being. Activities started now proceed smoothly.' },
    5: { name: 'Pratyari (Obstacle)', verdict: 'caution', desc: 'This position creates barriers and opposition. Avoid starting new ventures during this star.' },
    6: { name: 'Sadhaka (Achievement)', verdict: 'good', desc: 'Highly favorable for accomplishing goals. Success and fulfillment are indicated for activities begun now.' },
    7: { name: 'Vadha (Death-like)', verdict: 'caution', desc: 'The most inauspicious Tarabala position. Avoid important activities, especially travel and medical procedures.' },
    8: { name: 'Mitra (Friend)', verdict: 'good', desc: 'Friendly star position supporting partnerships, friendships, and cooperative ventures.' },
    9: { name: 'Parama Mitra (Best Friend)', verdict: 'excellent', desc: 'The most auspicious Tarabala position. All activities begun now receive stellar support and blessings.' },
  };

  const data = taraData[tara];
  return { tara, taraName: data.name, verdict: data.verdict, description: data.desc };
}

// ---------------------------------------------------------------------------
// Chandrabala (Moon Strength) — Moon's transit position from birth Rashi
// ---------------------------------------------------------------------------

/**
 * Calculate Chandrabala — Moon's transit house from birth Moon sign.
 * Good: 1, 3, 6, 7, 10, 11
 * Avoid: 2, 5, 8, 9, 12
 * Neutral: 4
 */
function calculateChandrabala(birthMoonSignIndex: number, transitMoonSignIndex: number): {
  house: number;
  verdict: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
} {
  const house = ((transitMoonSignIndex - birthMoonSignIndex + 12) % 12) + 1;

  const goodHouses = [1, 3, 6, 7, 10, 11];
  const badHouses = [2, 5, 8, 9, 12];

  if (goodHouses.includes(house)) {
    return {
      house,
      verdict: house === 1 || house === 11 ? 'excellent' : 'good',
      description: `Moon transits the ${house}${getOrdinal(house)} house from your birth Moon — this is favorable. Chandrabala supports the activity with emotional strength and mental clarity.`,
    };
  } else if (badHouses.includes(house)) {
    return {
      house,
      verdict: 'caution',
      description: `Moon transits the ${house}${getOrdinal(house)} house from your birth Moon — this is unfavorable for Chandrabala. Emotional challenges, mental unrest, or obstacles may arise. Consider postponing if possible.`,
    };
  }

  return {
    house,
    verdict: 'neutral',
    description: `Moon transits the ${house}${getOrdinal(house)} house from your birth Moon — neutral Chandrabala. Neither strongly favorable nor unfavorable.`,
  };
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ---------------------------------------------------------------------------
// Panchaka (Five-Source Energy) — B.V. Raman Ch. III
// ---------------------------------------------------------------------------

/**
 * Calculate Panchaka — critical for marriage, housewarming, upanayana.
 * Formula: (Tithi# + Vara# + Nakshatra#) mod 9
 * (Lagna# omitted as we don't have election-time lagna)
 *
 * Bad remainders: 1=Mrityu, 2=Agni, 4=Raja, 6=Chora, 8=Roga
 */
export function calculatePanchaka(
  tithiIndex: number,    // 0-29 (Shukla 0-14, Krishna 15-29)
  dayOfWeek: number,     // 0=Sun...6=Sat
  nakshatraName: string, // nakshatra name
): PanchakaResult {
  const nakshatraIdx = nakshatraOrder.indexOf(nakshatraName);
  // Tithi number 1-30, Vara 1-7, Nakshatra 1-27
  const tithiNum = tithiIndex + 1;
  const varaNum = dayOfWeek + 1;
  const nakNum = (nakshatraIdx >= 0 ? nakshatraIdx : 0) + 1;

  const sum = tithiNum + varaNum + nakNum;
  const remainder = sum % 9;

  const panchakaMap: Record<number, { name: string; isBad: boolean; desc: string }> = {
    0: { name: 'Safe', isBad: false, desc: 'No Panchaka dosha — this combination is safe for all activities.' },
    1: { name: 'Mrityu Panchaka', isBad: true, desc: 'Mrityu (Death) Panchaka — danger to life. Avoid marriage, upanayana, and all important ceremonies.' },
    2: { name: 'Agni Panchaka', isBad: true, desc: 'Agni (Fire) Panchaka — risk of fire and destruction. Avoid house construction, housewarming, and marriage.' },
    3: { name: 'Safe', isBad: false, desc: 'No Panchaka dosha — this combination is safe for all activities.' },
    4: { name: 'Raja Panchaka', isBad: true, desc: 'Raja Panchaka — obstacles from authority. Avoid starting business, government matters, and occupation changes.' },
    5: { name: 'Safe', isBad: false, desc: 'No Panchaka dosha — this combination is safe for all activities.' },
    6: { name: 'Chora Panchaka', isBad: true, desc: 'Chora (Thief) Panchaka — risk of theft and evil happenings. Avoid travel, marriage, and financial transactions.' },
    7: { name: 'Safe', isBad: false, desc: 'No Panchaka dosha — this combination is safe for all activities.' },
    8: { name: 'Roga Panchaka', isBad: true, desc: 'Roga (Disease) Panchaka — risk of illness. Avoid marriage, house building, and medical procedures.' },
  };

  const data = panchakaMap[remainder];
  return { remainder, name: data.name, isBad: data.isBad, description: data.desc };
}

// ---------------------------------------------------------------------------
// Paksha (Fortnight) Detection — B.V. Raman
// ---------------------------------------------------------------------------

/**
 * Detect Shukla (bright/waxing) vs Krishna (dark/waning) paksha from tithi index.
 * tithiIndex 0-14 = Shukla Paksha, 15-29 = Krishna Paksha
 */
function detectPaksha(tithiIndex: number): 'shukla' | 'krishna' {
  return tithiIndex < 15 ? 'shukla' : 'krishna';
}

/**
 * Events that strongly prefer Shukla (bright) paksha per B.V. Raman.
 * Marriage, construction, housewarming, education, business, spiritual initiation.
 */
const shuklaPreferredEvents = new Set([
  'marriage', 'construction', 'griha_pravesh', 'education', 'business',
  'spiritual', 'upanayana', 'naming', 'annaprasana', 'property', 'vehicle',
]);

/**
 * Events acceptable in Krishna paksha: mundan (health reasons), court cases, debt repayment.
 */
const krishnaAcceptableEvents = new Set([
  'mundan', 'court', 'debt_repay', 'medical',
]);

// ---------------------------------------------------------------------------
// Main Export: analyzeMuhurta
// ---------------------------------------------------------------------------

export function analyzeMuhurta(
  eventId: string,
  currentNakshatra: string,
  currentTithi: string,
  dayOfWeek: number,
  birthNakshatra: string,
  birthMoonSignIndex: number,
  transitMoonSignIndex: number,
  tithiIndex?: number, // 0-29, optional for backward compat
): MuhurtaAnalysis {
  const event = muhurtaEvents.find(e => e.id === eventId) || muhurtaEvents[muhurtaEvents.length - 1];
  const category = event.category;

  const avoidReasons: string[] = [];
  const recommendations: string[] = [];
  let totalScore = 50; // Start at neutral

  // 1. Nakshatra Suitability
  const nMap = nakshatraSuitabilityMap[category] || nakshatraSuitabilityMap.general;
  let nakshatraVerdict: 'excellent' | 'good' | 'neutral' | 'avoid' = 'neutral';
  let nakshatraNote = '';

  if (nMap.suitable.includes(currentNakshatra)) {
    nakshatraVerdict = 'excellent';
    nakshatraNote = `${currentNakshatra} is an excellent nakshatra for ${event.name.toLowerCase()}. Classical texts strongly recommend this star for this activity.`;
    totalScore += 20;
    recommendations.push(`${currentNakshatra} nakshatra is highly auspicious for ${event.name.toLowerCase()}`);
  } else if (nMap.moderately_suitable.includes(currentNakshatra)) {
    nakshatraVerdict = 'good';
    nakshatraNote = `${currentNakshatra} is moderately suitable for ${event.name.toLowerCase()}. Proceed with attention to other factors.`;
    totalScore += 10;
  } else if (nMap.avoid.includes(currentNakshatra)) {
    nakshatraVerdict = 'avoid';
    nakshatraNote = `${currentNakshatra} is not recommended for ${event.name.toLowerCase()} according to classical Muhurta rules. Consider postponing.`;
    totalScore -= 20;
    avoidReasons.push(`${currentNakshatra} nakshatra is inauspicious for ${event.name.toLowerCase()}`);
  } else {
    nakshatraNote = `${currentNakshatra} has neutral suitability for ${event.name.toLowerCase()}. Other factors should guide the decision.`;
  }

  // 2. Tithi Suitability
  const tithiClass = Object.entries(tithiClassification).find(([key]) =>
    currentTithi.toLowerCase().includes(key.toLowerCase())
  );
  const tithiGroup = tithiClass ? tithiClass[1] : 'Purna';
  const tithiMap = tithiEventSuitability[category] || tithiEventSuitability.general;
  const tithiVerdict = tithiMap[tithiGroup] || 'neutral';
  let tithiNote = '';

  switch (tithiVerdict) {
    case 'excellent':
      tithiNote = `The current tithi (${currentTithi}, ${tithiGroup} group) is highly auspicious for ${event.name.toLowerCase()}.`;
      totalScore += 15;
      recommendations.push(`${currentTithi} (${tithiGroup} tithi) is excellent for this activity`);
      break;
    case 'good':
      tithiNote = `The current tithi (${currentTithi}, ${tithiGroup} group) is favorable for ${event.name.toLowerCase()}.`;
      totalScore += 8;
      break;
    case 'avoid':
      tithiNote = `The current tithi (${currentTithi}, ${tithiGroup} group) is Rikta — a depleted tithi. Not recommended for ${event.name.toLowerCase()}.`;
      totalScore -= 15;
      avoidReasons.push(`Rikta tithi (${currentTithi}) is considered empty and unfavorable`);
      break;
    default:
      tithiNote = `The current tithi (${currentTithi}, ${tithiGroup} group) is neutral for ${event.name.toLowerCase()}.`;
  }

  // 3. Vara (Weekday) Suitability
  const varaMap = varaSuitability[category] || varaSuitability.general;
  const varaVerdict = varaMap[dayOfWeek] || 'neutral';
  const varaDay = dayNames[dayOfWeek];
  const varaRuler = dayRulers[dayOfWeek];
  let varaNote = '';

  switch (varaVerdict) {
    case 'excellent':
      varaNote = `${varaDay} (ruled by ${varaRuler}) is highly auspicious for ${event.name.toLowerCase()}.`;
      totalScore += 10;
      recommendations.push(`${varaDay} is an excellent day for ${event.name.toLowerCase()}`);
      break;
    case 'good':
      varaNote = `${varaDay} (ruled by ${varaRuler}) is favorable for ${event.name.toLowerCase()}.`;
      totalScore += 5;
      break;
    case 'avoid':
      varaNote = `${varaDay} (ruled by ${varaRuler}) is not recommended for ${event.name.toLowerCase()} according to Muhurta Shastra.`;
      totalScore -= 10;
      avoidReasons.push(`${varaDay} is generally avoided for ${event.name.toLowerCase()}`);
      break;
    default:
      varaNote = `${varaDay} (ruled by ${varaRuler}) has neutral influence on ${event.name.toLowerCase()}.`;
  }

  // 4. Tarabala
  const tarabala = calculateTarabala(birthNakshatra, currentNakshatra);
  const tarabalaVerdict = tarabala.verdict;
  const tarabalaNote = `Tarabala: ${tarabala.taraName} (Tara ${tarabala.tara}). ${tarabala.description}`;

  if (tarabalaVerdict === 'excellent') {
    totalScore += 15;
    recommendations.push(`Tarabala is Parama Mitra — your best possible stellar alignment`);
  } else if (tarabalaVerdict === 'good') {
    totalScore += 8;
  } else if (tarabalaVerdict === 'caution') {
    totalScore -= 12;
    avoidReasons.push(`Tarabala is ${tarabala.taraName} — unfavorable from your birth star`);
  }

  // 5. Chandrabala
  const chandrabala = calculateChandrabala(birthMoonSignIndex, transitMoonSignIndex);
  const chandrabalaVerdict = chandrabala.verdict;
  const chandrabalaNote = `Chandrabala: Moon in ${chandrabala.house}${getOrdinal(chandrabala.house)} from birth Moon. ${chandrabala.description}`;

  if (chandrabalaVerdict === 'excellent') {
    totalScore += 10;
    recommendations.push('Chandrabala is excellent — Moon\'s transit position supports this activity');
  } else if (chandrabalaVerdict === 'good') {
    totalScore += 5;
  } else if (chandrabalaVerdict === 'caution') {
    totalScore -= 10;
    avoidReasons.push('Chandrabala is weak — Moon\'s transit position does not support this activity');
  }

  // 6. Panchaka (if tithiIndex provided)
  let panchakaResult: PanchakaResult | null = null;
  if (tithiIndex !== undefined) {
    panchakaResult = calculatePanchaka(tithiIndex, dayOfWeek, currentNakshatra);
    if (panchakaResult.isBad) {
      // Panchaka is especially critical for marriage, construction, housewarming
      const criticalEvents = ['marriage', 'construction', 'griha_pravesh', 'upanayana'];
      const penalty = criticalEvents.includes(eventId) ? -15 : -8;
      totalScore += penalty;
      avoidReasons.push(`${panchakaResult.name} active — ${panchakaResult.description.split('.')[0]}`);
    } else {
      totalScore += 3;
    }
  }

  // 7. Paksha (Shukla/Krishna fortnight) awareness
  const resolvedTithiIndex = tithiIndex ?? 0;
  const paksha = detectPaksha(resolvedTithiIndex);
  let pakshaNote = '';

  if (paksha === 'krishna') {
    if (shuklaPreferredEvents.has(eventId)) {
      totalScore -= 10;
      pakshaNote = `Krishna Paksha (dark fortnight) — not recommended for ${event.name.toLowerCase()}. Shukla Paksha (bright fortnight) is strongly preferred for this activity.`;
      avoidReasons.push('Krishna Paksha (dark fortnight) is unfavorable for this activity');
    } else if (krishnaAcceptableEvents.has(eventId)) {
      pakshaNote = `Krishna Paksha (dark fortnight) — acceptable for ${event.name.toLowerCase()}. Some activities can be performed in either fortnight.`;
    } else {
      totalScore -= 5;
      pakshaNote = `Krishna Paksha (dark fortnight) — mildly unfavorable. Most auspicious activities prefer the bright fortnight (Shukla Paksha).`;
    }
  } else {
    totalScore += 5;
    pakshaNote = `Shukla Paksha (bright fortnight) — favorable for ${event.name.toLowerCase()}. The waxing Moon supports growth and new beginnings.`;
    recommendations.push('Shukla Paksha (bright fortnight) supports this activity');
  }

  // Clamp score
  totalScore = Math.max(0, Math.min(100, totalScore));

  // Determine overall verdict
  let overallVerdict: 'highly_auspicious' | 'auspicious' | 'moderate' | 'inauspicious';
  if (totalScore >= 75) overallVerdict = 'highly_auspicious';
  else if (totalScore >= 55) overallVerdict = 'auspicious';
  else if (totalScore >= 35) overallVerdict = 'moderate';
  else overallVerdict = 'inauspicious';

  // Add general recommendations based on verdict
  if (overallVerdict === 'highly_auspicious') {
    recommendations.push('This is a highly favorable time. Proceed with confidence and perform the activity during Abhijit Muhurat if possible.');
  } else if (overallVerdict === 'auspicious') {
    recommendations.push('Overall conditions are favorable. Proceed with the activity while observing general Muhurta precautions.');
  } else if (overallVerdict === 'moderate') {
    recommendations.push('Conditions are mixed. If postponement is not possible, perform remedial measures and choose the best time window within the day.');
  } else {
    recommendations.push('Conditions are unfavorable. Strongly consider postponing to a more auspicious date. If urgent, perform extensive remedial measures.');
  }

  return {
    event,
    nakshatraVerdict,
    nakshatraNote,
    tithiVerdict,
    tithiNote,
    varaVerdict,
    varaNote,
    tarabalaVerdict,
    tarabalaNote,
    chandrabalaVerdict,
    chandrabalaNote,
    panchakaResult,
    paksha,
    pakshaNote,
    overallScore: totalScore,
    overallVerdict,
    recommendations,
    avoidReasons,
  };
}

/**
 * Get the best events for a given day (based on nakshatra and tithi, without birth data)
 */
export function getBestEventsForDay(
  currentNakshatra: string,
  currentTithi: string,
  dayOfWeek: number,
  tithiIndex?: number,
): { event: MuhurtaEvent; score: number; verdict: string; paksha: 'shukla' | 'krishna' }[] {
  const paksha = tithiIndex !== undefined ? detectPaksha(tithiIndex) : 'shukla';

  return muhurtaEvents.map(event => {
    let score = 50;
    const category = event.category;
    const nMap = nakshatraSuitabilityMap[category] || nakshatraSuitabilityMap.general;

    if (nMap.suitable.includes(currentNakshatra)) score += 20;
    else if (nMap.moderately_suitable.includes(currentNakshatra)) score += 10;
    else if (nMap.avoid.includes(currentNakshatra)) score -= 20;

    const tithiClass = Object.entries(tithiClassification).find(([key]) =>
      currentTithi.toLowerCase().includes(key.toLowerCase())
    );
    const tithiGroup = tithiClass ? tithiClass[1] : 'Purna';
    const tithiMap = tithiEventSuitability[category] || tithiEventSuitability.general;
    const tv = tithiMap[tithiGroup] || 'neutral';
    if (tv === 'excellent') score += 15;
    else if (tv === 'good') score += 8;
    else if (tv === 'avoid') score -= 15;

    const varaMap = varaSuitability[category] || varaSuitability.general;
    const vv = varaMap[dayOfWeek] || 'neutral';
    if (vv === 'excellent') score += 10;
    else if (vv === 'good') score += 5;
    else if (vv === 'avoid') score -= 10;

    // Paksha scoring
    if (paksha === 'krishna') {
      if (shuklaPreferredEvents.has(event.id)) score -= 10;
      else if (!krishnaAcceptableEvents.has(event.id)) score -= 5;
    } else {
      score += 5;
    }

    // Panchaka scoring
    if (tithiIndex !== undefined) {
      const panchaka = calculatePanchaka(tithiIndex, dayOfWeek, currentNakshatra);
      if (panchaka.isBad) {
        const critical = ['marriage', 'construction', 'griha_pravesh', 'upanayana'];
        score += critical.includes(event.id) ? -15 : -8;
      }
    }

    score = Math.max(0, Math.min(100, score));
    const verdict = score >= 75 ? 'Highly Auspicious' :
                    score >= 55 ? 'Auspicious' :
                    score >= 35 ? 'Moderate' : 'Inauspicious';

    return { event, score, verdict, paksha };
  }).sort((a, b) => b.score - a.score);
}
