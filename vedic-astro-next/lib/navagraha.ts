/** Navagraha — planet emoji/symbol mapping for UI display */

export const navagrahaEmoji: Record<string, string> = {
  Sun: '☀️',
  Moon: '🌙',
  Mars: '♂️',
  Mercury: '☿️',
  Jupiter: '♃',
  Venus: '♀️',
  Saturn: '♄',
  Rahu: '🐍',
  Ketu: '☄️',
};

/** Sanskrit names of the nine planets */
export const navagrahaSanskrit: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चन्द्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

/** Get emoji for a planet name, with fallback */
export function getPlanetEmoji(planet: string): string {
  return navagrahaEmoji[planet] || '⭐';
}

/** Get Sanskrit name for a planet */
export function getPlanetSanskrit(planet: string): string {
  return navagrahaSanskrit[planet] || planet;
}
