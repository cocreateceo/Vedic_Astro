'use client';

import { useState } from 'react';

interface FreeConsultationFormProps {
  astrologer: string;
}

export default function FreeConsultationForm({ astrologer }: FreeConsultationFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setStatus('error');
      setErrorMsg('API not configured.');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          topic: data.topic,
          question: data.question,
          notes: '',
          astrologer,
          tier: 'free',
          preferredDate: new Date().toISOString().split('T')[0],
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card p-8 max-w-2xl mx-auto text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="font-heading text-xl text-sign-primary mb-2">Question Submitted!</h3>
        <p className="text-text-muted">
          Thank you! Our astrologer will reply to your email within 48 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sign-primary text-sm underline underline-offset-4"
        >
          Ask another question
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 max-w-2xl mx-auto">
      <h3 className="font-heading text-xl text-sign-primary mb-4 text-center">
        Ask {astrologer} a Question
      </h3>
      <p className="text-text-muted text-sm text-center mb-6">
        Free tier — you&apos;ll receive a detailed email reply within 48 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="free-name" className="block text-text-muted text-sm mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="free-name"
              name="name"
              required
              className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow"
            />
          </div>
          <div>
            <label htmlFor="free-email" className="block text-text-muted text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="free-email"
              name="email"
              required
              className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="free-phone" className="block text-text-muted text-sm mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="free-phone"
              name="phone"
              className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow"
            />
          </div>
          <div>
            <label htmlFor="free-topic" className="block text-text-muted text-sm mb-1">
              Topic
            </label>
            <select
              id="free-topic"
              name="topic"
              required
              className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow"
            >
              <option value="">Select a topic...</option>
              <option value="kundli">Kundli Analysis</option>
              <option value="marriage">Marriage Compatibility</option>
              <option value="career">Career Guidance</option>
              <option value="health">Health Concerns</option>
              <option value="muhurta">Muhurta (Auspicious Timing)</option>
              <option value="remedies">Remedies & Solutions</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="free-question" className="block text-text-muted text-sm mb-1">
            Your Question
          </label>
          <textarea
            id="free-question"
            name="question"
            required
            rows={4}
            placeholder="Describe your question in detail so our astrologer can give you the best guidance..."
            className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow resize-y"
          />
        </div>

        {errorMsg && (
          <p className="text-red-400 text-sm text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-6 py-3 rounded font-medium transition-all disabled:opacity-60"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Question — Free'}
        </button>
      </form>
    </div>
  );
}
