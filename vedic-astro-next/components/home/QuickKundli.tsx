'use client';

import { useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { usePetalConfetti } from '@/components/ui/PetalConfetti';
import SparkleWrap from '@/components/ui/SparkleWrap';
import PetalScatter from '@/components/ui/PetalScatter';
import { computeFullChart } from '@/lib/kundli-calc';
import { generateNorthIndianChart } from '@/lib/chart-svg';
import BirthDatePicker from '@/components/ui/BirthDatePicker';
import BirthTimePicker from '@/components/ui/BirthTimePicker';
import CityAutocomplete from '@/components/ui/CityAutocomplete';

export default function QuickKundli() {
  const [result, setResult] = useState<{ chartSvg: string; moonSign: string; moonSymbol: string; nakshatra: string; ascendant: string; ascSymbol: string } | null>(null);
  const triggerPetals = usePetalConfetti();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('qk-email') as HTMLInputElement).value.trim();
    const dob = (form.elements.namedItem('qk-dob') as HTMLInputElement).value;
    const time = (form.elements.namedItem('qk-time') as HTMLInputElement).value;
    const place = (form.elements.namedItem('qk-place') as HTMLInputElement).value.trim();
    if (!dob || !time) return;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    const { moonData, ascendant: asc, positions } = computeFullChart(dob, time, { place });
    const chartSvg = generateNorthIndianChart(positions, asc.signIndex, 'rashi');

    setResult({
      chartSvg,
      moonSign: moonData.signHindi,
      moonSymbol: moonData.symbol,
      nakshatra: moonData.nakshatra,
      ascendant: asc.signHindi,
      ascSymbol: asc.symbol,
    });
    triggerPetals();
  }

  return (
    <section className="py-16 md:py-24 sandalwood-bg">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="कुण्डली" title="Quick Kundli Preview" description="Enter your birth details to see a preview of your Vedic birth chart" emoji="🕉️" typewriter />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-8">
            <h3 className="font-heading text-sign-primary mb-6">Birth Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-text-muted text-sm block mb-1">Name</label>
                <input type="text" name="qk-name" placeholder="Enter your name" required className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow transition-colors" />
              </div>
              <div>
                <label className="text-text-muted text-sm block mb-1">Email ID</label>
                <input type="email" name="qk-email" placeholder="Enter your email" required pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}" title="Enter a valid email address (e.g. name@example.com)" className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow transition-colors" />
              </div>
              <div>
                <label className="text-text-muted text-sm block mb-1">Date of Birth</label>
                <BirthDatePicker name="qk-dob" required />
              </div>
              <div>
                <label className="text-text-muted text-sm block mb-1">Time of Birth</label>
                <BirthTimePicker name="qk-time" required />
              </div>
              <div>
                <label className="text-text-muted text-sm block mb-1">Place of Birth</label>
                <CityAutocomplete name="qk-place" required />
              </div>
              <PetalScatter count={10} className="w-full">
                <button type="submit" className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all">
                  Generate Preview
                </button>
              </PetalScatter>
            </form>
          </div>
          <div className="glass-card p-8 flex items-center justify-center">
            {result ? (
              <div className="w-full animate-fade-up">
                <div className="max-w-[300px] mx-auto mb-6" dangerouslySetInnerHTML={{ __html: result.chartSvg }} />
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Moon Sign', value: `${result.moonSymbol} ${result.moonSign}` },
                    { label: 'Nakshatra', value: result.nakshatra },
                    { label: 'Ascendant', value: `${result.ascSymbol} ${result.ascendant}` },
                  ].map(badge => (
                    <div key={badge.label} className="bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg p-3 text-center">
                      <span className="text-sign-primary/60 text-xs block">{badge.label}</span>
                      <span className="text-sign-primary text-sm font-medium">{badge.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/kundli" className="border-2 border-sign-primary text-sign-primary px-4 py-2 rounded-lg text-sm hover:bg-sign-primary hover:text-cosmic-bg transition-all inline-block">
                  View Full Report &rarr;
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4 notranslate" translate="no">&#10024;</div>
                <p className="text-text-muted">Your birth chart preview will appear here once you enter your details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
