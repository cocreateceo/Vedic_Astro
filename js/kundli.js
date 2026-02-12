// Kundli Calculator JavaScript with North & South Indian Charts
// Uses AstroEngine (bundled from vedic-astro-next/lib/astro) for real astronomical calculations.

const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const hindiSignNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
                        'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

const signAbbrev = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

const planetList = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

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

// City database for place resolution (subset — legacy site)
const CITY_DB = {
    'delhi': { lat: 28.61, lng: 77.21, tz: 5.5 },
    'new delhi': { lat: 28.61, lng: 77.21, tz: 5.5 },
    'mumbai': { lat: 19.08, lng: 72.88, tz: 5.5 },
    'bombay': { lat: 19.08, lng: 72.88, tz: 5.5 },
    'kolkata': { lat: 22.57, lng: 88.36, tz: 5.5 },
    'calcutta': { lat: 22.57, lng: 88.36, tz: 5.5 },
    'chennai': { lat: 13.08, lng: 80.27, tz: 5.5 },
    'madras': { lat: 13.08, lng: 80.27, tz: 5.5 },
    'bengaluru': { lat: 12.97, lng: 77.59, tz: 5.5 },
    'bangalore': { lat: 12.97, lng: 77.59, tz: 5.5 },
    'hyderabad': { lat: 17.39, lng: 78.49, tz: 5.5 },
    'ahmedabad': { lat: 23.02, lng: 72.57, tz: 5.5 },
    'pune': { lat: 18.52, lng: 73.86, tz: 5.5 },
    'poona': { lat: 18.52, lng: 73.86, tz: 5.5 },
    'jaipur': { lat: 26.91, lng: 75.79, tz: 5.5 },
    'lucknow': { lat: 26.85, lng: 80.95, tz: 5.5 },
    'varanasi': { lat: 25.32, lng: 83.01, tz: 5.5 },
    'benares': { lat: 25.32, lng: 83.01, tz: 5.5 },
    'kochi': { lat: 9.93, lng: 76.26, tz: 5.5 },
    'cochin': { lat: 9.93, lng: 76.26, tz: 5.5 },
    'chandigarh': { lat: 30.73, lng: 76.78, tz: 5.5 },
    'patna': { lat: 25.60, lng: 85.10, tz: 5.5 },
    'guwahati': { lat: 26.14, lng: 91.74, tz: 5.5 },
    'thiruvananthapuram': { lat: 8.52, lng: 76.94, tz: 5.5 },
    'trivandrum': { lat: 8.52, lng: 76.94, tz: 5.5 },
    'new york': { lat: 40.71, lng: -74.01, tz: -5 },
    'los angeles': { lat: 34.05, lng: -118.24, tz: -8 },
    'london': { lat: 51.51, lng: -0.13, tz: 0 },
    'dubai': { lat: 25.20, lng: 55.27, tz: 4 },
    'singapore': { lat: 1.35, lng: 103.82, tz: 8 },
    'sydney': { lat: -33.87, lng: 151.21, tz: 11 },
    'toronto': { lat: 43.65, lng: -79.38, tz: -5 },
};

function resolveCity(placeName) {
    if (!placeName) return CITY_DB['delhi'];
    const key = placeName.trim().toLowerCase();
    if (CITY_DB[key]) return CITY_DB[key];
    // Partial match
    for (const k of Object.keys(CITY_DB)) {
        if (k.startsWith(key) || key.startsWith(k)) return CITY_DB[k];
    }
    console.warn(`City "${placeName}" not found, defaulting to Delhi.`);
    return CITY_DB['delhi'];
}

