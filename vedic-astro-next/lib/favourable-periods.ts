// Favourable Periods calculation based on Dasha/Antardasha and house significations
// Maps to ClickAstro Chapter 5: "Favourable Periods"

import { DashaWithAntardasha, AntardashaData } from '@/types';
import { functionalBeneficsMap, mostMaleficMap, dashaOrder, dashaDurations, DASHA_CYCLE_YEARS } from './vedic-constants';

export type FavourableRating = 'excellent' | 'favourable' | 'less_favourable';

export interface FavourablePeriod {
  rating: FavourableRating;
  startDate: string;
  endDate: string;
  startAge: string;
  endAge: string;
  duration: string;
}

export interface FavourablePeriodsResult {
  career: FavourablePeriod[];
  business: FavourablePeriod[];
  houseConstruction: FavourablePeriod[];
}

// House significations for each category
// Career: 10th lord (profession), 6th lord (service), 2nd lord (income from career)
// Business: 7th lord (trade), 10th lord (profession), 11th lord (gains), 2nd lord (wealth), 9th lord (fortune)
// House: 4th lord (property), 2nd lord (wealth for investment), 11th lord (gains)

const careerHouses = [2, 6, 10];
const businessHouses = [2, 7, 9, 10, 11];
const houseConstructionHouses = [2, 4, 11];

// Planet → which houses it naturally signifies (natural karakatva)
const planetKarakaForCareer: Record<string, number> = {
  Sun: 2, Moon: 0, Mars: 1, Mercury: 2, Jupiter: 3, Venus: 1, Saturn: 2, Rahu: 1, Ketu: 0,
};
const planetKarakaForBusiness: Record<string, number> = {
  Sun: 1, Moon: 1, Mars: 1, Mercury: 3, Jupiter: 3, Venus: 2, Saturn: 1, Rahu: 2, Ketu: 0,
};
const planetKarakaForHouse: Record<string, number> = {
  Sun: 1, Moon: 2, Mars: 2, Mercury: 1, Jupiter: 2, Venus: 3, Saturn: 2, Rahu: 0, Ketu: 0,
};

/**
 * Compute a "score" for a given planet for a given ascendant and category.
 * Higher = more favourable for that activity.
 */
function planetScore(
  planet: string,
  ascSignIndex: number,
  category: 'career' | 'business' | 'house'
): number {
  const benefics = functionalBeneficsMap[ascSignIndex] || [];
  const malefic = mostMaleficMap[ascSignIndex];
  const isBenefic = benefics.includes(planet);
  const isMalefic = planet === malefic;

  let score = 0;

  // Benefic/malefic status: +3 benefic, -3 malefic, 0 neutral
  if (isBenefic) score += 3;
  if (isMalefic) score -= 3;

  // Natural karakatva for the category
  const karakaMap = category === 'career' ? planetKarakaForCareer
    : category === 'business' ? planetKarakaForBusiness
    : planetKarakaForHouse;
  score += karakaMap[planet] || 0;

  // Yogakaraka bonus
  const yogakarakas: Record<number, string> = {
    0: 'Jupiter', 1: 'Saturn', 3: 'Mars', 4: 'Mars',
    6: 'Saturn', 9: 'Venus', 10: 'Venus',
  };
  if (yogakarakas[ascSignIndex] === planet) score += 2;

  return score;
}

/**
 * Compute the combined rating for a dasha-antardasha period
 */
function periodRating(
  dashaPlanet: string,
  antarPlanet: string,
  ascSignIndex: number,
  category: 'career' | 'business' | 'house'
): FavourableRating {
  const dashaScore = planetScore(dashaPlanet, ascSignIndex, category);
  const antarScore = planetScore(antarPlanet, ascSignIndex, category);

  // Weighted: dasha lord 60%, antardasha lord 40%
  const combined = dashaScore * 0.6 + antarScore * 0.4;

  if (combined >= 3.5) return 'excellent';
  if (combined >= 1.0) return 'favourable';
  return 'less_favourable';
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

function formatAge(dob: Date, date: Date): string {
  let years = date.getFullYear() - dob.getFullYear();
  let months = date.getMonth() - dob.getMonth();
  if (months < 0) { years--; months += 12; }
  return `${years}y ${months}m`;
}

/**
 * Merge adjacent periods with same rating
 */
function mergePeriods(periods: FavourablePeriod[]): FavourablePeriod[] {
  if (periods.length === 0) return [];
  const merged: FavourablePeriod[] = [{ ...periods[0] }];

  for (let i = 1; i < periods.length; i++) {
    const last = merged[merged.length - 1];
    if (periods[i].rating === last.rating) {
      // Merge
      last.endDate = periods[i].endDate;
      last.endAge = periods[i].endAge;
      // Recalculate duration
      const startParts = last.startDate.split(' ');
      const endParts = periods[i].endDate.split(' ');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const startM = monthNames.indexOf(startParts[1]);
      const endM = monthNames.indexOf(endParts[1]);
      const startY = parseInt(startParts[2]);
      const endY = parseInt(endParts[2]);
      const totalMonths = (endY - startY) * 12 + (endM - startM);
      last.duration = formatDuration(Math.max(1, totalMonths));
    } else {
      merged.push({ ...periods[i] });
    }
  }
  return merged;
}

/**
 * Calculate favourable periods for career, business, and house construction.
 * Uses dasha/antardasha periods from birth to determine favorable timelines.
 */
export function calculateFavourablePeriods(
  dob: string,
  enhancedDashas: DashaWithAntardasha[],
  ascSignIndex: number,
  analysisStartAge: number = 15,
  analysisEndAge: number = 80,
): FavourablePeriodsResult {
  const dobDate = new Date(dob);
  const categories: ('career' | 'business' | 'house')[] = ['career', 'business', 'house'];

  const result: FavourablePeriodsResult = {
    career: [],
    business: [],
    houseConstruction: [],
  };

  for (const category of categories) {
    const periods: FavourablePeriod[] = [];

    for (const dasha of enhancedDashas) {
      if (!dasha.antardashas) continue;

      for (const antar of dasha.antardashas) {
        // Calculate start/end dates from years+months
        const startDate = new Date(antar.startYear, (antar.startMonth || 1) - 1, 1);
        const endDate = new Date(antar.endYear, (antar.endMonth || 1) - 1, 1);

        // Check if within analysis range
        const startAge = (startDate.getTime() - dobDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        const endAge = (endDate.getTime() - dobDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

        if (endAge < analysisStartAge || startAge > analysisEndAge) continue;

        // Clamp dates to analysis range
        const clampStart = startAge < analysisStartAge
          ? addMonths(dobDate, analysisStartAge * 12)
          : startDate;
        const clampEnd = endAge > analysisEndAge
          ? addMonths(dobDate, analysisEndAge * 12)
          : endDate;

        const rating = periodRating(dasha.planet, antar.planet, ascSignIndex, category);
        const durationMonths = (clampEnd.getTime() - clampStart.getTime()) / (30.44 * 24 * 60 * 60 * 1000);

        if (durationMonths < 0.5) continue; // Skip very short periods

        periods.push({
          rating,
          startDate: formatDate(clampStart),
          endDate: formatDate(clampEnd),
          startAge: formatAge(dobDate, clampStart),
          endAge: formatAge(dobDate, clampEnd),
          duration: formatDuration(Math.max(1, Math.round(durationMonths))),
        });
      }
    }

    // Merge adjacent same-rating periods
    const merged = mergePeriods(periods);

    if (category === 'career') result.career = merged;
    else if (category === 'business') result.business = merged;
    else result.houseConstruction = merged;
  }

  return result;
}
