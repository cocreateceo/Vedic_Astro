export function generateMoonPhaseSvg(tithiIndex: number): string {
  const cx = 40, cy = 40, r = 30;

  let illumination: number;
  if (tithiIndex <= 15) {
    illumination = tithiIndex / 15;
  } else {
    illumination = (30 - tithiIndex) / 15;
  }

  const sweepOffset = (1 - illumination * 2) * r;

  let svg = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#1A1A2E" stroke="rgba(var(--sign-glow-rgb),0.3)" stroke-width="1"/>`;

  if (illumination > 0.01) {
    if (tithiIndex <= 15) {
      svg += `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${Math.abs(sweepOffset)} ${r} 0 0 ${illumination > 0.5 ? 1 : 0} ${cx} ${cy - r}" fill="rgba(var(--sign-glow-rgb),0.6)"/>`;
    } else {
      svg += `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} A${Math.abs(sweepOffset)} ${r} 0 0 ${illumination > 0.5 ? 0 : 1} ${cx} ${cy - r}" fill="rgba(var(--sign-glow-rgb),0.6)"/>`;
    }
  }

  svg += '</svg>';
  return svg;
}
