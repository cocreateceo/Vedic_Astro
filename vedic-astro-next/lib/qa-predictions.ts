import { VedicChart, LifeQuestion, YogaResult, DoshaResult, GemstoneRecommendation, DashaWithAntardasha } from '@/types';
import { isBeneficForAscendant, getMostMalefic } from './horoscope-data';
import { signNames, signLords } from '@/lib/vedic-constants';

// ---------------------------------------------------------------------------
// Sign Rulers (alias for shared constant)
// ---------------------------------------------------------------------------
const signRulers: Record<number, string> = Object.fromEntries(signLords.map((lord, i) => [i, lord]));

// Exaltation signs (sign index where planet is exalted)
const exaltation: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7,
};

// Debilitation signs
const debilitation: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 1,
};

function isExalted(planet: string, signIndex: number): boolean {
  return exaltation[planet] === signIndex;
}

function isDebilitated(planet: string, signIndex: number): boolean {
  return debilitation[planet] === signIndex;
}

function isOwnSign(planet: string, signIndex: number): boolean {
  return signRulers[signIndex] === planet;
}

function getHouseLord(chart: VedicChart, houseNum: number): string {
  const ascIdx = chart.ascendant.index;
  const houseSignIndex = (ascIdx + houseNum - 1) % 12;
  return signRulers[houseSignIndex];
}

function getLordHouse(chart: VedicChart, planet: string): number {
  const p = chart.planets[planet];
  return p ? p.house : 1;
}

function getPlanetsInHouse(chart: VedicChart, houseNum: number): string[] {
  return Object.entries(chart.planets)
    .filter(([, p]) => p.house === houseNum)
    .map(([name]) => name);
}

function planetStrength(chart: VedicChart, planet: string): 'strong' | 'moderate' | 'weak' {
  const p = chart.planets[planet];
  if (!p) return 'moderate';
  if (isExalted(planet, p.signIndex)) return 'strong';
  if (isOwnSign(planet, p.signIndex)) return 'strong';
  if (isDebilitated(planet, p.signIndex)) return 'weak';
  return 'moderate';
}

function beneficCount(chart: VedicChart, houseNum: number): number {
  const planets = getPlanetsInHouse(chart, houseNum);
  return planets.filter(p => isBeneficForAscendant(p, chart.ascendant.index)).length;
}

// Helper to get ordinal suffix
function ordinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

// ---------------------------------------------------------------------------
// 15 Life Questions Generators
// ---------------------------------------------------------------------------

function generateFameAnswer(chart: VedicChart, yogas?: YogaResult[]): LifeQuestion {
  const lord10 = getHouseLord(chart, 10);
  const lord10House = getLordHouse(chart, lord10);
  const planetsIn10 = getPlanetsInHouse(chart, 10);
  const sunStrength = planetStrength(chart, 'Sun');
  const ascName = chart.ascendant.name;
  const rajaYogas = yogas?.filter(y => y.type === 'raja') || [];
  const beneficYogas = yogas?.filter(y => y.strength === 'strong') || [];

  let answer = `Based on your ${ascName} ascendant, `;

  // 10th lord analysis
  if (lord10House === 1 || lord10House === 10) {
    answer += `the 10th lord ${lord10} is strongly placed in the ${ordinal(lord10House)} house, which is a powerful indicator of fame and public recognition. You are destined to be known for your professional achievements. `;
  } else if ([4, 5, 7, 9].includes(lord10House)) {
    answer += `the 10th lord ${lord10} placed in the ${ordinal(lord10House)} house indicates good potential for recognition through ${lord10House === 4 ? 'academic or domestic achievements' : lord10House === 5 ? 'creative endeavors and intellectual pursuits' : lord10House === 7 ? 'partnerships and public dealings' : 'righteous deeds and higher learning'}. `;
  } else if ([6, 8, 12].includes(lord10House)) {
    answer += `the 10th lord ${lord10} in the ${ordinal(lord10House)} house suggests fame may come after overcoming significant obstacles. Recognition arrives later in life through perseverance. `;
  } else {
    answer += `the 10th lord ${lord10} in the ${ordinal(lord10House)} house indicates a steady path to recognition through ${lord10House === 2 ? 'accumulated wealth and eloquence' : lord10House === 3 ? 'communication and courage' : 'social networks and aspirations'}. `;
  }

  // Planets in 10th
  if (planetsIn10.length > 0) {
    answer += `The presence of ${planetsIn10.join(' and ')} in your 10th house ${planetsIn10.includes('Sun') ? 'strongly favors government positions and authority' : planetsIn10.includes('Jupiter') ? 'blesses you with wisdom-based recognition and respect from scholars' : planetsIn10.includes('Saturn') ? 'indicates fame through discipline, hard work, and sustained effort' : 'adds significant energy to your public image'}. `;
  }

  // Sun strength
  if (sunStrength === 'strong') {
    answer += 'Your Sun is in a position of strength, indicating natural authority, leadership ability, and the potential to shine in public life. ';
  } else if (sunStrength === 'weak') {
    answer += 'Your Sun needs strengthening — consider worshiping Lord Surya on Sundays and wearing a Ruby gemstone after consulting an astrologer. ';
  }

  // Yogas
  if (rajaYogas.length > 0) {
    answer += `The presence of ${rajaYogas.map(y => y.name).join(', ')} in your chart is a strong indicator of fame, power, and authority. ${rajaYogas.length > 1 ? 'Multiple Raja Yogas significantly enhance your potential for public recognition.' : ''}`;
  }
  if (beneficYogas.length > 2) {
    answer += ` With ${beneficYogas.length} strong yogas in your chart, your prospects for fame and recognition are notably enhanced.`;
  }

  return {
    question: 'Will I become famous? What is my potential for public recognition?',
    answer: answer.trim(),
    category: 'Fame',
    relevantHouses: [1, 10],
    relevantPlanets: ['Sun', lord10, ...planetsIn10],
  };
}