// Store current chart data for style switching
let currentPlanetPositions = null;
let currentNavamsaPositions = null;
let currentChartStyle = 'north';
let currentAscendantIndex = 0;
let currentNavamsaAscIndex = 0;

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

    let svg = `
        <svg viewBox="0 0 300 300" class="kundli-svg" style="width: 100%; height: auto;">
            <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#D4AF37"/>
                    <stop offset="100%" style="stop-color:#B8860B"/>
                </linearGradient>
            </defs>
            <rect x="5" y="5" width="290" height="290" fill="rgba(22, 33, 62, 0.9)" stroke="#D4AF37" stroke-width="2" rx="4"/>
            <rect x="10" y="10" width="280" height="280" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
            <line x1="10" y1="10" x2="290" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="290" y1="10" x2="10" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="150" y1="10" x2="150" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="10" y1="150" x2="290" y2="150" stroke="#D4AF37" stroke-width="1"/>
            <polygon points="150,80 220,150 150,220 80,150" fill="none" stroke="#D4AF37" stroke-width="1"/>
            <text x="148" y="25" text-anchor="middle" fill="#D4AF37" font-size="10" font-weight="bold">Asc</text>
    `;

    const planetTextPositions = [
        { x: 150, y: 55 }, { x: 80, y: 55 }, { x: 40, y: 100 }, { x: 40, y: 155 },
        { x: 40, y: 210 }, { x: 80, y: 250 }, { x: 150, y: 250 }, { x: 220, y: 250 },
        { x: 260, y: 210 }, { x: 260, y: 155 }, { x: 260, y: 100 }, { x: 220, y: 55 }
    ];

    for (let house = 1; house <= 12; house++) {
        const pos = planetTextPositions[house - 1];
        const pl = housePlanets[house] || [];
        if (pl.length > 0) {
            svg += `<text x="${pos.x}" y="${pos.y + 15}" text-anchor="middle" fill="#D4AF37" font-size="10" font-weight="500">${pl.join(' ')}</text>`;
        }
    }

    svg += `
        <text x="150" y="145" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>
        <text x="150" y="160" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>
    </svg>`;
    return svg;
}

// Generate South Indian style Kundli chart (Grid pattern with fixed signs)
function generateSouthIndianChart(planetPositions, ascendantIndex, chartType = 'rashi') {
    const signPositions = [
        { x: 0, y: 0, sign: 11 }, { x: 1, y: 0, sign: 0 }, { x: 2, y: 0, sign: 1 }, { x: 3, y: 0, sign: 2 },
        { x: 3, y: 1, sign: 3 }, { x: 3, y: 2, sign: 4 },
        { x: 3, y: 3, sign: 5 }, { x: 2, y: 3, sign: 6 }, { x: 1, y: 3, sign: 7 }, { x: 0, y: 3, sign: 8 },
        { x: 0, y: 2, sign: 9 }, { x: 0, y: 1, sign: 10 }
    ];

    const signPlanets = {};
    if (planetPositions) {
        Object.entries(planetPositions).forEach(([planet, data]) => {
            const si = signNames.indexOf(data.sign);
            if (!signPlanets[si]) signPlanets[si] = [];
            signPlanets[si].push(planetAbbrev[planet] || planet.substring(0, 2));
        });
    }

    const cellSize = 70, padding = 5, totalSize = cellSize * 4 + padding * 2;

    let svg = `
        <svg viewBox="0 0 ${totalSize} ${totalSize}" class="kundli-svg" style="width: 100%; height: auto;">
            <defs><linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#B8860B"/></linearGradient></defs>
            <rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="rgba(22, 33, 62, 0.9)" stroke="#D4AF37" stroke-width="2" rx="4"/>`;

    for (let i = 0; i <= 4; i++) {
        const y = padding + cellSize * i;
        svg += `<line x1="${padding}" y1="${y}" x2="${totalSize - padding}" y2="${y}" stroke="#D4AF37" stroke-width="1"/>`;
        svg += `<line x1="${padding + cellSize * i}" y1="${padding}" x2="${padding + cellSize * i}" y2="${totalSize - padding}" stroke="#D4AF37" stroke-width="1"/>`;
    }

    svg += `<text x="${totalSize / 2}" y="${totalSize / 2 - 5}" text-anchor="middle" fill="#B8B8B8" font-size="10">${chartType === 'rashi' ? 'Rashi' : 'Navamsa'}</text>
            <text x="${totalSize / 2}" y="${totalSize / 2 + 10}" text-anchor="middle" fill="#B8B8B8" font-size="10">Chart</text>`;

    signPositions.forEach(pos => {
        const x = padding + pos.x * cellSize;
        const y = padding + pos.y * cellSize;
        const si = pos.sign;
        const isAsc = si === ascendantIndex;

        svg += `<text x="${x + 5}" y="${y + 12}" fill="${isAsc ? '#D4AF37' : '#888'}" font-size="9">${signAbbrev[si]}</text>`;
        if (isAsc) {
            svg += `<line x1="${x + cellSize - 15}" y1="${y + 3}" x2="${x + cellSize - 3}" y2="${y + 15}" stroke="#D4AF37" stroke-width="2"/>`;
            svg += `<text x="${x + cellSize - 10}" y="${y + 12}" fill="#D4AF37" font-size="8">As</text>`;
        }

        const pl = signPlanets[si] || [];
        if (pl.length > 0) {
            svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 5}" text-anchor="middle" fill="#D4AF37" font-size="10" font-weight="500">${pl.slice(0, 3).join(' ')}</text>`;
            if (pl.length > 3) {
                svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 18}" text-anchor="middle" fill="#D4AF37" font-size="10">${pl.slice(3).join(' ')}</text>`;
            }
        }
    });

    svg += '</svg>';
    return svg;
}

