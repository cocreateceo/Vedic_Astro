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

// Calculate approximate Panchang (simplified version)
function calculatePanchang(date) {
    const baseDate = new Date('2000-01-01');
    const daysSince = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));

    // Simplified calculations (for demonstration)
    const tithiIndex = daysSince % 30;
    const nakshatraIndex = daysSince % 27;
    const yogaIndex = daysSince % 27;
    const karanaIndex = (daysSince * 2) % 11;

    // Determine paksha (fortnight)
    const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
    const tithiNum = (tithiIndex % 15) + 1;

    return {
        tithi: `${paksha} ${tithis[tithiNum - 1] || 'Purnima'}`,
        nakshatra: nakshatras[nakshatraIndex],
        yoga: yogas[yogaIndex],
        karana: karanas[karanaIndex]
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
}

updatePanchangDisplay();

// Kundli Calculator Functions
function calculateMoonSign(day, month) {
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

// Generate Kundli Chart (North Indian style)
function generateKundliChart(ascendant) {
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
    calculateMoonSign,
    generateKundliChart,
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

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to feature cards and other elements
document.querySelectorAll('.feature-card, .testimonial-card, .zodiac-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

console.log('Vedic_Astro initialized successfully');