function generateWealthAnswer(chart: VedicChart, yogas?: YogaResult[]): LifeQuestion {
  const lord2 = getHouseLord(chart, 2);
  const lord11 = getHouseLord(chart, 11);
  const lord2House = getLordHouse(chart, lord2);
  const lord11House = getLordHouse(chart, lord11);
  const jupStrength = planetStrength(chart, 'Jupiter');
  const planetsIn2 = getPlanetsInHouse(chart, 2);
  const planetsIn11 = getPlanetsInHouse(chart, 11);
  const dhanaYogas = yogas?.filter(y => y.type === 'dhana') || [];
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, wealth prospects are analyzed through the 2nd house (accumulated wealth) and 11th house (gains). `;

  // 2nd lord
  if ([1, 2, 5, 9, 10, 11].includes(lord2House)) {
    answer += `Your 2nd lord ${lord2} is well-placed in the ${ordinal(lord2House)} house, indicating strong potential for wealth accumulation. `;
  } else if ([6, 8, 12].includes(lord2House)) {
    answer += `The 2nd lord ${lord2} in the ${ordinal(lord2House)} house suggests some challenges in retaining wealth. Financial discipline and careful investments are advised. `;
  } else {
    answer += `The 2nd lord ${lord2} in the ${ordinal(lord2House)} house gives moderate wealth potential with steady growth over time. `;
  }

  // 11th lord
  if ([1, 2, 5, 9, 10, 11].includes(lord11House)) {
    answer += `The 11th lord ${lord11} in the ${ordinal(lord11House)} house is excellent for gains — you will receive income from multiple sources and build a strong financial network. `;
  } else {
    answer += `The 11th lord ${lord11} in the ${ordinal(lord11House)} house indicates gains that require consistent effort. `;
  }

  // Jupiter
  if (jupStrength === 'strong') {
    answer += 'Jupiter, the planet of wealth and expansion, is in a strong position in your chart, bringing prosperity, good fortune, and timely financial opportunities. ';
  } else if (jupStrength === 'weak') {
    answer += 'Jupiter is in a challenged position, so wearing a Yellow Sapphire and chanting Jupiter mantras on Thursdays can strengthen your wealth prospects. ';
  }

  // Planets in wealth houses
  if (planetsIn2.length > 0) {
    answer += `${planetsIn2.join(' and ')} in the 2nd house ${planetsIn2.includes('Moon') ? 'blesses you with wealth, good speech, and romantic nature' : planetsIn2.includes('Jupiter') ? 'is a powerful indicator of inherited wealth and financial wisdom' : 'contributes to your financial picture'}. `;
  }
  if (planetsIn11.length > 0) {
    answer += `${planetsIn11.join(' and ')} in the 11th house ${planetsIn11.includes('Rahu') ? 'indicates unconventional but substantial gains and financial ambition' : 'enhances your earning potential'}. `;
  }

  // Dhana yogas
  if (dhanaYogas.length > 0) {
    answer += `The presence of ${dhanaYogas.map(y => y.name).join(', ')} in your chart specifically indicates wealth accumulation and financial prosperity.`;
  }

  return {
    question: 'When can I make more money and grow in my career?',
    answer: answer.trim(),
    category: 'Wealth',
    relevantHouses: [2, 11],
    relevantPlanets: ['Jupiter', lord2, lord11],
  };
}

function generateDoshaAnswer(chart: VedicChart, doshas?: DoshaResult[]): LifeQuestion {
  const detected = doshas?.filter(d => d.detected) || [];
  const notDetected = doshas?.filter(d => !d.detected) || [];
  const ascName = chart.ascendant.name;

  let answer = `Based on your ${ascName} ascendant birth chart analysis: `;

  if (detected.length === 0) {
    answer += 'No major doshas have been detected in your horoscope. This is a fortunate indication, as the absence of doshas means fewer obstructions in the natural flow of planetary energies. Your chart is relatively well-balanced, and you can focus on strengthening your existing positive yogas for maximum benefit.';
  } else {
    detected.forEach(d => {
      answer += `\n\n${d.name} (${d.severity} severity): ${d.details || d.description} `;
      if (d.remedies.length > 0) {
        answer += `To reduce the negative effects: ${d.remedies.slice(0, 3).join('; ')}. `;
      }
    });
    if (notDetected.length > 0) {
      answer += `\n\nFortunately, ${notDetected.map(d => d.name).join(', ')} ${notDetected.length === 1 ? 'is' : 'are'} not present in your horoscope, so no remedies are required for ${notDetected.length === 1 ? 'this' : 'these'}.`;
    }
  }

  return {
    question: 'Do I have any doshas, and how can I reduce the negative effects?',
    answer: answer.trim(),
    category: 'Doshas',
    relevantHouses: [1, 7, 8],
    relevantPlanets: ['Mars', 'Rahu', 'Ketu', 'Saturn'],
  };
}

function generateGemstoneAnswer(chart: VedicChart, gemstones?: GemstoneRecommendation[]): LifeQuestion {
  if (!gemstones || gemstones.length === 0) {
    return {
      question: 'Which gemstones should I wear?',
      answer: `Based on your ${chart.ascendant.name} ascendant, a detailed gemstone analysis requires evaluating the Shadbala strength of all planets. Consult a qualified astrologer for personalized gemstone recommendations based on your current Dasha period.`,
      category: 'Gemstones',
      relevantHouses: [1, 9],
      relevantPlanets: [],
    };
  }

  let answer = `Based on the planetary strengths in your ${chart.ascendant.name} ascendant chart, the recommended gemstones are:\n\n`;

  gemstones.forEach((g, i) => {
    answer += `${i + 1}. **${g.primaryGem}** for ${g.planet}: ${g.reason} `;
    answer += `Wear a ${g.weight} stone set in ${g.metal} on the ${g.finger}. Start wearing on a ${g.startingDay}, 15 minutes after sunrise. `;
    answer += `Alternative: ${g.alternativeGem}. `;
    if (g.precautions.length > 0) {
      answer += `Precautions: ${g.precautions[0]} `;
    }
    answer += '\n\n';
  });

  answer += 'Important: Purchase good quality, natural, untreated gemstones from dependable sources. Ensure the gem is set so that sunlight can pass through it. Recheck your prescription when your Dasha period changes.';

  return {
    question: 'Which gemstones should I wear, and what precautions should I take?',
    answer: answer.trim(),
    category: 'Gemstones',
    relevantHouses: [1, 5, 9],
    relevantPlanets: gemstones.map(g => g.planet),
  };
}

function generateSiblingsAnswer(chart: VedicChart): LifeQuestion {
  const lord3 = getHouseLord(chart, 3);
  const lord3House = getLordHouse(chart, lord3);
  const planetsIn3 = getPlanetsInHouse(chart, 3);
  const ascName = chart.ascendant.name;
  const marsStrength = planetStrength(chart, 'Mars');

  let answer = `For your ${ascName} ascendant, the 3rd house governs siblings, courage, and communication. `;

  if ([1, 3, 5, 9, 10, 11].includes(lord3House)) {
    answer += `The 3rd lord ${lord3} in the ${ordinal(lord3House)} house is well-placed, indicating harmonious relationships with siblings. You will receive support and cooperation from your brothers and sisters. `;
  } else if (lord3House === 6) {
    answer += `The 3rd lord ${lord3} in the 6th house suggests some difficulties in maintaining smooth relationships with siblings. There may be disagreements or rivalry, but you may receive unexpected help from maternal relatives. `;
  } else if ([8, 12].includes(lord3House)) {
    answer += `The 3rd lord ${lord3} in the ${ordinal(lord3House)} house indicates challenges in sibling relationships. Distance or separation from siblings is possible, but spiritual bonds remain strong. `;
  } else {
    answer += `The 3rd lord ${lord3} in the ${ordinal(lord3House)} house indicates a moderate relationship with siblings, with periodic closeness and distance. `;
  }

  if (planetsIn3.length > 0) {
    answer += `The presence of ${planetsIn3.join(' and ')} in your 3rd house `;
    if (planetsIn3.includes('Jupiter')) answer += 'brings wisdom and support from elder siblings. ';
    else if (planetsIn3.includes('Mars')) answer += 'gives you tremendous courage and a dynamic relationship with siblings. ';
    else if (planetsIn3.includes('Saturn')) answer += 'may create delays in sibling matters but gives perseverance. ';
    else answer += 'influences your communication style and relationships with siblings. ';
  }

  if (marsStrength === 'strong') {
    answer += 'Mars, the natural significator of siblings, is strong in your chart, indicating that your siblings will be influential and successful.';
  }

  return {
    question: 'What are the predictions about my relationship with my siblings?',
    answer: answer.trim(),
    category: 'Siblings',
    relevantHouses: [3],
    relevantPlanets: ['Mars', lord3, ...planetsIn3],
  };
}

function generateChallengingDashaAnswer(chart: VedicChart, dashas?: DashaWithAntardasha[]): LifeQuestion {
  const malefic = getMostMalefic(chart.ascendant.index);
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, `;

  if (dashas && dashas.length > 0) {
    const challenging = dashas.filter(d => d.rating === 'challenging' || d.rating === 'mixed');
    const current = dashas.find(d => d.isCurrent);

    if (challenging.length > 0) {
      const most = challenging[0];
      answer += `the ${most.planet} Mahadasha (${most.startYear}–${most.endYear}) is likely to be the most challenging period. ${most.ratingReason} `;
      if (challenging.length > 1) {
        answer += `Additionally, the ${challenging.slice(1).map(d => `${d.planet} period (${d.startYear}–${d.endYear})`).join(' and ')} may also bring difficulties. `;
      }
    } else {
      answer += `your Dasha periods are generally favorable. However, `;
    }

    if (current) {
      answer += `\n\nYou are currently in the ${current.planet} Mahadasha (${current.startYear}–${current.endYear}), rated as "${current.rating}". ${current.ratingReason} `;
    }
  } else {
    answer += `${malefic} is the most malefic planet for your ascendant. The Dasha period ruled by ${malefic} requires extra caution. `;
  }

  answer += `\n\nTo mitigate challenging periods: worship the deity associated with the ruling planet, perform charitable acts on the planet's day, chant the appropriate mantra daily, and avoid major financial decisions during weak sub-periods.`;

  return {
    question: 'In which Dasha will I face the most challenges, and what can I do?',
    answer: answer.trim(),
    category: 'Challenges',
    relevantHouses: [6, 8, 12],
    relevantPlanets: [malefic],
  };
}

