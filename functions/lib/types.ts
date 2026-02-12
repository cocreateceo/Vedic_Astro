// Newsletter system types

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'all';

export interface Subscriber {
  email: string;
  name?: string;
  dob?: string;       // YYYY-MM-DD
  tob?: string;       // HH:MM
  pob?: string;
  moonSignIndex?: number;    // 0-11
  nakshatraIndex?: number;   // 0-26
  nakshatraName?: string;
  frequency: Frequency;
  active: string;            // "true" | "false" (DynamoDB GSI requires string)
  subscribedAt: string;      // ISO 8601
  unsubscribedAt?: string;   // ISO 8601
}

// API request/response types
export interface SubscribeRequest {
  email: string;
  name?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  frequency?: Frequency;
}

export interface PreferencesRequest {
  email: string;
  frequency: Frequency;
}

export interface ApiResponse {
  message?: string;
  error?: string;
  subscribed?: boolean;
  frequency?: Frequency;
  name?: string;
}

// Email rendering data
export interface PanchangSnapshot {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
}

export interface DailyEmailData {
  name: string;
  date: Date;
  moonSignIndex: number;
  nakshatraName: string;
  panchang: PanchangSnapshot;
  rahuKaal: { start: string; end: string };
  predictions: {
    general: string;
    career: string;
    love: string;
    health: string;
  };
  ratings: {
    overall: number;
    career: number;
    love: number;
    health: number;
    finance: number;
  };
  lucky: {
    number: number;
    color: string;
    direction: string;
  };
  remedy: string;
  mantra: string;
  timings: {
    abhijit: { start: string; end: string };
    bestHours: { start: string; end: string; activity: string }[];
  };
  unsubscribeUrl: string;
  dashboardUrl: string;
}

export interface WeeklyEmailData {
  name: string;
  dateRange: string;
  moonSignIndex: number;
  weekTheme: string;
  focusAreas: string[];
  bestDays: string[];
  challenges: string[];
  mantra: string;
  unsubscribeUrl: string;
  dashboardUrl: string;
}

export interface MonthlyEmailData {
  name: string;
  month: string;
  date: Date;
  moonSignIndex: number;
  nakshatraName: string;
  dob: string;
  monthlyFocus: string;
  themes: string[];
  auspiciousDates: { date: string; significance: string }[];
  currentDasha: { planet: string; startYear: number; endYear: number; isBenefic: boolean };
  gemstone: string;
  remedy: string;
  mantra: string;
  unsubscribeUrl: string;
  dashboardUrl: string;
}
