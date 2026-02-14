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

// ---------- Guru Chandal Dosha (Jupiter + Rahu conjunction) ----------

function detectGuruChandalDosha(positions: PlanetPositions): DoshaResult {
  const jupiter = positions['Jupiter'];
  const rahu = positions['Rahu'];

  if (!jupiter || !rahu) {
    return { name: 'Guru Chandal Dosha', detected: false, severity: 'none', description: '', details: '', remedies: [] };
  }

  // Jupiter and Rahu in the same sign
  if (jupiter.signIndex !== rahu.signIndex) {
    return {
      name: 'Guru Chandal Dosha',
      detected: false,
      severity: 'none',
      description: 'Guru Chandal Dosha is not present in your chart.',
      details: 'Jupiter and Rahu are not conjunct, so Guru Chandal Dosha does not form.',
      remedies: [],
    };
  }

  // Check for mitigating factors
  const cancellations: string[] = [];
  let severity: 'mild' | 'moderate' | 'severe' = 'moderate';

  // Jupiter in own sign or exalted
  if (jupiter.signIndex === 8 || jupiter.signIndex === 11 || jupiter.signIndex === 3) {
    cancellations.push('Jupiter is in own sign or exaltation, significantly reducing the dosha');
    severity = 'mild';
  }

  // Jupiter in Kendra house
  if ([1, 4, 7, 10].includes(jupiter.house)) {
    cancellations.push('Jupiter in a Kendra house reduces the negative effects');
    if (severity === 'moderate') severity = 'mild';
  }

  // If in 5th or 9th house (Trikona), effects are mixed but reduced
  if ([5, 9].includes(jupiter.house)) {
    cancellations.push('Jupiter in a Trikona house provides partial protection');
  }

  // Severe in 6th, 8th, or 12th house
  if ([6, 8, 12].includes(jupiter.house)) {
    severity = 'severe';
  }

  const cancellationNote = cancellations.length > 0
    ? ` Mitigating factors: ${cancellations.join('; ')}.`
    : '';

  return {
    name: 'Guru Chandal Dosha',
    detected: true,
    severity,
    description: `Guru Chandal Dosha is present with ${severity} intensity. Jupiter and Rahu are conjunct in ${jupiter.sign}.`,
    details: `Jupiter (Guru), the planet of wisdom and dharma, is conjunct Rahu in the ${jupiter.house}${getOrdinal(jupiter.house)} house. This combination can create confusion in matters of religion, education, and moral judgment. The native may face challenges with teachers, gurus, or spiritual guides, and may be drawn to unconventional or unorthodox beliefs. It can also indicate broken promises or dishonesty from trusted advisors.${cancellationNote}`,
    remedies: [
      'Recite Jupiter Beej Mantra: "Om Graam Greem Graum Sah Gurave Namah" 108 times on Thursdays',
      'Wear a Yellow Sapphire (Pukhraj) after consulting an astrologer',
      'Donate yellow items — turmeric, yellow cloth, bananas — on Thursdays',
      'Visit Lord Vishnu temple on Thursdays and offer yellow flowers',
      'Recite Vishnu Sahasranama or Guru Stotram regularly',
      'Feed Brahmins and donate to educational institutions',
      'Perform Brihaspati (Jupiter) Shanti Puja for severe cases',
    ],
  };
}

// ---------- Grahan Dosha (Sun/Moon with Rahu/Ketu — Eclipse Dosha) ----------

