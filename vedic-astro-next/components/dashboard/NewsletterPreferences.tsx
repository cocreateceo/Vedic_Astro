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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Check subscription status on mount
  useEffect(() => {
    if (!user?.email || !apiUrl) {
      setChecking(false);
      return;
    }

    fetch(`${apiUrl}/newsletter/status?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.subscribed) {
          setIsSubscribed(true);
          setFrequency(data.frequency || 'weekly');
          setStatus('subscribed');
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [user?.email, apiUrl]);

  async function handleSubscribe() {
    if (!user?.email || !apiUrl) return;
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${apiUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          dob: user.dob,
          tob: user.tob,
          pob: user.pob,
          frequency,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsSubscribed(true);
        setStatus('subscribed');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please try again later.');
    }
  }

  async function handleUpdateFrequency(newFreq: Frequency) {
    if (!user?.email || !apiUrl) return;
    const prevFreq = frequency;
    setFrequency(newFreq); // optimistic update

    try {
      const res = await fetch(`${apiUrl}/newsletter/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, frequency: newFreq }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Frequency updated to ${newFreq}.`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setFrequency(prevFreq); // rollback
        setMessage(data.error || 'Failed to update.');
      }
    } catch {
      setFrequency(prevFreq); // rollback
      setMessage('Unable to connect.');
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
