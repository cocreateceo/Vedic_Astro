/**
 * Gemstone Recommendation Engine
 * Based on Vedic gemology (Ratna Shastra) and BPHS
 *
 * Recommends gemstones based on ascendant lord and functional benefic planets.
 */

import { GemstoneRecommendation } from '@/types';
import { functionalBeneficsMap, signLords as signLordsArr } from '@/lib/vedic-constants';

interface PlanetData {
  sign: string;
  signIndex: number;
  house: number;
  degree: string;
  retrograde: boolean;
}

type PlanetPositions = Record<string, PlanetData>;

const signLords: Record<number, string> = Object.fromEntries(signLordsArr.map((lord, i) => [i, lord]));

const exaltationSigns: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
};

const debilitationSigns: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0,
};

interface GemData {
  primary: string;
  alternative: string;
  weight: string;
  metal: string;
  finger: string;
  day: string;
  mantra: string;
  precautions: string[];
}

const planetGems: Record<string, GemData> = {
  Sun: {
    primary: 'Ruby (Manik)',
    alternative: 'Red Garnet or Red Spinel',
    weight: '3-6 carats',
    metal: 'Gold',
    finger: 'Ring finger (right hand)',
    day: 'Sunday morning during Shukla Paksha',
    mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    precautions: [
      'Avoid if Sun is the most malefic planet for your ascendant',
      'Best worn during Sun Mahadasha or Antardasha',
      'Remove if you experience headaches or excessive heat',
      'Should not be worn with Blue Sapphire or Diamond',
    ],
  },
  Moon: {
    primary: 'Pearl (Moti)',
    alternative: 'Moonstone or White Coral',
    weight: '4-7 carats',
    metal: 'Silver',
    finger: 'Little finger or ring finger (right hand)',
    day: 'Monday morning during Shukla Paksha',
    mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    precautions: [
      'Avoid if Moon is severely afflicted by Saturn or Rahu',
      'Best for emotional balance and mental peace',
      'Natural pearl is preferred over cultured pearl',
      'Should be set so it touches the skin',
    ],
  },
  Mars: {
    primary: 'Red Coral (Moonga)',
    alternative: 'Carnelian or Red Jasper',
    weight: '5-9 carats',
    metal: 'Gold or Copper',
    finger: 'Ring finger (right hand)',
    day: 'Tuesday morning during Shukla Paksha',
    mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
    precautions: [
      'Avoid if Mars causes Mangal Dosha with severe effects',
      'Best for improving courage, property, and vitality',
      'Italian coral (Moonga) is considered best quality',
      'Should not be worn with Emerald or Blue Sapphire',
    ],
  },
  Mercury: {
    primary: 'Emerald (Panna)',
    alternative: 'Green Tourmaline or Peridot',
    weight: '3-6 carats',
    metal: 'Gold',
    finger: 'Little finger (right hand)',
    day: 'Wednesday morning during Shukla Paksha',
    mantra: 'Om Braam Breem Braum Sah Budhaya Namah',
    precautions: [
      'Colombian or Zambian emeralds are preferred',
      'Best for improving intellect, communication, and business',
      'Avoid if Mercury is combust (too close to Sun)',
      'Should not be worn with Red Coral',
    ],
  },
  Jupiter: {
    primary: 'Yellow Sapphire (Pukhraj)',
    alternative: 'Citrine or Yellow Topaz',
    weight: '3-5 carats',
    metal: 'Gold',
    finger: 'Index finger (right hand)',
    day: 'Thursday morning during Shukla Paksha',
    mantra: 'Om Graam Greem Graum Sah Gurave Namah',
    precautions: [
      'Ceylon (Sri Lankan) sapphires are considered best',
      'Best for wisdom, marriage, children, and prosperity',
      'Avoid if Jupiter is the most malefic for your ascendant',
      'Should be flawless and eye-clean for best results',
    ],
  },
  Venus: {
    primary: 'Diamond (Heera)',
    alternative: 'White Sapphire or Zircon',
    weight: '0.5-1.5 carats',
    metal: 'Platinum or White Gold',
    finger: 'Middle finger or ring finger (right hand)',
    day: 'Friday morning during Shukla Paksha',
    mantra: 'Om Draam Dreem Draum Sah Shukraya Namah',
    precautions: [
      'Quality matters more than size for diamonds',
      'Best for love, luxury, arts, and marriage harmony',
      'Should not be worn with Ruby or Red Coral',
      'Avoid if Venus is the most malefic for your ascendant',
    ],
  },
  Saturn: {
    primary: 'Blue Sapphire (Neelam)',
    alternative: 'Amethyst or Iolite',
    weight: '3-5 carats',
    metal: 'Silver or Iron (Panchdhatu)',
    finger: 'Middle finger (right hand)',
    day: 'Saturday evening during Shukla Paksha',
    mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah',
    precautions: [
      'MUST test for 3 days before wearing permanently',
      'Most powerful gemstone — can have dramatic effects',
      'Best for career, discipline, longevity, and protection',
      'Should not be worn with Ruby, Red Coral, or Pearl',
      'Discontinue immediately if you experience bad dreams or accidents during trial',
    ],
  },
  Rahu: {
    primary: 'Hessonite Garnet (Gomed)',
    alternative: 'Orange Zircon',
    weight: '5-7 carats',
    metal: 'Silver or Ashtadhatu (8-metal alloy)',
    finger: 'Middle finger (right hand)',
    day: 'Saturday evening during Krishna Paksha',
    mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah',
    precautions: [
      'Sri Lankan Gomed is considered best quality',
      'Best for overcoming Rahu-related obstacles',
      'Should not be worn with Ruby, Pearl, or Red Coral',
      'Trial period of 3 days recommended before permanent wearing',
    ],
  },
  Ketu: {
    primary: "Cat's Eye (Lehsunia/Vaidurya)",
    alternative: 'Tiger Eye or Chrysoberyl',
    weight: '3-5 carats',
    metal: 'Silver or Gold',
    finger: 'Little finger or middle finger (right hand)',
    day: 'Thursday or Tuesday during Krishna Paksha',
    mantra: 'Om Shram Shreem Shroum Sah Ketave Namah',
    precautions: [
      "Chrysoberyl Cat's Eye is the best variety",
      'Must show clear chatoyancy (cat eye effect)',
      'Best for spiritual growth and protection from accidents',
      'Should not be worn with Diamond or Emerald',
      'Trial period of 3 days recommended',
    ],
  },
};

