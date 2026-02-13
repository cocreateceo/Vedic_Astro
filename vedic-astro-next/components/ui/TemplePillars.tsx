/**
 * TemplePillars — Ornate Hindu temple pillar silhouettes framing content.
 * Dravidian-style pillars with carved capital, fluted shaft, lotus base,
 * and decorative medallions. Hidden on mobile for clean layout.
 */
export default function TemplePillars({ className = '' }: { className?: string }) {
  const pillar = (flip = false) => (
    <svg
      viewBox="0 0 60 600"
      className={`w-[40px] md:w-[50px] lg:w-[60px] h-full ${flip ? 'scale-x-[-1]' : ''}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`pillarGrad${flip ? 'R' : 'L'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--sign-primary)" stopOpacity="0.12" />
          <stop offset="40%" stopColor="var(--sign-primary)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--sign-primary)" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id={`pillarEdge${flip ? 'R' : 'L'}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--sign-primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--sign-primary)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* === Capital (top) — stepped bracket with volute === */}
      {/* Top bracket - widest */}
      <rect x="5" y="10" width="50" height="6" rx="2" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.5" strokeOpacity="0.15" />
      {/* Second step */}
      <rect x="10" y="16" width="40" height="5" rx="1" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.5" strokeOpacity="0.12" />
      {/* Volute curves */}
      <path d="M12 21 Q12 28 18 30 L42 30 Q48 28 48 21" fill="none" stroke="var(--sign-primary)" strokeWidth="0.6" strokeOpacity="0.18" />
      {/* Neck band */}
      <rect x="15" y="30" width="30" height="4" rx="1" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.4" strokeOpacity="0.15" />

      {/* === Decorative medallion 1 === */}
      <circle cx="30" cy="50" r="8" fill="none" stroke="var(--sign-primary)" strokeWidth="0.5" strokeOpacity="0.15" />
      <circle cx="30" cy="50" r="5" fill="none" stroke="var(--sign-primary)" strokeWidth="0.4" strokeOpacity="0.12" />
      <circle cx="30" cy="50" r="2" fill="var(--sign-primary)" fillOpacity="0.08" />
      {/* Lotus petals around medallion */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx={30 + Math.cos((angle * Math.PI) / 180) * 8}
          cy={50 + Math.sin((angle * Math.PI) / 180) * 8}
          rx="2"
          ry="1"
          fill="var(--sign-primary)"
          fillOpacity="0.06"
          transform={`rotate(${angle} ${30 + Math.cos((angle * Math.PI) / 180) * 8} ${50 + Math.sin((angle * Math.PI) / 180) * 8})`}
        />
      ))}

      {/* === Fluted shaft === */}
      {/* Main shaft body */}
      <rect x="18" y="65" width="24" height="440" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} />
      {/* Fluting lines (vertical grooves) */}
      {[22, 26, 30, 34, 38].map((x) => (
        <line key={x} x1={x} y1="70" x2={x} y2="500" stroke="var(--sign-primary)" strokeWidth="0.3" strokeOpacity="0.08" />
      ))}
      {/* Edge highlight */}
      <line x1="18" y1="65" x2="18" y2="505" stroke="var(--sign-primary)" strokeWidth="0.6" strokeOpacity="0.15" />
      <line x1="42" y1="65" x2="42" y2="505" stroke="var(--sign-primary)" strokeWidth="0.3" strokeOpacity="0.08" />

      {/* === Mid-shaft band with diamond pattern === */}
      <rect x="15" y="220" width="30" height="6" rx="1" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.4" strokeOpacity="0.12" />
      {/* Diamond pattern */}
      {[20, 26, 32, 38].map((x) => (
        <path key={x} d={`M${x} 223 l3 3 l-3 3 l-3 -3 z`} fill="var(--sign-primary)" fillOpacity="0.06" stroke="var(--sign-primary)" strokeWidth="0.3" strokeOpacity="0.1" />
      ))}

      {/* === Decorative medallion 2 === */}
      <circle cx="30" cy="300" r="7" fill="none" stroke="var(--sign-primary)" strokeWidth="0.4" strokeOpacity="0.12" />
      <path d="M30 293 l2 4 l4 1 l-3 3 l0.5 4 l-3.5 -2 l-3.5 2 l0.5 -4 l-3 -3 l4 -1 z" fill="var(--sign-primary)" fillOpacity="0.06" />

      {/* === Second mid-band === */}
      <rect x="15" y="400" width="30" height="6" rx="1" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.4" strokeOpacity="0.12" />

      {/* === Base — stepped lotus pedestal === */}
      {/* Shaft bottom cap */}
      <rect x="15" y="505" width="30" height="5" rx="1" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.4" strokeOpacity="0.15" />
      {/* Lotus band */}
      <path d="M12 515 Q15 510 18 515 Q21 510 24 515 Q27 510 30 515 Q33 510 36 515 Q39 510 42 515 Q45 510 48 515"
        fill="none" stroke="var(--sign-primary)" strokeWidth="0.5" strokeOpacity="0.15" />
      {/* Base steps */}
      <rect x="10" y="518" width="40" height="5" rx="1" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.4" strokeOpacity="0.12" />
      <rect x="5" y="523" width="50" height="6" rx="2" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.5" strokeOpacity="0.15" />

      {/* Plinth */}
      <rect x="2" y="530" width="56" height="8" rx="2" fill={`url(#pillarGrad${flip ? 'R' : 'L'})`} stroke="var(--sign-primary)" strokeWidth="0.5" strokeOpacity="0.12" />
    </svg>
  );

  return (
    <div className={`absolute inset-0 pointer-events-none hidden lg:flex justify-between items-stretch overflow-hidden ${className}`} aria-hidden="true">
      <div className="flex items-stretch h-full ml-2 xl:ml-6">
        {pillar(false)}
      </div>
      <div className="flex items-stretch h-full mr-2 xl:mr-6">
        {pillar(true)}
      </div>
    </div>
  );
}
