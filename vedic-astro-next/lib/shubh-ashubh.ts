/**
 * Auspicious / Inauspicious classification for Panchang elements
 * Based on traditional Vedic astrology texts (Muhurta Chintamani)
 */

export type AuspiciousLevel = 'shubh' | 'ashubh' | 'neutral';

/** Auspicious marker emoji + label */
export const auspiciousMarkers: Record<AuspiciousLevel, { emoji: string; label: string; labelHindi: string; className: string }> = {
  shubh:   { emoji: '🟢', label: 'Shubh',   labelHindi: 'शुभ',   className: 'text-green-400' },
  ashubh:  { emoji: '🔴', label: 'Ashubh',  labelHindi: 'अशुभ',  className: 'text-red-400' },
  neutral: { emoji: '🟡', label: 'Neutral', labelHindi: 'सामान्य', className: 'text-yellow-400' },
};

/** Tithi auspiciousness classification */
export function getTithiAuspiciousness(tithi: string): AuspiciousLevel {
  const t = tithi.toLowerCase();
  // Inauspicious tithis
  if (t.includes('amavasya')) return 'ashubh';
  if (t.includes('chaturdashi')) return 'ashubh';
  if (t.includes('ashtami') && t.includes('krishna')) return 'ashubh';

  // Highly auspicious tithis
  if (t.includes('purnima')) return 'shubh';
  if (t.includes('ekadashi')) return 'shubh';
  if (t.includes('dwitiya')) return 'shubh';
  if (t.includes('tritiya')) return 'shubh';
  if (t.includes('panchami')) return 'shubh';
  if (t.includes('saptami')) return 'shubh';
  if (t.includes('dashami')) return 'shubh';
  if (t.includes('trayodashi')) return 'shubh';

  return 'neutral';
}

/** Nakshatra auspiciousness classification */
export function getNakshatraAuspiciousness(nakshatra: string): AuspiciousLevel {
  const auspicious = [
    'Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya',
    'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana',
    'Dhanishta', 'Revati', 'Uttara Phalguni', 'Uttara Ashadha',
    'Uttara Bhadrapada',
  ];
  const inauspicious = [
    'Bharani', 'Ardra', 'Ashlesha', 'Magha', 'Jyeshtha',
    'Mula', 'Purva Bhadrapada',
  ];

  if (auspicious.includes(nakshatra)) return 'shubh';
  if (inauspicious.includes(nakshatra)) return 'ashubh';
  return 'neutral';
}

/** Yoga auspiciousness classification */
export function getYogaAuspiciousness(yoga: string): AuspiciousLevel {
  const auspicious = [
    'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Sukarma',
    'Dhriti', 'Vriddhi', 'Dhruva', 'Harshana', 'Siddhi',
    'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
    'Brahma', 'Indra',
  ];
  const inauspicious = [
    'Vishkumbha', 'Atiganda', 'Shula', 'Ganda',
    'Vyaghata', 'Vajra', 'Vyatipata', 'Parigha', 'Vaidhriti',
  ];

  if (auspicious.includes(yoga)) return 'shubh';
  if (inauspicious.includes(yoga)) return 'ashubh';
  return 'neutral';
}

/** Karana auspiciousness classification */
export function getKaranaAuspiciousness(karana: string): AuspiciousLevel {
  const auspicious = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja'];
  const inauspicious = ['Vishti', 'Shakuni', 'Chatushpada', 'Naga'];

  if (auspicious.includes(karana)) return 'shubh';
  if (inauspicious.includes(karana)) return 'ashubh';
  return 'neutral';
}

/** Get marker for any panchang element */
export function getAuspiciousMarker(type: 'tithi' | 'nakshatra' | 'yoga' | 'karana', value: string) {
  let level: AuspiciousLevel;
  switch (type) {
    case 'tithi': level = getTithiAuspiciousness(value); break;
    case 'nakshatra': level = getNakshatraAuspiciousness(value); break;
    case 'yoga': level = getYogaAuspiciousness(value); break;
    case 'karana': level = getKaranaAuspiciousness(value); break;
  }
  return auspiciousMarkers[level];
}