// ---------- Real astronomical calculations via AstroEngine ----------

const bodyKeys = {
    sun: 'Sun', moon: 'Moon', mars: 'Mars', mercury: 'Mercury',
    jupiter: 'Jupiter', venus: 'Venus', saturn: 'Saturn', rahu: 'Rahu', ketu: 'Ketu',
};

/**
 * Single engine call that returns moonData, ascendant, positions, tithi, yoga.
 * Use this instead of calling calculateMoonSign + calculateAscendant + calculatePlanetaryPositions separately.
 */
function computeFullChartLegacy(birthDate, birthTime, birthPlace, tzOverride) {
    const city = resolveCity(birthPlace);
    const tz = (tzOverride !== null && tzOverride !== undefined) ? tzOverride : city.tz;
    const chart = AstroEngine.computeChart({
        dateStr: birthDate, timeStr: birthTime,
        lat: city.lat, lng: city.lng, utcOffsetHours: tz,
    });

    const ascSignIndex = chart.ascendant.signIndex;
    const positions = {};

    for (const [bodyKey, planetName] of Object.entries(bodyKeys)) {
        const body = chart[bodyKey];
        const si = body.signIndex;
        const deg = body.degreeInSign;
        const house = ((si - ascSignIndex + 12) % 12) + 1;
        const absDeg = si * 30 + deg;
        const nakshatraIndex = Math.floor(absDeg / 13.333) % 27;
        const retrograde = body.speed < 0 && ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(planetName);

        positions[planetName] = {
            sign: signNames[si],
            signIndex: si,
            signHindi: hindiSignNames[si],
            degree: deg.toFixed(2),
            house: house,
            nakshatra: nakshatras[nakshatraIndex],
            retrograde: retrograde,
        };
    }

    // Moon sign
    const moonSi = chart.moon.signIndex;
    const moonAbsDeg = chart.moon.longitude;
    const moonNakshatraIndex = Math.floor(moonAbsDeg / 13.333) % 27;
    const moonData = {
        sign: signNames[moonSi],
        signHindi: hindiSignNames[moonSi],
        symbol: signSymbols[moonSi],
        nakshatra: nakshatras[moonNakshatraIndex],
    };

    // Ascendant
    const ascendant = {
        sign: signNames[ascSignIndex],
        signIndex: ascSignIndex,
        signHindi: hindiSignNames[ascSignIndex],
        symbol: signSymbols[ascSignIndex],
    };

    // Tithi
    let tithiDiff = chart.moon.longitude - chart.sun.longitude;
    if (tithiDiff < 0) tithiDiff += 360;
    const tithiIndex = Math.floor(tithiDiff / 12);
    const tithiNames = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
    const tithi = `${paksha} ${tithiNames[tithiIndex % 15]}`;

    // Yoga
    const yogaSum = (chart.sun.longitude + chart.moon.longitude) % 360;
    const yogaIndex = Math.floor(yogaSum / (800 / 60)) % 27;
    const yogaNames = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
                   'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
                   'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
                   'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
                   'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
                   'Indra', 'Vaidhriti'];
    const yoga = yogaNames[yogaIndex];

    // Navamsa positions (D9 chart)
    const navamsaPositions = {};
    const ascDeg = chart.ascendant.degreeInSign;
    const ascNakPada = Math.min(4, Math.floor((ascSignIndex * 30 + ascDeg) % 13.333 / 3.333) + 1);
    const navamsaAscIndex = (ascSignIndex * 9 + (ascNakPada - 1)) % 12;

    for (const [planetName, data] of Object.entries(positions)) {
        const si = data.signIndex;
        const deg = parseFloat(data.degree);
        const absDeg = si * 30 + deg;
        const pada = Math.min(4, Math.floor(absDeg % 13.333 / 3.333) + 1);
        const navamsaSign = (si * 9 + (pada - 1)) % 12;
        const navamsaHouse = ((navamsaSign - navamsaAscIndex + 12) % 12) + 1;

        navamsaPositions[planetName] = {
            sign: signNames[navamsaSign],
            signIndex: navamsaSign,
            signHindi: hindiSignNames[navamsaSign],
            degree: data.degree,
            house: navamsaHouse,
            nakshatra: data.nakshatra,
            retrograde: data.retrograde,
        };
    }

    return { moonData, ascendant, positions, navamsaPositions, navamsaAscIndex, tithi, yoga };
}

