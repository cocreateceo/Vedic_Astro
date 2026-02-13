/**
 * Toran — Traditional Hindu door garland (bandhanwar).
 * Marigold flowers + mango leaves hanging in a decorative swag pattern.
 * Used below navbar and above footer for an authentic temple entrance feel.
 */
export default function Toran({ className = '' }: { className?: string }) {
  return (
    <div className={`toran-wrap w-full overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-[40px] md:h-[52px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Mango leaf gradient */}
          <linearGradient id="toranLeaf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A7C2E" />
            <stop offset="100%" stopColor="#2D5A1E" />
          </linearGradient>
          {/* Marigold flower gradient */}
          <radialGradient id="toranMarigold" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
          {/* Red flower accent */}
          <radialGradient id="toranRed" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="100%" stopColor="#C62828" />
          </radialGradient>
          {/* Thread/string */}
          <linearGradient id="toranThread" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="10%" stopColor="#D4A843" />
            <stop offset="90%" stopColor="#D4A843" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Main thread — gentle catenary swags */}
        <path
          d="M0 8 Q100 8 150 20 Q200 32 300 20 Q400 8 450 20 Q500 32 600 20 Q700 8 750 20 Q800 32 900 20 Q1000 8 1050 20 Q1100 32 1200 8"
          fill="none"
          stroke="url(#toranThread)"
          strokeWidth="2"
        />

        {/* Second thread for thickness */}
        <path
          d="M0 10 Q100 10 150 22 Q200 34 300 22 Q400 10 450 22 Q500 34 600 22 Q700 10 750 22 Q800 34 900 22 Q1000 10 1050 22 Q1100 34 1200 10"
          fill="none"
          stroke="url(#toranThread)"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Mango leaves along the swag — clusters at peaks & valleys */}
        {[75, 225, 375, 525, 675, 825, 975, 1125].map((x, i) => {
          const isValley = i % 2 === 0;
          const baseY = isValley ? 14 : 28;
          return (
            <g key={`leaf-${i}`} transform={`translate(${x}, ${baseY})`}>
              {/* Left leaf */}
              <ellipse cx="-8" cy="4" rx="3" ry="9" fill="url(#toranLeaf)" transform="rotate(-25 -8 4)" opacity="0.9" />
              <line x1="-8" y1="-3" x2="-8" y2="11" stroke="#3A6B24" strokeWidth="0.5" transform="rotate(-25 -8 4)" />
              {/* Center leaf */}
              <ellipse cx="0" cy="2" rx="3" ry="10" fill="url(#toranLeaf)" opacity="0.95" />
              <line x1="0" y1="-5" x2="0" y2="10" stroke="#3A6B24" strokeWidth="0.5" />
              {/* Right leaf */}
              <ellipse cx="8" cy="4" rx="3" ry="9" fill="url(#toranLeaf)" transform="rotate(25 8 4)" opacity="0.9" />
              <line x1="8" y1="-3" x2="8" y2="11" stroke="#3A6B24" strokeWidth="0.5" transform="rotate(25 8 4)" />
            </g>
          );
        })}

        {/* Marigold flowers at the lowest point of each swag */}
        {[150, 450, 750, 1050].map((x, i) => (
          <g key={`marigold-${i}`} transform={`translate(${x}, 24)`}>
            {/* Outer petals ring */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 6}
                cy={Math.sin((angle * Math.PI) / 180) * 6}
                rx="4"
                ry="3"
                fill="url(#toranMarigold)"
                transform={`rotate(${angle} ${Math.cos((angle * Math.PI) / 180) * 6} ${Math.sin((angle * Math.PI) / 180) * 6})`}
                opacity="0.9"
              />
            ))}
            {/* Inner petals ring */}
            {[22, 67, 112, 157, 202, 247, 292, 337].map((angle) => (
              <ellipse
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 3}
                cy={Math.sin((angle * Math.PI) / 180) * 3}
                rx="3"
                ry="2"
                fill="#FFB300"
                transform={`rotate(${angle} ${Math.cos((angle * Math.PI) / 180) * 3} ${Math.sin((angle * Math.PI) / 180) * 3})`}
              />
            ))}
            {/* Center */}
            <circle cx="0" cy="0" r="3" fill="#FF6F00" />
            <circle cx="0" cy="0" r="1.5" fill="#FFD54F" />
          </g>
        ))}

        {/* Small red flower accents between marigolds */}
        {[300, 600, 900].map((x, i) => (
          <g key={`red-${i}`} transform={`translate(${x}, 14)`}>
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 4}
                cy={Math.sin((angle * Math.PI) / 180) * 4}
                rx="2.5"
                ry="2"
                fill="url(#toranRed)"
                transform={`rotate(${angle} ${Math.cos((angle * Math.PI) / 180) * 4} ${Math.sin((angle * Math.PI) / 180) * 4})`}
                opacity="0.85"
              />
            ))}
            <circle cx="0" cy="0" r="2" fill="#FFCDD2" />
          </g>
        ))}

        {/* Small hanging bells at swag bottoms */}
        {[150, 450, 750, 1050].map((x) => (
          <g key={`bell-${x}`} transform={`translate(${x}, 40)`}>
            <line x1="0" y1="-4" x2="0" y2="0" stroke="#D4A843" strokeWidth="1" />
            <path d="M-4 0 Q-4 6 0 8 Q4 6 4 0 Z" fill="#D4A843" opacity="0.7" />
            <circle cx="0" cy="9" r="1" fill="#B8860B" />
          </g>
        ))}
      </svg>
    </div>
  );
}
