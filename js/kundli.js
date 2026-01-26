// Kundli Calculator JavaScript with North & South Indian Charts

const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const hindiSignNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
                        'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

const signAbbrev = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const planetAbbrev = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke'
};

const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const dashaOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const dashaDurations = [7, 20, 6, 10, 7, 18, 16, 19, 17];

// Store current chart data for style switching
let currentPlanetPositions = null;
let currentChartStyle = 'north';
let currentAscendantIndex = 0;

// Generate North Indian style Kundli chart (Diamond pattern)
function generateNorthIndianChart(planetPositions, ascendantIndex, chartType = 'rashi') {
    // Group planets by house
    const housePlanets = {};
    if (planetPositions) {
        Object.entries(planetPositions).forEach(([planet, data]) => {
            const house = data.house;
            if (!housePlanets[house]) housePlanets[house] = [];
            housePlanets[house].push(planetAbbrev[planet] || planet.substring(0, 2));
        });
    }

    // North Indian chart - diamond pattern with houses
    // House positions in the diamond layout
    const houseCoords = [
        { x: 150, y: 30, textY: 50 },    // House 1 (Lagna - top center)
        { x: 75, y: 30, textY: 50 },     // House 2
        { x: 30, y: 75, textY: 95 },     // House 3
        { x: 30, y: 150, textY: 145 },   // House 4
        { x: 30, y: 225, textY: 195 },   // House 5
        { x: 75, y: 270, textY: 250 },   // House 6
        { x: 150, y: 270, textY: 250 },  // House 7
        { x: 225, y: 270, textY: 250 },  // House 8
        { x: 270, y: 225, textY: 195 },  // House 9
        { x: 270, y: 150, textY: 145 },  // House 10
        { x: 270, y: 75, textY: 95 },    // House 11
        { x: 225, y: 30, textY: 50 }     // House 12
    ];

    let svg = `
        <svg viewBox="0 0 300 300" class="kundli-svg" style="width: 100%; height: auto;">
            <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#D4AF37"/>
                    <stop offset="100%" style="stop-color:#B8860B"/>
                </linearGradient>
            </defs>

            <!-- Background -->
            <rect x="5" y="5" width="290" height="290" fill="rgba(22, 33, 62, 0.9)" stroke="#D4AF37" stroke-width="2" rx="4"/>

            <!-- Outer square -->
            <rect x="10" y="10" width="280" height="280" fill="none" stroke="#D4AF37" stroke-width="1.5"/>

            <!-- Diagonal lines creating diamond pattern -->
            <line x1="10" y1="10" x2="290" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="290" y1="10" x2="10" y2="290" stroke="#D4AF37" stroke-width="1"/>

            <!-- Cross lines -->
            <line x1="150" y1="10" x2="150" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="10" y1="150" x2="290" y2="150" stroke="#D4AF37" stroke-width="1"/>

            <!-- Inner diamond (center box) -->
            <polygon points="150,80 220,150 150,220 80,150" fill="none" stroke="#D4AF37" stroke-width="1"/>

            <!-- Lagna marker in house 1 -->
            <text x="148" y="25" text-anchor="middle" fill="#D4AF37" font-size="10" font-weight="bold">Asc</text>
    `;

    // Add house numbers at corners
    const houseNumPositions = [
        { x: 150, y: 60 },   // 1
        { x: 80, y: 40 },    // 2
        { x: 25, y: 80 },    // 3
        { x: 25, y: 150 },   // 4
        { x: 25, y: 220 },   // 5
        { x: 80, y: 265 },   // 6
        { x: 150, y: 265 },  // 7
        { x: 220, y: 265 },  // 8
        { x: 275, y: 220 },  // 9
        { x: 275, y: 150 },  // 10
        { x: 275, y: 80 },   // 11
        { x: 220, y: 40 }    // 12
    ];

    // Add planet text positions
    const planetTextPositions = [
        { x: 150, y: 55 },    // 1
        { x: 80, y: 55 },     // 2
        { x: 40, y: 100 },    // 3
        { x: 40, y: 155 },    // 4
        { x: 40, y: 210 },    // 5
        { x: 80, y: 250 },    // 6
        { x: 150, y: 250 },   // 7
        { x: 220, y: 250 },   // 8
        { x: 260, y: 210 },   // 9
        { x: 260, y: 155 },   // 10
        { x: 260, y: 100 },   // 11
        { x: 220, y: 55 }     // 12
    ];

    // Add planets to each house
    for (let house = 1; house <= 12; house++) {
        const pos = planetTextPositions[house - 1];
        const planetsList = housePlanets[house] || [];
        if (planetsList.length > 0) {
            const text = planetsList.join(' ');
            svg += `<text x="${pos.x}" y="${pos.y + 15}" text-anchor="middle" fill="#D4AF37" font-size="10" font-weight="500">${text}</text>`;
        }
    }

    // Center label
    svg += `
        <text x="150" y="145" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>
        <text x="150" y="160" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>
    `;

    svg += '</svg>';
    return svg;
}

