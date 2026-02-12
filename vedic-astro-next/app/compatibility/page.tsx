'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { getNakshatraIndex, calculateGunaScores, getVerdict } from '@/lib/compatibility-calc';
import { GunaScore } from '@/types';

export default function CompatibilityPage() {
  const [result, setResult] = useState<{ names: string; scores: GunaScore[]; total: number; percentage: number } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name1 = (form.elements.namedItem('name1') as HTMLInputElement).value;
    const name2 = (form.elements.namedItem('name2') as HTMLInputElement).value;
    const dob1 = (form.elements.namedItem('dob1') as HTMLInputElement).value;
    const dob2 = (form.elements.namedItem('dob2') as HTMLInputElement).value;

    const n1 = getNakshatraIndex(dob1);
    const n2 = getNakshatraIndex(dob2);
    const scores = calculateGunaScores(n1, n2);
    const total = scores.reduce((sum, s) => sum + s.obtained, 0);

    setResult({ names: `${name1} & ${name2}`, scores, total: Math.round(total), percentage: Math.round((total / 36) * 100) });
  }

  const verdict = result ? getVerdict(result.total) : null;

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader sanskrit="गुण मिलान" title="Compatibility Check" description="Ashtakoot Gun Milan for marriage compatibility" />

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-heading text-sign-primary">Partner 1</h3>
                <div><label className="text-text-muted text-sm block mb-1">Name</label><input type="text" name="name1" required className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow" /></div>
                <div><label className="text-text-muted text-sm block mb-1">Date of Birth</label><input type="date" name="dob1" required className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow" /></div>
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-sign-primary">Partner 2</h3>
                <div><label className="text-text-muted text-sm block mb-1">Name</label><input type="text" name="name2" required className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow" /></div>
                <div><label className="text-text-muted text-sm block mb-1">Date of Birth</label><input type="date" name="dob2" required className="w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary focus-glow" /></div>
              </div>
            </div>
            <button type="submit" className="btn-premium w-full mt-6 bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all">Check Compatibility</button>
          </form>
        </div>

        {result && verdict && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass-card p-8 text-center">
              <h2 className="font-heading text-xl text-sign-primary mb-4">{result.names}</h2>
              <div className="score-circle mx-auto mb-4" style={{ '--score-percent': `${result.percentage}` } as React.CSSProperties}>
                <div className="score-circle-inner">
                  <div className="text-center">
                    <span className="text-3xl font-heading text-sign-primary">{result.total}</span>
                    <span className="text-text-muted text-sm block">/36</span>
                  </div>
                </div>
              </div>
              <h3 className="font-heading text-lg text-sign-primary mb-2">{verdict.title}</h3>
              <p className="text-text-muted">{verdict.description}</p>
            </div>

            <div className="glass-card p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-sign-primary/20">
                  <th className="text-left py-2 text-sign-primary/80">Guna</th>
                  <th className="text-left py-2 text-sign-primary/80">Max</th>
                  <th className="text-left py-2 text-sign-primary/80">Obtained</th>
                  <th className="text-left py-2 text-sign-primary/80">Aspect</th>
                </tr></thead>
                <tbody>
                  {result.scores.map(s => (
                    <tr key={s.name} className="border-b border-sign-primary/10 table-row-hover transition-colors">
                      <td className="py-2 text-text-primary font-medium">{s.name}</td>
                      <td className="py-2 text-text-muted">{s.max}</td>
                      <td className={`py-2 font-medium ${s.obtained >= s.max * 0.7 ? 'text-green-400' : s.obtained >= s.max * 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>{s.obtained}</td>
                      <td className="py-2 text-text-muted">{s.desc}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-sign-primary/30">
                    <td className="py-2 text-text-primary font-bold">Total</td>
                    <td className="py-2 text-text-primary font-bold">36</td>
                    <td className={`py-2 font-bold ${result.total >= 18 ? 'text-green-400' : 'text-red-400'}`}>{result.total}</td>
                    <td className="py-2 text-text-primary font-bold">{result.percentage}% Match</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
