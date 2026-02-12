/**
 * Dosha Analysis Calculator
 * Based on BPHS and classical Vedic astrology texts
 *
 * Detects: Mangal (Kuja) Dosha, Kaal Sarpa Dosha, Pitra Dosha
 */

import { DoshaResult } from '@/types';

interface PlanetData {
  sign: string;
  signIndex: number;
  house: number;
  degree: string;
  retrograde: boolean;
}

type PlanetPositions = Record<string, PlanetData>;

// ---------- Mangal (Kuja) Dosha ----------

function detectMangalDosha(positions: PlanetPositions): DoshaResult {
  const mars = positions['Mars'];
  if (!mars) {
    return { name: 'Mangal Dosha (Kuja Dosha)', detected: false, severity: 'none', description: '', details: '', remedies: [] };
  }

  const mangalDoshaHouses = [1, 2, 4, 7, 8, 12];
  const detected = mangalDoshaHouses.includes(mars.house);

  if (!detected) {
    return {
      name: 'Mangal Dosha (Kuja Dosha)',
      detected: false,
      severity: 'none',
      description: 'Mangal Dosha is not present in your chart.',
      details: `Mars is placed in the ${mars.house}th house, which does not form Mangal Dosha.`,
      remedies: [],
    };
  }

  // Determine severity
  let severity: 'mild' | 'moderate' | 'severe' = 'moderate';
  const severeHouses = [7, 8];
  const mildHouses = [1, 2];

  if (severeHouses.includes(mars.house)) {
    severity = 'severe';
  } else if (mildHouses.includes(mars.house)) {
    severity = 'mild';
  }

  // Check for cancellation conditions
  const cancellations: string[] = [];
  const jupiter = positions['Jupiter'];
  const venus = positions['Venus'];
  const saturn = positions['Saturn'];

  // Mars in own sign or exalted
  if (mars.signIndex === 0 || mars.signIndex === 7 || mars.signIndex === 9) {
    cancellations.push('Mars is in own sign or exaltation, reducing the dosha effect');
    severity = 'mild';
  }

  // Jupiter aspects Mars (Jupiter in 1, 5, 7, 9 from Mars sign)
  if (jupiter) {
    const diff = ((jupiter.signIndex - mars.signIndex + 12) % 12);
    if (diff === 4 || diff === 6 || diff === 8) {
      cancellations.push("Jupiter's aspect on Mars mitigates the dosha");
      if (severity === 'severe') severity = 'moderate';
      if (severity === 'moderate') severity = 'mild';
    }
  }

  // Venus conjunct Mars
  if (venus && venus.signIndex === mars.signIndex) {
    cancellations.push('Venus conjunct Mars reduces the negative effects');
  }

  // Saturn aspects Mars
  if (saturn) {
    const diff = ((saturn.signIndex - mars.signIndex + 12) % 12);
    if (diff === 2 || diff === 6 || diff === 9) {
      cancellations.push("Saturn's aspect on Mars provides some relief");
    }
  }

  const cancellationNote = cancellations.length > 0
    ? ` However, some cancellation factors are present: ${cancellations.join('; ')}.`
    : '';

  return {
    name: 'Mangal Dosha (Kuja Dosha)',
    detected: true,
    severity,
    description: `Mangal Dosha is present with ${severity} intensity. Mars is placed in the ${mars.house}${getOrdinal(mars.house)} house in ${mars.sign}.`,
    details: `Mars in the ${mars.house}${getOrdinal(mars.house)} house creates Mangal Dosha, which primarily affects marriage and partnerships. This placement can cause delays in marriage, discord with spouse, or aggressive tendencies in relationships.${cancellationNote}`,
    remedies: [
      'Recite Mangal Beej Mantra: "Om Kraam Kreem Kraum Sah Bhaumaya Namah" 108 times on Tuesdays',
      'Perform Kumbh Vivah (symbolic marriage with a pot or Peepal tree) before actual marriage',
      'Wear Red Coral (Moonga) gemstone after consulting an astrologer',
      'Fast on Tuesdays and donate red lentils, jaggery, or red cloth',
      'Visit Hanuman temple on Tuesdays and offer sindoor',
      'Chant Hanuman Chalisa daily for Mars pacification',
      severity === 'severe' ? 'Perform Mangal Shanti Puja for relief' : 'Offer prayers to Lord Kartikeya',
    ],
  };
}

// ---------- Kaal Sarpa Dosha ----------

