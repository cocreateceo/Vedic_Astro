export interface Planet {
  name: string;
  sign: string;
  signIndex: number;
  signHindi: string;
  degree: string;
  house: number;
  nakshatra: string;
  nakshatraPada: number;
  retrograde: boolean;
}

export interface PanchangData {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  tithiIndex: number;
}

export interface RahuKaalData {
  start: string;
  end: string;
  startH: number;
  endH: number;
  isActive: boolean;
}

export interface ZodiacSign {
  key: string;
  name: string;
  symbol: string;
  element: string;
  ruler: string;
  quality: string;
  dates: string;
  lucky_numbers: string;
  lucky_colors: string;
  lucky_day: string;
  compatible: string;
  description: string;
}

export interface ZodiacWheelSign {
  key: string;
  symbol: string;
  hindi: string;
  english: string;
}

export interface KundliInput {
  name: string;
  dob: string;
  time: string;
  place: string;
}

export interface MoonSignData {
  sign: string;
  signIndex: number;
  signHindi: string;
  symbol: string;
  nakshatra: string;
  nakshatraPada: number;
}

export interface AscendantData {
  sign: string;
  signIndex: number;
  signHindi: string;
  symbol: string;
}

export interface VedicChart {
  moonSign: {
    name: string;
    hindi: string;
    symbol: string;
    index: number;
  };
  sunSign: {
    name: string;
    hindi: string;
    symbol: string;
  };
  ascendant: {
    name: string;
    hindi: string;
    symbol: string;
    index: number;
  };
  nakshatra: string;
  nakshatraPada: number;
  planets: Record<string, {
    sign: string;
    signIndex: number;
    signHindi: string;
    house: number;
    degree: string;
    nakshatra: string;
    nakshatraPada: number;
    retrograde: boolean;
    navamsaSign: string;
    navamsaSignHindi: string;
  }>;
  birthDetails: {
    date: string;
    time: string;
    place: string;
  };
  engineVersion?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  dob: string;
  tob: string;
  pob: string;
  timezone: string;
  vedicChart: VedicChart;
  horoscope: HoroscopeData | null;
  horoscopeHistory: HoroscopeData[];
  createdAt: string;
}

export interface TimePeriod {
  label: string;
  start: string;
  end: string;
  type: 'good' | 'bad' | 'best';
  description: string;
}

export interface DailyTimings {
  rahuKaal: { start: string; end: string };
  yamagandam: { start: string; end: string };
  gulikaKaal: { start: string; end: string };
  abhijitMuhurat: { start: string; end: string };
  bestHours: { start: string; end: string; activity: string }[];
  allPeriods: TimePeriod[];
}

export interface DayDetailedReport {
  general: string;
  career: string;
  love: string;
  health: string;
  ratings: Record<string, number>;
  lucky: { number: number; color: string; day: string; direction: string };
  remedies: string[];
  mantra: string;
  timings: DailyTimings;
}

export interface HoroscopeData {
  date: string;
  generatedAt: string;
  moonSign: RashiDetail;
  nakshatra: NakshatraDetail;
  daily: {
    general: string;
    career: string;
    love: string;
    health: string;
    ratings: Record<string, number>;
    lucky?: {
      number: number;
      color: string;
      day: string;
      direction: string;
    };
    remedies?: string[];
    mantra?: string;
    timings?: DailyTimings;
  };
  weekly?: WeeklyPrediction;
  monthly?: MonthlyPrediction;
  panchanga?: PanchangaPrediction;
  bhava?: BhavaPrediction[];
  compatibility?: string[];
  element?: string;
  ruler?: string;
  gem?: string;
  deity?: string;
}

export interface RashiDetail {
  name: string;
  sanskrit: string;
  ruler: string;
  element: string;
  quality: string;
  nature: string;
  bodyPart: string;
  direction: string;
  gem: string;
  deity: string;
  characteristics: string;
  strengths: string[];
  challenges: string[];
  compatibleSigns: number[];
  career: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDays: string[];
  mantra: string;
}

export interface NakshatraDetail {
  deity: string;
  ruler: string;
  symbol: string;
  nature: string;
  qualities: string;
  careers: string[];
  mantra: string;
}

export interface GunaDetail {
  name: string;
  max: number;
  desc: string;
}

export interface GunaScore extends GunaDetail {
  obtained: number;
}

export interface CompatibilityVerdict {
  title: string;
  description: string;
}

export interface DashaData {
  planet: string;
  startYear: number;
  endYear: number;
  duration: number;
  isCurrent: boolean;
}

export interface Astrologer {
  name: string;
  avatar: string;
  specializations: string[];
  rating: number;
  experience: string;
  consultations: string;
  ribbon?: string;
}

export interface Testimonial {
  text: string;
  name: string;
  location: string;
  rating: number;
}

export interface HouseSignification {
  name: string;
  keywords: string[];
  description: string;
}

export interface DailyPredictions {
  themes: string[];
  generalPositive: string[];
  generalChallenging: string[];
  careerPositive: string[];
  careerChallenging: string[];
  lovePositive: string[];
  loveChallenging: string[];
  healthAdvice: string[];
  remedies: string[];
}