// Generate South Indian style Kundli chart (Grid pattern with fixed signs)
function generateSouthIndianChart(planetPositions, ascendantIndex, chartType = 'rashi') {
    // South Indian chart - 4x4 grid with fixed sign positions
    // Signs are always in the same position, Ascendant is marked

    // Grid positions for the 12 houses (outer ring of 4x4, going clockwise from top-left)
    // Pisces starts at top-left, going right then down
    const signPositions = [
        // Top row: Pisces, Aries, Taurus, Gemini
        { x: 0, y: 0, sign: 11 },   // Pisces (12th sign, index 11)
        { x: 1, y: 0, sign: 0 },    // Aries
        { x: 2, y: 0, sign: 1 },    // Taurus
        { x: 3, y: 0, sign: 2 },    // Gemini
        // Right column: Cancer, Leo
        { x: 3, y: 1, sign: 3 },    // Cancer
        { x: 3, y: 2, sign: 4 },    // Leo
        // Bottom row (right to left): Virgo, Libra, Scorpio, Sagittarius
        { x: 3, y: 3, sign: 5 },    // Virgo
        { x: 2, y: 3, sign: 6 },    // Libra
        { x: 1, y: 3, sign: 7 },    // Scorpio
        { x: 0, y: 3, sign: 8 },    // Sagittarius
        // Left column (bottom to top): Capricorn, Aquarius
        { x: 0, y: 2, sign: 9 },    // Capricorn
        { x: 0, y: 1, sign: 10 }    // Aquarius
    ];

    // Map planets to their signs
    const signPlanets = {};
    if (planetPositions) {
        Object.entries(planetPositions).forEach(([planet, data]) => {
            const signIndex = signNames.indexOf(data.sign);
            if (!signPlanets[signIndex]) signPlanets[signIndex] = [];
            signPlanets[signIndex].push(planetAbbrev[planet] || planet.substring(0, 2));
        });
    }

    const cellSize = 70;
    const padding = 5;
    const totalSize = cellSize * 4 + padding * 2;

    let svg = `
        <svg viewBox="0 0 ${totalSize} ${totalSize}" class="kundli-svg" style="width: 100%; height: auto;">
            <defs>
                <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#D4AF37"/>
                    <stop offset="100%" style="stop-color:#B8860B"/>
                </linearGradient>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="rgba(22, 33, 62, 0.9)" stroke="#D4AF37" stroke-width="2" rx="4"/>

            <!-- Grid lines -->
            <line x1="${padding}" y1="${padding}" x2="${totalSize - padding}" y2="${padding}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${padding}" y1="${padding + cellSize}" x2="${totalSize - padding}" y2="${padding + cellSize}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${padding}" y1="${padding + cellSize * 2}" x2="${totalSize - padding}" y2="${padding + cellSize * 2}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${padding}" y1="${padding + cellSize * 3}" x2="${totalSize - padding}" y2="${padding + cellSize * 3}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${padding}" y1="${totalSize - padding}" x2="${totalSize - padding}" y2="${totalSize - padding}" stroke="#D4AF37" stroke-width="1"/>

            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${totalSize - padding}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${padding + cellSize}" y1="${padding}" x2="${padding + cellSize}" y2="${totalSize - padding}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${padding + cellSize * 2}" y1="${padding}" x2="${padding + cellSize * 2}" y2="${totalSize - padding}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${padding + cellSize * 3}" y1="${padding}" x2="${padding + cellSize * 3}" y2="${totalSize - padding}" stroke="#D4AF37" stroke-width="1"/>
            <line x1="${totalSize - padding}" y1="${padding}" x2="${totalSize - padding}" y2="${totalSize - padding}" stroke="#D4AF37" stroke-width="1"/>

            <!-- Center area label -->
            <text x="${totalSize / 2}" y="${totalSize / 2 - 5}" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>
            <text x="${totalSize / 2}" y="${totalSize / 2 + 10}" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>
    `;

    // Draw each sign box
    signPositions.forEach((pos, index) => {
        const x = padding + pos.x * cellSize;
        const y = padding + pos.y * cellSize;
        const signIndex = pos.sign;
        const isAscendant = signIndex === ascendantIndex;

        // Sign abbreviation in top-left corner
        svg += `<text x="${x + 5}" y="${y + 12}" fill="${isAscendant ? '#D4AF37' : '#888'}" font-size="9">${signAbbrev[signIndex]}</text>`;

        // Ascendant marker (diagonal line in corner)
        if (isAscendant) {
            svg += `<line x1="${x + cellSize - 15}" y1="${y + 3}" x2="${x + cellSize - 3}" y2="${y + 15}" stroke="#D4AF37" stroke-width="2"/>`;
            svg += `<text x="${x + cellSize - 10}" y="${y + 12}" fill="#D4AF37" font-size="8">As</text>`;
        }

        // Planets in this sign
        const planetsList = signPlanets[signIndex] || [];
        if (planetsList.length > 0) {
            const planetsText = planetsList.slice(0, 3).join(' ');
            svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 5}" text-anchor="middle" fill="#D4AF37" font-size="10" font-weight="500">${planetsText}</text>`;
            if (planetsList.length > 3) {
                const remainingText = planetsList.slice(3).join(' ');
                svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 18}" text-anchor="middle" fill="#D4AF37" font-size="10">${remainingText}</text>`;
            }
        }
    });

    svg += '</svg>';
    return svg;
}