function detectKaalSarpaDosha(positions: PlanetPositions): DoshaResult {
  const rahu = positions['Rahu'];
  const ketu = positions['Ketu'];
  if (!rahu || !ketu) {
    return { name: 'Kaal Sarpa Dosha', detected: false, severity: 'none', description: '', details: '', remedies: [] };
  }

  const rahuIdx = rahu.signIndex;
  const ketuIdx = ketu.signIndex;

  // Check if all 7 planets (Sun-Saturn) are on one side of Rahu-Ketu axis
  const mainPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  let allOnOneSide = true;

  // Calculate the arc from Rahu to Ketu (going forward)
  const forwardArc: number[] = [];
  let idx = rahuIdx;
  while (idx !== ketuIdx) {
    forwardArc.push(idx);
    idx = (idx + 1) % 12;
  }
  forwardArc.push(ketuIdx);

  let allInForward = true;
  let allInBackward = true;

  for (const planet of mainPlanets) {
    const pData = positions[planet];
    if (!pData) continue;
    if (forwardArc.includes(pData.signIndex)) {
      allInBackward = false;
    } else {
      allInForward = false;
    }
  }

  allOnOneSide = allInForward || allInBackward;

  if (!allOnOneSide) {
    return {
      name: 'Kaal Sarpa Dosha',
      detected: false,
      severity: 'none',
      description: 'Kaal Sarpa Dosha is not present in your chart.',
      details: 'Planets are distributed on both sides of the Rahu-Ketu axis, so Kaal Sarpa Dosha does not form.',
      remedies: [],
    };
  }

  // Determine type based on Rahu's house
  const kaalSarpaTypes: Record<number, string> = {
    1: 'Anant', 2: 'Kulik', 3: 'Vasuki', 4: 'Shankhpal', 5: 'Padma', 6: 'Mahapadma',
    7: 'Takshak', 8: 'Karkotak', 9: 'Shankhchoor', 10: 'Patak', 11: 'Vishdhar', 12: 'Sheshnag',
  };

  const type = kaalSarpaTypes[rahu.house] || 'Unknown';
  const severity: 'moderate' | 'severe' = [1, 7, 8, 12].includes(rahu.house) ? 'severe' : 'moderate';

  return {
    name: 'Kaal Sarpa Dosha',
    detected: true,
    severity,
    description: `${type} Kaal Sarpa Dosha is present. All planets are hemmed between Rahu (${rahu.sign}) and Ketu (${ketu.sign}).`,
    details: `Rahu in the ${rahu.house}${getOrdinal(rahu.house)} house and Ketu in the ${ketu.house}${getOrdinal(ketu.house)} house create ${type} Kaal Sarpa Dosha. This can cause sudden ups and downs in life, obstacles in career, and delays in important matters. The native may experience recurring patterns of setback followed by recovery.`,
    remedies: [
      'Perform Kaal Sarpa Dosha Shanti Puja at Trimbakeshwar or Srikalahasti temple',
      'Recite Rahu Beej Mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah" 18,000 times',
      'Worship Lord Shiva with Rudrabhishek on Mondays',
      'Keep a silver snake idol at home and worship it',
      'Donate black sesame seeds and dark blue cloth on Saturdays',
      'Chant Maha Mrityunjaya Mantra 108 times daily',
      'Offer milk to a Shiva Lingam on Mondays',
    ],
  };
}

// ---------- Pitra Dosha ----------

function detectPitraDosha(positions: PlanetPositions): DoshaResult {
  const sun = positions['Sun'];
  const rahu = positions['Rahu'];
  const saturn = positions['Saturn'];

  if (!sun) {
    return { name: 'Pitra Dosha', detected: false, severity: 'none', description: '', details: '', remedies: [] };
  }

  let detected = false;
  const causes: string[] = [];

  // Sun conjunct Rahu
  if (rahu && sun.signIndex === rahu.signIndex) {
    detected = true;
    causes.push('Sun is conjunct Rahu (Grahan Dosha)');
  }

  // Sun conjunct Saturn
  if (saturn && sun.signIndex === saturn.signIndex) {
    detected = true;
    causes.push('Sun is conjunct Saturn');
  }

  // Sun in 9th house with malefic influence
  if (sun.house === 9) {
    if (rahu && rahu.house === 9) {
      detected = true;
      causes.push('Sun and Rahu in 9th house (house of father/ancestors)');
    }
    if (saturn && saturn.house === 9) {
      detected = true;
      causes.push('Sun and Saturn in 9th house');
    }
  }

  // Rahu in 9th house
  if (rahu && rahu.house === 9) {
    detected = true;
    causes.push('Rahu placed in 9th house (house of ancestors)');
  }

  // Saturn aspects Sun (3rd, 7th, 10th aspect)
  if (saturn && sun) {
    const diff = ((saturn.signIndex - sun.signIndex + 12) % 12);
    if (diff === 2 || diff === 6 || diff === 9) {
      detected = true;
      causes.push("Saturn's aspect on Sun");
    }
  }

  if (!detected) {
    return {
      name: 'Pitra Dosha',
      detected: false,
      severity: 'none',
      description: 'Pitra Dosha is not present in your chart.',
      details: 'There are no significant afflictions to the Sun or 9th house that indicate Pitra Dosha.',
      remedies: [],
    };
  }

  const severity = causes.length >= 3 ? 'severe' as const : causes.length >= 2 ? 'moderate' as const : 'mild' as const;

  return {
    name: 'Pitra Dosha',
    detected: true,
    severity,
    description: `Pitra Dosha is present due to: ${causes.join(', ')}.`,
    details: `Pitra Dosha indicates karmic debts from ancestors. It may cause obstacles in progeny, career delays, and family discord. The native should perform ancestral rites to alleviate the effects. Causes: ${causes.join('. ')}.`,
    remedies: [
      'Perform Pind Daan at Gaya, Prayag, or Varanasi for ancestral peace',
      'Perform Narayan Nagbali Puja at Trimbakeshwar',
      'Offer Tarpan (water oblation) to ancestors on Amavasya (new moon)',
      'Feed Brahmins on the death anniversary of ancestors',
      'Donate food and clothes to the needy on Saturdays',
      'Recite Surya Mantra daily and offer water to the Sun at sunrise',
      'Plant a Peepal tree and water it regularly',
      'Perform Shradh rituals during Pitru Paksha',
    ],
  };
}

// ---------- Helper ----------

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ---------- Main Export ----------

export function analyzeAllDoshas(positions: PlanetPositions): DoshaResult[] {
  return [
    detectMangalDosha(positions),
    detectKaalSarpaDosha(positions),
    detectPitraDosha(positions),
  ];
}
