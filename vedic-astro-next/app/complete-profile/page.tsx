'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import BirthDatePicker from '@/components/ui/BirthDatePicker';
import BirthTimePicker from '@/components/ui/BirthTimePicker';
import CityAutocomplete from '@/components/ui/CityAutocomplete';

function CompleteProfileContent() {
  const { user, updateBirthDetails } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = "w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-sign-primary/60 focus:shadow-[0_0_15px_rgba(var(--sign-glow-rgb),0.15)] transition-all duration-300";

  useEffect(() => {
    if (user && user.dob && user.tob && user.pob) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const form = e.currentTarget;
    const dob = (form.elements.namedItem('dob') as HTMLInputElement).value;
    const tob = (form.elements.namedItem('tob') as HTMLInputElement).value;
    const pob = (form.elements.namedItem('pob') as HTMLInputElement).value;
    const timezone = (form.elements.namedItem('timezone') as HTMLSelectElement).value;

    if (!dob || !tob || !pob) {
      setError('All birth details are required to generate your Vedic chart.');
      setSaving(false);
      return;
    }

    if (!timezone) {
      setError('Please select your birth place timezone.');
      setSaving(false);
      return;
    }

    try {
      await updateBirthDetails(dob, tob, pob, timezone);
      router.push('/dashboard');
    } catch {
      setError('Failed to save birth details. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-sign-primary/10 border border-sign-primary/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sign-primary">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl text-sign-primary mb-2">Complete Your Profile</h1>
            <p className="text-text-muted/70 text-sm">
              Enter your birth details to generate your personalized Vedic birth chart and horoscope.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg mb-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-muted text-sm block mb-1.5">Date of Birth</label>
                <BirthDatePicker name="dob" required />
              </div>
              <div>
                <label className="text-text-muted text-sm block mb-1.5">Time of Birth</label>
                <BirthTimePicker name="tob" required />
              </div>
            </div>

            <div>
              <label className="text-text-muted text-sm block mb-1.5">Place of Birth</label>
              <CityAutocomplete name="pob" required />
            </div>

            <div>
              <label className="text-text-muted text-sm block mb-1.5">Timezone</label>
              <select name="timezone" required className={inputClass}>
                <option value="">Select timezone</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="America/New_York">US Eastern</option>
                <option value="America/Chicago">US Central</option>
                <option value="America/Denver">US Mountain</option>
                <option value="America/Los_Angeles">US Pacific</option>
                <option value="Europe/London">UK (GMT)</option>
                <option value="Europe/Paris">Central Europe (CET)</option>
                <option value="Asia/Dubai">UAE (GST)</option>
                <option value="Asia/Singapore">Singapore (SGT)</option>
                <option value="Australia/Sydney">Australia (AEST)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Generating Your Chart...' : 'Generate My Vedic Chart'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return <ProtectedRoute><CompleteProfileContent /></ProtectedRoute>;
}
