import type { ConsultationTierId } from '@/lib/consultation-config';

interface HowItWorksProps {
  tierId?: ConsultationTierId;
}

const FREE_STEPS = [
  { step: '1', title: 'Choose', desc: 'Pick your consultation tier and astrologer' },
  { step: '2', title: 'Ask', desc: 'Submit your question with birth details' },
  { step: '3', title: 'Get Answer', desc: 'Receive a detailed email reply within 48 hours' },
];

const PAID_STEPS = [
  { step: '1', title: 'Choose', desc: 'Select a tier and your preferred astrologer' },
  { step: '2', title: 'Pay', desc: 'Complete payment via Razorpay or Stripe' },
  { step: '3', title: 'Schedule', desc: 'Pick a convenient slot on Calendly' },
  { step: '4', title: 'Connect', desc: 'Join the live video session for personalized guidance' },
];

export default function HowItWorks({ tierId }: HowItWorksProps) {
  const steps = !tierId || tierId === 'free' ? FREE_STEPS : PAID_STEPS;

  return (
    <div className="glass-card p-8 max-w-3xl mx-auto text-center">
      <h3 className="font-heading text-xl text-sign-primary mb-6">How It Works</h3>
      <div className={`grid grid-cols-1 gap-6 ${steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
        {steps.map((s) => (
          <div key={s.step}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg flex items-center justify-center mx-auto mb-2 font-bold">
              {s.step}
            </div>
            <h4 className="text-text-primary font-medium mb-1">{s.title}</h4>
            <p className="text-text-muted text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