function generatePropertyAnswer(chart: VedicChart): LifeQuestion {
  const lord4 = getHouseLord(chart, 4);
  const lord4House = getLordHouse(chart, lord4);
  const planetsIn4 = getPlanetsInHouse(chart, 4);
  const lord4Strength = planetStrength(chart, lord4);
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, the 4th house governs property, home, mother, vehicles, and general happiness. `;

  if ([1, 2, 4, 5, 9, 10, 11].includes(lord4House)) {
    answer += `The 4th lord ${lord4} placed in the ${ordinal(lord4House)} house is a positive indicator for property ownership. ${lord4House === 2 ? 'You will accumulate property and may inherit wealth through your mother.' : lord4House === 4 ? 'The lord in its own house strongly indicates owning a comfortable home.' : lord4House === 10 ? 'Your career success will directly lead to property acquisition.' : 'You have good potential to own land and property.'} `;
  } else if ([6, 8, 12].includes(lord4House)) {
    answer += `The 4th lord ${lord4} in the ${ordinal(lord4House)} house suggests some challenges in acquiring property. There may be delays or disputes, but persistent effort will eventually lead to property ownership. `;
  } else {
    answer += `The 4th lord ${lord4} in the ${ordinal(lord4House)} house gives moderate indications for property. Timing your purchase during favorable Dasha periods is key. `;
  }

  if (planetsIn4.length > 0) {
    answer += `${planetsIn4.join(' and ')} in your 4th house `;
    if (planetsIn4.includes('Venus')) answer += 'is excellent — Venus here blesses you with a beautiful home, good vehicles, and domestic harmony. ';
    else if (planetsIn4.includes('Moon')) answer += 'indicates strong emotional attachment to home and potential property through maternal connections. ';
    else if (planetsIn4.includes('Jupiter')) answer += 'is very auspicious for property, indicating spacious homes and academic success. ';
    else if (planetsIn4.includes('Mars')) answer += 'gives energy in property matters but beware of hasty decisions in real estate. ';
    else answer += 'influences your property and domestic affairs. ';
  }

  if (lord4Strength === 'strong') {
    answer += `Since ${lord4} is in a position of strength (${isExalted(lord4, chart.planets[lord4]?.signIndex) ? 'exalted' : 'in own sign'}), this is a very favorable indication for property ownership and domestic happiness.`;
  }

  return {
    question: 'Will I own a house? What are the indications for property?',
    answer: answer.trim(),
    category: 'Property',
    relevantHouses: [4],
    relevantPlanets: [lord4, ...planetsIn4],
  };
}

function generateMarriageAnswer(chart: VedicChart): LifeQuestion {
  const lord7 = getHouseLord(chart, 7);
  const lord7House = getLordHouse(chart, lord7);
  const planetsIn7 = getPlanetsInHouse(chart, 7);
  const venusStrength = planetStrength(chart, 'Venus');
  const jupiterAspects7 = chart.planets['Jupiter']?.house;
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, married life is analyzed through the 7th house (marriage and partnerships). `;

  if ([1, 4, 7, 9, 10].includes(lord7House)) {
    answer += `Your 7th lord ${lord7} is well-placed in the ${ordinal(lord7House)} house, indicating a ${lord7House === 4 ? 'charming and devoted spouse with a happy domestic life' : lord7House === 7 ? 'strong and loyal partner' : lord7House === 9 ? 'righteous, spiritually inclined spouse' : lord7House === 10 ? 'career-oriented partner who brings professional success' : 'loving marriage'}. `;
  } else if ([6, 8, 12].includes(lord7House)) {
    answer += `The 7th lord ${lord7} in the ${ordinal(lord7House)} house suggests some turbulence in married life. ${lord7House === 6 ? 'Disputes and disagreements need to be managed with patience.' : lord7House === 8 ? 'There may be unexpected events in marriage, but deep transformation strengthens the bond.' : 'Distance from spouse at times is possible, but spiritual growth through the relationship is indicated.'} `;
  } else {
    answer += `The 7th lord ${lord7} in the ${ordinal(lord7House)} house indicates a reasonably happy married life with ${lord7House === 2 ? 'a wealthy partner' : lord7House === 5 ? 'romance and creativity in the relationship' : 'mutual growth and understanding'}. `;
  }

  if (planetsIn7.length > 0) {
    planetsIn7.forEach(p => {
      if (p === 'Venus') answer += 'Venus in the 7th house is one of the best placements for marriage — your spouse will be attractive, loving, and you will enjoy a harmonious relationship. ';
      else if (p === 'Jupiter') answer += 'Jupiter in the 7th house brings a wise, educated spouse and blessings for a long-lasting marriage. ';
      else if (p === 'Mars') answer += 'Mars in the 7th house adds passion but requires patience — your partner may be assertive and independent. ';
      else if (p === 'Saturn') answer += 'Saturn in the 7th house may bring a mature or older partner, and the marriage strengthens over time. ';
      else if (p === 'Rahu') answer += 'Rahu in the 7th house may bring an unconventional or inter-cultural marriage. ';
    });
  }

  if (venusStrength === 'strong') {
    answer += 'Venus, the natural significator of marriage, is strong in your chart, ensuring romantic fulfillment and a beautiful relationship. ';
  }

  // Check Jupiter influence on Moon
  if (jupiterAspects7 !== undefined) {
    const jupHouse = chart.planets['Jupiter'].house;
    if ([1, 5, 7, 9].includes(jupHouse)) {
      answer += 'Jupiter\'s benefic influence on your chart indicates that your married life will generally be smooth and happy.';
    }
  }

  return {
    question: 'What will my married life be like?',
    answer: answer.trim(),
    category: 'Marriage',
    relevantHouses: [7],
    relevantPlanets: ['Venus', lord7, ...planetsIn7],
  };
}

