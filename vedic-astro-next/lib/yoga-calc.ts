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

  // -- Viparita Raja Yoga (Lords of 6th, 8th, 12th in each other's houses) --
  // BPHS Ch. 36: When lords of dusthana houses are placed in other dusthana houses
  const dusthanaHouses = [6, 8, 12];
  const dusthanaLords = dusthanaHouses.map(h => ({
    house: h,
    lord: signLords[(ascendantSignIndex + h - 1) % 12],
  }));

  for (const dl of dusthanaLords) {
    const dlData = positions[dl.lord];
    if (!dlData) continue;
    // Check if this dusthana lord is placed in another dusthana house
    const otherDusthanas = dusthanaHouses.filter(h => h !== dl.house);
    if (otherDusthanas.includes(dlData.house)) {
      const viparitaNames: Record<number, { name: string; sanskrit: string }> = {
        6: { name: 'Harsha Viparita Raja Yoga', sanskrit: 'Harsha Viparīta Rāja Yoga' },
        8: { name: 'Sarala Viparita Raja Yoga', sanskrit: 'Sarala Viparīta Rāja Yoga' },
        12: { name: 'Vimala Viparita Raja Yoga', sanskrit: 'Vimala Viparīta Rāja Yoga' },
      };
      const yogaInfo = viparitaNames[dl.house];
      yogas.push({
        name: yogaInfo.name,
        sanskrit: yogaInfo.sanskrit,
        type: 'raja',
        description: `Lord of the ${dl.house}th house (${dl.lord}) is placed in the ${dlData.house}th house, forming Viparita Raja Yoga.`,
        effects: dl.house === 6
          ? 'Harsha Yoga grants victory over enemies, good health, and happiness. Obstacles transform into stepping stones for success.'
          : dl.house === 8
            ? 'Sarala Yoga grants longevity, fearlessness, and prosperity. Hidden dangers dissolve, and the native gains through inheritance or insurance.'
            : 'Vimala Yoga grants spiritual liberation, minimal expenses relative to income, and freedom from bondage. The native gains through foreign lands.',
        planets: [dl.lord],
        strength: 'moderate',
      });
    }
  }

  // -- Dharma-Karmadhipati Yoga (9th + 10th lord connection) --
  // BPHS: Most powerful Raja Yoga when 9th and 10th lords are connected
  const tenthLord = signLords[(ascendantSignIndex + 9) % 12];
  const tenthLordData = positions[tenthLord];
  if (ninthLordData && tenthLordData && ninthLord !== tenthLord) {
    if (arePlanetsConjunct(ninthLordData, tenthLordData) || arePlanetsInMutualKendra(ninthLordData, tenthLordData)) {
      yogas.push({
        name: 'Dharma-Karmadhipati Yoga',
        sanskrit: 'Dharma-Karmādhipati Yoga',
        type: 'raja',
        description: `The 9th lord (${ninthLord}) and 10th lord (${tenthLord}) are connected, forming the premier Raja Yoga.`,
        effects: 'The most powerful Raja Yoga in Vedic astrology. Bestows fame, authority, righteous conduct combined with professional success. The native achieves high status through meritorious deeds and is respected as a leader.',
        planets: [ninthLord, tenthLord],
        strength: arePlanetsConjunct(ninthLordData, tenthLordData) ? 'strong' : 'moderate',
      });
    }
  }

  // -- Parivartana Yoga (Mutual Exchange of Signs) --
  // BPHS Ch. 28: When two planets occupy each other's signs
  const planetList = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  for (let i = 0; i < planetList.length; i++) {
    for (let j = i + 1; j < planetList.length; j++) {
      const p1 = planetList[i];
      const p2 = planetList[j];
      const p1Data = positions[p1];
      const p2Data = positions[p2];
      if (!p1Data || !p2Data) continue;

      // Check if p1 is in p2's sign and p2 is in p1's sign
      const p1InP2Sign = signLords[p1Data.signIndex] === p2;
      const p2InP1Sign = signLords[p2Data.signIndex] === p1;

      if (p1InP2Sign && p2InP1Sign) {
        // Determine if this is a Maha (benefic), Khala (mixed), or Dainya (malefic) Parivartana
        const p1House = p1Data.house;
        const p2House = p2Data.house;
        const goodHousesSet = [1, 2, 4, 5, 7, 9, 10, 11];
        const badHousesSet = [6, 8, 12];
        const bothGood = goodHousesSet.includes(p1House) && goodHousesSet.includes(p2House);
        const anyBad = badHousesSet.includes(p1House) || badHousesSet.includes(p2House);

        if (bothGood) {
          yogas.push({
            name: 'Maha Parivartana Yoga',
            sanskrit: 'Mahā Parivartana Yoga',
            type: 'parivartana',
            description: `${p1} and ${p2} exchange signs — ${p1} is in ${p2}'s sign and ${p2} is in ${p1}'s sign.`,
            effects: 'A powerful mutual exchange between benefic houses. Both planets strengthen each other, producing results as if they were in their own signs. Brings prosperity, wisdom, and success in the areas governed by both houses.',
            planets: [p1, p2],
            strength: 'strong',
          });
        } else if (anyBad) {
          yogas.push({
            name: 'Dainya Parivartana Yoga',
            sanskrit: 'Dainya Parivartana Yoga',
            type: 'parivartana',
            description: `${p1} and ${p2} exchange signs, involving a dusthana house (6th, 8th, or 12th).`,
            effects: 'A challenging mutual exchange involving a difficult house. Initial struggles lead to eventual growth. The native must overcome obstacles related to both house significations before gaining mastery over them.',
            planets: [p1, p2],
            strength: 'weak',
          });
        }
      }
    }
  }

  // -- Kemdrum Yoga (No planet in 2nd or 12th from Moon) --
  // BPHS & Saravali: One of the most important negative yogas
  if (moon) {
    const secondFromMoonH = (moon.house % 12) + 1;
    const twelfthFromMoonH = ((moon.house - 2 + 12) % 12) + 1;
    let hasPlanetAdjacent = false;
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      const pData = positions[planet];
      if (pData && (pData.house === secondFromMoonH || pData.house === twelfthFromMoonH)) {
        hasPlanetAdjacent = true;
        break;
      }
    }
    // Kemdrum is cancelled if Moon is in Kendra from Lagna, or if Moon is conjunct/aspected by benefic
    const moonInKendra = isInKendra(moon.house);
    if (!hasPlanetAdjacent && !moonInKendra) {
      yogas.push({
        name: 'Kemdrum Yoga',
        sanskrit: 'Kemadruma Yoga',
        type: 'arishta',
        description: 'No planet (excluding Sun, Rahu, Ketu) occupies the 2nd or 12th house from Moon.',
        effects: 'Indicates periods of loneliness, financial difficulty, and emotional isolation. The native may face loss of wealth and reputation at certain life stages. However, self-made success is possible through personal effort. Remedies through Moon worship are highly recommended.',
        planets: ['Moon'],
        strength: 'moderate',
      });
    }
  }

  // -- Shakata Yoga (Jupiter in 6th/8th from Moon) --
  // Saravali Ch. 35: Jupiter in adverse position from Moon
  if (jupiter && moon) {
    const jupFromMoon = ((jupiter.signIndex - moon.signIndex + 12) % 12);
    if (jupFromMoon === 5 || jupFromMoon === 7) { // 6th or 8th from Moon (0-indexed: 5 or 7)
      // Cancelled if Jupiter is in Kendra from Lagna
      if (!isInKendra(jupiter.house)) {
        yogas.push({
          name: 'Shakata Yoga',
          sanskrit: 'Śakaṭa Yoga',
          type: 'arishta',
          description: `Jupiter is in the ${jupFromMoon === 5 ? '6th' : '8th'} sign from Moon, forming Shakata Yoga.`,
          effects: 'Indicates fluctuations in fortune — periods of prosperity followed by loss, like a cart wheel going up and down. The native experiences instability in wealth and status. Consistent effort and Jupiter remedies help stabilize the effects.',
          planets: ['Jupiter', 'Moon'],
          strength: 'moderate',
        });
      }
    }
  }

  // -- Guru Chandal Yoga (Jupiter + Rahu/Ketu conjunction) --
  // BPHS: Jupiter afflicted by nodes
  const rahu = positions['Rahu'];
  const ketu = positions['Ketu'];
  if (jupiter && rahu && arePlanetsConjunct(jupiter, rahu)) {
    yogas.push({
      name: 'Guru Chandal Yoga',
      sanskrit: 'Guru Chāṇḍāla Yoga',
      type: 'arishta',
      description: 'Jupiter and Rahu are conjunct in the same sign.',
      effects: 'The native may face confusion in matters of dharma and wisdom. Unconventional beliefs, challenges with teachers or gurus, and misguided spirituality are possible. However, if Jupiter is strong, this can give success in foreign lands and through innovative thinking. Jupiter remedies are essential.',
      planets: ['Jupiter', 'Rahu'],
      strength: jupiter.house === 1 || jupiter.house === 5 || jupiter.house === 9 ? 'weak' : 'moderate',
    });
  }
  if (jupiter && ketu && arePlanetsConjunct(jupiter, ketu)) {
    yogas.push({
      name: 'Guru Chandal Yoga',
      sanskrit: 'Guru Chāṇḍāla Yoga',
      type: 'arishta',
      description: 'Jupiter and Ketu are conjunct in the same sign.',
      effects: 'Ketu with Jupiter creates detachment from conventional wisdom and can lead to deep spiritual insight. The native may reject orthodox learning in favor of esoteric knowledge. While spiritually beneficial, material progress may face obstacles. Balance spiritual pursuits with worldly duties.',
      planets: ['Jupiter', 'Ketu'],
      strength: 'weak',
    });
  }

  // -- Grahan Yoga (Sun/Moon with Rahu/Ketu — Eclipse Yoga) --
  if (sun && rahu && arePlanetsConjunct(sun, rahu)) {
    yogas.push({
      name: 'Surya Grahan Yoga',
      sanskrit: 'Sūrya Grahaṇa Yoga',
      type: 'arishta',
      description: 'Sun is conjunct Rahu, forming a solar eclipse combination.',
      effects: 'The father may face challenges, and the native\'s ego and self-confidence may be undermined. Authority figures may create obstacles. However, this combination can also give success in foreign lands, politics, and unconventional fields. Surya worship is the primary remedy.',
      planets: ['Sun', 'Rahu'],
      strength: sun.house === 1 || sun.house === 10 ? 'moderate' : 'weak',
    });
  }
  if (moon && rahu && arePlanetsConjunct(moon, rahu)) {
    yogas.push({
      name: 'Chandra Grahan Yoga',
      sanskrit: 'Chandra Grahaṇa Yoga',
      type: 'arishta',
      description: 'Moon is conjunct Rahu, forming a lunar eclipse combination.',
      effects: 'The mind may experience anxiety, restlessness, and emotional confusion. The mother may face health issues. However, this gives strong intuition, psychic abilities, and success in fields involving the masses. Chandra worship and meditation are essential remedies.',
      planets: ['Moon', 'Rahu'],
      strength: 'moderate',
    });
  }

  // -- Shubha Kartari Yoga (Benefics flanking a house) --
  // Benefics in 2nd and 12th from Lagna
  const beneficPlanets = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const house2Occupants = beneficPlanets.filter(b => positions[b]?.house === 2);
  const house12Occupants = beneficPlanets.filter(b => positions[b]?.house === 12);
  if (house2Occupants.length > 0 && house12Occupants.length > 0) {
    yogas.push({
      name: 'Shubha Kartari Yoga',
      sanskrit: 'Śubha Kartarī Yoga',
      type: 'special',
      description: 'Benefic planets flank the Ascendant from the 2nd and 12th houses.',
      effects: 'The native is protected and supported throughout life. Good health, pleasant personality, and fortunate circumstances surround the individual. Like being enclosed in a protective cocoon of benefic energy.',
      planets: [...house2Occupants, ...house12Occupants],
      strength: 'strong',
    });
  }

  // -- Papa Kartari Yoga (Malefics flanking a house) --
  const maleficPlanets = ['Mars', 'Saturn', 'Rahu', 'Ketu'];
  const house2Malefics = maleficPlanets.filter(m => positions[m]?.house === 2);
  const house12Malefics = maleficPlanets.filter(m => positions[m]?.house === 12);
  if (house2Malefics.length > 0 && house12Malefics.length > 0) {
    yogas.push({
      name: 'Papa Kartari Yoga',
      sanskrit: 'Pāpa Kartarī Yoga',
      type: 'arishta',
      description: 'Malefic planets hem in the Ascendant from the 2nd and 12th houses.',
      effects: 'The native faces obstacles, health challenges, and restrictions in self-expression. Life feels constrained at times, and progress requires extra effort. Spiritual practices and remedies for the afflicting planets provide relief.',
      planets: [...house2Malefics, ...house12Malefics],
      strength: 'moderate',
    });
  }

  // -- Chandra-Adhi Yoga (Jupiter, Venus, Mercury in 6th, 7th, 8th from Moon) --
  // Already covered by Adhi Yoga above, but let's add the strong variant

  // -- Vasumati Yoga (All benefics in Upachaya houses 3, 6, 10, 11) --
  // Saravali: Great wealth yoga
  const upachayaHouses = [3, 6, 10, 11];
  const beneficsInUpachaya = beneficPlanets.filter(b => {
    const bData = positions[b];
    return bData && upachayaHouses.includes(bData.house);
  });
  if (beneficsInUpachaya.length >= 3) {
    yogas.push({
      name: 'Vasumati Yoga',
      sanskrit: 'Vasumatī Yoga',
      type: 'dhana',
      description: `Benefic planets (${beneficsInUpachaya.join(', ')}) are placed in Upachaya houses (3rd, 6th, 10th, 11th).`,
      effects: 'Grants ever-increasing wealth and prosperity. The native accumulates substantial resources through personal effort. Financial position improves with age. The native commands respect through material success.',
      planets: beneficsInUpachaya,
      strength: beneficsInUpachaya.length >= 4 ? 'strong' : 'moderate',
    });
  }

  // -- Nabhasa Yogas: Rajju Yoga (All planets in moveable signs) --
  // Saravali Ch. 33
  const signQualities: Record<number, string> = {
    0: 'moveable', 1: 'fixed', 2: 'dual', 3: 'moveable', 4: 'fixed', 5: 'dual',
    6: 'moveable', 7: 'fixed', 8: 'dual', 9: 'moveable', 10: 'fixed', 11: 'dual',
  };

  const allPlanetSigns = mainPlanets.map(p => positions[p]?.signIndex).filter((s): s is number => s !== undefined);
  const allQualities = allPlanetSigns.map(s => signQualities[s]);

  if (allQualities.length >= 7 && allQualities.every(q => q === 'moveable')) {
    yogas.push({
      name: 'Rajju Yoga (Nabhasa)',
      sanskrit: 'Rajju Yoga',
      type: 'nabhasa',
      description: 'All seven planets are placed in moveable (cardinal) signs — Aries, Cancer, Libra, Capricorn.',
      effects: 'The native loves to travel, is fond of foreign countries, and has a restless disposition. Success comes through movement, change, and adaptability. The native may frequently change residence or profession.',
      planets: mainPlanets,
      strength: 'moderate',
    });
  } else if (allQualities.length >= 7 && allQualities.every(q => q === 'fixed')) {
    yogas.push({
      name: 'Musala Yoga (Nabhasa)',
      sanskrit: 'Mūsala Yoga',
      type: 'nabhasa',
      description: 'All seven planets are placed in fixed signs — Taurus, Leo, Scorpio, Aquarius.',
      effects: 'The native is steady, proud, wealthy, and learned. They have a stable disposition and accumulate lasting wealth. Success comes through persistence and patience. The native commands respect through consistent behavior.',
      planets: mainPlanets,
      strength: 'moderate',
    });
  } else if (allQualities.length >= 7 && allQualities.every(q => q === 'dual')) {
    yogas.push({
      name: 'Nala Yoga (Nabhasa)',
      sanskrit: 'Nala Yoga',
      type: 'nabhasa',
      description: 'All seven planets are placed in dual (mutable) signs — Gemini, Virgo, Sagittarius, Pisces.',
      effects: 'The native is skilled in many arts, attractive in appearance, and possesses fluctuating fortunes. Success comes through versatility and adaptability. The native excels in multiple fields but may lack single-minded focus.',
      planets: mainPlanets,
      strength: 'moderate',
    });
  }

  // -- Nabhasa: Kamala Yoga (All planets in Kendra houses) --
  const allInKendra = mainPlanets.every(p => {
    const pData = positions[p];
    return pData && isInKendra(pData.house);
  });
  if (allInKendra) {
    yogas.push({
      name: 'Kamala Yoga (Nabhasa)',
      sanskrit: 'Kamala Yoga',
      type: 'nabhasa',
      description: 'All seven planets occupy Kendra houses (1st, 4th, 7th, 10th).',
      effects: 'An extremely rare and powerful yoga. The native is virtuous like a king, famous throughout the land, long-lived, and enjoys all comforts. Equivalent to being born under the most auspicious of celestial configurations.',
      planets: mainPlanets,
      strength: 'strong',
    });
  }

  // -- Nabhasa: Gada Yoga (Planets only in two consecutive Kendras) --
  // Check if all planets are in exactly 2 adjacent Kendras
  const occupiedKendras = [...new Set(mainPlanets.map(p => positions[p]?.house).filter(h => h !== undefined && isInKendra(h)))];
  if (occupiedKendras.length === 2) {
    yogas.push({
      name: 'Gada Yoga (Nabhasa)',
      sanskrit: 'Gadā Yoga',
      type: 'nabhasa',
      description: `All planets are concentrated in two Kendra houses (${occupiedKendras.join(' and ')}).`,
      effects: 'The native is wealthy, engaged in religious rites and sacrifices, and skilled in music and arts. They obtain income through their effort and expertise. Focus of energy creates concentrated results.',
      planets: mainPlanets.filter(p => occupiedKendras.includes(positions[p]?.house)),
      strength: 'moderate',
    });
  }

  // -- Daridra Yoga (Lord of 11th in 6th/8th/12th) --
  // BPHS: Poverty combination
  const eleventhLordData = positions[eleventhLord];
  if (eleventhLordData && [6, 8, 12].includes(eleventhLordData.house)) {
    yogas.push({
      name: 'Daridra Yoga',
      sanskrit: 'Dāridra Yoga',
      type: 'arishta',
      description: `The 11th lord (${eleventhLord}) is placed in the ${eleventhLordData.house}th house (a dusthana).`,
      effects: 'Indicates obstacles in income and gains. Financial setbacks, unfulfilled desires, and difficulties with elder siblings are possible. The native should cultivate patience in financial matters and pursue multiple income sources. Remedies for the 11th lord planet are recommended.',
      planets: [eleventhLord],
      strength: 'weak',
    });
  }

  // -- Duryoga (Lord of 10th in 6th/8th/12th) --
  // BPHS: Career difficulty
  if (tenthLordData && [6, 8, 12].includes(tenthLordData.house)) {
    // But 10th lord in 6th can also form Viparita-type benefits in competition
    if (tenthLordData.house !== 6) { // 6th house placement can be good for competitive careers
      yogas.push({
        name: 'Duryoga',
        sanskrit: 'Duryoga',
        type: 'arishta',
        description: `The 10th lord (${tenthLord}) is placed in the ${tenthLordData.house}th house.`,
        effects: 'The native may face challenges in career establishment, frequent job changes, or difficulty gaining recognition. However, this placement can give success in healing, research, or spiritual professions. Patience in career matters is essential.',
        planets: [tenthLord],
        strength: 'weak',
      });
    }
  }

  // -- Sunapha/Anapha/Durudhara Yoga trio --
  // Durudhara Yoga (planets on BOTH sides of Moon, excluding Sun)
  if (moon) {
    const secondFromMoonCheck = (moon.house % 12) + 1;
    const twelfthFromMoonCheck = ((moon.house - 2 + 12) % 12) + 1;
    let hasSecondFMoon = false, hasTwelfthFMoon = false;
    const durudharaPlanets: string[] = [];
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      const pData = positions[planet];
      if (pData) {
        if (pData.house === secondFromMoonCheck) { hasSecondFMoon = true; durudharaPlanets.push(planet); }
        if (pData.house === twelfthFromMoonCheck) { hasTwelfthFMoon = true; durudharaPlanets.push(planet); }
      }
    }
    if (hasSecondFMoon && hasTwelfthFMoon) {
      yogas.push({
        name: 'Durudhara Yoga',
        sanskrit: 'Durūdhara Yoga',
        type: 'lunar',
        description: 'Planets (excluding Sun, Rahu, Ketu) occupy both the 2nd and 12th houses from Moon.',
        effects: 'The native enjoys wealth, conveyances, and a good reputation. They are generous, charitable, and surrounded by loyal servants and friends. This yoga protects the Moon and enhances mental stability and material prosperity.',
        planets: ['Moon', ...durudharaPlanets],
        strength: 'strong',
      });
    }
  }

  // -- Chaturmukha Yoga (Jupiter in Kendra, all benefics aspect Lagna) --
  // BPHS: Rare benefic combination
  if (jupiter && isInKendra(jupiter.house)) {
    let beneficAspectsOnLagna = 0;
    for (const b of ['Jupiter', 'Venus', 'Mercury']) {
      const bData = positions[b];
      if (bData) {
        const aspected = getAspectedHousesForYoga(b, bData.house);
        if (aspected.includes(1) || bData.house === 1) beneficAspectsOnLagna++;
      }
    }
    if (beneficAspectsOnLagna >= 2) {
      yogas.push({
        name: 'Chaturmukha Yoga',
        sanskrit: 'Chaturmukha Yoga',
        type: 'special',
        description: 'Jupiter is in a Kendra and multiple benefics aspect or occupy the Ascendant.',
        effects: 'The native is blessed like Lord Brahma (four-faced). They are learned, wealthy, generous, and long-lived. They command respect from scholars and kings alike, and their speech is authoritative.',
        planets: ['Jupiter'],
        strength: 'strong',
      });
    }
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

// Helper: Get houses aspected by a planet (used for yoga detection)
function getAspectedHousesForYoga(planet: string, fromHouse: number): number[] {
  const houses: number[] = [];
  const wrap = (h: number): number => ((h - 1) % 12 + 12) % 12 + 1;
  houses.push(wrap(fromHouse + 7));
  switch (planet) {
    case 'Mars': houses.push(wrap(fromHouse + 4)); houses.push(wrap(fromHouse + 8)); break;
    case 'Jupiter': houses.push(wrap(fromHouse + 5)); houses.push(wrap(fromHouse + 9)); break;
    case 'Saturn': houses.push(wrap(fromHouse + 3)); houses.push(wrap(fromHouse + 10)); break;
  }
  return houses;
}

function strengthValue(s: 'strong' | 'moderate' | 'weak'): number {
  return s === 'strong' ? 3 : s === 'moderate' ? 2 : 1;
}