// Calculate planetary positions (simplified)
function calculatePlanetaryPositions(birthDate, birthTime) {
    const date = new Date(birthDate + 'T' + birthTime);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const hour = date.getHours();

    const positions = {};

    planets.forEach((planet, index) => {
        const seed = dayOfYear + index * 31 + hour;
        const signIndex = (seed * 7) % 12;
        const degree = ((seed * 13) % 30);
        const house = ((signIndex + Math.floor(hour / 2)) % 12) + 1;
        const nakshatraIndex = Math.floor((signIndex * 30 + degree) / 13.333) % 27;

        positions[planet] = {
            sign: signNames[signIndex],
            signIndex: signIndex,
            signHindi: hindiSignNames[signIndex],
            degree: degree.toFixed(2),
            house: house,
            nakshatra: nakshatras[nakshatraIndex],
            retrograde: (seed % 5 === 0 && ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(planet))
        };
    });

    return positions;
}

// Calculate Ascendant
function calculateAscendant(birthTime) {
    const hour = parseInt(birthTime.split(':')[0]);
    const signIndex = Math.floor(hour / 2) % 12;
    return {
        sign: signNames[signIndex],
        signIndex: signIndex,
        signHindi: hindiSignNames[signIndex],
        symbol: signSymbols[signIndex]
    };
}

// Calculate Moon Sign and Nakshatra
function calculateMoonSign(birthDate) {
    const date = new Date(birthDate);
    const dayOfMonth = date.getDate();
    const month = date.getMonth();

    const signIndex = (dayOfMonth + month) % 12;
    const nakshatraIndex = (dayOfMonth * 27 / 30) % 27;

    return {
        sign: signNames[signIndex],
        signHindi: hindiSignNames[signIndex],
        symbol: signSymbols[signIndex],
        nakshatra: nakshatras[Math.floor(nakshatraIndex)]
    };
}

// Calculate Vimshottari Dasha periods
function calculateDasha(birthDate, moonNakshatra) {
    const nakshatraIndex = nakshatras.indexOf(moonNakshatra);
    const dashaLordIndex = nakshatraIndex % 9;

    const dashas = [];
    let currentYear = new Date(birthDate).getFullYear();

    const balanceYears = (dashaDurations[dashaLordIndex] * 0.6);

    for (let i = 0; i < 9; i++) {
        const index = (dashaLordIndex + i) % 9;
        const planet = dashaOrder[index];
        const duration = i === 0 ? balanceYears : dashaDurations[index];
        const endYear = currentYear + duration;

        dashas.push({
            planet: planet,
            startYear: Math.floor(currentYear),
            endYear: Math.floor(endYear),
            duration: duration,
            isCurrent: new Date().getFullYear() >= currentYear && new Date().getFullYear() < endYear
        });

        currentYear = endYear;
    }

    return dashas;
}

