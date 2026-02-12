'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Link from 'next/link';

function ProfileContent() {
  const { user, updateBirthDetails, logout } = useAuth();

  if (!user) return null;

  const chart = user.vedicChart;

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const dob = (form.elements.namedItem('dob') as HTMLInputElement).value;
    const tob = (form.elements.namedItem('tob') as HTMLInputElement).value;
    const pob = (form.elements.namedItem('pob') as HTMLInputElement).value;
    const tz = (form.elements.namedItem('timezone') as HTMLSelectElement).value;
    updateBirthDetails(dob, tob, pob, tz);
  }

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4">
        <h1 className="font-heading text-2xl text-sign-primary mb-8">My Profile</h1>

        <div className="glass-card p-8 mb-6">
          <h2 className="font-heading text-lg text-sign-primary mb-4">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-text-muted">Name:</span> <span className="text-text-primary ml-2">{user.name}</span></div>
            <div><span className="text-text-muted">Email:</span> <span className="text-text-primary ml-2">{user.email}</span></div>
            <div><span className="text-text-muted">Joined:</span> <span className="text-text-primary ml-2">{new Date(user.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>

        <div className="glass-card p-8 mb-6">
          <h2 className="font-heading text-lg text-sign-primary mb-4">Vedic Chart Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-text-muted">Moon Sign:</span> <span className="text-text-primary ml-2">{chart.moonSign.symbol} {chart.moonSign.name}</span></div>
            <div><span className="text-text-muted">Sun Sign:</span> <span className="text-text-primary ml-2">{chart.sunSign.symbol} {chart.sunSign.name}</span></div>
            <div><span className="text-text-muted">Ascendant:</span> <span className="text-text-primary ml-2">{chart.ascendant.symbol} {chart.ascendant.name}</span></div>
            <div><span className="text-text-muted">Nakshatra:</span> <span className="text-text-primary ml-2">{chart.nakshatra}</span></div>
          </div>
        </div>

        <div className="glass-card p-8 mb-6">
          <h2 className="font-heading text-lg text-sign-primary mb-4">Edit Birth Details</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-text-muted text-sm block mb-1">Date of Birth</label><input type="date" name="dob" defaultValue={user.dob} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-sign-primary" /></div>
              <div><label className="text-text-muted text-sm block mb-1">Time of Birth</label><input type="time" name="tob" defaultValue={user.tob} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-sign-primary" /></div>
            </div>
            <div><label className="text-text-muted text-sm block mb-1">Place of Birth</label><input type="text" name="pob" defaultValue={user.pob} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-sign-primary" /></div>
            <div><label className="text-text-muted text-sm block mb-1">Timezone</label>
              <select name="timezone" defaultValue={user.timezone} className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-sign-primary">
                <option value="Asia/Kolkata">India (IST)</option><option value="America/New_York">US Eastern</option><option value="Europe/London">UK (GMT)</option>
              </select>
            </div>
            <button type="submit" className="bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-6 py-3 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(var(--sign-glow-rgb),0.3)] transition-all">Save & Recalculate</button>
          </form>
        </div>

        <div className="flex gap-4">
          <Link href="/dashboard" className="border border-sign-primary text-sign-primary px-4 py-2 rounded-lg text-sm hover:bg-sign-primary hover:text-cosmic-bg transition-all">Back to Dashboard</Link>
          <button onClick={logout} className="text-red-400 text-sm hover:text-red-300 transition-colors">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}
