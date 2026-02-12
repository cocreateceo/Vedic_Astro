'use client';

import { PAYMENT_ENABLED } from '@/lib/consultation-config';

interface CalendlyEmbedProps {
  calendlyUrl: string;
  name: string;
  email: string;
}

export default function CalendlyEmbed({ calendlyUrl, name, email }: CalendlyEmbedProps) {
  const url = `${calendlyUrl}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

  if (PAYMENT_ENABLED) {
    return (
      <div className="text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-8 py-3 rounded font-medium transition-all"
        >
          Schedule on Calendly
        </a>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-cosmic-bg/60 backdrop-blur-sm flex items-center justify-center z-10">
        <span className="text-text-muted text-sm border border-sign-primary/20 bg-cosmic-bg/80 px-4 py-2 rounded-full">
          Available after payment
        </span>
      </div>
      <div className="opacity-30">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sign-primary/10 flex items-center justify-center">
          <span className="text-2xl">&#128197;</span>
        </div>
        <p className="text-text-muted text-sm">Calendly scheduling will appear here</p>
      </div>
    </div>
  );
}