function detectGrahanDosha(positions: PlanetPositions): DoshaResult {
  const sun = positions['Sun'];
  const moon = positions['Moon'];
  const rahu = positions['Rahu'];
  const ketu = positions['Ketu'];

  if (!sun || !moon || !rahu || !ketu) {
    return { name: 'Grahan Dosha', detected: false, severity: 'none', description: '', details: '', remedies: [] };
  }

  const eclipses: string[] = [];

  // Sun-Rahu conjunction (Solar eclipse)
  if (sun.signIndex === rahu.signIndex) {
    eclipses.push(`Sun-Rahu conjunction in ${sun.sign} (Solar Eclipse pattern)`);
  }
  // Sun-Ketu conjunction
  if (sun.signIndex === ketu.signIndex) {
    eclipses.push(`Sun-Ketu conjunction in ${sun.sign} (Solar Eclipse pattern)`);
  }
  // Moon-Rahu conjunction (Lunar eclipse)
  if (moon.signIndex === rahu.signIndex) {
    eclipses.push(`Moon-Rahu conjunction in ${moon.sign} (Lunar Eclipse pattern)`);
  }
  // Moon-Ketu conjunction
  if (moon.signIndex === ketu.signIndex) {
    eclipses.push(`Moon-Ketu conjunction in ${moon.sign} (Lunar Eclipse pattern)`);
  }

  if (eclipses.length === 0) {
    return {
      name: 'Grahan Dosha',
      detected: false,
      severity: 'none',
      description: 'Grahan Dosha is not present in your chart.',
      details: 'Neither Sun nor Moon are conjunct with Rahu or Ketu, so no eclipse-based dosha forms.',
      remedies: [],
    };
  }

  const severity = eclipses.length >= 2 ? 'severe' as const : 'moderate' as const;
  const hasSolar = eclipses.some(e => e.includes('Sun'));
  const hasLunar = eclipses.some(e => e.includes('Moon'));

  let effectsDetail = '';
  if (hasSolar && hasLunar) {
    effectsDetail = 'Both luminaries are eclipsed, indicating karmic challenges with both father (Sun) and mother (Moon). The native may face health issues, identity confusion, and emotional turbulence.';
  } else if (hasSolar) {
    effectsDetail = 'The Sun is eclipsed, affecting self-confidence, father\'s health, career in government, and eyesight. The native may struggle with authority figures and face ego-related challenges.';
  } else {
    effectsDetail = 'The Moon is eclipsed, affecting mental peace, mother\'s health, emotional stability, and public image. The native may experience anxiety, mood disorders, and relationship challenges.';
  }

  return {
    name: 'Grahan Dosha',
    detected: true,
    severity,
    description: `Grahan Dosha is present: ${eclipses.join('; ')}.`,
    details: `Grahan Dosha occurs when the luminaries (Sun or Moon) are conjunct the shadow planets (Rahu or Ketu), mimicking an eclipse in the birth chart. ${effectsDetail} This dosha intensifies during eclipse seasons and during the dasha periods of the involved planets.`,
    remedies: [
      hasSolar ? 'Offer water (Arghya) to the rising Sun daily with the Surya Mantra' : 'Perform Chandra Puja on Mondays and Purnima days',
      'Recite Maha Mrityunjaya Mantra 108 times daily for overall protection',
      'Perform Grahan Dosha Shanti Puja at an auspicious time',
      'Donate black sesame seeds and dark cloth on Saturdays for Rahu/Ketu pacification',
      'Visit Rahu-Ketu temples (like Thirunageswaram or Srikalahasti)',
      'Keep fast on eclipse days and perform charity',
      hasSolar ? 'Recite Aditya Hridaya Stotra on Sundays' : 'Recite Chandra Kavach on Mondays',
      'Perform Navagraha Shanti Homa for overall planetary pacification',
    ],
  };
}

// ---------- Shani Dosha (Saturn in adverse houses) ----------

