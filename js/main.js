// ===== Vedic_Astro Main JavaScript =====

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.background = 'rgba(13, 13, 26, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(13, 13, 26, 0.95)';
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Update Panchang Date
function updatePanchangDate() {
    const dateElement = document.getElementById('panchang-date');
    if (dateElement) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

updatePanchangDate();

// Tabs functionality
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(target)?.classList.add('active');
        });
    });
}

initTabs();

// Zodiac Data
const zodiacData = {
    aries: {
        name: 'Mesha (Aries)',
        symbol: '♈',
        element: 'Fire',
        ruler: 'Mars (Mangal)',
        quality: 'Cardinal',
        dates: 'April 14 - May 14',
        lucky_numbers: '1, 8, 17',
        lucky_colors: 'Red, Scarlet',
        lucky_day: 'Tuesday',
        compatible: 'Leo, Sagittarius',
        description: 'Aries natives are natural leaders with boundless energy and enthusiasm. Ruled by Mars, they are courageous, confident, and always ready to take initiative.'
    },
    taurus: {
        name: 'Vrishabha (Taurus)',
        symbol: '♉',
        element: 'Earth',
        ruler: 'Venus (Shukra)',
        quality: 'Fixed',
        dates: 'May 15 - June 14',
        lucky_numbers: '2, 6, 9',
        lucky_colors: 'Green, Pink',
        lucky_day: 'Friday',
        compatible: 'Virgo, Capricorn',
        description: 'Taurus natives are grounded, practical, and value stability. Ruled by Venus, they appreciate beauty, comfort, and the finer things in life.'
    },
    gemini: {
        name: 'Mithuna (Gemini)',
        symbol: '♊',
        element: 'Air',
        ruler: 'Mercury (Budha)',
        quality: 'Mutable',
        dates: 'June 15 - July 14',
        lucky_numbers: '3, 5, 7',
        lucky_colors: 'Yellow, Green',
        lucky_day: 'Wednesday',
        compatible: 'Libra, Aquarius',
        description: 'Gemini natives are intellectually curious, versatile, and excellent communicators. Ruled by Mercury, they thrive on mental stimulation and variety.'
    },
    cancer: {
        name: 'Karka (Cancer)',
        symbol: '♋',
        element: 'Water',
        ruler: 'Moon (Chandra)',
        quality: 'Cardinal',
        dates: 'July 15 - August 14',
        lucky_numbers: '2, 7, 11',
        lucky_colors: 'White, Silver',
        lucky_day: 'Monday',
        compatible: 'Scorpio, Pisces',
        description: 'Cancer natives are nurturing, intuitive, and deeply emotional. Ruled by the Moon, they are protective of loved ones and value home and family.'
    },
    leo: {
        name: 'Simha (Leo)',
        symbol: '♌',
        element: 'Fire',
        ruler: 'Sun (Surya)',
        quality: 'Fixed',
        dates: 'August 15 - September 15',
        lucky_numbers: '1, 4, 10',
        lucky_colors: 'Gold, Orange',
        lucky_day: 'Sunday',
        compatible: 'Aries, Sagittarius',
        description: 'Leo natives are confident, charismatic, and natural performers. Ruled by the Sun, they possess strong leadership qualities and creative talents.'
    },
    virgo: {
        name: 'Kanya (Virgo)',
        symbol: '♍',
        element: 'Earth',
        ruler: 'Mercury (Budha)',
        quality: 'Mutable',
        dates: 'September 16 - October 15',
        lucky_numbers: '5, 14, 23',
        lucky_colors: 'Green, Brown',
        lucky_day: 'Wednesday',
        compatible: 'Taurus, Capricorn',
        description: 'Virgo natives are analytical, detail-oriented, and service-minded. Ruled by Mercury, they excel at organization and problem-solving.'
    },
    libra: {
        name: 'Tula (Libra)',
        symbol: '♎',
        element: 'Air',
        ruler: 'Venus (Shukra)',
        quality: 'Cardinal',
        dates: 'October 16 - November 14',
        lucky_numbers: '6, 15, 24',
        lucky_colors: 'Blue, Pink',
        lucky_day: 'Friday',
        compatible: 'Gemini, Aquarius',
        description: 'Libra natives are diplomatic, fair-minded, and seek harmony. Ruled by Venus, they value relationships and have a refined aesthetic sense.'
    },
    scorpio: {
        name: 'Vrishchika (Scorpio)',
        symbol: '♏',
        element: 'Water',
        ruler: 'Mars (Mangal)',
        quality: 'Fixed',
        dates: 'November 15 - December 14',
        lucky_numbers: '9, 18, 27',
        lucky_colors: 'Red, Black',
        lucky_day: 'Tuesday',
        compatible: 'Cancer, Pisces',
        description: 'Scorpio natives are intense, passionate, and deeply perceptive. Ruled by Mars, they possess strong willpower and transformative abilities.'
    },
    sagittarius: {
        name: 'Dhanu (Sagittarius)',
        symbol: '♐',
        element: 'Fire',
        ruler: 'Jupiter (Guru)',
        quality: 'Mutable',
        dates: 'December 15 - January 13',
        lucky_numbers: '3, 12, 21',
        lucky_colors: 'Yellow, Purple',
        lucky_day: 'Thursday',
        compatible: 'Aries, Leo',
        description: 'Sagittarius natives are optimistic, adventurous, and philosophical. Ruled by Jupiter, they seek truth, wisdom, and new experiences.'
    },
    capricorn: {
        name: 'Makara (Capricorn)',
        symbol: '♑',
        element: 'Earth',
        ruler: 'Saturn (Shani)',
        quality: 'Cardinal',
        dates: 'January 14 - February 12',
        lucky_numbers: '8, 17, 26',
        lucky_colors: 'Brown, Black',
        lucky_day: 'Saturday',
        compatible: 'Taurus, Virgo',
        description: 'Capricorn natives are ambitious, disciplined, and practical. Ruled by Saturn, they are patient and work steadily toward their goals.'
    },
    aquarius: {
        name: 'Kumbha (Aquarius)',
        symbol: '♒',
        element: 'Air',
        ruler: 'Saturn (Shani)',
        quality: 'Fixed',
        dates: 'February 13 - March 13',
        lucky_numbers: '4, 13, 22',
        lucky_colors: 'Blue, Electric Blue',
        lucky_day: 'Saturday',
        compatible: 'Gemini, Libra',
        description: 'Aquarius natives are innovative, humanitarian, and independent thinkers. Ruled by Saturn, they value freedom and progressive ideas.'
    },
    pisces: {
        name: 'Meena (Pisces)',
        symbol: '♓',
        element: 'Water',
        ruler: 'Jupiter (Guru)',
        quality: 'Mutable',
        dates: 'March 14 - April 13',
        lucky_numbers: '3, 7, 12',
        lucky_colors: 'Sea Green, Lavender',
        lucky_day: 'Thursday',
        compatible: 'Cancer, Scorpio',
        description: 'Pisces natives are compassionate, intuitive, and artistic. Ruled by Jupiter, they possess deep spiritual sensitivity and creative imagination.'
    }
};

