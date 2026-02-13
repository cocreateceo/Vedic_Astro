'use client';

/**
 * G5 — Pooja Thali Loading Screen
 * A circular loading indicator styled as a traditional pooja thali
 * with sacred items arranged around a central diya.
 */

const thaliItems = ['🪷', '🍚', '🥥', '🪔', '🌺', '🍌'];

export default function PoojaThaliLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="pooja-thali-loader">
        <div className="pooja-thali-plate" />
        {thaliItems.map((item, i) => (
          <div key={i} className="pooja-thali-item">{item}</div>
        ))}
        <div className="pooja-thali-center">🕉️</div>
      </div>
      <p className="text-text-muted text-sm animate-pulse">{text}</p>
    </div>
  );
}