function detectShaniDosha(positions: PlanetPositions): DoshaResult {
  const saturn = positions['Saturn'];

  if (!saturn) {
    return { name: 'Shani Dosha', detected: false, severity: 'none', description: '', details: '', remedies: [] };
  }

  // Saturn in 1st, 4th, 7th, 8th, or 10th house creates significant effects
  const shaniDoshaHouses = [1, 4, 7, 8, 10];
  const detected = shaniDoshaHouses.includes(saturn.house);

  if (!detected) {
    return {
      name: 'Shani Dosha',
      detected: false,
      severity: 'none',
      description: 'Shani Dosha is not significantly present in your chart.',
      details: `Saturn is in the ${saturn.house}${getOrdinal(saturn.house)} house, which does not form a major Shani Dosha.`,
      remedies: [],
    };
  }

  let severity: 'mild' | 'moderate' | 'severe' = 'moderate';
  let houseEffect = '';

  switch (saturn.house) {
    case 1:
      houseEffect = 'Saturn in the 1st house can cause a serious, melancholic disposition, delayed success in early life, and health issues related to bones and joints. However, it grants tremendous discipline and longevity.';
      severity = 'moderate';
      break;
    case 4:
      houseEffect = 'Saturn in the 4th house may create challenges in domestic happiness, distance from mother, delays in acquiring property, and a general sense of emotional dissatisfaction despite material comfort.';
      severity = 'moderate';
      break;
    case 7:
      houseEffect = 'Saturn in the 7th house often delays marriage and brings a mature or older spouse. Married life may feel like a duty rather than a joy, but relationships strengthen over time. Patience in partnerships is essential.';
      severity = 'moderate';
      break;
    case 8:
      houseEffect = 'Saturn in the 8th house may bring chronic health issues, obstacles in inheritance, and a difficult transformation process. However, it grants remarkable longevity and deep occult knowledge.';
      severity = 'severe';
      break;
    case 10:
      houseEffect = 'Saturn in the 10th house delays career success but eventually grants positions of great authority. The professional path is marked by hard work, slow rise, and eventual lasting recognition.';
      severity = 'mild';
      break;
  }

  // Check for mitigating factors
  const cancellations: string[] = [];
  const jupiter = positions['Jupiter'];

  // Saturn in own sign (Capricorn or Aquarius) or exalted (Libra)
  if (saturn.signIndex === 9 || saturn.signIndex === 10 || saturn.signIndex === 6) {
    cancellations.push('Saturn is in own sign or exaltation, converting challenges into strengths');
    if (severity === 'severe') severity = 'moderate';
    if (severity === 'moderate') severity = 'mild';
  }

  // Jupiter aspecting Saturn
  if (jupiter) {
    const diff = ((jupiter.signIndex - saturn.signIndex + 12) % 12);
    if (diff === 4 || diff === 6 || diff === 8) {
      cancellations.push("Jupiter's aspect on Saturn brings wisdom and divine grace to ease difficulties");
      if (severity === 'severe') severity = 'moderate';
    }
  }

  const cancellationNote = cancellations.length > 0
    ? ` Positive factors: ${cancellations.join('; ')}.`
    : '';

  return {
    name: 'Shani Dosha',
    detected: true,
    severity,
    description: `Shani Dosha is present with ${severity} intensity. Saturn is in the ${saturn.house}${getOrdinal(saturn.house)} house in ${saturn.sign}.`,
    details: `${houseEffect}${cancellationNote}`,
    remedies: [
      'Recite Shani Beej Mantra: "Om Praam Preem Praum Sah Shanaischaraya Namah" 108 times on Saturdays',
      'Donate black sesame seeds, mustard oil, iron items, and dark blue cloth on Saturdays',
      'Fast on Saturdays and consume only one meal after sunset',
      'Visit Lord Shani or Hanuman temple every Saturday',
      'Light a sesame oil lamp under a Peepal tree on Saturday evenings',
      'Recite Hanuman Chalisa daily — Hanuman protects from Saturn\'s afflictions',
      'Wear Blue Sapphire (Neelam) only after thorough astrological consultation',
      'Serve elderly, disabled, and underprivileged people as Saturn\'s karmic remedy',
    ],
  };
}

// ---------- Gandanta Dosha (Birth at Nakshatra/Sign junctions) ----------