const functionalBenefics = functionalBeneficsMap;

function calculatePlanetStrength(planet: string, data: PlanetData): number {
  let strength = 50; // baseline

  // Exalted = very strong
  if (exaltationSigns[planet] === data.signIndex) strength += 30;
  // Own sign = strong
  else if (signLords[data.signIndex] === planet) strength += 20;
  // Debilitated = very weak
  else if (debilitationSigns[planet] === data.signIndex) strength -= 30;

  // In Kendra = strong
  if ([1, 4, 7, 10].includes(data.house)) strength += 10;
  // In Trikona = good
  if ([5, 9].includes(data.house)) strength += 8;
  // In dusthana = weak
  if ([6, 8, 12].includes(data.house)) strength -= 15;
  // In 2nd or 11th = moderate gain
  if ([2, 11].includes(data.house)) strength += 5;

  // Retrograde planets are considered strong in Vedic astrology
  if (data.retrograde) strength += 5;

  return Math.max(0, Math.min(100, strength));
}

export function recommendGemstones(
  positions: PlanetPositions,
  ascendantSignIndex: number
): GemstoneRecommendation[] {
  const benefics = functionalBenefics[ascendantSignIndex] || [];
  const ascLord = signLords[ascendantSignIndex];

  // Calculate strength of each benefic planet
  const planetStrengths: { planet: string; strength: number }[] = [];
  for (const planet of benefics) {
    const pData = positions[planet];
    if (!pData) continue;
    // Skip Rahu/Ketu from main recommendations
    if (planet === 'Rahu' || planet === 'Ketu') continue;
    planetStrengths.push({ planet, strength: calculatePlanetStrength(planet, pData) });
  }

  // Sort by strength ascending (weakest first — they need the most help)
  planetStrengths.sort((a, b) => a.strength - b.strength);

  const recommendations: GemstoneRecommendation[] = [];

  // Primary recommendation: Ascendant lord's gemstone (always recommended)
  const ascLordData = positions[ascLord];
  if (ascLordData && planetGems[ascLord]) {
    const gem = planetGems[ascLord];
    recommendations.push({
      planet: ascLord,
      primaryGem: gem.primary,
      alternativeGem: gem.alternative,
      weight: gem.weight,
      metal: gem.metal,
      finger: gem.finger,
      startingDay: gem.day,
      mantra: gem.mantra,
      precautions: gem.precautions,
      reason: `${ascLord} is your Ascendant Lord. Strengthening it enhances overall health, personality, and life direction.`,
    });
  }

  // Secondary: weakest benefic (if different from ascendant lord)
  for (const ps of planetStrengths) {
    if (ps.planet === ascLord) continue;
    if (recommendations.length >= 3) break;
    const gem = planetGems[ps.planet];
    if (!gem) continue;
    recommendations.push({
      planet: ps.planet,
      primaryGem: gem.primary,
      alternativeGem: gem.alternative,
      weight: gem.weight,
      metal: gem.metal,
      finger: gem.finger,
      startingDay: gem.day,
      mantra: gem.mantra,
      precautions: gem.precautions,
      reason: `${ps.planet} is a functional benefic that is weak in your chart (strength: ${ps.strength}/100). Wearing its gemstone will boost the areas of life it governs.`,
    });
  }

  return recommendations;
}
