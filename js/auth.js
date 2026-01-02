// Authentication System for Vedic_Astro

// User storage (using localStorage for demo - in production use a backend)
const AUTH_KEY = 'vedic_astro_user';
const USERS_KEY = 'vedic_astro_users';

// Initialize users storage
if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

        tab.classList.add('active');
        const formId = tab.dataset.tab === 'login' ? 'login-form' : 'signup-form';
        document.getElementById(formId).classList.add('active');

        hideMessages();
    });
});

// Show error message
function showError(message) {
    const errorEl = document.getElementById('error-msg');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    document.getElementById('success-msg').style.display = 'none';
}

// Show success message
function showSuccess(message) {
    const successEl = document.getElementById('success-msg');
    successEl.textContent = message;
    successEl.style.display = 'block';
    document.getElementById('error-msg').style.display = 'none';
}

// Hide messages
function hideMessages() {
    document.getElementById('error-msg').style.display = 'none';
    document.getElementById('success-msg').style.display = 'none';
}

// Get all users
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

// Save users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
}

// Save current user session
function setCurrentUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// Logout
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Calculate Vedic chart data
function calculateVedicChart(dob, tob, pob) {
    const birthDate = new Date(dob + 'T' + tob);
    const dayOfYear = Math.floor((birthDate - new Date(birthDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const hour = birthDate.getHours();

    const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const hindiSignNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
                            'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
    const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const nakshatras = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
        'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    // Calculate moon sign
    const day = birthDate.getDate();
    const month = birthDate.getMonth();
    const moonSignIndex = (day + month) % 12;
    const nakshatraIndex = Math.floor((day * 27 / 30)) % 27;

    // Calculate ascendant
    const ascendantIndex = Math.floor(hour / 2) % 12;

    // Calculate sun sign
    const sunSignIndex = (dayOfYear * 7) % 12;

    // Planetary positions (simplified)
    const planets = {};
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    planetNames.forEach((planet, index) => {
        const seed = dayOfYear + index * 31 + hour;
        const signIndex = (seed * 7) % 12;
        const house = ((signIndex + ascendantIndex) % 12) + 1;
        planets[planet] = {
            sign: signNames[signIndex],
            signHindi: hindiSignNames[signIndex],
            house: house,
            degree: ((seed * 13) % 30).toFixed(1)
        };
    });

    return {
        moonSign: {
            name: signNames[moonSignIndex],
            hindi: hindiSignNames[moonSignIndex],
            symbol: signSymbols[moonSignIndex],
            index: moonSignIndex
        },
        sunSign: {
            name: signNames[sunSignIndex],
            hindi: hindiSignNames[sunSignIndex],
            symbol: signSymbols[sunSignIndex]
        },
        ascendant: {
            name: signNames[ascendantIndex],
            hindi: hindiSignNames[ascendantIndex],
            symbol: signSymbols[ascendantIndex],
            index: ascendantIndex
        },
        nakshatra: nakshatras[nakshatraIndex],
        planets: planets,
        birthDetails: {
            date: dob,
            time: tob,
            place: pob
        }
    };
}

// Login form handler
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        setCurrentUser(user);
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showError('Invalid email or password');
    }
});

// Signup form handler
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const dob = document.getElementById('signup-dob').value;
    const tob = document.getElementById('signup-tob').value;
    const pob = document.getElementById('signup-pob').value;
    const timezone = document.getElementById('signup-timezone').value;

    // Validate
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    if (!timezone) {
        showError('Please select your birth place timezone');
        return;
    }

    const users = getUsers();

    // Check if email exists
    if (users.find(u => u.email === email)) {
        showError('Email already registered. Please login.');
        return;
    }

    // Calculate Vedic chart
    const vedicChart = calculateVedicChart(dob, tob, pob);

    // Generate initial personalized horoscope
    let initialHoroscope = null;
    if (typeof window.VedicHoroscopeData !== 'undefined') {
        initialHoroscope = window.VedicHoroscopeData.generatePersonalizedHoroscope(vedicChart, new Date());
    }

    // Create user with horoscope and timezone
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        dob: dob,
        tob: tob,
        pob: pob,
        timezone: timezone,
        vedicChart: vedicChart,
        horoscope: initialHoroscope,
        horoscopeHistory: [],
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    showSuccess('Account created successfully! Redirecting...');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
});

/**
 * Generate and store personalized horoscope for user
 * Uses VedicHoroscopeData from horoscope-data.js
 * @param {Object} vedicChart - User's Vedic chart
 * @returns {Object} - Generated horoscope data
 */
function generateUserHoroscope(vedicChart) {
    // Check if horoscope data is available
    if (typeof window.VedicHoroscopeData === 'undefined') {
        console.warn('VedicHoroscopeData not loaded, using basic horoscope');
        return generateBasicHoroscope(vedicChart);
    }

    return window.VedicHoroscopeData.generatePersonalizedHoroscope(vedicChart, new Date());
}

/**
 * Basic horoscope generation fallback
 */
function generateBasicHoroscope(vedicChart) {
    const moonSignIndex = vedicChart.moonSign.index;
    const today = new Date();

    return {
        date: today.toISOString().split('T')[0],
        generatedAt: today.toISOString(),
        moonSign: { name: vedicChart.moonSign.name },
        daily: {
            general: "Your cosmic energies are aligned for a productive day. Trust your intuition.",
            career: "Professional opportunities await. Stay focused on your goals.",
            love: "Relationships benefit from open communication and understanding.",
            health: "Pay attention to your well-being. Balance activity with rest.",
            ratings: { overall: 75, career: 70, love: 72, health: 78, finance: 68 }
        }
    };
}

/**
 * Update user's stored horoscope (called daily or on demand)
 * @param {Object} user - Current user object
 * @returns {Object} - Updated user with new horoscope
 */
function updateUserHoroscope(user) {
    if (!user || !user.vedicChart) return user;

    const today = new Date().toISOString().split('T')[0];

    // Check if horoscope needs updating (once per day)
    if (user.horoscope && user.horoscope.date === today) {
        return user; // Already up to date
    }

    // Generate new horoscope
    const newHoroscope = generateUserHoroscope(user.vedicChart);

    // Update user in storage
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
        users[userIndex].horoscope = newHoroscope;
        users[userIndex].horoscopeHistory = users[userIndex].horoscopeHistory || [];

        // Keep last 7 days of history
        if (user.horoscope) {
            users[userIndex].horoscopeHistory.unshift(user.horoscope);
            users[userIndex].horoscopeHistory = users[userIndex].horoscopeHistory.slice(0, 7);
        }

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        localStorage.setItem(AUTH_KEY, JSON.stringify(users[userIndex]));

        return users[userIndex];
    }

    return user;
}

/**
 * Get user's current horoscope (generates if needed)
 * @returns {Object|null} - Current horoscope or null
 */
function getUserHoroscope() {
    let user = getCurrentUser();
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];

    // Check if horoscope needs updating
    if (!user.horoscope || user.horoscope.date !== today) {
        user = updateUserHoroscope(user);
    }

    return user.horoscope;
}

/**
 * Get horoscope history for the user
 * @returns {Array} - Array of past horoscopes
 */
function getHoroscopeHistory() {
    const user = getCurrentUser();
    return user?.horoscopeHistory || [];
}

// Export for global use
window.VedicAuth = {
    getCurrentUser,
    isLoggedIn,
    logout,
    calculateVedicChart,
    generateUserHoroscope,
    updateUserHoroscope,
    getUserHoroscope,
    getHoroscopeHistory
};
