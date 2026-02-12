/**
 * Yoga Identification Calculator
 * Based on Brihat Parashara Hora Shastra (BPHS) and Phaladeepika
 *
 * Identifies planetary yogas (combinations) present in a birth chart.
 */

import { YogaResult } from '@/types';

interface PlanetData {
  sign: string;
  signIndex: number;
  house: number;
  degree: string;
  retrograde: boolean;
}

type PlanetPositions = Record<string, PlanetData>;

const signLords: Record<number, string> = {
  0: 'Mars', 1: 'Venus', 2: 'Mercury', 3: 'Moon', 4: 'Sun', 5: 'Mercury',
  6: 'Venus', 7: 'Mars', 8: 'Jupiter', 9: 'Saturn', 10: 'Saturn', 11: 'Jupiter',
};

const exaltationSigns: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
};

const debilitationSigns: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0,
};

const moolatrikonaSigns: Record<string, number> = {
  Sun: 4, Moon: 1, Mars: 0, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 10,
};

const kendraHouses = [1, 4, 7, 10];
const trikonaHouses = [1, 5, 9];

function isInKendra(house: number): boolean {
  return kendraHouses.includes(house);
}

function isInTrikona(house: number): boolean {
  return trikonaHouses.includes(house);
}

function isExalted(planet: string, signIndex: number): boolean {
  return exaltationSigns[planet] === signIndex;
}

function isDebilitated(planet: string, signIndex: number): boolean {
  return debilitationSigns[planet] === signIndex;
}

function isInOwnSign(planet: string, signIndex: number): boolean {
  return signLords[signIndex] === planet;
}

function isInMoolatrikona(planet: string, signIndex: number): boolean {
  return moolatrikonaSigns[planet] === signIndex;
}

function arePlanetsConjunct(p1: PlanetData, p2: PlanetData): boolean {
  return p1.signIndex === p2.signIndex;
}

function arePlanetsInMutualKendra(p1: PlanetData, p2: PlanetData): boolean {
  const diff = Math.abs(p1.house - p2.house);
  return diff === 3 || diff === 6 || diff === 9 || diff === 0;
}

function getHouseFromAscendant(planetSignIndex: number, ascendantSignIndex: number): number {
  return ((planetSignIndex - ascendantSignIndex + 12) % 12) + 1;
}