function generateEducationAnswer(chart: VedicChart): LifeQuestion {
  const lord4 = getHouseLord(chart, 4);
  const lord5 = getHouseLord(chart, 5);
  const lord4House = getLordHouse(chart, lord4);
  const lord5House = getLordHouse(chart, lord5);
  const mercuryStrength = planetStrength(chart, 'Mercury');
  const planetsIn4 = getPlanetsInHouse(chart, 4);
  const planetsIn5 = getPlanetsInHouse(chart, 5);
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, education is analyzed through the 4th house (formal education) and 5th house (intelligence, higher learning). `;

  if ([1, 2, 4, 5, 9, 10].includes(lord4House)) {
    answer += `The 4th lord ${lord4} in the ${ordinal(lord4House)} house is favorable for academic success. ${lord4House === 2 ? 'You will gain wealth through education.' : lord4House === 5 ? 'Your educational achievements will be marked by creativity and intelligence.' : 'You are likely to complete your education successfully.'} `;
  } else {
    answer += `The 4th lord ${lord4} in the ${ordinal(lord4House)} house suggests you may need extra effort in formal education, but determination will bring results. `;
  }

  if ([1, 4, 5, 9, 10, 11].includes(lord5House)) {
    answer += `The 5th lord ${lord5} is well-placed in the ${ordinal(lord5House)} house, indicating sharp intelligence and the ability to excel in intellectual pursuits. `;
  } else {
    answer += `The 5th lord ${lord5} in the ${ordinal(lord5House)} house suggests developing your intellect requires focused effort. `;
  }

  if (mercuryStrength === 'strong') {
    answer += 'Mercury, the planet of intelligence and learning, is strong in your chart. This is an excellent indication for academic success, analytical ability, and communication skills. ';
  } else if (mercuryStrength === 'weak') {
    answer += 'Mercury needs strengthening — wearing an Emerald and chanting Mercury mantras on Wednesdays can improve intellectual clarity. ';
  }

  // Planets in education houses
  const eduPlanets = [...new Set([...planetsIn4, ...planetsIn5])];
  if (eduPlanets.length > 0) {
    if (eduPlanets.includes('Jupiter')) answer += 'Jupiter in your education houses brings wisdom, interest in philosophy, and potential for higher degrees. ';
    if (eduPlanets.includes('Mercury')) answer += 'Mercury here enhances analytical skills and suggests proficiency in mathematics, commerce, or technology. ';
    if (eduPlanets.includes('Venus')) answer += 'Venus indicates talent in arts, music, literature, and creative fields. ';
    if (eduPlanets.includes('Sun') || eduPlanets.includes('Ketu')) answer += 'You have special faculties that may express in unique or unconventional fields of study. ';
  }

  return {
    question: 'What challenges might I face in education? Should I pursue further studies?',
    answer: answer.trim(),
    category: 'Education',
    relevantHouses: [4, 5],
    relevantPlanets: ['Mercury', 'Jupiter', lord4, lord5],
  };
}

function generateCareerAnswer(chart: VedicChart): LifeQuestion {
  const lord10 = getHouseLord(chart, 10);
  const lord10House = getLordHouse(chart, lord10);
  const planetsIn10 = getPlanetsInHouse(chart, 10);
  const ascName = chart.ascendant.name;
  const lord10Sign = chart.planets[lord10]?.sign || '';

  let answer = `For your ${ascName} ascendant, your 10th house of career reveals: `;

  // 10th lord placement
  if (lord10House === 1) {
    answer += `The 10th lord ${lord10} in the 1st house makes you a career-oriented person. You are result-driven, and your career is closely tied to your personality. You will be learned, famous, and wealthy over time. `;
  } else if ([2, 11].includes(lord10House)) {
    answer += `The 10th lord ${lord10} in the ${ordinal(lord10House)} house connects your career directly to financial growth. You are talented in wealth-generating professions. `;
  } else if (lord10House === 7) {
    answer += `The 10th lord ${lord10} in the 7th house indicates success through partnerships, business collaborations, or a career involving public interactions. `;
  } else if ([5, 9].includes(lord10House)) {
    answer += `The 10th lord ${lord10} in the ${ordinal(lord10House)} house indicates a creative, fortune-blessed career path with opportunities in education, advisory, or spiritual domains. `;
  } else {
    answer += `The 10th lord ${lord10} in the ${ordinal(lord10House)} house shapes your career through ${lord10House === 3 ? 'communication, media, or entrepreneurial ventures' : lord10House === 4 ? 'real estate, education, or government' : lord10House === 6 ? 'service, healthcare, or competitive fields' : lord10House === 8 ? 'research, investigation, or occult sciences' : lord10House === 12 ? 'foreign lands, spirituality, or institutions' : 'steady professional effort'}. `;
  }

  // Planets in 10th
  if (planetsIn10.length > 0) {
    planetsIn10.forEach(p => {
      if (p === 'Sun') answer += 'Sun in the 10th is a powerful placement for government service, leadership, and authority. ';
      else if (p === 'Moon') answer += 'Moon here indicates a public-facing career, possibly in healthcare, hospitality, or counseling. ';
      else if (p === 'Mars') answer += 'Mars gives energy for engineering, military, sports, or surgical fields. ';
      else if (p === 'Mercury') answer += 'Mercury favors commerce, IT, writing, or analytical professions. ';
      else if (p === 'Jupiter') answer += 'Jupiter in the 10th is excellent for teaching, law, finance, or advisory roles. ';
      else if (p === 'Venus') answer += 'Venus indicates success in arts, entertainment, luxury goods, or beauty industries. ';
      else if (p === 'Saturn') answer += 'Saturn gives methodical success through hard work, mining, construction, or administration. ';
      else if (p === 'Rahu') answer += 'Rahu here indicates ambition for power, success in politics, technology, or unconventional careers. ';
    });
  }

  // Job vs Business guidance
  const saturnIn10 = planetsIn10.includes('Saturn');
  const marsIn1 = chart.planets['Mars']?.house === 1;
  if (saturnIn10 || lord10House === 6) {
    answer += '\n\nA structured job with clear hierarchy would suit you well initially. Business ventures may succeed after establishing expertise.';
  } else if (marsIn1 || lord10House === 7) {
    answer += '\n\nYou have the courage and energy to be a self-starter. Business or entrepreneurship can bring success, especially in partnership-based ventures.';
  } else {
    answer += '\n\nBoth job and business paths are viable. Your chart suggests starting with a job to build skills and capital, then transitioning to business when the Dasha period is favorable.';
  }

  return {
    question: 'What would be better for me — working in a job or doing business?',
    answer: answer.trim(),
    category: 'Career',
    relevantHouses: [10, 7],
    relevantPlanets: [lord10, ...planetsIn10],
  };
}

function generateSpouseAnswer(chart: VedicChart): LifeQuestion {
  const lord7 = getHouseLord(chart, 7);
  const lord7House = getLordHouse(chart, lord7);
  const venusData = chart.planets['Venus'];
  const planetsIn7 = getPlanetsInHouse(chart, 7);
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, the 7th house and Venus indicate the characteristics of your spouse. `;

  // 7th lord sign (describes spouse qualities)
  const lord7Sign = chart.planets[lord7]?.sign || '';
  if (lord7Sign) {
    const fireSign = ['Aries', 'Leo', 'Sagittarius'].includes(lord7Sign);
    const earthSign = ['Taurus', 'Virgo', 'Capricorn'].includes(lord7Sign);
    const airSign = ['Gemini', 'Libra', 'Aquarius'].includes(lord7Sign);
    const waterSign = ['Cancer', 'Scorpio', 'Pisces'].includes(lord7Sign);

    if (fireSign) answer += `The 7th lord ${lord7} in the fiery sign of ${lord7Sign} suggests your spouse will be energetic, confident, passionate, and perhaps dominant in the relationship. `;
    else if (earthSign) answer += `The 7th lord ${lord7} in the earthy sign of ${lord7Sign} indicates a practical, reliable, financially savvy spouse who values stability. `;
    else if (airSign) answer += `The 7th lord ${lord7} in the airy sign of ${lord7Sign} suggests an intellectual, communicative, and socially active spouse. `;
    else if (waterSign) answer += `The 7th lord ${lord7} in the watery sign of ${lord7Sign} indicates an emotionally deep, intuitive, and nurturing spouse. `;
  }

  // 7th lord in house
  if (lord7House === 4) answer += 'Your spouse is likely devoted to home and family. You will enjoy domestic happiness together. ';
  else if (lord7House === 10) answer += 'Your spouse will likely be career-oriented and professionally successful. ';
  else if (lord7House === 9) answer += 'Your spouse may be spiritually inclined, well-educated, or from a different cultural background. ';
  else if (lord7House === 2) answer += 'Your spouse comes from a good family background and may bring financial stability to the marriage. ';

  // Venus placement
  if (venusData) {
    answer += `Venus, the significator of spouse, is placed in ${venusData.sign} in your ${ordinal(venusData.house)} house. `;
    if (venusData.house === 4) answer += 'This indicates a spouse with artistic taste, love of beauty, and good domestic skills. ';
    else if (venusData.house === 7) answer += 'This is an ideal placement — your spouse will be attractive, loving, and your relationship will be fulfilling. ';
    else if (venusData.house === 1) answer += 'You yourself radiate charm and attractiveness, which draws quality partners. ';
  }

  return {
    question: 'What are the characteristics, values, and profession of my spouse?',
    answer: answer.trim(),
    category: 'Spouse',
    relevantHouses: [7],
    relevantPlanets: ['Venus', lord7],
  };
}