// Nakshatras (27 Lunar Mansions)
const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Tithis (Lunar Days)
const tithis = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

// Yogas
const yogas = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
];

// Karanas
const karanas = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
    'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
];

// Calculate Panchang using real Sun/Moon positions via AstroEngine
function calculatePanchang(date) {
    if (typeof AstroEngine === 'undefined') {
        // Fallback if engine not loaded
        const baseDate = new Date('2000-01-01');
        const daysSince = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
        const tithiIndex = daysSince % 30;
        const nakshatraIndex = daysSince % 27;
        const yogaIndex = daysSince % 27;
        const karanaIndex = (daysSince * 2) % 11;
        const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
        const tithiNum = (tithiIndex % 15) + 1;
        return {
            tithi: `${paksha} ${tithis[tithiNum - 1] || 'Purnima'}`,
            nakshatra: nakshatras[nakshatraIndex],
            yoga: yogas[yogaIndex],
            karana: karanas[karanaIndex],
            tithiIndex: tithiIndex
        };
    }

    // Real calculation using astronomical positions
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const chart = AstroEngine.computeChart({
        dateStr: `${year}-${month}-${day}`, timeStr: '06:00',
        lat: 28.61, lng: 77.21, utcOffsetHours: 5.5 // Delhi sunrise
    });

    // Tithi from Moon-Sun elongation
    let tithiDiff = chart.moon.longitude - chart.sun.longitude;
    if (tithiDiff < 0) tithiDiff += 360;
    const tithiIndex = Math.floor(tithiDiff / 12);
    const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
    const tithi = `${paksha} ${tithis[tithiIndex % 15]}`;

    // Nakshatra from Moon's sidereal longitude
    const moonNakIdx = Math.floor(chart.moon.longitude / 13.333) % 27;

    // Yoga from Sun+Moon
    const yogaSum = (chart.sun.longitude + chart.moon.longitude) % 360;
    const yogaIdx = Math.floor(yogaSum / (800 / 60)) % 27;

    // Karana from Moon-Sun (half-tithi)
    const karanaIdx = Math.floor(tithiDiff / 6) % 60;
    const movKaranas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];
    const fixKaranas = ['Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
    let karana;
    if (karanaIdx === 0) karana = fixKaranas[0];
    else if (karanaIdx === 57) karana = fixKaranas[1];
    else if (karanaIdx === 58) karana = fixKaranas[2];
    else if (karanaIdx === 59) karana = fixKaranas[3];
    else karana = movKaranas[(karanaIdx - 1) % 7];

    return {
        tithi: tithi,
        nakshatra: nakshatras[moonNakIdx],
        yoga: yogas[yogaIdx],
        karana: karana,
        tithiIndex: tithiIndex
    };
}

