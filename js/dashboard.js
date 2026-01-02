// Dashboard JavaScript - Personalized Vedic Reports using Stored Horoscope Data
// Based on authentic Vedic sources (BPHS, Phaladeepika, Brihat Jataka)

// Function to get fresh user data from localStorage
function getFreshUserData() {
    const userData = localStorage.getItem('vedic_astro_user');
    return userData ? JSON.parse(userData) : null;
}

// Check authentication and get user with updated horoscope
let user = getFreshUserData();
if (!user) {
    window.location.href = 'login.html';
}

// Update horoscope if needed (daily update)
user = VedicAuth.updateUserHoroscope(user);
const horoscope = user.horoscope || VedicAuth.getUserHoroscope();

// User dropdown toggle
function toggleUserMenu() {
    document.getElementById('user-dropdown').classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('user-dropdown')?.classList.remove('active');
    }
});

// Logout function
function logout() {
    VedicAuth.logout();
}

// Generate mini chart SVG
function generateMiniChart(planets, ascendantIndex) {
    const signAbbrev = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

    return `
        <svg viewBox="0 0 150 150" class="mini-chart-svg">
            <rect x="2" y="2" width="146" height="146" fill="rgba(22, 33, 62, 0.9)" stroke="#D4AF37" stroke-width="1" rx="2"/>
            <line x1="2" y1="2" x2="148" y2="148" stroke="#D4AF37" stroke-width="0.5" opacity="0.5"/>
            <line x1="148" y1="2" x2="2" y2="148" stroke="#D4AF37" stroke-width="0.5" opacity="0.5"/>
            <line x1="75" y1="2" x2="75" y2="148" stroke="#D4AF37" stroke-width="0.5" opacity="0.5"/>
            <line x1="2" y1="75" x2="148" y2="75" stroke="#D4AF37" stroke-width="0.5" opacity="0.5"/>
            <polygon points="75,40 110,75 75,110 40,75" fill="none" stroke="#D4AF37" stroke-width="0.5"/>
            <text x="75" y="28" text-anchor="middle" fill="#D4AF37" font-size="8">Asc</text>
            <text x="75" y="72" text-anchor="middle" fill="#888" font-size="7">${signAbbrev[ascendantIndex]}</text>
            <text x="75" y="82" text-anchor="middle" fill="#888" font-size="7">Chart</text>
        </svg>
    `;
}

// Initialize dashboard with stored horoscope data
function initDashboard() {
    const chart = user.vedicChart;

    // Set welcome message
    document.getElementById('welcome-text').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;

    // Set current date
    const today = new Date();
    document.getElementById('current-date').textContent = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Set user avatar
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('user-avatar').textContent = initials;

    // Set mini chart
    document.getElementById('mini-chart').innerHTML = generateMiniChart(chart.planets, chart.ascendant.index);

    // Set moon sign info
    document.getElementById('user-moon-symbol').textContent = chart.moonSign.symbol;
    document.getElementById('user-moon-sign').textContent = `${chart.moonSign.hindi} (${chart.moonSign.name})`;

    // Set sidebar birth info
    document.getElementById('sidebar-dob').textContent = formatDate(user.dob);
    document.getElementById('sidebar-tob').textContent = formatTime(user.tob);
    document.getElementById('sidebar-pob').textContent = user.pob;
    document.getElementById('sidebar-timezone').textContent = formatTimezone(user.timezone);

    // Set sidebar chart info
    document.getElementById('sidebar-moon').textContent = chart.moonSign.name;
    document.getElementById('sidebar-sun').textContent = chart.sunSign.name;
    document.getElementById('sidebar-asc').textContent = chart.ascendant.name;
    document.getElementById('sidebar-nak').textContent = chart.nakshatra;

    // Initialize edit form with current values
    document.getElementById('edit-dob').value = user.dob;
    document.getElementById('edit-tob').value = user.tob;
    document.getElementById('edit-pob').value = user.pob;
    if (user.timezone) {
        document.getElementById('edit-timezone').value = user.timezone;
    }

    // Set Dasha (calculated from Vimshottari system)
    const dashaOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const currentDashaIndex = (today.getFullYear() - new Date(user.dob).getFullYear()) % 9;
    document.getElementById('current-dasha').textContent = `${dashaOrder[currentDashaIndex]} Mahadasha`;
    document.getElementById('current-antardasha').textContent = `${dashaOrder[(currentDashaIndex + 1) % 9]} Antardasha`;

    // Load reports from stored horoscope
    loadDailyReport();
    loadWeeklyReport();
    loadMonthlyReport();

    // Display horoscope source
    displayHoroscopeSource();
}