function generateMarriageTypeAnswer(chart: VedicChart): LifeQuestion {
  const lord5 = getHouseLord(chart, 5);
  const lord7 = getHouseLord(chart, 7);
  const lord5House = getLordHouse(chart, lord5);
  const lord7House = getLordHouse(chart, lord7);
  const venusHouse = chart.planets['Venus']?.house || 0;
  const marsHouse = chart.planets['Mars']?.house || 0;
  const rahuHouse = chart.planets['Rahu']?.house || 0;
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, the type of marriage is analyzed from the 5th house (romance) and 7th house (marriage). `;

  // Love marriage indicators
  const loveIndicators: string[] = [];
  if (lord5House === 7 || lord7House === 5) loveIndicators.push(`the exchange between 5th and 7th lords`);
  if (venusHouse === 5) loveIndicators.push('Venus in the 5th house (romance)');
  if (marsHouse === 7) loveIndicators.push('Mars in the 7th house (passion)');
  if (rahuHouse === 7 || rahuHouse === 5) loveIndicators.push(`Rahu in the ${ordinal(rahuHouse)} house (unconventional love)`);

  // Arranged marriage indicators
  const arrangedIndicators: string[] = [];
  if ([2, 4, 9].includes(lord7House)) arrangedIndicators.push(`the 7th lord in the ${ordinal(lord7House)} house (family-oriented marriage)`);
  if (chart.planets['Jupiter']?.house === 7) arrangedIndicators.push('Jupiter in the 7th house (traditional blessings)');
  if (chart.planets['Saturn']?.house === 7) arrangedIndicators.push('Saturn in the 7th (structured, arranged union)');

  if (loveIndicators.length > arrangedIndicators.length) {
    answer += `Your chart shows strong love marriage indicators: ${loveIndicators.join(', ')}. Romance and personal choice will play a significant role in your marriage. However, seeking family approval will bring additional blessings. `;
  } else if (arrangedIndicators.length > loveIndicators.length) {
    answer += `Your chart leans toward an arranged marriage, indicated by ${arrangedIndicators.join(', ')}. The marriage arranged through family channels will bring happiness and stability. `;
  } else {
    answer += 'Your chart shows a balance of both possibilities. The marriage may start as an introduction through family or friends but develop into a love bond. Either way, the overall indications for marital happiness are positive. ';
  }

  return {
    question: 'Will I have an arranged marriage or a love marriage?',
    answer: answer.trim(),
    category: 'Marriage Type',
    relevantHouses: [5, 7],
    relevantPlanets: ['Venus', 'Mars', lord5, lord7],
  };
}

function generateHealthAnswer(chart: VedicChart): LifeQuestion {
  const lord6 = getHouseLord(chart, 6);
  const lord6House = getLordHouse(chart, lord6);
  const lord8 = getHouseLord(chart, 8);
  const lord1 = getHouseLord(chart, 1);
  const lord1Strength = planetStrength(chart, lord1);
  const moonStrength = planetStrength(chart, 'Moon');
  const planetsIn6 = getPlanetsInHouse(chart, 6);
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, health is analyzed through the 1st house (vitality), 6th house (diseases), and 8th house (longevity). `;

  // Ascendant lord strength
  if (lord1Strength === 'strong') {
    answer += `Your ascendant lord ${lord1} is in a strong position, indicating a robust constitution and generally good health throughout life. `;
  } else if (lord1Strength === 'weak') {
    answer += `The ascendant lord ${lord1} is in a weak position, suggesting you should pay extra attention to your health and adopt a disciplined lifestyle. `;
  } else {
    answer += `Your ascendant lord ${lord1} has moderate strength, indicating average health that improves with proper care. `;
  }

  // 6th house analysis
  if (lord6House === 6) {
    answer += 'The 6th lord in its own house is favorable — your body has good ability to fight diseases and recover quickly. ';
  } else if ([1, 7].includes(lord6House)) {
    answer += `The 6th lord in the ${ordinal(lord6House)} house may bring periodic health issues that need attention. Preventive care is strongly recommended. `;
  }

  if (planetsIn6.length > 0) {
    planetsIn6.forEach(p => {
      if (p === 'Mars') answer += 'Mars in the 6th house gives ability to overcome diseases but watch for inflammation, fever, or surgical matters. ';
      else if (p === 'Saturn') answer += 'Saturn here may bring chronic conditions related to bones or joints — regular exercise is essential. ';
      else if (p === 'Mercury') answer += 'Mercury in the 6th may cause nervous tension or skin issues — manage stress carefully. ';
      else if (p === 'Jupiter') answer += 'Jupiter in the 6th helps overcome health issues but beware of overindulgence and weight gain. ';
    });
  }

  // Moon for mental health
  if (moonStrength === 'strong') {
    answer += 'Your Moon is strong, indicating good mental health, emotional stability, and peaceful sleep. ';
  } else if (moonStrength === 'weak') {
    answer += 'A challenged Moon suggests attention to mental health — practice meditation, avoid stress, and ensure adequate sleep. ';
  }

  // 8th lord for longevity
  const lord8House = getLordHouse(chart, lord8);
  if (lord8House === 8) {
    answer += 'The 8th lord in its own house is a positive indication for longevity — a long lifespan is indicated.';
  } else if ([1, 2, 7].includes(lord8House)) {
    answer += 'Pay attention to health during challenging Dasha periods and maintain regular check-ups.';
  } else {
    answer += 'Overall, your chart indicates a normal to good lifespan with proper health management.';
  }

  return {
    question: 'What are the general predictions about my health?',
    answer: answer.trim(),
    category: 'Health',
    relevantHouses: [1, 6, 8],
    relevantPlanets: [lord1, lord6, 'Moon'],
  };
}

