import { Planet, signNames, planetAbbrev, signAbbrev, calculateNavamsaSign, calculateNakshatraPada } from './kundli-calc';

function getNavamsaPlanetsForChart(planetPositions: Record<string, Planet>, ascendantIndex: number): Record<number, string[]> {
  const navamsaHousePlanets: Record<number, string[]> = {};
  // Calculate navamsa ascendant
  const ascDegree = 15; // midpoint of ascendant sign
  const { pada: ascPada } = calculateNakshatraPada(ascendantIndex, ascDegree);
  const navamsaAscSign = calculateNavamsaSign(ascendantIndex, ascPada);

  Object.entries(planetPositions).forEach(([planet, data]) => {
    const degree = parseFloat(data.degree);
    const { pada } = calculateNakshatraPada(data.signIndex, degree);
    const navamsaSign = calculateNavamsaSign(data.signIndex, pada);
    const house = ((navamsaSign - navamsaAscSign + 12) % 12) + 1;
    if (!navamsaHousePlanets[house]) navamsaHousePlanets[house] = [];
    navamsaHousePlanets[house].push(planetAbbrev[planet] || planet.substring(0, 2));
  });
  return navamsaHousePlanets;
}

export function generateNorthIndianChart(
  planetPositions: Record<string, Planet> | null,
  ascendantIndex: number,
  chartType: string = 'rashi'
): string {
  const housePlanets: Record<number, string[]> = {};
  if (planetPositions) {
    if (chartType === 'navamsa') {
      const navamsaPlanets = getNavamsaPlanetsForChart(planetPositions, ascendantIndex);
      Object.assign(housePlanets, navamsaPlanets);
    } else {
      Object.entries(planetPositions).forEach(([planet, data]) => {
        const house = data.house;
        if (!housePlanets[house]) housePlanets[house] = [];
        housePlanets[house].push(planetAbbrev[planet] || planet.substring(0, 2));
      });
    }
  }

  const planetTextPositions = [
    { x: 150, y: 55 }, { x: 80, y: 55 }, { x: 40, y: 100 },
    { x: 40, y: 155 }, { x: 40, y: 210 }, { x: 80, y: 250 },
    { x: 150, y: 250 }, { x: 220, y: 250 }, { x: 260, y: 210 },
    { x: 260, y: 155 }, { x: 260, y: 100 }, { x: 220, y: 55 }
  ];

  let svg = `<svg viewBox="0 0 300 300" class="kundli-svg" style="width:100%;height:auto;">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:var(--sign-primary)"/>
        <stop offset="100%" style="stop-color:var(--sign-dark)"/>
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="290" height="290" fill="rgba(22,33,62,0.9)" stroke="var(--sign-primary)" stroke-width="2" rx="4"/>
    <rect x="10" y="10" width="280" height="280" fill="none" stroke="var(--sign-primary)" stroke-width="1.5"/>
    <line x1="10" y1="10" x2="290" y2="290" stroke="var(--sign-primary)" stroke-width="1"/>
    <line x1="290" y1="10" x2="10" y2="290" stroke="var(--sign-primary)" stroke-width="1"/>
    <line x1="150" y1="10" x2="150" y2="290" stroke="var(--sign-primary)" stroke-width="1"/>
    <line x1="10" y1="150" x2="290" y2="150" stroke="var(--sign-primary)" stroke-width="1"/>
    <polygon points="150,80 220,150 150,220 80,150" fill="none" stroke="var(--sign-primary)" stroke-width="1"/>
    <text x="148" y="25" text-anchor="middle" fill="var(--sign-primary)" font-size="10" font-weight="bold">Asc</text>`;

  for (let house = 1; house <= 12; house++) {
    const pos = planetTextPositions[house - 1];
    const planetsList = housePlanets[house] || [];
    if (planetsList.length > 0) {
      svg += `<text x="${pos.x}" y="${pos.y + 15}" text-anchor="middle" fill="var(--sign-primary)" font-size="10" font-weight="500">${planetsList.join(' ')}</text>`;
    }
  }

  svg += `<text x="150" y="145" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>
    <text x="150" y="160" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>
  </svg>`;

  return svg;
}