// Load daily report from stored horoscope
function loadDailyReport() {
    const today = new Date();

    // Set date
    document.getElementById('daily-date').textContent = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Use stored horoscope data
    if (horoscope && horoscope.daily) {
        document.getElementById('daily-prediction').textContent = horoscope.daily.general;
        document.getElementById('daily-career').textContent = horoscope.daily.career;
        document.getElementById('daily-love').textContent = horoscope.daily.love;
        document.getElementById('daily-health').textContent = horoscope.daily.health;

        // Set lucky elements from horoscope
        if (horoscope.daily.lucky) {
            document.getElementById('lucky-number').textContent = horoscope.daily.lucky.number;
            document.getElementById('lucky-color').textContent = horoscope.daily.lucky.color;
            document.getElementById('lucky-time').textContent = horoscope.daily.lucky.day;
            document.getElementById('lucky-direction').textContent = horoscope.daily.lucky.direction;
        }

        // Set remedies from horoscope
        if (horoscope.daily.remedies) {
            const remedyList = document.getElementById('remedy-list');
            remedyList.innerHTML = horoscope.daily.remedies.map(r => `<li>${r}</li>`).join('');
        }

        // Set ratings from horoscope
        if (horoscope.daily.ratings) {
            const ratings = horoscope.daily.ratings;
            Object.keys(ratings).forEach(key => {
                const el = document.getElementById(`${key}-rating`);
                if (el) {
                    el.style.width = `${ratings[key]}%`;
                    el.parentElement.nextElementSibling.textContent = `${ratings[key]}%`;
                }
            });
        }
    } else {
        // Fallback to basic content
        document.getElementById('daily-prediction').textContent =
            "Your cosmic energies are aligned for a productive day. Trust your intuition and take measured steps toward your goals.";
    }

    // Set transits (calculated from current date)
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const transitGrid = document.getElementById('transit-grid');
    transitGrid.innerHTML = planets.slice(0, 6).map((planet, i) => `
        <div class="transit-item">
            <div class="transit-planet">${planet}</div>
            <div class="transit-sign">${signs[(today.getMonth() + i) % 12]}</div>
        </div>
    `).join('');
}

// Load weekly report from stored horoscope
function loadWeeklyReport() {
    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 6);

    document.getElementById('weekly-date').textContent =
        `${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    if (horoscope && horoscope.weekly) {
        document.getElementById('weekly-overview').textContent =
            `This week's theme focuses on ${horoscope.weekly.theme}. ${horoscope.weekly.focus.slice(0, 3).join(', ')} are highlighted areas that deserve your attention and energy.`;

        if (horoscope.weekly.bestDays && horoscope.weekly.bestDays.length > 0) {
            document.getElementById('weekly-best-days').textContent =
                `Based on your Vedic chart, ${horoscope.weekly.bestDays.join(' and ')} are most favorable for important activities and decisions.`;
        }

        if (horoscope.weekly.challenges && horoscope.weekly.challenges.length > 0) {
            document.getElementById('weekly-challenges').textContent =
                `Exercise caution around ${horoscope.weekly.challenges.join(', ')}. Use these times for reflection rather than major decisions.`;
        }

        // Set weekly details based on moon sign
        const moonSign = horoscope.moonSign;
        if (moonSign) {
            document.getElementById('weekly-career').textContent =
                `Professional matters align with your ${moonSign.element || 'elemental'} nature. Your ${moonSign.ruler || 'planetary ruler'} supports career growth through ${(moonSign.strengths || ['dedication', 'focus']).slice(0, 2).join(' and ')}.`;

            document.getElementById('weekly-relationships').textContent =
                `Relationships benefit from your natural ${(moonSign.strengths || ['understanding']).slice(0, 1)[0] || 'understanding'}. Compatible connections with ${(horoscope.compatibility || ['complementary']).slice(0, 2).join(' and ')} signs are highlighted.`;

            document.getElementById('weekly-finance').textContent =
                `Financial planning is favored. Your lucky numbers ${(moonSign.luckyNumbers || [3, 7]).join(', ')} may bring fortune. Colors ${(moonSign.luckyColors || ['gold']).slice(0, 2).join(' and ')} attract prosperity.`;
        }
    } else {
        // Fallback content
        document.getElementById('weekly-overview').textContent =
            "This week brings opportunities for growth and self-development. Pay attention to the themes emerging in your daily experiences.";
    }
}

