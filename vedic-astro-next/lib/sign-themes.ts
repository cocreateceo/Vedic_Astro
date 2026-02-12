export type SignKey =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type VisualThemeKey = 'vedic-ember' | 'sacred-light' | 'sacred-fire' | 'temple-gold' | 'cosmic-night' | 'ocean-deep';

export type ThemeKey = SignKey | VisualThemeKey;

export interface ThemePalette {
  name: string;
  primary: string;
  secondary: string;
  dark: string;
  glowRgb: string;
  bgTint: string;
}

export interface SignPalette extends ThemePalette {
  key: SignKey;
  hindi: string;
}

export interface VisualTheme extends ThemePalette {
  key: VisualThemeKey;
  description: string;
}

export const SIGN_KEYS: SignKey[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

export const SIGN_PALETTES: Record<SignKey, SignPalette> = {
  aries: {
    key: 'aries', name: 'Aries', hindi: 'Mesha',
    primary: '#DC143C', secondary: '#FF4D6A', dark: '#A0102E',
    glowRgb: '220,20,60', bgTint: 'rgba(220,20,60,0.03)',
  },
  taurus: {
    key: 'taurus', name: 'Taurus', hindi: 'Vrishabha',
    primary: '#2E8B57', secondary: '#4CAF7A', dark: '#1E6B3E',
    glowRgb: '46,139,87', bgTint: 'rgba(46,139,87,0.03)',
  },
  gemini: {
    key: 'gemini', name: 'Gemini', hindi: 'Mithuna',
    primary: '#F4D03F', secondary: '#FFEB3B', dark: '#C9A825',
    glowRgb: '244,208,63', bgTint: 'rgba(244,208,63,0.03)',
  },
  cancer: {
    key: 'cancer', name: 'Cancer', hindi: 'Karka',
    primary: '#C0C0C0', secondary: '#D8D8D8', dark: '#A0A0A0',
    glowRgb: '192,192,192', bgTint: 'rgba(192,192,192,0.03)',
  },
  leo: {
    key: 'leo', name: 'Leo', hindi: 'Simha',
    primary: '#D4AF37', secondary: '#E4C84B', dark: '#B8860B',
    glowRgb: '212,175,55', bgTint: 'rgba(212,175,55,0.03)',
  },
  virgo: {
    key: 'virgo', name: 'Virgo', hindi: 'Kanya',
    primary: '#6B8E23', secondary: '#8AAF3C', dark: '#4F6A1A',
    glowRgb: '107,142,35', bgTint: 'rgba(107,142,35,0.03)',
  },
  libra: {
    key: 'libra', name: 'Libra', hindi: 'Tula',
    primary: '#E8B4C8', secondary: '#F0CCD8', dark: '#D09AAE',
    glowRgb: '232,180,200', bgTint: 'rgba(232,180,200,0.03)',
  },
  scorpio: {
    key: 'scorpio', name: 'Scorpio', hindi: 'Vrishchika',
    primary: '#8B0000', secondary: '#B02020', dark: '#6A0000',
    glowRgb: '139,0,0', bgTint: 'rgba(139,0,0,0.03)',
  },
  sagittarius: {
    key: 'sagittarius', name: 'Sagittarius', hindi: 'Dhanu',
    primary: '#8A2BE2', secondary: '#A855F7', dark: '#6A1FB0',
    glowRgb: '138,43,226', bgTint: 'rgba(138,43,226,0.03)',
  },
  capricorn: {
    key: 'capricorn', name: 'Capricorn', hindi: 'Makara',
    primary: '#8B6C42', secondary: '#A89060', dark: '#6B4E2A',
    glowRgb: '139,108,66', bgTint: 'rgba(139,108,66,0.03)',
  },
  aquarius: {
    key: 'aquarius', name: 'Aquarius', hindi: 'Kumbha',
    primary: '#00BFFF', secondary: '#40E0D0', dark: '#0088BB',
    glowRgb: '0,191,255', bgTint: 'rgba(0,191,255,0.03)',
  },
  pisces: {
    key: 'pisces', name: 'Pisces', hindi: 'Meena',
    primary: '#9370DB', secondary: '#B19CD9', dark: '#7048B0',
    glowRgb: '147,112,219', bgTint: 'rgba(147,112,219,0.03)',
  },
};

export const VISUAL_THEME_KEYS: VisualThemeKey[] = [
  'vedic-ember', 'sacred-light', 'sacred-fire', 'temple-gold', 'cosmic-night', 'ocean-deep',
];

export const VISUAL_THEMES: Record<VisualThemeKey, VisualTheme> = {
  'vedic-ember': {
    key: 'vedic-ember', name: 'Vedic Ember', description: 'Warm sunset temple',
    primary: '#F28C1A', secondary: '#FFB030', dark: '#D06A10',
    glowRgb: '242,140,26', bgTint: 'rgba(242,140,26,0.06)',
  },
  'sacred-light': {
    key: 'sacred-light', name: 'Sacred Light', description: 'Ivory & saffron',
    primary: '#C07820', secondary: '#D89838', dark: '#A06010',
    glowRgb: '192,120,32', bgTint: 'rgba(192,120,32,0.06)',
  },
  'sacred-fire': {
    key: 'sacred-fire', name: 'Sacred Fire', description: 'Crimson flames',
    primary: '#F01040', secondary: '#FF4060', dark: '#B80C30',
    glowRgb: '240,16,64', bgTint: 'rgba(240,16,64,0.06)',
  },
  'temple-gold': {
    key: 'temple-gold', name: 'Temple Gold', description: 'Classic golden',
    primary: '#E8B830', secondary: '#FFD740', dark: '#C09010',
    glowRgb: '232,184,48', bgTint: 'rgba(232,184,48,0.06)',
  },
  'cosmic-night': {
    key: 'cosmic-night', name: 'Cosmic Night', description: 'Deep indigo sky',
    primary: '#4B6EF5', secondary: '#70A0FF', dark: '#3050C0',
    glowRgb: '75,110,245', bgTint: 'rgba(75,110,245,0.06)',
  },
  'ocean-deep': {
    key: 'ocean-deep', name: 'Ocean Deep', description: 'Teal ocean depths',
    primary: '#00D4D8', secondary: '#40F0E0', dark: '#009898',
    glowRgb: '0,212,216', bgTint: 'rgba(0,212,216,0.06)',
  },
};

export const DEFAULT_PALETTE: ThemePalette = VISUAL_THEMES['vedic-ember'];

export function isSignKey(key: string): key is SignKey {
  return SIGN_KEYS.includes(key as SignKey);
}

export function isVisualThemeKey(key: string): key is VisualThemeKey {
  return VISUAL_THEME_KEYS.includes(key as VisualThemeKey);
}

export function isThemeKey(key: string): key is ThemeKey {
  return isSignKey(key) || isVisualThemeKey(key);
}

export function getThemePalette(key: ThemeKey): ThemePalette {
  if (isSignKey(key)) return SIGN_PALETTES[key];
  if (isVisualThemeKey(key)) return VISUAL_THEMES[key];
  return DEFAULT_PALETTE;
}

export function getSignByIndex(index: number): SignKey {
  return SIGN_KEYS[index % 12];
}

export function getPaletteByIndex(index: number): SignPalette {
  return SIGN_PALETTES[getSignByIndex(index)];
}

export function getPalette(sign: SignKey): SignPalette {
  return SIGN_PALETTES[sign];
}
