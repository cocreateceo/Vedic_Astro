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
