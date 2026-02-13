interface SriYantraProps {
  /** Size in px (default 400) */
  size?: number;
  /** CSS opacity (default 0.04) */
  opacity?: number;
  className?: string;
}

export default function SriYantra({ size = 400, opacity = 0.04, className = '' }: SriYantraProps) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bhupura — outer square gate with openings */}
        <rect x="30" y="30" width="440" height="440" stroke="currentColor" strokeWidth="3" />
        <rect x="40" y="40" width="420" height="420" stroke="currentColor" strokeWidth="2" />
        <rect x="48" y="48" width="404" height="404" stroke="currentColor" strokeWidth="1.5" />
        {/* Gate openings (T-shaped breaks) */}
        {/* Top */}
        <line x1="230" y1="30" x2="230" y2="48" stroke="currentColor" strokeWidth="1.5" />
        <line x1="270" y1="30" x2="270" y2="48" stroke="currentColor" strokeWidth="1.5" />
        {/* Bottom */}
        <line x1="230" y1="452" x2="230" y2="470" stroke="currentColor" strokeWidth="1.5" />
        <line x1="270" y1="452" x2="270" y2="470" stroke="currentColor" strokeWidth="1.5" />
        {/* Left */}
        <line x1="30" y1="230" x2="48" y2="230" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="270" x2="48" y2="270" stroke="currentColor" strokeWidth="1.5" />
        {/* Right */}
        <line x1="452" y1="230" x2="470" y2="230" stroke="currentColor" strokeWidth="1.5" />
        <line x1="452" y1="270" x2="470" y2="270" stroke="currentColor" strokeWidth="1.5" />

        {/* Outer lotus ring — 16 petals */}
        <circle cx="250" cy="250" r="195" stroke="currentColor" strokeWidth="1.5" />
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 - 90) * Math.PI / 180;
          const nextAngle = ((i + 1) * 22.5 - 90) * Math.PI / 180;
          const r = 195;
          const petalR = 215;
          const cx = 250, cy = 250;
          const x1 = cx + r * Math.cos(angle);
          const y1 = cy + r * Math.sin(angle);
          const x2 = cx + r * Math.cos(nextAngle);
          const y2 = cy + r * Math.sin(nextAngle);
          const midAngle = ((i + 0.5) * 22.5 - 90) * Math.PI / 180;
          const px = cx + petalR * Math.cos(midAngle);
          const py = cy + petalR * Math.sin(midAngle);
          return (
            <path
              key={`outer-petal-${i}`}
              d={`M${x1},${y1} Q${px},${py} ${x2},${y2}`}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          );
        })}

        {/* Inner lotus ring — 8 petals */}
        <circle cx="250" cy="250" r="165" stroke="currentColor" strokeWidth="1" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 - 90) * Math.PI / 180;
          const nextAngle = ((i + 1) * 45 - 90) * Math.PI / 180;
          const r = 165;
          const petalR = 185;
          const cx = 250, cy = 250;
          const x1 = cx + r * Math.cos(angle);
          const y1 = cy + r * Math.sin(angle);
          const x2 = cx + r * Math.cos(nextAngle);
          const y2 = cy + r * Math.sin(nextAngle);
          const midAngle = ((i + 0.5) * 45 - 90) * Math.PI / 180;
          const px = cx + petalR * Math.cos(midAngle);
          const py = cy + petalR * Math.sin(midAngle);
          return (
            <path
              key={`inner-petal-${i}`}
              d={`M${x1},${y1} Q${px},${py} ${x2},${y2}`}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          );
        })}

        {/* Nine interlocking triangles */}
        {/* 4 upward-pointing triangles (Shiva) */}
        <polygon points="250,85 370,375 130,375" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <polygon points="250,115 350,345 150,345" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polygon points="250,145 330,320 170,320" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <polygon points="250,170 315,300 185,300" stroke="currentColor" strokeWidth="1.2" fill="none" />

        {/* 5 downward-pointing triangles (Shakti) */}
        <polygon points="250,415 115,145 385,145" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <polygon points="250,390 135,165 365,165" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polygon points="250,365 155,185 345,185" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <polygon points="250,340 170,200 330,200" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <polygon points="250,318 188,218 312,218" stroke="currentColor" strokeWidth="1" fill="none" />

        {/* Bindu — central point */}
        <circle cx="250" cy="250" r="5" fill="currentColor" />
        <circle cx="250" cy="250" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