export function generateSouthIndianChart(
  planetPositions: Record<string, Planet> | null,
  ascendantIndex: number,
  chartType: string = 'rashi'
): string {
  const signPositions = [
    { x: 0, y: 0, sign: 11 }, { x: 1, y: 0, sign: 0 },
    { x: 2, y: 0, sign: 1 }, { x: 3, y: 0, sign: 2 },
    { x: 3, y: 1, sign: 3 }, { x: 3, y: 2, sign: 4 },
    { x: 3, y: 3, sign: 5 }, { x: 2, y: 3, sign: 6 },
    { x: 1, y: 3, sign: 7 }, { x: 0, y: 3, sign: 8 },
    { x: 0, y: 2, sign: 9 }, { x: 0, y: 1, sign: 10 }
  ];

  const signPlanets: Record<number, string[]> = {};
  if (planetPositions) {
    if (chartType === 'navamsa') {
      Object.entries(planetPositions).forEach(([planet, data]) => {
        const degree = parseFloat(data.degree);
        const { pada } = calculateNakshatraPada(data.signIndex, degree);
        const navamsaSign = calculateNavamsaSign(data.signIndex, pada);
        if (!signPlanets[navamsaSign]) signPlanets[navamsaSign] = [];
        signPlanets[navamsaSign].push(planetAbbrev[planet] || planet.substring(0, 2));
      });
    } else {
      Object.entries(planetPositions).forEach(([planet, data]) => {
        const signIndex = signNames.indexOf(data.sign);
        if (!signPlanets[signIndex]) signPlanets[signIndex] = [];
        signPlanets[signIndex].push(planetAbbrev[planet] || planet.substring(0, 2));
      });
    }
  }

  const cellSize = 70;
  const padding = 5;
  const totalSize = cellSize * 4 + padding * 2;

  let svg = `<svg viewBox="0 0 ${totalSize} ${totalSize}" class="kundli-svg" style="width:100%;height:auto;">
    <rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="rgba(22,33,62,0.9)" stroke="var(--sign-primary)" stroke-width="2" rx="4"/>`;

  for (let i = 0; i <= 4; i++) {
    svg += `<line x1="${padding}" y1="${padding + cellSize * i}" x2="${totalSize - padding}" y2="${padding + cellSize * i}" stroke="var(--sign-primary)" stroke-width="1"/>`;
    svg += `<line x1="${padding + cellSize * i}" y1="${padding}" x2="${padding + cellSize * i}" y2="${totalSize - padding}" stroke="var(--sign-primary)" stroke-width="1"/>`;
  }

  svg += `<text x="${totalSize / 2}" y="${totalSize / 2 - 5}" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>
    <text x="${totalSize / 2}" y="${totalSize / 2 + 10}" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>`;

  signPositions.forEach((pos) => {
    const x = padding + pos.x * cellSize;
    const y = padding + pos.y * cellSize;
    const signIndex = pos.sign;
    const isAscendant = signIndex === ascendantIndex;

    svg += `<text x="${x + 5}" y="${y + 12}" fill="${isAscendant ? 'var(--sign-primary)' : '#888'}" font-size="9">${signAbbrev[signIndex]}</text>`;

    if (isAscendant) {
      svg += `<line x1="${x + cellSize - 15}" y1="${y + 3}" x2="${x + cellSize - 3}" y2="${y + 15}" stroke="var(--sign-primary)" stroke-width="2"/>`;
    }

    const planetsList = signPlanets[signIndex] || [];
    if (planetsList.length > 0) {
      const planetsText = planetsList.slice(0, 3).join(' ');
      svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 5}" text-anchor="middle" fill="var(--sign-primary)" font-size="10" font-weight="500">${planetsText}</text>`;
      if (planetsList.length > 3) {
        svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 18}" text-anchor="middle" fill="var(--sign-primary)" font-size="10">${planetsList.slice(3).join(' ')}</text>`;
      }
    }
  });

  svg += '</svg>';
  return svg;
}

