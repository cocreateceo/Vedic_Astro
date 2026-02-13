/** Rashi (Zodiac sign) emoji mapping — by index (0=Aries, 11=Pisces) */

export const rashiEmojis = [
  '🐏', // Mesha (Aries) — Ram
  '🐂', // Vrishabha (Taurus) — Bull
  '👯', // Mithuna (Gemini) — Twins
  '🦀', // Karka (Cancer) — Crab
  '🦁', // Simha (Leo) — Lion
  '👩', // Kanya (Virgo) — Maiden
  '⚖️', // Tula (Libra) — Scales
  '🦂', // Vrishchika (Scorpio) — Scorpion
  '🏹', // Dhanu (Sagittarius) — Bow & Arrow
  '🐐', // Makara (Capricorn) — Goat
  '🏺', // Kumbha (Aquarius) — Water Pot
  '🐟', // Meena (Pisces) — Fish
];

/** Element emojis for each zodiac element */
export const elementEmojis: Record<string, string> = {
  Fire: '🔥',
  Earth: '🌍',
  Air: '💨',
  Water: '🌊',
};

/** Get rashi emoji by sign index */
export function getRashiEmoji(signIndex: number): string {
  return rashiEmojis[signIndex] || '⭐';
}

/** Get rashi emoji by English sign name */
export function getRashiEmojiByName(name: string): string {
  const nameMap: Record<string, number> = {
    Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5,
    Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11,
  };
  return rashiEmojis[nameMap[name] ?? -1] || '⭐';
}

/** Get element emoji */
export function getElementEmoji(element: string): string {
  return elementEmojis[element] || '';
}
