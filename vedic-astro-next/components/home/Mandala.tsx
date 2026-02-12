'use client';

export default function Mandala() {
  const size = 350;
  const cx = size / 2;
  const cy = size / 2;

  const outerDots = Array.from({ length: 27 }, (_, i) => {
    const angle = (i * 360 / 27) * Math.PI / 180;
    return { x: cx + 160 * Math.cos(angle), y: cy + 160 * Math.sin(angle) };
  });

  const petals = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30) * Math.PI / 180;
    const px = cx + 120 * Math.cos(angle);
    const py = cy + 120 * Math.sin(angle);
    const a1 = angle - 0.15;
    const a2 = angle + 0.15;
    return {
      d: `M${cx + 100 * Math.cos(a1)} ${cy + 100 * Math.sin(a1)} Q${px} ${py} ${cx + 100 * Math.cos(a2)} ${cy + 100 * Math.sin(a2)}`
    };
  });

  const gemColors = ['#FF6B35', '#C0C0C0', '#FF4444', '#51cf66', '#FFD700', '#FF69B4', '#4169E1', '#708090', '#FFD700'];
  const gems = gemColors.map((color, i) => {
    const angle = (i * 40) * Math.PI / 180;
    return { x: cx + 80 * Math.cos(angle), y: cy + 80 * Math.sin(angle), color };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[350px]">
      <g className="mandala-layer-slow">
        <circle cx={cx} cy={cy} r={160} fill="none" stroke="rgba(var(--sign-glow-rgb),0.3)" strokeWidth="1.5"/>
        {outerDots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={2.5} fill="rgba(var(--sign-glow-rgb),0.6)"/>
        ))}
      </g>
      <g className="mandala-layer-medium">
        <circle cx={cx} cy={cy} r={120} fill="none" stroke="rgba(var(--sign-glow-rgb),0.25)" strokeWidth="1.5"/>
        {petals.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke="rgba(var(--sign-glow-rgb),0.4)" strokeWidth="1.5"/>
        ))}
      </g>
      <g className="mandala-layer-fast">
        <circle cx={cx} cy={cy} r={80} fill="none" stroke="rgba(var(--sign-glow-rgb),0.25)" strokeWidth="1.5"/>
        {gems.map((g, i) => (
          <circle key={i} cx={g.x} cy={g.y} r={4} fill={g.color} opacity={0.8}/>
        ))}
      </g>
      <circle cx={cx} cy={cy} r={50} fill="rgba(var(--sign-glow-rgb),0.15)" stroke="rgba(var(--sign-glow-rgb),0.5)" strokeWidth="2"/>
      <text x={cx} y={cy + 5} textAnchor="middle" fill="var(--sign-primary)" fontSize="50" dominantBaseline="central" fontFamily="'Noto Sans Devanagari', serif" opacity="0.9">&#x0950;</text>
    </svg>
  );
}