// Calculate Tithi
function calculateTithi(birthDate) {
    const date = new Date(birthDate);
    const daysSinceNewMoon = date.getDate() % 15;
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    const paksha = date.getDate() <= 15 ? 'Shukla' : 'Krishna';
    return `${paksha} ${tithis[daysSinceNewMoon]}`;
}

// Calculate Yoga
function calculateYoga(birthDate) {
    const date = new Date(birthDate);
    const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
                   'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
                   'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
                   'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
                   'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
                   'Indra', 'Vaidhriti'];
    const index = (date.getDate() + date.getMonth()) % 27;
    return yogas[index];
}

// Switch chart style function
function switchChartStyle(style) {
    currentChartStyle = style;

    // Update button states
    document.getElementById('north-btn').classList.toggle('active', style === 'north');
    document.getElementById('south-btn').classList.toggle('active', style === 'south');

    // Re-render charts if we have data
    if (currentPlanetPositions) {
        renderCharts();
    }
}

// Render charts with current style
function renderCharts() {
    if (currentChartStyle === 'north') {
        document.getElementById('rashi-chart').innerHTML = generateNorthIndianChart(currentPlanetPositions, currentAscendantIndex, 'rashi');
        document.getElementById('navamsa-chart').innerHTML = generateNorthIndianChart(currentPlanetPositions, currentAscendantIndex, 'navamsa');
    } else {
        document.getElementById('rashi-chart').innerHTML = generateSouthIndianChart(currentPlanetPositions, currentAscendantIndex, 'rashi');
        document.getElementById('navamsa-chart').innerHTML = generateSouthIndianChart(currentPlanetPositions, currentAscendantIndex, 'navamsa');
    }
}

// Make switchChartStyle available globally
window.switchChartStyle = switchChartStyle;

// Form submission handler
document.getElementById('kundli-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const birthDate = document.getElementById('birth-date').value;
    const birthTime = document.getElementById('birth-time').value;
    const birthPlace = document.getElementById('birth-place').value;
    const chartStyle = document.getElementById('chart-style').value;

    // Calculate all astrological data
    const moonData = calculateMoonSign(birthDate);
    const ascendant = calculateAscendant(birthTime);
    const planetPositions = calculatePlanetaryPositions(birthDate, birthTime);
    const dashas = calculateDasha(birthDate, moonData.nakshatra);

    // Store for chart style switching
    currentPlanetPositions = planetPositions;
    currentAscendantIndex = ascendant.signIndex;
    currentChartStyle = chartStyle;

    // Update button states
    document.getElementById('north-btn').classList.toggle('active', chartStyle === 'north');
    document.getElementById('south-btn').classList.toggle('active', chartStyle === 'south');

    // Update UI
    document.getElementById('result-name').textContent = `${name}'s Birth Chart`;
    document.getElementById('moon-sign').textContent = `${moonData.symbol} ${moonData.signHindi}`;
    document.getElementById('birth-nakshatra').textContent = moonData.nakshatra;
    document.getElementById('ascendant').textContent = `${ascendant.symbol} ${ascendant.signHindi}`;
    document.getElementById('sun-sign').textContent = `${planetPositions['Sun'].sign}`;
    document.getElementById('birth-tithi').textContent = calculateTithi(birthDate);
    document.getElementById('birth-yoga').textContent = calculateYoga(birthDate);

    // Generate charts
    renderCharts();

    // Populate planet table
    const planetTable = document.getElementById('planet-positions');
    planetTable.innerHTML = '';

    planets.forEach(planet => {
        const data = planetPositions[planet];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${planet}</strong>${data.retrograde ? ' (R)' : ''}</td>
            <td>${data.signHindi} (${data.sign})</td>
            <td>${data.degree}°</td>
            <td>${data.house}</td>
            <td>${data.nakshatra}</td>
        `;
        planetTable.appendChild(row);
    });

    // Populate Dasha list
    const dashaList = document.getElementById('dasha-list');
    dashaList.innerHTML = '';

    dashas.forEach(dasha => {
        const div = document.createElement('div');
        div.className = `dasha-item${dasha.isCurrent ? ' dasha-current' : ''}`;
        div.innerHTML = `
            <span class="dasha-planet">${dasha.planet} Mahadasha${dasha.isCurrent ? ' (Current)' : ''}</span>
            <span class="dasha-period">${dasha.startYear} - ${dasha.endYear}</span>
        `;
        dashaList.appendChild(div);
    });

    // Show results
    document.getElementById('kundli-result').classList.add('active');

    // Scroll to results
    document.getElementById('kundli-result').scrollIntoView({ behavior: 'smooth' });
});
