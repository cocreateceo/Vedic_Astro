'use client';

interface SignMandalaProps {
  petals?: number;
  speed?: number;
  color?: string;
}

export default function SignMandala({ petals = 12, speed = 60, color = 'var(--sign-primary)' }: SignMandalaProps) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;

  const outerPetals = Array.from({ length: petals }, (_, i) => {
    const angle = (i * (360 / petals)) * Math.PI / 180;
    const px = cx + 160 * Math.cos(angle);
    const py = cy + 160 * Math.sin(angle);
    const a1 = angle - 0.2;
    const a2 = angle + 0.2;
    return `M${cx + 130 * Math.cos(a1)} ${cy + 130 * Math.sin(a1)} Q${px} ${py} ${cx + 130 * Math.cos(a2)} ${cy + 130 * Math.sin(a2)}`;
  });

  const innerPetals = Array.from({ length: petals * 2 }, (_, i) => {
    const angle = (i * (360 / (petals * 2))) * Math.PI / 180;
    const px = cx + 100 * Math.cos(angle);
    const py = cy + 100 * Math.sin(angle);
    const a1 = angle - 0.12;
    const a2 = angle + 0.12;
    return `M${cx + 80 * Math.cos(a1)} ${cy + 80 * Math.sin(a1)} Q${px} ${py} ${cx + 80 * Math.cos(a2)} ${cy + 80 * Math.sin(a2)}`;
  });

  const dots = Array.from({ length: 27 }, (_, i) => {
    const angle = (i * (360 / 27)) * Math.PI / 180;
    return { x: cx + 180 * Math.cos(angle), y: cy + 180 * Math.sin(angle) };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" style={{ opacity: 0.12 }}>
      <g style={{ animation: `mandalaRotate ${speed}s linear infinite`, transformOrigin: 'center' }}>
        <circle cx={cx} cy={cy} r={180} fill="none" stroke={color} strokeWidth="0.5" />
        {dots.map((d, i) => (
          <circle key={`d${i}`} cx={d.x} cy={d.y} r={2} fill={color} />
        ))}
      </g>
      <g style={{ animation: `mandalaRotate ${speed * 0.7}s linear infinite reverse`, transformOrigin: 'center' }}>
        <circle cx={cx} cy={cy} r={140} fill="none" stroke={color} strokeWidth="0.5" />
        {outerPetals.map((d, i) => (
          <path key={`op${i}`} d={d} fill="none" stroke={color} strokeWidth="1" />
        ))}
      </g>
      <g style={{ animation: `mandalaRotate ${speed * 0.5}s linear infinite`, transformOrigin: 'center' }}>
        <circle cx={cx} cy={cy} r={90} fill="none" stroke={color} strokeWidth="0.5" />
        {innerPetals.map((d, i) => (
          <path key={`ip${i}`} d={d} fill="none" stroke={color} strokeWidth="0.8" />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={50} fill="none" stroke={color} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={30} fill="none" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}
