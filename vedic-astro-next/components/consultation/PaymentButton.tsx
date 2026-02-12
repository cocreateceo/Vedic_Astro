'use client';

import { PAYMENT_ENABLED } from '@/lib/consultation-config';

interface PaymentButtonProps {
  tierId: string;
  priceLabel: string;
}

export default function PaymentButton({ tierId, priceLabel }: PaymentButtonProps) {
  if (PAYMENT_ENABLED) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => {
            // TODO: load Razorpay.js and create order
            console.log('Razorpay checkout for', tierId);
          }}
          className="w-full btn-premium bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded font-medium transition-all flex items-center justify-center gap-2"
        >
          Pay {priceLabel} with Razorpay
        </button>
        <button
          onClick={() => {
            // TODO: redirect to Stripe Checkout
            console.log('Stripe checkout for', tierId);
          }}
          className="w-full btn-premium bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded font-medium transition-all flex items-center justify-center gap-2"
        >
          Pay {priceLabel} with Stripe
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 relative">
      <button
        disabled
        className="w-full bg-bg-light text-text-muted px-6 py-3 rounded font-medium opacity-50 cursor-not-allowed"
      >
        Razorpay — {priceLabel}
      </button>
      <button
        disabled
        className="w-full bg-bg-light text-text-muted px-6 py-3 rounded font-medium opacity-50 cursor-not-allowed"
      >
        Stripe — {priceLabel}
      </button>
      <div className="absolute inset-0 flex items-center justify-center bg-cosmic-bg/40 backdrop-blur-[2px] rounded">
        <span className="text-text-muted text-sm border border-sign-primary/20 bg-cosmic-bg/80 px-4 py-2 rounded-full">
          Payment launching soon
        </span>
      </div>
    </div>
  );
}