export interface PlanetAnalysis {
  planet: string;
  sign: string;
  house: number;
  degree: string;
  isBenefic: boolean;
  isMostMalefic: boolean;
  houseKeywords: string[];
  houseDescription: string;
  interpretation: string;
}

export interface HoroscopePageData {
  content: string;
  lucky_number: string;
  lucky_color: string;
  lucky_time: string;
  mood: string;
  love: number;
  career: number;
  health: number;
  finance: number;
}

export interface SignTheme {
  key: string;
  name: string;
  hindi: string;
  primary: string;
  secondary: string;
  dark: string;
  glowRgb: string;
  bgTint: string;
}

// ---------- Yoga Types ----------

export interface YogaResult {
  name: string;
  sanskrit: string;
  type: 'raja' | 'dhana' | 'pancha_mahapurusha' | 'lunar' | 'solar' | 'special' | 'cancellation';
  description: string;
  effects: string;
  planets: string[];
  strength: 'strong' | 'moderate' | 'weak';
}

// ---------- Dosha Types ----------

export interface DoshaResult {
  name: string;
  detected: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  description: string;
  details: string;
  remedies: string[];
}

// ---------- Gemstone Types ----------

export interface GemstoneRecommendation {
  planet: string;
  primaryGem: string;
  alternativeGem: string;
  weight: string;
  metal: string;
  finger: string;
  startingDay: string;
  mantra: string;
  precautions: string[];
  reason: string;
}

// ---------- Transit Types ----------

export interface TransitPrediction {
  planet: string;
  transitSign: string;
  transitSignIndex: number;
  houseFromMoon: number;
  effects: string;
  isPositive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface SadeSatiResult {
  active: boolean;
  phase: 'none' | 'rising' | 'peak' | 'setting';
  description: string;
  remedies: string[];
}

// ---------- Antardasha Types ----------

export interface AntardashaData {
  planet: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  duration: number;
  isCurrent: boolean;
}

export interface DashaWithAntardasha extends DashaData {
  antardashas: AntardashaData[];
  rating: 'excellent' | 'favourable' | 'mixed' | 'challenging';
  ratingReason: string;
}

// ---------- Weekly Prediction Types ----------

export interface DayHighlight {
  dayName: string;
  date: string;
  mood: 'excellent' | 'good' | 'mixed' | 'challenging';
  bestFor: string[];
  avoidFor: string[];
  briefNote: string;
  detailed?: DayDetailedReport;
}

export interface ActivityRecommendation {
  activity: string;
  bestDay: string;
  reason: string;
}

export interface WeeklyPrediction {
  weekStart: string;
  weekEnd: string;
  theme: string;
  overview: string;
  ratings: Record<string, number>;
  dayHighlights: DayHighlight[];
  transitFocus: string[];
  remedies: string[];
  bestActivities: ActivityRecommendation[];
}

// ---------- Monthly Prediction Types ----------

export interface MonthlyPhase {
  label: string;
  period: string;
  prediction: string;
  energy: string;
}

export interface AuspiciousDate {
  date: string;
  dayOfWeek: string;
  goodFor: string[];
  reason: string;
}

export interface InauspiciousDate {
  date: string;
  dayOfWeek: string;
  avoidFor: string[];
  reason: string;
}

export interface MonthlyTransit {
  planet: string;
  event: string;
  date: string;
  impact: string;
  isPositive: boolean;
}

export interface MonthlyPrediction {
  month: string;
  overview: {
    general: string;
    career: string;
    love: string;
    health: string;
    finance: string;
  };
  ratings: Record<string, number>;
  phases: MonthlyPhase[];
  auspiciousDates: AuspiciousDate[];
  inauspiciousDates: InauspiciousDate[];
  keyTransits: MonthlyTransit[];
  remedies: string[];
  mantra: string;
}

// ---------- Panchanga Prediction Types ----------

export interface PanchangaPrediction {
  weekdayOfBirth: {
    day: string;
    planet: string;
    prediction: string;
  };
  birthNakshatra: {
    name: string;
    prediction: string;
  };
  birthTithi: {
    name: string;
    prediction: string;
  };
  birthKaranam: {
    name: string;
    prediction: string;
  };
  birthNithyaYoga: {
    name: string;
    prediction: string;
  };
}

// ---------- Bhava Prediction Types ----------

export interface BhavaPrediction {
  house: number;
  houseName: string;
  lordPlanet: string;
  lordPlacedIn: number;
  occupants: string[];
  prediction: string;
  aspects: string[];
}

// ---------- Life Q&A Types ----------

export interface LifeQuestion {
  question: string;
  answer: string;
  category: string;
  relevantHouses: number[];
  relevantPlanets: string[];
}

// ---------- Consultation Types ----------

export type ConsultationTierId = 'free' | 'standard' | 'premium';

export interface ConsultationBooking {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  notes?: string;
  question?: string;
  astrologer: string;
  tier: ConsultationTierId;
}