// Update Panchang display
function updatePanchangDisplay() {
    const today = new Date();
    const panchang = calculatePanchang(today);

    const tithiEl = document.getElementById('tithi');
    const nakshatraEl = document.getElementById('nakshatra');
    const yogaEl = document.getElementById('yoga');
    const karanaEl = document.getElementById('karana');

    if (tithiEl) tithiEl.textContent = panchang.tithi;
    if (nakshatraEl) nakshatraEl.textContent = panchang.nakshatra;
    if (yogaEl) yogaEl.textContent = panchang.yoga;
    if (karanaEl) karanaEl.textContent = panchang.karana;

    // Calculate sunrise/sunset (approximate for demo)
    const sunriseEl = document.getElementById('sunrise');
    const sunsetEl = document.getElementById('sunset');

    if (sunriseEl) sunriseEl.textContent = '6:48 AM';
    if (sunsetEl) sunsetEl.textContent = '5:32 PM';

    // Update sunrise/sunset combined element (new homepage)
    const sunriseSunsetEl = document.getElementById('sunrise-sunset');
    if (sunriseSunsetEl) sunriseSunsetEl.textContent = '6:48 AM / 5:32 PM';

    // Rahu Kaal calculation
    calculateRahuKaal();

    // Moon phase
    generateMoonPhase(panchang.tithiIndex);

    // Populate ticker
    populateTicker(panchang);
}

updatePanchangDisplay();

// ===== Rahu Kaal Calculator =====
function calculateRahuKaal() {
    const rahuKaalEl = document.getElementById('rahu-kaal');
    const rahuStatusEl = document.getElementById('rahu-kaal-status');
    if (!rahuKaalEl) return;

    const day = new Date().getDay(); // 0=Sun, 1=Mon, ...
    // Rahu Kaal times (approximate, based on sunrise at 6:00 AM)
    const rahuKaalTimes = [
        { start: '4:30 PM', end: '6:00 PM', startH: 16.5, endH: 18 },  // Sunday
        { start: '7:30 AM', end: '9:00 AM', startH: 7.5, endH: 9 },    // Monday
        { start: '3:00 PM', end: '4:30 PM', startH: 15, endH: 16.5 },  // Tuesday
        { start: '12:00 PM', end: '1:30 PM', startH: 12, endH: 13.5 }, // Wednesday
        { start: '1:30 PM', end: '3:00 PM', startH: 13.5, endH: 15 },  // Thursday
        { start: '10:30 AM', end: '12:00 PM', startH: 10.5, endH: 12 },// Friday
        { start: '9:00 AM', end: '10:30 AM', startH: 9, endH: 10.5 }   // Saturday
    ];

    const rk = rahuKaalTimes[day];
    rahuKaalEl.textContent = `${rk.start} - ${rk.end}`;

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const isActive = currentHour >= rk.startH && currentHour < rk.endH;

    rahuStatusEl.textContent = isActive ? 'Active Now' : 'Not Active';
    rahuStatusEl.className = `rahu-kaal-status ${isActive ? 'active' : 'inactive'}`;
}

// ===== Moon Phase SVG Generator =====
function generateMoonPhase(tithiIndex) {
    const container = document.getElementById('moon-phase-display');
    if (!container) return;

    // tithiIndex 0-14 = Shukla (waxing), 15-29 = Krishna (waning)
    const phase = tithiIndex / 30; // 0 to ~1

    let illumination;
    if (tithiIndex <= 15) {
        illumination = tithiIndex / 15; // 0 (new) to 1 (full)
    } else {
        illumination = (30 - tithiIndex) / 15; // 1 (full) to 0 (new)
    }

    // Create moon phase SVG
    const cx = 40, cy = 40, r = 30;
    const sweepOffset = (1 - illumination * 2) * r; // Controls the terminator curve

    let svg = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#1A1A2E" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>`;

    if (illumination > 0.01) {
        if (tithiIndex <= 15) {
            // Waxing: illuminated from right
            svg += `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${Math.abs(sweepOffset)} ${r} 0 0 ${illumination > 0.5 ? 1 : 0} ${cx} ${cy - r}" fill="rgba(212,175,55,0.6)"/>`;
        } else {
            // Waning: illuminated from left
            svg += `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} A${Math.abs(sweepOffset)} ${r} 0 0 ${illumination > 0.5 ? 0 : 1} ${cx} ${cy - r}" fill="rgba(212,175,55,0.6)"/>`;
        }
    }

    svg += '</svg>';
    container.innerHTML = svg;
}

