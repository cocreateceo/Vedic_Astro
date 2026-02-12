'use client';

interface Astrologer {
  name: string;
  avatar: string;
  specs: string[];
  rating: number;
  exp: string;
  consult: string;
  price: string;
}

interface AstrologerCardProps {
  astrologer: Astrologer;
  selected: boolean;
  onSelect: () => void;
}

export default function AstrologerCard({ astrologer: a, selected, onSelect }: AstrologerCardProps) {
  return (
    <div
      className={`glass-card hover-lift p-6 transition-all cursor-pointer ${
        selected ? 'ring-2 ring-sign-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{a.avatar}</div>
        <div className="flex-1">
          <h3 className="font-heading text-lg text-text-primary">{a.name}</h3>
          <div className="text-sign-primary text-sm mb-1">
            {'★'.repeat(a.rating)}{'☆'.repeat(5 - a.rating)}
          </div>
          <p className="text-text-muted text-xs mb-2">
            {a.exp} | {a.consult} consultations
          </p>
          <div className="flex gap-2 flex-wrap mb-3">
            {a.specs.map((s) => (
              <span
                key={s}
                className="text-xs bg-sign-primary/10 text-sign-primary px-2 py-1 rounded"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sign-primary font-medium">{a.price}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                selected
                  ? 'bg-sign-primary text-cosmic-bg'
                  : 'btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg'
              }`}
            >
              {selected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