function detectGandantaDosha(positions: PlanetPositions, ascendantSignIndex: number): DoshaResult {
  const moon = positions['Moon'];

  if (!moon) {
    return { name: 'Gandanta Dosha', detected: false, severity: 'none', description: '', details: '', remedies: [] };
  }

  // Gandanta occurs at the junctions of Water-Fire signs:
  // Cancer (3) → Leo (4), Scorpio (7) → Sagittarius (8), Pisces (11) → Aries (0)
  // Specifically in the last pada of Ashlesha/Jyeshtha/Revati and first pada of Magha/Mula/Ashwini
  const gandantaNakshatras: Record<string, { type: string; severity: 'mild' | 'moderate' | 'severe' }> = {
    'Ashwini': { type: 'Pisces-Aries junction (Revati to Ashwini)', severity: 'moderate' },
    'Magha': { type: 'Cancer-Leo junction (Ashlesha to Magha)', severity: 'severe' },
    'Mula': { type: 'Scorpio-Sagittarius junction (Jyeshtha to Mula)', severity: 'severe' },
    'Revati': { type: 'Pisces-Aries junction (Revati to Ashwini)', severity: 'moderate' },
    'Ashlesha': { type: 'Cancer-Leo junction (Ashlesha to Magha)', severity: 'severe' },
    'Jyeshtha': { type: 'Scorpio-Sagittarius junction (Jyeshtha to Mula)', severity: 'severe' },
  };

  // We need the Moon's nakshatra — derive from the signIndex and degree
  // Since we may not have exact nakshatra here, check if Moon is at sign junction
  const moonDegree = parseFloat(moon.degree);
  const isAtJunction = (
    ((moon.signIndex === 3 || moon.signIndex === 7 || moon.signIndex === 11) && moonDegree >= 26.67) || // Last pada of water sign
    ((moon.signIndex === 0 || moon.signIndex === 4 || moon.signIndex === 8) && moonDegree <= 3.33) // First pada of fire sign
  );

  if (!isAtJunction) {
    return {
      name: 'Gandanta Dosha',
      detected: false,
      severity: 'none',
      description: 'Gandanta Dosha is not present in your chart.',
      details: 'The Moon is not at a Water-Fire sign junction, so Gandanta Dosha does not form.',
      remedies: [],
    };
  }

  const severity = (moon.signIndex === 7 || moon.signIndex === 8 || moon.signIndex === 3 || moon.signIndex === 4) ? 'severe' as const : 'moderate' as const;

  return {
    name: 'Gandanta Dosha',
    detected: true,
    severity,
    description: `Gandanta Dosha is present. The Moon is at a Water-Fire sign junction at ${moonDegree.toFixed(1)}° in ${moon.sign}.`,
    details: `Gandanta means "drowning point" — it occurs when the Moon is at the junction between a Water sign and a Fire sign. This is considered one of the most sensitive birth conditions in Vedic astrology. The native may face an early-life crisis that becomes a powerful catalyst for spiritual transformation. The Gandanta point represents the death of one cycle and birth of another — a powerful karmic transition.`,
    remedies: [
      'Perform Gandanta Dosha Shanti Puja as soon as possible after birth',
      'Donate gold equal to the weight of the baby (symbolic or actual) at a temple',
      'Recite Maha Mrityunjaya Mantra 1,008 times for protection',
      'Perform Rudrabhishek at a Shiva temple on the birth nakshatra day',
      'Feed Brahmins and perform charity on the birth star day each month',
      'Worship Lord Ganesha before starting any new venture',
      'Keep fast on Mondays for Moon pacification',
      'The child should be named after the deity of the birth nakshatra',
    ],
  };
}

// ---------- Main Export ----------

export function analyzeAllDoshas(positions: PlanetPositions, ascendantSignIndex?: number): DoshaResult[] {
  return [
    detectMangalDosha(positions),
    detectKaalSarpaDosha(positions),
    detectPitraDosha(positions),
    detectGuruChandalDosha(positions),
    detectGrahanDosha(positions),
    detectShaniDosha(positions),
    detectGandantaDosha(positions, ascendantSignIndex ?? 0),
  ];
}