// ===== Cosmic Ticker Population =====
function populateTicker(panchang) {
    const track = document.getElementById('ticker-track');
    if (!track) return;

    const day = new Date().getDay();
    const rahuKaalTimes = [
        '4:30 PM - 6:00 PM', '7:30 AM - 9:00 AM', '3:00 PM - 4:30 PM',
        '12:00 PM - 1:30 PM', '1:30 PM - 3:00 PM', '10:30 AM - 12:00 PM',
        '9:00 AM - 10:30 AM'
    ];

    const items = [
        { label: 'Tithi', value: panchang.tithi },
        { label: 'Nakshatra', value: panchang.nakshatra },
        { label: 'Yoga', value: panchang.yoga },
        { label: 'Karana', value: panchang.karana },
        { label: 'Rahu Kaal', value: rahuKaalTimes[day] }
    ];

    // Create two copies for seamless infinite loop
    let html = '';
    for (let copy = 0; copy < 2; copy++) {
        items.forEach(item => {
            html += `<div class="ticker-item">
                <span class="ticker-label">${item.label}:</span>
                <span>${item.value}</span>
                <span class="ticker-separator">&#x2726;</span>
            </div>`;
        });
    }

    track.innerHTML = html;
}

// ===== Star Canvas Particle System =====
function initStarCanvas() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 75 : 150;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
            const alpha = star.opacity * (0.3 + twinkle * 0.7);

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();

            // Slow downward drift
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const startTime = performance.now();

                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease-out curve
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(target * eased).toLocaleString() + '+';

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target.toLocaleString() + '+';
                        }
                    }

                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);
}