export function identifyYogas(positions: PlanetPositions, ascendantSignIndex: number): YogaResult[] {
  const yogas: YogaResult[] = [];

  // -- Raja Yogas (Kendra-Trikona lords conjunction/mutual aspect) --

  const kendraLords: string[] = [];
  const trikonaLords: string[] = [];
  kendraHouses.forEach(h => {
    const signIdx = (ascendantSignIndex + h - 1) % 12;
    const lord = signLords[signIdx];
    if (!kendraLords.includes(lord)) kendraLords.push(lord);
  });
  trikonaHouses.forEach(h => {
    const signIdx = (ascendantSignIndex + h - 1) % 12;
    const lord = signLords[signIdx];
    if (!trikonaLords.includes(lord)) trikonaLords.push(lord);
  });

  for (const kLord of kendraLords) {
    for (const tLord of trikonaLords) {
      if (kLord === tLord) continue;
      const kData = positions[kLord];
      const tData = positions[tLord];
      if (!kData || !tData) continue;
      if (arePlanetsConjunct(kData, tData) || arePlanetsInMutualKendra(kData, tData)) {
        yogas.push({
          name: 'Raja Yoga',
          sanskrit: 'Raja Yoga',
          type: 'raja',
          description: `Formed by the association of Kendra lord (${kLord}) and Trikona lord (${tLord}).`,
          effects: 'Bestows power, authority, fame, and success in life. The native achieves high status and leadership positions.',
          planets: [kLord, tLord],
          strength: arePlanetsConjunct(kData, tData) ? 'strong' : 'moderate',
        });
        break;
      }
    }
  }

  // -- Gajakesari Yoga (Jupiter in Kendra from Moon) --
  const jupiter = positions['Jupiter'];
  const moon = positions['Moon'];
  if (jupiter && moon) {
    const houseDiff = ((jupiter.signIndex - moon.signIndex + 12) % 12);
    if (houseDiff === 0 || houseDiff === 3 || houseDiff === 6 || houseDiff === 9) {
      yogas.push({
        name: 'Gajakesari Yoga',
        sanskrit: 'Gajakesari Yoga',
        type: 'lunar',
        description: 'Jupiter is placed in a Kendra (1st, 4th, 7th, or 10th) from Moon.',
        effects: 'Grants wisdom, wealth, fame, and lasting reputation. The native is intelligent, virtuous, and respected in society.',
        planets: ['Jupiter', 'Moon'],
        strength: isExalted('Jupiter', jupiter.signIndex) || isInOwnSign('Jupiter', jupiter.signIndex) ? 'strong' : 'moderate',
      });
    }
  }

  // -- Budhaditya Yoga (Sun + Mercury conjunction) --
  const sun = positions['Sun'];
  const mercury = positions['Mercury'];
  if (sun && mercury && arePlanetsConjunct(sun, mercury)) {
    const inKendra = isInKendra(sun.house);
    yogas.push({
      name: 'Budhaditya Yoga',
      sanskrit: 'Budhaditya Yoga',
      type: 'solar',
      description: 'Sun and Mercury are conjunct in the same sign.',
      effects: 'Grants intelligence, eloquence, skill in arts and sciences. The native has strong analytical abilities and good communication.',
      planets: ['Sun', 'Mercury'],
      strength: inKendra ? 'strong' : 'moderate',
    });
  }

  // -- Chandra-Mangal Yoga (Moon + Mars conjunction) --
  const mars = positions['Mars'];
  if (moon && mars && arePlanetsConjunct(moon, mars)) {
    yogas.push({
      name: 'Chandra-Mangal Yoga',
      sanskrit: 'Chandra Mangala Yoga',
      type: 'lunar',
      description: 'Moon and Mars are conjunct in the same sign.',
      effects: 'Grants wealth through own efforts, business acumen, and earning ability. The native is enterprising and financially successful.',
      planets: ['Moon', 'Mars'],
      strength: 'moderate',
    });
  }

  // -- Pancha Mahapurusha Yogas --
  const mahapurushaConfig: { planet: string; yoga: string; sanskrit: string; effects: string }[] = [
    { planet: 'Mars', yoga: 'Ruchaka Yoga', sanskrit: 'Ruchaka Yoga', effects: 'Grants courage, commanding personality, military prowess, and leadership. The native is brave, wealthy, and famous.' },
    { planet: 'Mercury', yoga: 'Bhadra Yoga', sanskrit: 'Bhadra Yoga', effects: 'Grants intelligence, eloquence, learning, and longevity. The native is wise, scholarly, and respected.' },
    { planet: 'Jupiter', yoga: 'Hamsa Yoga', sanskrit: 'Hamsa Yoga', effects: 'Grants righteousness, spiritual wisdom, virtue, and respect. The native is noble, charitable, and revered.' },
    { planet: 'Venus', yoga: 'Malavya Yoga', sanskrit: 'Malavya Yoga', effects: 'Grants beauty, luxury, vehicles, wealth, and artistic talent. The native enjoys material comforts and refined pleasures.' },
    { planet: 'Saturn', yoga: 'Sasa Yoga', sanskrit: 'Shasha Yoga', effects: 'Grants authority, power over others, servants, and political success. The native commands respect and holds positions of power.' },
  ];

  for (const cfg of mahapurushaConfig) {
    const p = positions[cfg.planet];
    if (!p) continue;
    const inKendra = isInKendra(p.house);
    const inOwnOrExalted = isInOwnSign(cfg.planet, p.signIndex) || isExalted(cfg.planet, p.signIndex) || isInMoolatrikona(cfg.planet, p.signIndex);
    if (inKendra && inOwnOrExalted) {
      yogas.push({
        name: cfg.yoga,
        sanskrit: cfg.sanskrit,
        type: 'pancha_mahapurusha',
        description: `${cfg.planet} is in a Kendra house in its own sign, exaltation, or moolatrikona.`,
        effects: cfg.effects,
        planets: [cfg.planet],
        strength: isExalted(cfg.planet, p.signIndex) ? 'strong' : 'moderate',
      });
    }
  }

  // -- Neecha Bhanga Raja Yoga (Cancellation of Debilitation) --
  const mainPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  for (const planet of mainPlanets) {
    const p = positions[planet];
    if (!p || !isDebilitated(planet, p.signIndex)) continue;

    const debSign = debilitationSigns[planet];
    const debSignLord = signLords[debSign];
    const debSignLordData = positions[debSignLord];
    const exaltSignLord = signLords[exaltationSigns[planet]];
    const exaltSignLordData = positions[exaltSignLord];

    let cancelled = false;
    // Lord of debilitation sign in Kendra from Lagna or Moon
    if (debSignLordData && (isInKendra(debSignLordData.house))) {
      cancelled = true;
    }
    // Lord of exaltation sign in Kendra
    if (exaltSignLordData && isInKendra(exaltSignLordData.house)) {
      cancelled = true;
    }
    // Debilitated planet is exalted in Navamsa (simplified check)
    if (p.retrograde) {
      cancelled = true; // Retrograde debilitated planet gains strength
    }

    if (cancelled) {
      yogas.push({
        name: 'Neecha Bhanga Raja Yoga',
        sanskrit: 'Neecha Bhanga Raja Yoga',
        type: 'cancellation',
        description: `${planet}'s debilitation is cancelled, converting weakness into exceptional strength.`,
        effects: 'The native rises from humble beginnings to achieve great heights. Initial struggles transform into extraordinary success and recognition.',
        planets: [planet, debSignLord],
        strength: 'strong',
      });
    }
  }

  // -- Dhana Yogas (Wealth combinations) --
  // 2nd lord + 11th lord conjunction
  const secondLord = signLords[(ascendantSignIndex + 1) % 12];
  const eleventhLord = signLords[(ascendantSignIndex + 10) % 12];
  if (secondLord !== eleventhLord) {
    const sl = positions[secondLord];
    const el = positions[eleventhLord];
    if (sl && el && arePlanetsConjunct(sl, el)) {
      yogas.push({
        name: 'Dhana Yoga',
        sanskrit: 'Dhana Yoga',
        type: 'dhana',
        description: `2nd lord (${secondLord}) and 11th lord (${eleventhLord}) are conjunct.`,
        effects: 'Grants financial prosperity and accumulation of wealth. The native enjoys abundance and material security.',
        planets: [secondLord, eleventhLord],
        strength: 'moderate',
      });
    }
  }

  // -- Lakshmi Yoga (9th lord in Kendra, strong Venus) --
  const ninthLord = signLords[(ascendantSignIndex + 8) % 12];
  const ninthLordData = positions[ninthLord];
  const venus = positions['Venus'];
  if (ninthLordData && venus && isInKendra(ninthLordData.house) &&
      (isExalted('Venus', venus.signIndex) || isInOwnSign('Venus', venus.signIndex) || isInKendra(venus.house))) {
    yogas.push({
      name: 'Lakshmi Yoga',
      sanskrit: 'Lakshmi Yoga',
      type: 'dhana',
      description: '9th lord is strong and Venus is powerful in the chart.',
      effects: 'Bestows wealth, beauty, and the blessings of Goddess Lakshmi. The native is prosperous, virtuous, and enjoys comforts.',
      planets: [ninthLord, 'Venus'],
      strength: 'strong',
    });
  }

  // -- Amala Yoga (Natural benefic in 10th from Lagna/Moon) --
  const naturalBenefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  for (const b of naturalBenefics) {
    const bData = positions[b];
    if (!bData) continue;
    if (bData.house === 10) {
      yogas.push({
        name: 'Amala Yoga',
        sanskrit: 'Amala Yoga',
        type: 'special',
        description: `${b} (natural benefic) is placed in the 10th house.`,
        effects: 'The native has a spotless reputation, is virtuous, charitable, and known for good deeds.',
        planets: [b],
        strength: 'moderate',
      });
      break;
    }
  }

  // -- Veshi Yoga (Planet other than Moon in 2nd from Sun) --
  if (sun) {
    const secondFromSun = (sun.house % 12) + 1;
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      const pData = positions[planet];
      if (pData && pData.house === secondFromSun) {
        yogas.push({
          name: 'Veshi Yoga',
          sanskrit: 'Veshi Yoga',
          type: 'solar',
          description: `${planet} is placed in the 2nd house from Sun.`,
          effects: 'The native is truthful, eloquent, and endowed with knowledge. Brings fame through speech and learning.',
          planets: ['Sun', planet],
          strength: 'moderate',
        });
        break;
      }
    }
  }

  // -- Voshi Yoga (Planet other than Moon in 12th from Sun) --
  if (sun) {
    const twelfthFromSun = ((sun.house - 2 + 12) % 12) + 1;
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      const pData = positions[planet];
      if (pData && pData.house === twelfthFromSun) {
        yogas.push({
          name: 'Voshi Yoga',
          sanskrit: 'Voshi Yoga',
          type: 'solar',
          description: `${planet} is placed in the 12th house from Sun.`,
          effects: 'The native is charitable, learned, and gifted with good memory. Brings recognition and generosity.',
          planets: ['Sun', planet],
          strength: 'moderate',
        });
        break;
      }
    }
  }

  // -- Ubhayachari Yoga (Planets on both sides of Sun) --
  if (sun) {
    const secondFromSun = (sun.house % 12) + 1;
    const twelfthFromSun = ((sun.house - 2 + 12) % 12) + 1;
    let hasSecond = false, hasTwelfth = false;
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      const pData = positions[planet];
      if (pData) {
        if (pData.house === secondFromSun) hasSecond = true;
        if (pData.house === twelfthFromSun) hasTwelfth = true;
      }
    }
    if (hasSecond && hasTwelfth) {
      yogas.push({
        name: 'Ubhayachari Yoga',
        sanskrit: 'Ubhayachari Yoga',
        type: 'solar',
        description: 'Planets (excluding Moon, Rahu, Ketu) occupy both the 2nd and 12th houses from Sun.',
        effects: 'The native is a king or equal to a king, eloquent, handsome, and balanced in nature.',
        planets: ['Sun'],
        strength: 'strong',
      });
    }
  }

  // -- Sunapha Yoga (Planet in 2nd from Moon, excluding Sun) --
  if (moon) {
    const secondFromMoon = (moon.house % 12) + 1;
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      const pData = positions[planet];
      if (pData && pData.house === secondFromMoon) {
        yogas.push({
          name: 'Sunapha Yoga',
          sanskrit: 'Sunapha Yoga',
          type: 'lunar',
          description: `${planet} is in the 2nd house from Moon.`,
          effects: 'The native earns wealth through own intelligence and effort. Self-made prosperity and good reputation.',
          planets: ['Moon', planet],
          strength: 'moderate',
        });
        break;
      }
    }
  }

  // -- Anapha Yoga (Planet in 12th from Moon, excluding Sun) --
  if (moon) {
    const twelfthFromMoon = ((moon.house - 2 + 12) % 12) + 1;
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      const pData = positions[planet];
      if (pData && pData.house === twelfthFromMoon) {
        yogas.push({
          name: 'Anapha Yoga',
          sanskrit: 'Anapha Yoga',
          type: 'lunar',
          description: `${planet} is in the 12th house from Moon.`,
          effects: 'The native is powerful, healthy, and free from disease. Enjoys good reputation and comforts.',
          planets: ['Moon', planet],
          strength: 'moderate',
        });
        break;
      }
    }
  }

  // -- Gaja Kesari variant: Jupiter in Kendra from Lagna --
  if (jupiter && isInKendra(jupiter.house) && (isExalted('Jupiter', jupiter.signIndex) || isInOwnSign('Jupiter', jupiter.signIndex))) {
    const alreadyHasHamsa = yogas.some(y => y.name === 'Hamsa Yoga');
    if (!alreadyHasHamsa) {
      yogas.push({
        name: 'Hamsa Yoga',
        sanskrit: 'Hamsa Yoga',
        type: 'pancha_mahapurusha',
        description: 'Jupiter is in a Kendra in its own sign or exaltation.',
        effects: 'Grants righteousness, spiritual wisdom, virtue, and respect. The native is noble, charitable, and revered.',
        planets: ['Jupiter'],
        strength: isExalted('Jupiter', jupiter.signIndex) ? 'strong' : 'moderate',
      });
    }
  }

  // -- Adhi Yoga (Benefics in 6th, 7th, 8th from Moon) --
  if (moon) {
    const h6 = (moon.house + 5 - 1) % 12 + 1;
    const h7 = (moon.house + 6 - 1) % 12 + 1;
    const h8 = (moon.house + 7 - 1) % 12 + 1;
    let beneficCount = 0;
    const adhiPlanets: string[] = [];
    for (const b of ['Mercury', 'Jupiter', 'Venus']) {
      const bData = positions[b];
      if (bData && (bData.house === h6 || bData.house === h7 || bData.house === h8)) {
        beneficCount++;
        adhiPlanets.push(b);
      }
    }
    if (beneficCount >= 2) {
      yogas.push({
        name: 'Adhi Yoga',
        sanskrit: 'Adhi Yoga',
        type: 'special',
        description: 'Benefic planets occupy the 6th, 7th, and 8th houses from Moon.',
        effects: 'The native becomes a leader or commander, wealthy, healthy, and victorious over enemies.',
        planets: ['Moon', ...adhiPlanets],
        strength: beneficCount >= 3 ? 'strong' : 'moderate',
      });
    }
  }

  // -- Saraswati Yoga (Jupiter, Venus, Mercury in Kendra/Trikona/2nd) --
  const goodHouses = [1, 2, 4, 5, 7, 9, 10];
  if (jupiter && venus && mercury) {
    const allInGood = goodHouses.includes(jupiter.house) && goodHouses.includes(venus.house) && goodHouses.includes(mercury.house);
    if (allInGood) {
      yogas.push({
        name: 'Saraswati Yoga',
        sanskrit: 'Saraswati Yoga',
        type: 'special',
        description: 'Jupiter, Venus, and Mercury are placed in Kendra, Trikona, or 2nd house.',
        effects: 'The native is highly learned, eloquent, poetic, and skilled in fine arts. Blessed by Goddess Saraswati.',
        planets: ['Jupiter', 'Venus', 'Mercury'],
        strength: 'strong',
      });
    }
  }

  // -- Kahala Yoga (4th lord and Jupiter in mutual Kendras) --
  const fourthLord = signLords[(ascendantSignIndex + 3) % 12];
  const fourthLordData = positions[fourthLord];
  if (fourthLordData && jupiter && arePlanetsInMutualKendra(fourthLordData, jupiter)) {
    yogas.push({
      name: 'Kahala Yoga',
      sanskrit: 'Kahala Yoga',
      type: 'special',
      description: `4th lord (${fourthLord}) and Jupiter are in mutual Kendra positions.`,
      effects: 'The native is bold, courageous, and leads armies or organizations. Commands respect through bravery.',
      planets: [fourthLord, 'Jupiter'],
      strength: 'moderate',
    });
  }

  // Deduplicate by name (keep strongest)
  const unique = new Map<string, YogaResult>();
  for (const y of yogas) {
    const existing = unique.get(y.name);
    if (!existing || strengthValue(y.strength) > strengthValue(existing.strength)) {
      unique.set(y.name, y);
    }
  }

  return Array.from(unique.values());
}

function strengthValue(s: 'strong' | 'moderate' | 'weak'): number {
  return s === 'strong' ? 3 : s === 'moderate' ? 2 : 1;
}