// Legacy wrappers for backward compatibility (each now calls computeFullChartLegacy)
function calculatePlanetaryPositions(birthDate, birthTime, birthPlace) {
    return computeFullChartLegacy(birthDate, birthTime, birthPlace).positions;
}

function calculateAscendant(birthDate, birthTime, birthPlace) {
    return computeFullChartLegacy(birthDate, birthTime, birthPlace).ascendant;
}

function calculateMoonSign(birthDate, birthTime, birthPlace) {
    return computeFullChartLegacy(birthDate, birthTime, birthPlace).moonData;
}

// Vimshottari Dasha (unchanged — pure rule-based)
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
            planet, startYear: Math.floor(currentYear), endYear: Math.floor(endYear),
            duration, isCurrent: new Date().getFullYear() >= currentYear && new Date().getFullYear() < endYear
        });
        currentYear = endYear;
    }
    return dashas;
}

// Switch chart style function
function switchChartStyle(style) {
    currentChartStyle = style;
    document.getElementById('north-btn').classList.toggle('active', style === 'north');
    document.getElementById('south-btn').classList.toggle('active', style === 'south');
    if (currentPlanetPositions) renderCharts();
}

function renderCharts() {
    const gen = currentChartStyle === 'north' ? generateNorthIndianChart : generateSouthIndianChart;
    document.getElementById('rashi-chart').innerHTML = gen(currentPlanetPositions, currentAscendantIndex, 'rashi');
    document.getElementById('navamsa-chart').innerHTML = gen(currentNavamsaPositions || currentPlanetPositions, currentNavamsaAscIndex, 'navamsa');
}

window.switchChartStyle = switchChartStyle;

// Initialize pickers for kundli page
document.addEventListener('DOMContentLoaded', function() {
    if (typeof VedicPicker !== 'undefined' && document.getElementById('kundli-date-picker')) {
        window._kundliDatePicker = VedicPicker.createDatePicker('#kundli-date-picker', { hiddenInputId: 'birth-date' });
        window._kundliTimePicker = VedicPicker.createTimePicker('#kundli-time-picker', { hiddenInputId: 'birth-time' });
        window._kundliTzPicker = VedicPicker.createTimezoneSelector('#kundli-tz-picker', { hiddenInputId: 'kundli-timezone', autoDetect: true });
    }
    if (typeof VedicPicker !== 'undefined' && document.getElementById('birth-place')) {
        VedicPicker.createPlaceAutocomplete('#birth-place');
    }
});

