'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus('loading');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(result.message || 'Message sent successfully!');
        form.reset();
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please try again later.');
    }
  }

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4">
        <SectionHeader sanskrit={"संपर्क"} title="Contact Us" description="We'd love to hear from you" emoji="🙏" />

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-text-muted text-sm mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-text-muted text-sm mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-text-muted text-sm mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-text-muted text-sm mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-6 py-2 rounded font-medium transition-all disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {message && (
              <p className={`text-sm ${status === 'success' ? 'text-green-500' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
