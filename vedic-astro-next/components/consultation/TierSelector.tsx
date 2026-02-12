'use client';

import { useState } from 'react';
import { TIERS, PAYMENT_ENABLED, type ConsultationTierId } from '@/lib/consultation-config';
import TierCard from './TierCard';
import AstrologerCard from './AstrologerCard';
import FreeConsultationForm from './FreeConsultationForm';
import PaymentButton from './PaymentButton';
import CalendlyEmbed from './CalendlyEmbed';

const astrologers = [
  { name: 'Pt. Ramesh Shastri', avatar: '\uD83E\uDDD1', specs: ['Kundli', 'Muhurta', 'Prashna'], rating: 5, exp: '15+ years', consult: '5000+', price: '$30/session' },
  { name: 'Dr. Meera Joshi', avatar: '\uD83D\uDC69', specs: ['Nadi', 'Remedies', 'Career'], rating: 4, exp: '12+ years', consult: '3500+', price: '$25/session' },
  { name: 'Acharya Vikram Singh', avatar: '\uD83D\uDC68', specs: ['Prashna', 'Vastu', 'Marriage'], rating: 5, exp: '20+ years', consult: '8000+', price: '$40/session' },
  { name: 'Jyotishi Ananya Devi', avatar: '\uD83E\uDDD1', specs: ['Marriage', 'Career', 'Health'], rating: 4, exp: '10+ years', consult: '2800+', price: '$25/session' },
];

type Step = 'tier' | 'astrologer' | 'action';

const STEP_LABELS: Record<Step, string> = {
  tier: 'Choose Tier',
  astrologer: 'Select Astrologer',
  action: 'Book Session',
};

export default function TierSelector() {
  const [step, setStep] = useState<Step>('tier');
  const [selectedTier, setSelectedTier] = useState<ConsultationTierId | null>(null);
  const [selectedAstrologer, setSelectedAstrologer] = useState<string | null>(null);

  const currentTier = TIERS.find((t) => t.id === selectedTier);

  function handleTierSelect(tierId: string) {
    setSelectedTier(tierId as ConsultationTierId);
    setSelectedAstrologer(null);
    setStep('astrologer');
  }

  function handleAstrologerSelect(name: string) {
    setSelectedAstrologer(name);
    setStep('action');
  }

  function handleBack() {
    if (step === 'action') {
      setSelectedAstrologer(null);
      setStep('astrologer');
    } else if (step === 'astrologer') {
      setSelectedTier(null);
      setStep('tier');
    }
  }

  // Breadcrumb
  const steps: Step[] = ['tier', 'astrologer', 'action'];
  const currentIdx = steps.indexOf(step);

  return (
    <div>
      {/* Progress Breadcrumb */}
      <div className="flex items-center justify-center gap-2 mb-10 text-sm">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (i < currentIdx) {
                  if (i === 0) { setSelectedTier(null); setSelectedAstrologer(null); }
                  if (i === 1) { setSelectedAstrologer(null); }
                  setStep(s);
                }
              }}
              disabled={i > currentIdx}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                i === currentIdx
                  ? 'bg-sign-primary text-cosmic-bg'
                  : i < currentIdx
                    ? 'bg-sign-primary/20 text-sign-primary cursor-pointer hover:bg-sign-primary/30'
                    : 'bg-bg-light text-text-muted cursor-default'
              }`}
            >
              {STEP_LABELS[s]}
            </button>
            {i < steps.length - 1 && (
              <span className="text-text-muted/40">&#8250;</span>
            )}
          </div>
        ))}
      </div>

      {/* Back button */}
      {step !== 'tier' && (
        <button
          onClick={handleBack}
          className="text-sign-primary text-sm mb-6 flex items-center gap-1 hover:underline underline-offset-4"
        >
          &#8592; Back
        </button>
      )}

      {/* Step: Choose Tier */}
      {step === 'tier' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} onSelect={handleTierSelect} />
          ))}
        </div>
      )}

      {/* Step: Select Astrologer */}
      {step === 'astrologer' && selectedTier && (
        <div>
          <p className="text-text-muted text-center mb-6">
            {currentTier?.name} — Select an astrologer to continue
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {astrologers.map((a) => (
              <AstrologerCard
                key={a.name}
                astrologer={a}
                selected={selectedAstrologer === a.name}
                onSelect={() => handleAstrologerSelect(a.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step: Action (form / payment+calendly) */}
      {step === 'action' && selectedTier && selectedAstrologer && (
        <div className="space-y-8">
          {selectedTier === 'free' ? (
            <FreeConsultationForm astrologer={selectedAstrologer} />
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="font-heading text-xl text-sign-primary text-center">
                {currentTier?.name} with {selectedAstrologer}
              </h3>
              <p className="text-text-muted text-sm text-center">
                {currentTier?.duration}
              </p>
              <PaymentButton tierId={selectedTier} priceLabel={currentTier?.priceLabel || ''} />
              {PAYMENT_ENABLED && currentTier?.calendlyUrl && (
                <CalendlyEmbed
                  calendlyUrl={currentTier.calendlyUrl}
                  name=""
                  email=""
                />
              )}
              {!PAYMENT_ENABLED && currentTier?.calendlyUrl && (
                <CalendlyEmbed
                  calendlyUrl={currentTier.calendlyUrl}
                  name=""
                  email=""
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
