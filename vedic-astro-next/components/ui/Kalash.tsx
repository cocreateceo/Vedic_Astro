interface KalashProps {
  /** Size in px (default 36) */
  size?: number;
  className?: string;
}

export default function Kalash({ size = 36, className = '' }: KalashProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      {/* Pot body — rounded brass vessel */}
      <path
        d="M18 38 Q16 28 20 22 Q24 18 32 18 Q40 18 44 22 Q48 28 46 38 Z"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M18 38 Q16 28 20 22 Q24 18 32 18 Q40 18 44 22 Q48 28 46 38 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Pot rim — wide lip */}
      <path
        d="M19 22 Q19 19 22 18 L42 18 Q45 19 45 22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Base / pedestal */}
      <path
        d="M22 38 Q22 42 26 43 L38 43 Q42 42 42 38"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <line x1="24" y1="43" x2="40" y2="43" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />

      {/* Mango leaves — 5 leaves fanning from the pot mouth */}
      <path d="M32 18 Q28 12 22 8" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M32 18 Q26 11 24 6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M32 18 Q32 10 32 4" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M32 18 Q38 11 40 6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M32 18 Q36 12 42 8" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* Leaf tips — small ovals */}
      <ellipse cx="22" cy="7.5" rx="2.5" ry="4" transform="rotate(-30 22 7.5)" fill="currentColor" opacity="0.3" />
      <ellipse cx="24" cy="5.5" rx="2" ry="3.5" transform="rotate(-15 24 5.5)" fill="currentColor" opacity="0.25" />
      <ellipse cx="32" cy="3.5" rx="2" ry="3.5" fill="currentColor" opacity="0.3" />
      <ellipse cx="40" cy="5.5" rx="2" ry="3.5" transform="rotate(15 40 5.5)" fill="currentColor" opacity="0.25" />
      <ellipse cx="42" cy="7.5" rx="2.5" ry="4" transform="rotate(30 42 7.5)" fill="currentColor" opacity="0.3" />

      {/* Coconut on top */}
      <circle cx="32" cy="14" r="4.5" fill="currentColor" opacity="0.35" />
      <circle cx="32" cy="14" r="4.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />

      {/* Pot body decorative bands */}
      <path d="M21 28 Q32 26 43 28" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M20 33 Q32 31 44 33" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* Water droplet accents */}
      <circle cx="26" cy="30" r="1" fill="currentColor" opacity="0.2" />
      <circle cx="38" cy="30" r="1" fill="currentColor" opacity="0.2" />
    </svg>
  );
}