function generateJobChangeAnswer(chart: VedicChart, dashas?: DashaWithAntardasha[]): LifeQuestion {
  const lord10 = getHouseLord(chart, 10);
  const lord10House = getLordHouse(chart, lord10);
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, career transitions are analyzed from the 10th house and current Dasha periods. `;

  // Multiple skills
  if (lord10House !== 10) {
    answer += `Since the 10th lord ${lord10} is placed in the ${ordinal(lord10House)} house rather than its own house, transitions between different roles or companies are indicated throughout your career. You may develop multiple skills through these changes. `;
  } else {
    answer += `The 10th lord in its own house suggests stability in career. Changes will be more about promotions and growth within your field rather than complete career shifts. `;
  }

  // Dasha-based favorable periods
  if (dashas && dashas.length > 0) {
    const current = dashas.find(d => d.isCurrent);
    const favorable = dashas.filter(d => d.rating === 'excellent' || d.rating === 'favourable');

    if (current) {
      answer += `\n\nCurrently in ${current.planet} Mahadasha (${current.startYear}–${current.endYear}), rated "${current.rating}". `;
      if (current.rating === 'excellent' || current.rating === 'favourable') {
        answer += 'This is a favorable time for career moves and advancement. ';
      } else {
        answer += 'It may be better to wait for a more favorable sub-period before making major career changes. ';
      }

      if (current.antardashas && current.antardashas.length > 0) {
        const upcomingFavorable = current.antardashas.filter(ad => !ad.isCurrent && ad.startYear >= new Date().getFullYear());
        if (upcomingFavorable.length > 0) {
          const next = upcomingFavorable[0];
          answer += `The upcoming ${current.planet}/${next.planet} sub-period (${next.startMonth}/${next.startYear}–${next.endMonth}/${next.endYear}) could bring career opportunities. `;
        }
      }
    }

    if (favorable.length > 0) {
      answer += `\n\nFavorable periods for career growth include: ${favorable.slice(0, 3).map(d => `${d.planet} period (${d.startYear}–${d.endYear})`).join(', ')}.`;
    }
  }

  return {
    question: 'When will I be able to change my job or advance in my career?',
    answer: answer.trim(),
    category: 'Career Change',
    relevantHouses: [10],
    relevantPlanets: [lord10],
  };
}

function generateChildrenAnswer(chart: VedicChart): LifeQuestion {
  const lord5 = getHouseLord(chart, 5);
  const lord5House = getLordHouse(chart, lord5);
  const planetsIn5 = getPlanetsInHouse(chart, 5);
  const jupiterStrength = planetStrength(chart, 'Jupiter');
  const ascName = chart.ascendant.name;

  let answer = `For your ${ascName} ascendant, children and progeny are analyzed through the 5th house and Jupiter (the natural significator of children). `;

  if ([1, 2, 5, 9, 10, 11].includes(lord5House)) {
    answer += `The 5th lord ${lord5} in the ${ordinal(lord5House)} house is a positive indication for children. ${lord5House === 5 ? 'The lord in its own house strongly indicates having children who will bring happiness. However, you should note that some challenges with or about children may occur initially.' : lord5House === 9 ? 'This is very auspicious — your children will be fortunate and bring you pride.' : 'Your children will contribute positively to your life.'} `;
  } else if ([6, 8, 12].includes(lord5House)) {
    answer += `The 5th lord ${lord5} in the ${ordinal(lord5House)} house may bring some concerns regarding children. ${lord5House === 6 ? 'There could be health matters related to children that need attention.' : lord5House === 8 ? 'Unexpected events related to children may occur, but the bond will be deep.' : 'Your children may settle abroad or be distant at times.'} Remedies and prayer to your Ishta Devata will bring relief. `;
  } else {
    answer += `The 5th lord ${lord5} in the ${ordinal(lord5House)} house gives moderate indications. Timing for children is best during the Dasha of the 5th lord or Jupiter. `;
  }

  if (planetsIn5.length > 0) {
    planetsIn5.forEach(p => {
      if (p === 'Jupiter') answer += 'Jupiter in the 5th house is extremely auspicious for progeny — multiple children and happiness through them is indicated. ';
      else if (p === 'Sun') answer += 'Sun in the 5th gives successful children who may hold positions of authority. ';
      else if (p === 'Ketu') answer += 'Ketu in the 5th indicates spiritual or unique talents in your children, though timing of birth may face delays. ';
      else if (p === 'Saturn') answer += 'Saturn here may delay children but ensures mature, responsible offspring. ';
      else if (p === 'Venus') answer += 'Venus blesses with beautiful, artistic children. ';
    });
  }

  if (jupiterStrength === 'strong') {
    answer += 'Jupiter is strong in your chart, which is a very favorable indication for progeny and happiness through children.';
  } else if (jupiterStrength === 'weak') {
    answer += 'Since Jupiter is in a challenged position, wearing a Yellow Sapphire and performing Jupiter remedies on Thursdays is recommended for blessings related to children.';
  }

  return {
    question: 'Will I have children? What are the predictions about my children?',
    answer: answer.trim(),
    category: 'Children',
    relevantHouses: [5],
    relevantPlanets: ['Jupiter', lord5, ...planetsIn5],
  };
}

// ---------------------------------------------------------------------------
// Main Generator
// ---------------------------------------------------------------------------

export function generateLifeQA(
  chart: VedicChart,
  yogas?: YogaResult[],
  doshas?: DoshaResult[],
  gemstones?: GemstoneRecommendation[],
  dashas?: DashaWithAntardasha[],
): LifeQuestion[] {
  return [
    generateFameAnswer(chart, yogas),
    generateWealthAnswer(chart, yogas),
    generateDoshaAnswer(chart, doshas),
    generateGemstoneAnswer(chart, gemstones),
    generateSiblingsAnswer(chart),
    generateChallengingDashaAnswer(chart, dashas),
    generatePropertyAnswer(chart),
    generateMarriageAnswer(chart),
    generateEducationAnswer(chart),
    generateCareerAnswer(chart),
    generateSpouseAnswer(chart),
    generateMarriageTypeAnswer(chart),
    generateHealthAnswer(chart),
    generateJobChangeAnswer(chart, dashas),
    generateChildrenAnswer(chart),
  ];
}