// ===== Interactive Zodiac Wheel =====
function generateZodiacWheel() {
    const wrapper = document.getElementById('zodiac-wheel-wrapper');
    if (!wrapper) return;

    const signs = [
        { key: 'aries', symbol: '♈', hindi: 'मेष', english: 'Aries' },
        { key: 'taurus', symbol: '♉', hindi: 'वृषभ', english: 'Taurus' },
        { key: 'gemini', symbol: '♊', hindi: 'मिथुन', english: 'Gemini' },
        { key: 'cancer', symbol: '♋', hindi: 'कर्क', english: 'Cancer' },
        { key: 'leo', symbol: '♌', hindi: 'सिंह', english: 'Leo' },
        { key: 'virgo', symbol: '♍', hindi: 'कन्या', english: 'Virgo' },
        { key: 'libra', symbol: '♎', hindi: 'तुला', english: 'Libra' },
        { key: 'scorpio', symbol: '♏', hindi: 'वृश्चिक', english: 'Scorpio' },
        { key: 'sagittarius', symbol: '♐', hindi: 'धनु', english: 'Sagittarius' },
        { key: 'capricorn', symbol: '♑', hindi: 'मकर', english: 'Capricorn' },
        { key: 'aquarius', symbol: '♒', hindi: 'कुम्भ', english: 'Aquarius' },
        { key: 'pisces', symbol: '♓', hindi: 'मीन', english: 'Pisces' }
    ];

    const size = 500;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = 220;
    const innerR = 130;
    const decorR = 240;

    let svg = `<svg id="zodiac-wheel-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>

        <!-- Decorative outer ring (rotates) -->
        <g class="mandala-layer-slow">
            <circle cx="${cx}" cy="${cy}" r="${decorR}" fill="none" stroke="rgba(212,175,55,0.1)" stroke-width="1"/>`;

    // Decorative dots on outer ring
    for (let i = 0; i < 36; i++) {
        const angle = (i * 10) * Math.PI / 180;
        const dx = cx + decorR * Math.cos(angle);
        const dy = cy + decorR * Math.sin(angle);
        svg += `<circle cx="${dx}" cy="${dy}" r="${i % 3 === 0 ? 2.5 : 1}" fill="rgba(212,175,55,${i % 3 === 0 ? 0.3 : 0.15})"/>`;
    }

    svg += `</g>

        <!-- Inner decorative ring (rotates opposite) -->
        <g class="mandala-layer-medium">
            <circle cx="${cx}" cy="${cy}" r="${innerR - 10}" fill="none" stroke="rgba(212,175,55,0.08)" stroke-width="1" stroke-dasharray="4 8"/>
        </g>

        <!-- Sign wedges (static) -->
        <g id="zodiac-wedges">`;

    signs.forEach((sign, i) => {
        const startAngle = (i * 30 - 90) * Math.PI / 180;
        const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
        const midAngle = ((i + 0.5) * 30 - 90) * Math.PI / 180;

        const x1 = cx + outerR * Math.cos(startAngle);
        const y1 = cy + outerR * Math.sin(startAngle);
        const x2 = cx + outerR * Math.cos(endAngle);
        const y2 = cy + outerR * Math.sin(endAngle);

        const ix1 = cx + innerR * Math.cos(startAngle);
        const iy1 = cy + innerR * Math.sin(startAngle);
        const ix2 = cx + innerR * Math.cos(endAngle);
        const iy2 = cy + innerR * Math.sin(endAngle);

        // Wedge path
        const path = `M${ix1} ${iy1} L${x1} ${y1} A${outerR} ${outerR} 0 0 1 ${x2} ${y2} L${ix2} ${iy2} A${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`;

        svg += `<g class="zodiac-wedge" data-sign="${sign.key}" style="cursor: pointer;">
            <path d="${path}" fill="rgba(22,33,62,0.8)" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>`;

        // Symbol text in middle of wedge
        const textR = (outerR + innerR) / 2;
        const tx = cx + textR * Math.cos(midAngle);
        const ty = cy + textR * Math.sin(midAngle);

        svg += `<text x="${tx}" y="${ty - 5}" text-anchor="middle" fill="#D4AF37" font-size="18" dominant-baseline="central">${sign.symbol}</text>`;
        svg += `<text x="${tx}" y="${ty + 14}" text-anchor="middle" fill="rgba(212,175,55,0.6)" font-size="8" dominant-baseline="central">${sign.english}</text>`;

        svg += `</g>`;

        // Radial line
        svg += `<line x1="${ix1}" y1="${iy1}" x2="${x1}" y2="${y1}" stroke="rgba(212,175,55,0.2)" stroke-width="0.5"/>`;
    });

    svg += `</g>

        <!-- Center -->
        <circle cx="${cx}" cy="${cy}" r="${innerR - 10}" fill="rgba(13,13,26,0.9)" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
        <text x="${cx}" y="${cy - 10}" text-anchor="middle" fill="rgba(212,175,55,0.4)" font-size="40" dominant-baseline="central" font-family="'Noto Sans Devanagari', serif">ॐ</text>
        <text x="${cx}" y="${cy + 25}" text-anchor="middle" fill="rgba(212,175,55,0.5)" font-size="10" letter-spacing="2">RASHI CHAKRA</text>

    </svg>`;

    wrapper.innerHTML = svg;

    // Add interaction events
    const wedges = wrapper.querySelectorAll('.zodiac-wedge');
    const infoPanel = document.getElementById('zodiac-wheel-info');

    wedges.forEach(wedge => {
        wedge.addEventListener('mouseenter', () => {
            const signKey = wedge.dataset.sign;
            const data = zodiacData[signKey];
            const sign = signs.find(s => s.key === signKey);
            if (!data || !sign) return;

            // Highlight wedge
            const path = wedge.querySelector('path');
            path.setAttribute('fill', 'rgba(212,175,55,0.15)');
            path.setAttribute('stroke', 'rgba(212,175,55,0.8)');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('filter', 'url(#glow)');

            // Update info panel
            infoPanel.innerHTML = `
                <h3>${sign.symbol} ${data.name}</h3>
                <p>${data.description}</p>
                <div class="zodiac-info-details">
                    <div class="zodiac-detail-item">
                        <span class="detail-label">Element</span>
                        <span class="detail-value">${data.element}</span>
                    </div>
                    <div class="zodiac-detail-item">
                        <span class="detail-label">Ruler</span>
                        <span class="detail-value">${data.ruler}</span>
                    </div>
                    <div class="zodiac-detail-item">
                        <span class="detail-label">Dates</span>
                        <span class="detail-value">${data.dates}</span>
                    </div>
                    <div class="zodiac-detail-item">
                        <span class="detail-label">Compatible</span>
                        <span class="detail-value">${data.compatible}</span>
                    </div>
                </div>
                <p style="margin-top: var(--space-md);"><a href="zodiac.html#${signKey}" class="btn btn-secondary">Learn More</a></p>
            `;
        });

        wedge.addEventListener('mouseleave', () => {
            const path = wedge.querySelector('path');
            path.setAttribute('fill', 'rgba(22,33,62,0.8)');
            path.setAttribute('stroke', 'rgba(212,175,55,0.3)');
            path.setAttribute('stroke-width', '1');
            path.removeAttribute('filter');
        });

        wedge.addEventListener('click', () => {
            window.location.href = `zodiac.html#${wedge.dataset.sign}`;
        });
    });

    // Pause rotation on hover
    wrapper.addEventListener('mouseenter', () => {
        wrapper.querySelectorAll('.mandala-layer-slow, .mandala-layer-medium').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    });

    wrapper.addEventListener('mouseleave', () => {
        wrapper.querySelectorAll('.mandala-layer-slow, .mandala-layer-medium').forEach(el => {
            el.style.animationPlayState = 'running';
        });

        // Reset info panel
        infoPanel.innerHTML = `
            <div class="zodiac-wheel-default">
                <h3>Rashi Chakra</h3>
                <p>Hover over a sign on the wheel to see details, or click to explore the full zodiac page.</p>
                <p style="margin-top: var(--space-md);"><a href="zodiac.html" class="btn btn-secondary">Explore All Signs</a></p>
            </div>
        `;
    });
}

