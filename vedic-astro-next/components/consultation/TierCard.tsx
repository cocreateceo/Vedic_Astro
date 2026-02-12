'use client';

import { PAYMENT_ENABLED, type ConsultationTier } from '@/lib/consultation-config';

interface TierCardProps {
  tier: ConsultationTier;
  onSelect: (tierId: string) => void;
}

export default function TierCard({ tier, onSelect }: TierCardProps) {
  const isFree = tier.id === 'free';
  const isDisabled = !isFree && !PAYMENT_ENABLED;

  return (
    <div
      className={`glass-card hover-lift p-6 relative flex flex-col ${
        tier.recommended ? 'ring-2 ring-sign-primary' : ''
      }`}
    >
      {tier.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          Most Popular
        </div>
      )}

      <div className="text-center mb-4">
        <p className="font-devanagari text-sign-primary/70 text-sm">{tier.sanskrit}</p>
        <h3 className="font-heading text-xl text-text-primary mt-1">{tier.name}</h3>
        <div className="mt-3">
          <span className="text-3xl font-bold text-sign-primary">{tier.priceLabel}</span>
        </div>
        <p className="text-text-muted text-xs mt-1">{tier.duration}</p>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
            <span className="text-sign-primary mt-0.5 shrink-0">&#10003;</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="relative">
        <button
          onClick={() => !isDisabled && onSelect(tier.id)}
          disabled={isDisabled}
          className={`w-full px-6 py-3 rounded font-medium text-sm transition-all ${
            isDisabled
              ? 'bg-bg-light text-text-muted cursor-not-allowed opacity-60'
              : 'btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg'
          }`}
        >
          {isFree ? 'Ask Now — Free' : isDisabled ? 'Coming Soon' : `Select — ${tier.priceLabel}`}
        </button>

        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-cosmic-bg/80 backdrop-blur-sm text-text-muted text-xs px-3 py-1 rounded-full border border-sign-primary/20">
              Payment launching soon
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