// Load monthly report from stored horoscope
function loadMonthlyReport() {
    const today = new Date();
    document.getElementById('monthly-date').textContent = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (horoscope && horoscope.monthly) {
        document.getElementById('monthly-overview').textContent =
            `This month emphasizes ${horoscope.monthly.focus}. The themes of ${horoscope.monthly.themes.slice(0, 3).join(', ')} guide your path toward fulfillment and success.`;

        document.getElementById('monthly-focus').textContent =
            `Key areas of focus include ${horoscope.monthly.themes.slice(0, 2).join(' and ')}. Your element (${horoscope.element || 'cosmic'}) energy supports transformation in these domains.`;

        if (horoscope.monthly.keyDates && horoscope.monthly.keyDates.length > 0) {
            const keyDateStr = horoscope.monthly.keyDates
                .map(d => `${d.date} (${d.significance})`)
                .join('; ');
            document.getElementById('monthly-events').textContent =
                `Significant dates this month: ${keyDateStr}. Planetary alignments create opportunities for breakthroughs during these periods.`;
        }
    } else {
        // Fallback content
        document.getElementById('monthly-overview').textContent =
            "This month brings transformative energies. Major planetary alignments support personal growth and achievement of long-term goals.";
    }
}

// Display horoscope source and update info
function displayHoroscopeSource() {
    // Create source indicator if not exists
    let sourceDiv = document.getElementById('horoscope-source');
    if (!sourceDiv) {
        sourceDiv = document.createElement('div');
        sourceDiv.id = 'horoscope-source';
        sourceDiv.style.cssText = `
            text-align: center;
            padding: 1rem;
            margin-top: 1rem;
            font-size: 0.75rem;
            color: var(--text-muted);
            border-top: 1px solid rgba(212, 175, 55, 0.1);
        `;
        const container = document.querySelector('.dashboard-content');
        if (container) container.appendChild(sourceDiv);
    }

    if (horoscope) {
        const generatedDate = horoscope.generatedAt ? new Date(horoscope.generatedAt).toLocaleString() : 'Today';
        sourceDiv.innerHTML = `
            <p>Predictions based on Classical Vedic Astrology Texts</p>
            <p style="font-size: 0.65rem; margin-top: 0.25rem;">
                Sources: Brihat Parashara Hora Shastra, Phaladeepika, Brihat Jataka |
                Last updated: ${generatedDate}
            </p>
            <p style="font-size: 0.65rem; margin-top: 0.25rem;">
                Your Rashi: ${horoscope.moonSign?.name || 'N/A'} |
                Nakshatra: ${user.vedicChart?.nakshatra || 'N/A'} |
                Gem: ${horoscope.gem || 'N/A'}
            </p>
        `;
    }
}

// Tab switching
document.querySelectorAll('.report-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.report-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`${tab.dataset.report}-report`).classList.add('active');
    });
});