// ===== Enhanced Mandala SVG =====
function generateMandala() {
    const container = document.getElementById('mandala-container');
    if (!container) return;

    const size = 350;
    const cx = size / 2;
    const cy = size / 2;

    let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

    // Outer rotating ring with nakshatra dots
    svg += `<g class="mandala-layer-slow">
        <circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="rgba(212,175,55,0.15)" stroke-width="1"/>`;
    for (let i = 0; i < 27; i++) {
        const angle = (i * 360 / 27) * Math.PI / 180;
        const dx = cx + 160 * Math.cos(angle);
        const dy = cy + 160 * Math.sin(angle);
        svg += `<circle cx="${dx}" cy="${dy}" r="2.5" fill="rgba(212,175,55,0.3)"/>`;
    }
    svg += `</g>`;

    // Middle ring with lotus petals
    svg += `<g class="mandala-layer-medium">
        <circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="rgba(212,175,55,0.1)" stroke-width="1"/>`;
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const px = cx + 120 * Math.cos(angle);
        const py = cy + 120 * Math.sin(angle);
        // Lotus petal shape
        const a1 = angle - 0.15;
        const a2 = angle + 0.15;
        const p1x = cx + 100 * Math.cos(a1);
        const p1y = cy + 100 * Math.sin(a1);
        const p2x = cx + 100 * Math.cos(a2);
        const p2y = cy + 100 * Math.sin(a2);
        svg += `<path d="M${p1x} ${p1y} Q${px} ${py} ${p2x} ${p2y}" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1"/>`;
    }
    svg += `</g>`;

    // Inner ring with planet gems
    svg += `<g class="mandala-layer-fast">
        <circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="rgba(212,175,55,0.12)" stroke-width="1"/>`;
    const gemColors = ['#FF6B35', '#C0C0C0', '#FF4444', '#51cf66', '#FFD700', '#FF69B4', '#4169E1', '#708090', '#FFD700'];
    for (let i = 0; i < 9; i++) {
        const angle = (i * 40) * Math.PI / 180;
        const gx = cx + 80 * Math.cos(angle);
        const gy = cy + 80 * Math.sin(angle);
        svg += `<circle cx="${gx}" cy="${gy}" r="4" fill="${gemColors[i]}" opacity="0.5"/>`;
    }
    svg += `</g>`;

    // Center Om
    svg += `
        <circle cx="${cx}" cy="${cy}" r="50" fill="rgba(212,175,55,0.08)" stroke="rgba(212,175,55,0.3)" stroke-width="1.5"/>
        <text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="#D4AF37" font-size="50" dominant-baseline="central" font-family="'Noto Sans Devanagari', serif" opacity="0.8">ॐ</text>
    `;

    svg += `</svg>`;
    container.innerHTML = svg;
}

// ===== Quick Kundli Form Handler =====
function initQuickKundli() {
    const form = document.getElementById('quick-kundli-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('qk-name').value;
        const dob = document.getElementById('qk-dob').value;
        const time = document.getElementById('qk-time').value;
        const place = document.getElementById('qk-place').value;

        if (!dob || !time) return;

        // Use kundli.js functions if available, otherwise use main.js fallback
        let moonData, ascendant, chartSvg;

        if (typeof calculateMoonSign === 'function' && typeof calculateAscendant === 'function' && typeof generateNorthIndianChart === 'function') {
            // kundli.js is loaded
            moonData = calculateMoonSign(dob);
            ascendant = calculateAscendant(time);
            const positions = calculatePlanetaryPositions(dob, time);
            chartSvg = generateNorthIndianChart(positions, ascendant.signIndex, 'rashi');
        } else {
            // Fallback using main.js functions
            const date = new Date(dob);
            const moonSign = window.VedicAstro.calculateMoonSign(date.getDate(), date.getMonth() + 1);
            const data = zodiacData[moonSign];
            moonData = {
                sign: data.name.split(' (')[0],
                signHindi: data.name.split('(')[0].trim(),
                symbol: data.symbol,
                nakshatra: nakshatras[Math.floor(date.getDate() * 27 / 30) % 27]
            };
            const hour = parseInt(time.split(':')[0]);
            const ascIndex = Math.floor(hour / 2) % 12;
            const signKeys = Object.keys(zodiacData);
            ascendant = {
                sign: zodiacData[signKeys[ascIndex]].name,
                symbol: zodiacData[signKeys[ascIndex]].symbol,
                signHindi: zodiacData[signKeys[ascIndex]].name.split('(')[0].trim()
            };
            chartSvg = window.VedicAstro.generateKundliChart(ascIndex);
        }

        // Show result
        document.getElementById('quick-kundli-placeholder').style.display = 'none';
        const chartDiv = document.getElementById('quick-kundli-chart');
        chartDiv.style.display = 'block';

        document.getElementById('quick-chart-svg').innerHTML = chartSvg;

        document.getElementById('quick-kundli-badges').innerHTML = `
            <div class="kundli-badge">
                <span class="badge-label">Moon Sign</span>
                <span class="badge-value">${moonData.symbol || ''} ${moonData.signHindi || moonData.sign}</span>
            </div>
            <div class="kundli-badge">
                <span class="badge-label">Nakshatra</span>
                <span class="badge-value">${moonData.nakshatra}</span>
            </div>
            <div class="kundli-badge">
                <span class="badge-label">Ascendant</span>
                <span class="badge-value">${ascendant.symbol || ''} ${ascendant.signHindi || ascendant.sign}</span>
            </div>
        `;
    });
}

