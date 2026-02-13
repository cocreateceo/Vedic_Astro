'use client';

interface RangoliCardProps {
  children: React.ReactNode;
  className?: string;
  /** Corner ornament size in px (default 32) */
  size?: number;
}

export default function RangoliCard({ children, className = '', size = 32 }: RangoliCardProps) {
  return (
    <div className={`rangoli-card ${className}`} style={{ '--rangoli-size': `${size}px` } as React.CSSProperties}>
      <svg className="rangoli-corner rangoli-tl" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <RangoliCorner />
      </svg>
      <svg className="rangoli-corner rangoli-tr" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <RangoliCorner />
      </svg>
      <svg className="rangoli-corner rangoli-bl" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <RangoliCorner />
      </svg>
      <svg className="rangoli-corner rangoli-br" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <RangoliCorner />
      </svg>
      {children}
    </div>
  );
}

function RangoliCorner() {
  return (
    <g>
      {/* Outer arc with dots */}
      <path
        d="M4 44 Q4 4 44 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
      {/* Inner arc */}
      <path
        d="M10 44 Q10 10 44 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.35"
      />
      {/* Corner lotus/paisley motif */}
      <circle cx="8" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.4" />
      {/* Petal dots along outer arc */}
      <circle cx="4" cy="32" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="8" cy="20" r="1.5" fill="currentColor" opacity="0.35" />
      <circle cx="20" cy="8" r="1.5" fill="currentColor" opacity="0.35" />
      <circle cx="32" cy="4" r="1.5" fill="currentColor" opacity="0.4" />
      {/* Diamond accent on inner arc */}
      <path d="M14 14 L16 12 L18 14 L16 16 Z" fill="currentColor" opacity="0.3" />
      {/* Small leaf strokes */}
      <path
        d="M6 26 Q10 24 8 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
      />
      <path
        d="M26 6 Q24 10 20 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
      />
    </g>
  );
}