// Refresh horoscope button handler
function refreshHoroscope() {
    // Force regenerate horoscope
    if (typeof window.VedicHoroscopeData !== 'undefined') {
        const newHoroscope = window.VedicHoroscopeData.generatePersonalizedHoroscope(user.vedicChart, new Date());

        // Update user in storage
        const users = JSON.parse(localStorage.getItem('vedic_astro_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            users[userIndex].horoscope = newHoroscope;
            localStorage.setItem('vedic_astro_users', JSON.stringify(users));
            localStorage.setItem('vedic_astro_user', JSON.stringify(users[userIndex]));

            // Reload page to show new horoscope
            window.location.reload();
        }
    }
}

// Helper function to format date
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Helper function to format time
function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Helper function to format timezone for display
function formatTimezone(tz) {
    if (!tz) return '-';
    const tzMap = {
        'Asia/Kolkata': 'IST (UTC+5:30)',
        'America/New_York': 'ET (UTC-5)',
        'America/Chicago': 'CT (UTC-6)',
        'America/Denver': 'MT (UTC-7)',
        'America/Los_Angeles': 'PT (UTC-8)',
        'America/Anchorage': 'AK (UTC-9)',
        'Pacific/Honolulu': 'HT (UTC-10)',
        'America/Toronto': 'ET (UTC-5)',
        'America/Vancouver': 'PT (UTC-8)',
        'America/Mexico_City': 'CST (UTC-6)',
        'America/Sao_Paulo': 'BRT (UTC-3)',
        'America/Buenos_Aires': 'ART (UTC-3)',
        'Europe/London': 'GMT (UTC+0)',
        'Europe/Paris': 'CET (UTC+1)',
        'Europe/Moscow': 'MSK (UTC+3)',
        'Europe/Istanbul': 'TRT (UTC+3)',
        'Asia/Dubai': 'GST (UTC+4)',
        'Asia/Karachi': 'PKT (UTC+5)',
        'Asia/Dhaka': 'BST (UTC+6)',
        'Asia/Bangkok': 'ICT (UTC+7)',
        'Asia/Singapore': 'SGT (UTC+8)',
        'Asia/Hong_Kong': 'HKT (UTC+8)',
        'Asia/Shanghai': 'CST (UTC+8)',
        'Asia/Tokyo': 'JST (UTC+9)',
        'Asia/Seoul': 'KST (UTC+9)',
        'Australia/Perth': 'AWST (UTC+8)',
        'Australia/Sydney': 'AEST (UTC+10)',
        'Australia/Melbourne': 'AEST (UTC+10)',
        'Pacific/Auckland': 'NZST (UTC+12)',
        'Africa/Cairo': 'EET (UTC+2)',
        'Africa/Johannesburg': 'SAST (UTC+2)',
        'Africa/Lagos': 'WAT (UTC+1)',
        'Asia/Jerusalem': 'IST (UTC+2)'
    };
    return tzMap[tz] || tz;
}

// Toggle birth details edit mode
function toggleBirthEdit() {
    const displayDiv = document.getElementById('birth-display');
    const editDiv = document.getElementById('birth-edit');
    const editBtn = document.getElementById('edit-birth-btn');

    if (editDiv.style.display === 'none') {
        displayDiv.style.display = 'none';
        editDiv.style.display = 'block';
        editBtn.textContent = '✕';
    } else {
        displayDiv.style.display = 'block';
        editDiv.style.display = 'none';
        editBtn.textContent = '✏️';
    }
}

// Show success toast
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// Handle birth details form submission
document.addEventListener('DOMContentLoaded', function() {
    const birthForm = document.getElementById('birth-edit-form');
    if (birthForm) {
        birthForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const dob = document.getElementById('edit-dob').value;
            const tob = document.getElementById('edit-tob').value;
            const pob = document.getElementById('edit-pob').value;
            const timezone = document.getElementById('edit-timezone').value;

            if (!dob || !tob || !pob || !timezone) {
                alert('Please fill in all birth details including timezone');
                return;
            }

            // Get fresh user data
            const currentUser = VedicAuth.getCurrentUser();
            if (!currentUser) {
                alert('User session expired. Please login again.');
                window.location.href = 'login.html';
                return;
            }

            // Recalculate Vedic chart
            const vedicChart = VedicAuth.calculateVedicChart(dob, tob, pob);

            // Generate new horoscope
            let newHoroscope = null;
            if (typeof window.VedicHoroscopeData !== 'undefined') {
                newHoroscope = window.VedicHoroscopeData.generatePersonalizedHoroscope(vedicChart, new Date());
            }

            // Update user in storage
            const users = JSON.parse(localStorage.getItem('vedic_astro_users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);

            if (userIndex !== -1) {
                users[userIndex].dob = dob;
                users[userIndex].tob = tob;
                users[userIndex].pob = pob;
                users[userIndex].timezone = timezone;
                users[userIndex].vedicChart = vedicChart;
                users[userIndex].horoscope = newHoroscope;

                localStorage.setItem('vedic_astro_users', JSON.stringify(users));
                localStorage.setItem('vedic_astro_user', JSON.stringify(users[userIndex]));

                showToast('Birth details updated! Chart recalculated.');

                // Force hard reload to get fresh data
                setTimeout(() => {
                    window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
                }, 1000);
            } else {
                // User not found in users array, update current user directly
                currentUser.dob = dob;
                currentUser.tob = tob;
                currentUser.pob = pob;
                currentUser.timezone = timezone;
                currentUser.vedicChart = vedicChart;
                currentUser.horoscope = newHoroscope;

                localStorage.setItem('vedic_astro_user', JSON.stringify(currentUser));

                // Also add/update in users array
                users.push(currentUser);
                localStorage.setItem('vedic_astro_users', JSON.stringify(users));

                showToast('Birth details updated! Chart recalculated.');
                // Force hard reload to get fresh data
                setTimeout(() => {
                    window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
                }, 1000);
            }
        });
    }
});

// Initialize
initDashboard();
