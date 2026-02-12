// ── Feature Flags ─────────────────────────────────────────────────────
// Flip to `true` when Razorpay/Stripe keys are configured
export const PAYMENT_ENABLED = false;

// ── Calendly ──────────────────────────────────────────────────────────
export const CALENDLY_30MIN = 'https://calendly.com/cocreateceo/30min';
export const CALENDLY_60MIN = 'https://calendly.com/cocreateceo/60min';

// ── Payment Gateway Stubs ─────────────────────────────────────────────
export const RAZORPAY_KEY_ID = '';
export const STRIPE_PUBLISHABLE_KEY = '';

// ── Tier Definitions ──────────────────────────────────────────────────
export type ConsultationTierId = 'free' | 'standard' | 'premium';

export interface ConsultationTier {
  id: ConsultationTierId;
  name: string;
  sanskrit: string;
  price: number;
  priceLabel: string;
  duration: string;
  features: string[];
  calendlyUrl: string | null;
  recommended?: boolean;
}

export const TIERS: ConsultationTier[] = [
  {
    id: 'free',
    name: 'Ask a Question',
    sanskrit: 'प्रश्न',
    price: 0,
    priceLabel: 'Free',
    duration: 'Email reply within 48 hrs',
    features: [
      'One detailed question',
      'Expert astrologer response',
      'Email reply within 48 hours',
      'Basic remedies included',
    ],
    calendlyUrl: null,
  },
  {
    id: 'standard',
    name: 'Live Consultation',
    sanskrit: 'परामर्श',
    price: 29,
    priceLabel: '$29',
    duration: '30-minute video call',
    features: [
      '30-minute live video session',
      'Personalized chart analysis',
      'Real-time Q&A',
      'Remedies & gemstone advice',
      'Session recording shared',
    ],
    calendlyUrl: CALENDLY_30MIN,
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Detailed Analysis',
    sanskrit: 'विस्तृत विश्लेषण',
    price: 49,
    priceLabel: '$49',
    duration: '60-minute session + PDF report',
    features: [
      '60-minute in-depth session',
      'Full birth chart analysis',
      'Dasha & transit predictions',
      'Compatibility & career guidance',
      'Detailed PDF report emailed',
      'One follow-up email included',
    ],
    calendlyUrl: CALENDLY_60MIN,
  },
];