// ===== Testimonial Carousel =====
function initTestimonialCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const slideCount = slides.length;
    let currentSlide = 0;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    // Generate dots
    let dotsHtml = '';
    for (let i = 0; i < slideCount; i++) {
        dotsHtml += `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`;
    }
    dotsContainer.innerHTML = dotsHtml;

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slideCount);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Dot click
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
            stopAutoplay();
            startAutoplay();
        });
    });

    // Pause on hover
    const container = document.getElementById('testimonial-carousel');
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);

    // Touch swipe
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide((currentSlide + 1) % slideCount);
            } else {
                goToSlide((currentSlide - 1 + slideCount) % slideCount);
            }
        }
        startAutoplay();
    }, { passive: true });

    startAutoplay();
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// Kundli Calculator Functions
function calculateMoonSignMain(day, month) {
    // Simplified moon sign calculation based on Vedic dates
    const vedicSigns = [
        { start: [4, 14], end: [5, 14], sign: 'aries' },
        { start: [5, 15], end: [6, 14], sign: 'taurus' },
        { start: [6, 15], end: [7, 14], sign: 'gemini' },
        { start: [7, 15], end: [8, 14], sign: 'cancer' },
        { start: [8, 15], end: [9, 15], sign: 'leo' },
        { start: [9, 16], end: [10, 15], sign: 'virgo' },
        { start: [10, 16], end: [11, 14], sign: 'libra' },
        { start: [11, 15], end: [12, 14], sign: 'scorpio' },
        { start: [12, 15], end: [1, 13], sign: 'sagittarius' },
        { start: [1, 14], end: [2, 12], sign: 'capricorn' },
        { start: [2, 13], end: [3, 13], sign: 'aquarius' },
        { start: [3, 14], end: [4, 13], sign: 'pisces' }
    ];

    for (const period of vedicSigns) {
        const [startMonth, startDay] = period.start;
        const [endMonth, endDay] = period.end;

        if (startMonth <= endMonth) {
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay) ||
                (month > startMonth && month < endMonth)) {
                return period.sign;
            }
        } else {
            // Handle year wrap (Sagittarius: Dec 15 - Jan 13)
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay) ||
                month > startMonth || month < endMonth) {
                return period.sign;
            }
        }
    }

    return 'aries'; // default
}

// Generate Kundli Chart (North Indian style) - fallback for pages without kundli.js
function generateKundliChartMain(ascendant) {
    const houses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

    // North Indian Kundli layout coordinates
    return `
        <svg viewBox="0 0 300 300" class="kundli-svg">
            <!-- Outer border -->
            <rect x="10" y="10" width="280" height="280" fill="none" stroke="#D4AF37" stroke-width="2"/>

            <!-- Diagonal lines creating 12 houses -->
            <line x1="10" y1="10" x2="290" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="290" y1="10" x2="10" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="150" y1="10" x2="150" y2="290" stroke="#D4AF37" stroke-width="1"/>
            <line x1="10" y1="150" x2="290" y2="150" stroke="#D4AF37" stroke-width="1"/>

            <!-- Inner square -->
            <rect x="80" y="80" width="140" height="140" fill="none" stroke="#D4AF37" stroke-width="1"/>

            <!-- House numbers -->
            <text x="150" y="55" text-anchor="middle" fill="#D4AF37" font-size="14">1</text>
            <text x="220" y="55" text-anchor="middle" fill="#B8B8B8" font-size="12">12</text>
            <text x="265" y="100" text-anchor="middle" fill="#B8B8B8" font-size="12">11</text>
            <text x="265" y="150" text-anchor="middle" fill="#B8B8B8" font-size="12">10</text>
            <text x="265" y="210" text-anchor="middle" fill="#B8B8B8" font-size="12">9</text>
            <text x="220" y="260" text-anchor="middle" fill="#B8B8B8" font-size="12">8</text>
            <text x="150" y="260" text-anchor="middle" fill="#B8B8B8" font-size="12">7</text>
            <text x="80" y="260" text-anchor="middle" fill="#B8B8B8" font-size="12">6</text>
            <text x="35" y="210" text-anchor="middle" fill="#B8B8B8" font-size="12">5</text>
            <text x="35" y="150" text-anchor="middle" fill="#B8B8B8" font-size="12">4</text>
            <text x="35" y="100" text-anchor="middle" fill="#B8B8B8" font-size="12">3</text>
            <text x="80" y="55" text-anchor="middle" fill="#B8B8B8" font-size="12">2</text>

            <!-- Center text -->
            <text x="150" y="145" text-anchor="middle" fill="#D4AF37" font-size="12">Rashi</text>
            <text x="150" y="165" text-anchor="middle" fill="#D4AF37" font-size="12">Chart</text>
        </svg>
    `;
}