export function generateEastIndianChart(
  planetPositions: Record<string, Planet> | null,
  ascendantIndex: number,
  chartType: string = 'rashi'
): string {
  // East Indian (Bengali) chart: 4x4 grid, signs around perimeter, Aries at top-left
  // Signs are fixed (like South Indian), but Aries starts at (0,0)
  const signPositions = [
    { x: 0, y: 0, sign: 0 },  { x: 1, y: 0, sign: 1 },
    { x: 2, y: 0, sign: 2 },  { x: 3, y: 0, sign: 3 },
    { x: 3, y: 1, sign: 4 },  { x: 3, y: 2, sign: 5 },
    { x: 3, y: 3, sign: 6 },  { x: 2, y: 3, sign: 7 },
    { x: 1, y: 3, sign: 8 },  { x: 0, y: 3, sign: 9 },
    { x: 0, y: 2, sign: 10 }, { x: 0, y: 1, sign: 11 }
  ];

  const signPlanets: Record<number, string[]> = {};
  if (planetPositions) {
    if (chartType === 'navamsa') {
      Object.entries(planetPositions).forEach(([planet, data]) => {
        const degree = parseFloat(data.degree);
        const { pada } = calculateNakshatraPada(data.signIndex, degree);
        const navamsaSign = calculateNavamsaSign(data.signIndex, pada);
        if (!signPlanets[navamsaSign]) signPlanets[navamsaSign] = [];
        signPlanets[navamsaSign].push(planetAbbrev[planet] || planet.substring(0, 2));
      });
    } else {
      Object.entries(planetPositions).forEach(([planet, data]) => {
        const signIndex = signNames.indexOf(data.sign);
        if (!signPlanets[signIndex]) signPlanets[signIndex] = [];
        signPlanets[signIndex].push(planetAbbrev[planet] || planet.substring(0, 2));
      });
    }
  }

  const cellSize = 70;
  const padding = 5;
  const totalSize = cellSize * 4 + padding * 2;

  let svg = `<svg viewBox="0 0 ${totalSize} ${totalSize}" class="kundli-svg" style="width:100%;height:auto;">
    <rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="rgba(22,33,62,0.9)" stroke="var(--sign-primary)" stroke-width="2" rx="4"/>`;

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    svg += `<line x1="${padding}" y1="${padding + cellSize * i}" x2="${totalSize - padding}" y2="${padding + cellSize * i}" stroke="var(--sign-primary)" stroke-width="1"/>`;
    svg += `<line x1="${padding + cellSize * i}" y1="${padding}" x2="${padding + cellSize * i}" y2="${totalSize - padding}" stroke="var(--sign-primary)" stroke-width="1"/>`;
  }

  // Diagonal lines in corner cells (characteristic East Indian style)
  const p = padding;
  const c = cellSize;
  svg += `<line x1="${p}" y1="${p}" x2="${p + c}" y2="${p + c}" stroke="var(--sign-primary)" stroke-width="0.7" opacity="0.6"/>`;
  svg += `<line x1="${p + c * 3}" y1="${p + c}" x2="${p + c * 4}" y2="${p}" stroke="var(--sign-primary)" stroke-width="0.7" opacity="0.6"/>`;
  svg += `<line x1="${p}" y1="${p + c * 4}" x2="${p + c}" y2="${p + c * 3}" stroke="var(--sign-primary)" stroke-width="0.7" opacity="0.6"/>`;
  svg += `<line x1="${p + c * 3}" y1="${p + c * 3}" x2="${p + c * 4}" y2="${p + c * 4}" stroke="var(--sign-primary)" stroke-width="0.7" opacity="0.6"/>`;

  // Center label
  svg += `<text x="${totalSize / 2}" y="${totalSize / 2 - 5}" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>
    <text x="${totalSize / 2}" y="${totalSize / 2 + 10}" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>`;

  signPositions.forEach((pos) => {
    const x = padding + pos.x * cellSize;
    const y = padding + pos.y * cellSize;
    const signIndex = pos.sign;
    const isAscendant = signIndex === ascendantIndex;

    svg += `<text x="${x + 5}" y="${y + 12}" fill="${isAscendant ? 'var(--sign-primary)' : '#888'}" font-size="9">${signAbbrev[signIndex]}</text>`;

    if (isAscendant) {
      svg += `<line x1="${x + cellSize - 15}" y1="${y + 3}" x2="${x + cellSize - 3}" y2="${y + 15}" stroke="var(--sign-primary)" stroke-width="2"/>`;
    }

    const planetsList = signPlanets[signIndex] || [];
    if (planetsList.length > 0) {
      const planetsText = planetsList.slice(0, 3).join(' ');
      svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 5}" text-anchor="middle" fill="var(--sign-primary)" font-size="10" font-weight="500">${planetsText}</text>`;
      if (planetsList.length > 3) {
        svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 18}" text-anchor="middle" fill="var(--sign-primary)" font-size="10">${planetsList.slice(3).join(' ')}</text>`;
      }
    }
  });

  svg += '</svg>';
  return svg;
}

