'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Frequency = 'daily' | 'weekly' | 'monthly' | 'all';

const FREQUENCY_OPTIONS: { value: Frequency; label: string; desc: string }[] = [
  { value: 'daily', label: 'Daily', desc: 'Every morning at ~9:30 AM IST' },
  { value: 'weekly', label: 'Weekly', desc: 'Every Monday morning' },
  { value: 'monthly', label: 'Monthly', desc: '1st of each month' },
  { value: 'all', label: 'All', desc: 'Daily + Weekly + Monthly' },
];

export default function NewsletterPreferences() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(true);

  const NEWSLETTER_KEY = 'vedic_newsletter_pref';

  // Check subscription status on mount from localStorage
  useEffect(() => {
    if (!user?.email) {
      setChecking(false);
      return;
    }

    try {
      const saved = localStorage.getItem(NEWSLETTER_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.email === user.email && data.subscribed) {
          setIsSubscribed(true);
          setFrequency(data.frequency || 'weekly');
          setStatus('subscribed');
        }
      }
    } catch { /* ignore */ }
    setChecking(false);
  }, [user?.email]);

  async function handleSubscribe() {
    if (!user?.email) return;
    setStatus('loading');
    setMessage('');

    try {
      const data = { email: user.email, name: user.name, frequency, subscribed: true };
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
      setIsSubscribed(true);
      setStatus('subscribed');
      setMessage('Subscribed! You will receive personalized horoscope insights.');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  function handleUpdateFrequency(newFreq: Frequency) {
    if (!user?.email) return;
    setFrequency(newFreq);

    try {
      const saved = localStorage.getItem(NEWSLETTER_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data.frequency = newFreq;
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
      setMessage(`Frequency updated to ${newFreq}.`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to update.');
    }
  }

  if (checking) {
    return (
      <div className="glass-card hover-lift p-6">
        <h3 className="font-heading text-sign-primary text-sm mb-3">Newsletter</h3>
        <p className="text-text-muted text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <div className="glass-card hover-lift p-6">
      <h3 className="font-heading text-sign-primary text-sm mb-3">Newsletter</h3>

      {isSubscribed ? (
        <div>
          <p className="text-green-400 text-xs mb-3 flex items-center gap-1">
            <span>&#10003;</span> Subscribed
          </p>

          <p className="text-text-muted text-xs mb-2">Frequency:</p>
          <div className="space-y-1.5">
            {FREQUENCY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleUpdateFrequency(opt.value)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                  frequency === opt.value
                    ? 'bg-sign-primary/20 text-sign-primary border border-sign-primary/40'
                    : 'text-text-muted hover:text-sign-primary hover:bg-sign-primary/5 border border-transparent'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-text-muted ml-1">— {opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-text-muted text-xs mb-3">
            Get personalized Vedic horoscope insights delivered to your inbox.
          </p>

          <p className="text-text-muted text-xs mb-2">Choose frequency:</p>
          <div className="space-y-1.5 mb-3">
            {FREQUENCY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFrequency(opt.value)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                  frequency === opt.value
                    ? 'bg-sign-primary/20 text-sign-primary border border-sign-primary/40'
                    : 'text-text-muted hover:text-sign-primary hover:bg-sign-primary/5 border border-transparent'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-text-muted ml-1">— {opt.desc}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-2 rounded text-sm font-medium transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      )}

      {message && (
        <p className={`text-xs mt-2 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
