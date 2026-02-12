import { GunaDetail, GunaScore, CompatibilityVerdict } from '@/types';
import { computeFullChart } from '@/lib/kundli-calc';
import { nakshatras } from '@/lib/vedic-constants';

const gunaDetails: GunaDetail[] = [
  { name: 'Varna', max: 1, desc: 'Spiritual compatibility' },
  { name: 'Vashya', max: 2, desc: 'Mutual attraction' },
  { name: 'Tara', max: 3, desc: 'Destiny & health' },
  { name: 'Yoni', max: 4, desc: 'Physical compatibility' },
  { name: 'Graha Maitri', max: 5, desc: 'Mental compatibility' },
  { name: 'Gana', max: 6, desc: 'Temperament' },
  { name: 'Bhakoot', max: 7, desc: 'Emotional harmony' },
  { name: 'Nadi', max: 8, desc: 'Health & genes' }
];

/**
 * Get nakshatra index from birth data using the real astronomy engine.
 * Falls back to noon and Delhi if only date is provided.
 */
export function getNakshatraIndex(dateStr: string, timeStr?: string, place?: string): number {
  const fc = computeFullChart(dateStr, timeStr || '12:00', place ? { place } : undefined);
  return nakshatras.indexOf(fc.moonData.nakshatra);
}

export function calculateGunaScores(nakshatra1: number, nakshatra2: number): GunaScore[] {
  const n1 = nakshatra1;
  const n2 = nakshatra2;
  const scores: GunaScore[] = [];

  const varnaScore = Math.abs(n1 - n2) % 4 === 0 ? 1 : (Math.abs(n1 - n2) % 2 === 0 ? 0.5 : 0);
  scores.push({ ...gunaDetails[0], obtained: varnaScore });

  const vashyaScore = Math.min(2, 2 - (Math.abs(n1 - n2) % 3));
  scores.push({ ...gunaDetails[1], obtained: vashyaScore });

  const taraDiff = Math.abs(n1 - n2) % 9;
  const taraScore = taraDiff <= 3 ? 3 : (taraDiff <= 6 ? 1.5 : 0);
  scores.push({ ...gunaDetails[2], obtained: taraScore });

  const yoniScore = ((n1 + n2) % 5) <= 2 ? 4 : (((n1 + n2) % 5) === 3 ? 2 : 1);
  scores.push({ ...gunaDetails[3], obtained: yoniScore });

  const maitriScore = Math.abs(n1 - n2) <= 9 ? 5 : (Math.abs(n1 - n2) <= 18 ? 3 : 0);
  scores.push({ ...gunaDetails[4], obtained: maitriScore });

  const gana1 = n1 % 3;
  const gana2 = n2 % 3;
  const ganaScore = gana1 === gana2 ? 6 : (Math.abs(gana1 - gana2) === 1 ? 3 : 0);
  scores.push({ ...gunaDetails[5], obtained: ganaScore });

  const rashi1 = Math.floor(n1 * 12 / 27);
  const rashi2 = Math.floor(n2 * 12 / 27);
  const rashiDiff = Math.abs(rashi1 - rashi2);
  const bhakootScore = (rashiDiff === 0 || rashiDiff === 6) ? 0 : 7;
  scores.push({ ...gunaDetails[6], obtained: bhakootScore });

  const nadi1 = n1 % 3;
  const nadi2 = n2 % 3;
  const nadiScore = nadi1 !== nadi2 ? 8 : 0;
  scores.push({ ...gunaDetails[7], obtained: nadiScore });

  return scores;
}

export function getVerdict(totalScore: number): CompatibilityVerdict {
  if (totalScore >= 28) {
    return { title: 'Excellent Match!', description: 'This is an excellent match with a very high compatibility score. The union is blessed with harmony, understanding, and mutual respect.' };
  } else if (totalScore >= 21) {
    return { title: 'Good Match', description: 'This is a good match with above-average compatibility. While some areas may need attention, the overall alignment is positive.' };
  } else if (totalScore >= 18) {
    return { title: 'Average Match', description: 'This is an average match. Some compatibility exists, but there are areas of concern. Consultation with an astrologer is recommended.' };
  } else {
    return { title: 'Challenging Match', description: 'This match shows below-average compatibility. Significant challenges may exist. We recommend consulting an experienced astrologer.' };
  }
}