export function generateWestIndianChart(
  planetPositions: Record<string, Planet> | null,
  ascendantIndex: number,
  chartType: string = 'rashi'
): string {
  // Circular wheel chart — 12 equal segments, house 1 at top
  const housePlanets: Record<number, string[]> = {};
  if (planetPositions) {
    if (chartType === 'navamsa') {
      const navamsaPlanets = getNavamsaPlanetsForChart(planetPositions, ascendantIndex);
      Object.assign(housePlanets, navamsaPlanets);
    } else {
      Object.entries(planetPositions).forEach(([planet, data]) => {
        const house = data.house;
        if (!housePlanets[house]) housePlanets[house] = [];
        housePlanets[house].push(planetAbbrev[planet] || planet.substring(0, 2));
      });
    }
  }

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 138;
  const innerR = 48;
  const midR = (outerR + innerR) / 2;
  const labelR = innerR + 14;
  const planetR = midR + 8;

  let svg = `<svg viewBox="0 0 ${size} ${size}" class="kundli-svg" style="width:100%;height:auto;">
    <rect x="0" y="0" width="${size}" height="${size}" fill="rgba(22,33,62,0.9)" stroke="var(--sign-primary)" stroke-width="2" rx="4"/>
    <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="var(--sign-primary)" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none" stroke="var(--sign-primary)" stroke-width="1"/>`;

  // 12 radial lines — house 1 starts at top (12 o'clock)
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);
    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--sign-primary)" stroke-width="0.8"/>`;
  }

  // Center text
  svg += `<text x="${cx}" y="${cy - 5}" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>`;
  svg += `<text x="${cx}" y="${cy + 10}" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>`;

  // House signs and planets
  for (let i = 0; i < 12; i++) {
    const house = i + 1;
    const midAngle = ((i * 30 + 15) - 90) * Math.PI / 180;
    const signIndex = (ascendantIndex + i) % 12;
    const isAscendant = house === 1;

    // Sign abbreviation (near inner edge)
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);
    svg += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" fill="${isAscendant ? 'var(--sign-primary)' : '#888'}" font-size="8" font-weight="${isAscendant ? 'bold' : 'normal'}">${signAbbrev[signIndex]}</text>`;

    // Planet text (in middle of segment)
    const planetsList = housePlanets[house] || [];
    if (planetsList.length > 0) {
      const px = cx + planetR * Math.cos(midAngle);
      const py = cy + planetR * Math.sin(midAngle);
      const line1 = planetsList.slice(0, 2).join(' ');
      svg += `<text x="${px.toFixed(1)}" y="${(py + 3).toFixed(1)}" text-anchor="middle" fill="var(--sign-primary)" font-size="9" font-weight="500">${line1}</text>`;
      if (planetsList.length > 2) {
        const line2 = planetsList.slice(2).join(' ');
        svg += `<text x="${px.toFixed(1)}" y="${(py + 14).toFixed(1)}" text-anchor="middle" fill="var(--sign-primary)" font-size="9">${line2}</text>`;
      }
    }
  }

  // Ascendant marker arrow at top
  svg += `<text x="${cx}" y="${cy - outerR - 3}" text-anchor="middle" fill="var(--sign-primary)" font-size="10" font-weight="bold">Asc</text>`;

  svg += '</svg>';
  return svg;
}

export function generateMiniChart(ascendantIndex: number): string {
  return `<svg viewBox="0 0 150 150" class="kundli-svg">
    <rect x="2" y="2" width="146" height="146" fill="rgba(22,33,62,0.9)" stroke="var(--sign-primary)" stroke-width="1" rx="2"/>
    <line x1="2" y1="2" x2="148" y2="148" stroke="var(--sign-primary)" stroke-width="0.5" opacity="0.5"/>
    <line x1="148" y1="2" x2="2" y2="148" stroke="var(--sign-primary)" stroke-width="0.5" opacity="0.5"/>
    <line x1="75" y1="2" x2="75" y2="148" stroke="var(--sign-primary)" stroke-width="0.5" opacity="0.5"/>
    <line x1="2" y1="75" x2="148" y2="75" stroke="var(--sign-primary)" stroke-width="0.5" opacity="0.5"/>
    <polygon points="75,40 110,75 75,110 40,75" fill="none" stroke="var(--sign-primary)" stroke-width="0.5"/>
    <text x="75" y="28" text-anchor="middle" fill="var(--sign-primary)" font-size="8">Asc</text>
    <text x="75" y="72" text-anchor="middle" fill="#888" font-size="7">${signAbbrev[ascendantIndex]}</text>
    <text x="75" y="82" text-anchor="middle" fill="#888" font-size="7">Chart</text>
  </svg>`;
}
