// Shared Vedic astrology constants — single source of truth for the Next.js app.
// Import from here instead of redeclaring in each module.

export const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export const signSymbols = ['\u2648', '\u2649', '\u264A', '\u264B', '\u264C', '\u264D', '\u264E', '\u264F', '\u2650', '\u2651', '\u2652', '\u2653'];

export const hindiSignNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

export const signAbbrev = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

export const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export const planetAbbrev: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke'
};

export const nakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const tithis = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

export const yogas = [
  'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

export const movableKaranas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];
export const fixedKaranas = ['Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];

export const dashaOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
export const dashaDurations = [7, 20, 6, 10, 7, 18, 16, 19, 17];
export const DASHA_CYCLE_YEARS = 120;

/** Functional benefic planets for each ascendant sign index (0=Aries..11=Pisces) */
export const functionalBeneficsMap: Record<number, string[]> = {
  0:  ['Sun', 'Moon', 'Mars', 'Jupiter', 'Venus', 'Saturn'],
  1:  ['Sun', 'Moon', 'Mercury', 'Saturn'],
  2:  ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'],
  3:  ['Sun', 'Moon', 'Mars', 'Mercury', 'Venus'],
  4:  ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus'],
  5:  ['Moon', 'Mercury', 'Jupiter', 'Venus'],
  6:  ['Sun', 'Moon', 'Mars', 'Jupiter', 'Venus', 'Saturn'],
  7:  ['Sun', 'Moon', 'Mercury', 'Jupiter', 'Saturn'],
  8:  ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'],
  9:  ['Moon', 'Mars', 'Mercury', 'Venus', 'Saturn'],
  10: ['Sun', 'Mars', 'Jupiter', 'Venus', 'Saturn'],
  11: ['Moon', 'Mars', 'Mercury', 'Jupiter'],
};

/** Most malefic planet for each ascendant sign index */
export const mostMaleficMap: Record<number, string> = {
  0:  'Ketu',
  1:  'Jupiter',
  2:  'Ketu',
  3:  'Saturn',
  4:  'Moon',
  5:  'Mars',
  6:  'Mercury',
  7:  'Venus',
  8:  'Moon',
  9:  'Sun',
  10: 'Mercury',
  11: 'Venus',
};

/** Sign lords (ruling planets) */
export const signLords = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];
