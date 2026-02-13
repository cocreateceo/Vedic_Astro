'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Toran from '@/components/ui/Toran';
import AartiDiyaRow from '@/components/ui/AartiDiyaRow';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    // Save locally until backend is available
    try {
      const subs = JSON.parse(localStorage.getItem('vedic_newsletter_subs') || '[]');
      if (subs.includes(email.toLowerCase())) {
        setStatus('success');
        setMessage('You are already subscribed!');
        setEmail('');
        return;
      }
      subs.push(email.toLowerCase());
      localStorage.setItem('vedic_newsletter_subs', JSON.stringify(subs));
      setStatus('success');
      setMessage('Subscribed successfully! You will receive horoscope updates.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <footer className="border-t border-sign-primary/10 bg-cosmic-bg pt-0 pb-8">
      <Toran className="rotate-180 opacity-60 -mt-1" />
      <div className="max-w-[1200px] mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/images/vedic-astro-logo.jpg"
                alt="Vedic Astro"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="font-heading text-2xl text-sign-primary font-semibold">Vedic_Astro</span>
            </Link>
            <p className="text-text-muted text-sm">Your trusted source for authentic Vedic astrology insights, horoscopes, and spiritual guidance.</p>
          </div>
          <div>
            <h4 className="font-heading temple-gradient mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/horoscopes" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Horoscopes</Link></li>
              <li><Link href="/kundli" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Free Kundli</Link></li>
              <li><Link href="/compatibility" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Compatibility</Link></li>
              <li><Link href="/panchang" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Panchang</Link></li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-heading temple-gradient mb-4">Learn</h4>
              <ul className="space-y-2">
                <li><Link href="/zodiac" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Zodiac Signs</Link></li>
                <li><Link href="/articles" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Articles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading temple-gradient mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">About Us</Link></li>
                <li><Link href="/contact" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Contact</Link></li>
                <li><Link href="/privacy" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Privacy</Link></li>
                <li><Link href="/terms" className="text-text-muted text-sm hover:text-sign-primary transition-colors animated-underline">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-heading temple-gradient mb-4">Newsletter</h4>
            <p className="text-text-muted text-sm mb-3">Get daily horoscope updates</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                required
                className="bg-bg-light border border-sign-primary/20 rounded px-3 py-2 text-sm text-text-primary focus-glow flex-1 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-4 py-2 rounded text-sm font-medium transition-all disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Join'}
              </button>
            </form>
            {message && (
              <p className={`text-xs mt-2 ${status === 'success' ? 'text-green-500' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
        <AartiDiyaRow count={5} className="mb-6" />
        <div className="border-t border-sign-primary/10 pt-6 text-center">
          <p className="text-text-muted text-sm">&copy; 2026 Vedic_Astro. All rights reserved.</p>
          <p className="text-text-muted text-xs mt-2">Disclaimer: Astrology is for entertainment and guidance purposes. Major life decisions should be made with professional advice.</p>
        </div>
      </div>
    </footer>
  );
}