// Compatibility Score Calculator (Ashtakoot)
function calculateCompatibility(sign1, sign2) {
    // Simplified compatibility based on elements
    const elements = {
        aries: 'fire', taurus: 'earth', gemini: 'air', cancer: 'water',
        leo: 'fire', virgo: 'earth', libra: 'air', scorpio: 'water',
        sagittarius: 'fire', capricorn: 'earth', aquarius: 'air', pisces: 'water'
    };

    const compatibility = {
        'fire-fire': 85, 'fire-earth': 55, 'fire-air': 90, 'fire-water': 45,
        'earth-earth': 80, 'earth-air': 50, 'earth-water': 85,
        'air-air': 75, 'air-water': 60,
        'water-water': 90
    };

    const el1 = elements[sign1];
    const el2 = elements[sign2];
    const key = [el1, el2].sort().join('-');

    return compatibility[key] || 70;
}

// Generate daily horoscope (simplified)
function generateDailyHoroscope(sign) {
    const horoscopes = {
        aries: "Today brings dynamic energy to your endeavors. Mars supports bold initiatives, but practice patience in dealings with authority figures. Financial matters require careful attention.",
        taurus: "Venus enhances your creative expression today. Relationships flourish under harmonious aspects. Focus on practical matters in the afternoon for best results.",
        gemini: "Mercury's influence sharpens your communication skills. Networking opportunities abound. Avoid scattered focus; prioritize your most important tasks.",
        cancer: "The Moon heightens your intuition today. Trust your instincts in personal matters. Home-related decisions are favored in the evening hours.",
        leo: "The Sun illuminates your path to success. Leadership opportunities emerge. Balance confidence with humility for optimal outcomes.",
        virgo: "Mercury aids analytical thinking. Perfect day for organizing and planning. Health matters benefit from attention and care.",
        libra: "Venus brings harmony to relationships. Diplomatic skills prove valuable. Artistic pursuits flourish under current planetary alignments.",
        scorpio: "Mars intensifies your determination. Transformation and regeneration are themes. Guard against power struggles in partnerships.",
        sagittarius: "Jupiter expands your horizons. Learning and travel are highlighted. Philosophical insights emerge through contemplation.",
        capricorn: "Saturn rewards disciplined effort. Career advancement is possible through steady work. Avoid shortcuts; integrity matters.",
        aquarius: "Uranus sparks innovative thinking. Community involvement brings fulfillment. Embrace unconventional solutions to challenges.",
        pisces: "Neptune enhances spiritual awareness. Creative and artistic pursuits thrive. Practice boundaries in emotional matters."
    };

    return horoscopes[sign] || horoscopes.aries;
}

// Export functions for use in other files
window.VedicAstro = {
    zodiacData,
    nakshatras,
    tithis,
    yogas,
    karanas,
    calculatePanchang,
    calculateMoonSign: calculateMoonSignMain,
    generateKundliChart: generateKundliChartMain,
    calculateCompatibility,
    generateDailyHoroscope
};

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Initialize Pickers for Quick Kundli =====
function initQuickKundliPickers() {
    if (typeof VedicPicker !== 'undefined' && document.getElementById('qk-date-picker')) {
        window._qkDatePicker = VedicPicker.createDatePicker('#qk-date-picker', { hiddenInputId: 'qk-dob' });
        window._qkTimePicker = VedicPicker.createTimePicker('#qk-time-picker', { hiddenInputId: 'qk-time' });
        window._qkTzPicker = VedicPicker.createTimezoneSelector('#qk-tz-picker', { hiddenInputId: 'qk-timezone', autoDetect: true });
    }
    if (typeof VedicPicker !== 'undefined' && document.getElementById('qk-place')) {
        VedicPicker.createPlaceAutocomplete('#qk-place');
    }
}

// ===== Initialize All Homepage Features =====
document.addEventListener('DOMContentLoaded', () => {
    initStarCanvas();
    animateCounters();
    generateZodiacWheel();
    generateMandala();
    initQuickKundliPickers();
    initQuickKundli();
    initTestimonialCarousel();
    initScrollReveal();
});

console.log('Vedic_Astro initialized successfully');