// Form submission handler
document.getElementById('kundli-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const birthDate = document.getElementById('birth-date').value;
    const birthTime = document.getElementById('birth-time').value;
    const birthPlace = document.getElementById('birth-place').value;
    const chartStyle = document.getElementById('chart-style').value;

    // Use timezone offset from picker if available (without mutating CITY_DB)
    let tzOverride = null;
    const tzInput = document.getElementById('kundli-timezone');
    if (tzInput && tzInput.dataset.offsetHours) {
        tzOverride = parseFloat(tzInput.dataset.offsetHours);
    }

    // Calculate all astrological data using real astronomy (single engine call)
    const fullChart = computeFullChartLegacy(birthDate, birthTime, birthPlace, tzOverride);
    const { moonData, ascendant, positions: planetPositions, navamsaPositions, navamsaAscIndex, tithi, yoga } = fullChart;
    const dashas = calculateDasha(birthDate, moonData.nakshatra);

    // Store for chart style switching
    currentPlanetPositions = planetPositions;
    currentNavamsaPositions = navamsaPositions;
    currentAscendantIndex = ascendant.signIndex;
    currentNavamsaAscIndex = navamsaAscIndex;
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
    document.getElementById('birth-tithi').textContent = tithi;
    document.getElementById('birth-yoga').textContent = yoga;

    // Generate charts
    renderCharts();

    // Populate planet table
    const planetTable = document.getElementById('planet-positions');
    planetTable.innerHTML = '';

    planetList.forEach(planet => {
        const data = planetPositions[planet];
        const isBenefic = window.VedicHoroscopeData?.isBeneficForAscendant(planet, ascendant.signIndex);
        const mostMalefic = window.VedicHoroscopeData?.getMostMalefic(ascendant.signIndex);
        const isMostMalefic = (planet === mostMalefic);
        const houseInfo = window.VedicHoroscopeData?.getHouseInfo(data.house);

        let statusIcon = '';
        let statusClass = '';
        if (isMostMalefic) {
            statusIcon = ' \u26A0';
            statusClass = ' style="color: #ff6b6b;"';
        } else if (isBenefic) {
            statusIcon = ' \u2713';
            statusClass = ' style="color: #51cf66;"';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong${statusClass}>${planet}${statusIcon}</strong>${data.retrograde ? ' (R)' : ''}</td>
            <td>${data.signHindi} (${data.sign})</td>
            <td>${data.degree}\u00B0</td>
            <td title="${houseInfo ? houseInfo.keywords.join(', ') : ''}">${data.house}</td>
            <td>${data.nakshatra}</td>
        `;
        planetTable.appendChild(row);
    });

    // Add planet analysis section
    if (window.VedicHoroscopeData) {
        const analysisContainer = document.getElementById('planet-analysis');
        if (analysisContainer) {
            const vedicChart = { ascendant: ascendant, planets: planetPositions };
            const analysis = window.VedicHoroscopeData.generatePlanetAnalysis(vedicChart);
            const mostMalefic = window.VedicHoroscopeData.getMostMalefic(ascendant.signIndex);

            let html = `<div class="analysis-header" style="margin-bottom: 1rem;">
                <p style="color: var(--text-muted); font-size: 0.85rem;">
                    <span style="color: #51cf66;">\u2713 Green</span> = Benefic for your Ascendant (${ascendant.sign}) &nbsp;|&nbsp;
                    <span style="color: #ff6b6b;">\u26A0 Red</span> = Most Malefic Planet (${mostMalefic})
                </p>
            </div>`;

            analysis.forEach(item => {
                const borderColor = item.isMostMalefic ? '#ff6b6b' : item.isBenefic ? '#51cf66' : '#D4AF37';
                html += `
                    <div style="border-left: 3px solid ${borderColor}; padding: 0.5rem 1rem; margin-bottom: 0.5rem; background: rgba(22,33,62,0.5); border-radius: 4px;">
                        <strong style="color: ${borderColor};">${item.planet}</strong>
                        <span style="color: var(--text-muted); font-size: 0.85rem;"> in ${item.sign} | House ${item.house}</span>
                        <p style="color: var(--text); font-size: 0.85rem; margin-top: 0.25rem;">${item.interpretation}</p>
                    </div>`;
            });

            analysisContainer.innerHTML = html;
        }
    }

    // Populate Dasha list
    const dashaListEl = document.getElementById('dasha-list');
    dashaListEl.innerHTML = '';

    dashas.forEach(dasha => {
        const div = document.createElement('div');
        div.className = `dasha-item${dasha.isCurrent ? ' dasha-current' : ''}`;
        div.innerHTML = `
            <span class="dasha-planet">${dasha.planet} Mahadasha${dasha.isCurrent ? ' (Current)' : ''}</span>
            <span class="dasha-period">${dasha.startYear} - ${dasha.endYear}</span>
        `;
        dashaListEl.appendChild(div);
    });

    // Show results
    document.getElementById('kundli-result').classList.add('active');
    document.getElementById('kundli-result').scrollIntoView({ behavior: 'smooth' });
});
