// Horoscopes Page JavaScript

const horoscopeData = {
    daily: {
        aries: {
            content: `<p>Today brings dynamic energy to your endeavors. Mars, your ruling planet, supports bold initiatives, but practice patience in dealings with authority figures. Financial matters require careful attention this afternoon.</p>
            <p>Romance is favored in the evening hours. Singles may encounter someone intriguing through friends or social gatherings. Those in relationships should plan quality time together.</p>
            <p>Health-wise, channel excess energy into physical activities. Avoid impulsive decisions, especially regarding major purchases or commitments.</p>`,
            lucky_number: '7',
            lucky_color: 'Red',
            lucky_time: '4:00 PM - 6:00 PM',
            mood: 'Energetic',
            love: 4, career: 5, health: 3, finance: 4
        },
        taurus: {
            content: `<p>Venus enhances your creative expression today. Your natural charm opens doors in both personal and professional spheres. Artistic endeavors receive cosmic support.</p>
            <p>Financial opportunities may present themselves unexpectedly. Trust your instincts about investments, but conduct thorough research before committing.</p>
            <p>In relationships, express your feelings openly. Partners appreciate your steadfast nature. Evening hours favor relaxation and self-care.</p>`,
            lucky_number: '6',
            lucky_color: 'Green',
            lucky_time: '10:00 AM - 12:00 PM',
            mood: 'Content',
            love: 5, career: 4, health: 4, finance: 5
        },
        gemini: {
            content: `<p>Mercury sharpens your mental faculties today. Communication flows effortlessly, making this ideal for important conversations, negotiations, or presentations.</p>
            <p>Multiple opportunities may compete for your attention. Prioritize ruthlessly and focus on what truly matters. Avoid spreading yourself too thin.</p>
            <p>Social connections prove beneficial. Network actively, as today's conversations may lead to future opportunities. Evening favors intellectual pursuits.</p>`,
            lucky_number: '5',
            lucky_color: 'Yellow',
            lucky_time: '2:00 PM - 4:00 PM',
            mood: 'Curious',
            love: 3, career: 5, health: 4, finance: 4
        },
        cancer: {
            content: `<p>The Moon heightens your intuitive abilities today. Pay attention to subtle cues and inner guidance. Emotional intelligence serves you well in all interactions.</p>
            <p>Home and family matters take center stage. Creating a nurturing environment brings satisfaction. Consider home improvement projects or family gatherings.</p>
            <p>Past issues may resurface for resolution. Approach them with compassion and wisdom. Evening meditation brings clarity and peace.</p>`,
            lucky_number: '2',
            lucky_color: 'Silver',
            lucky_time: '8:00 PM - 10:00 PM',
            mood: 'Intuitive',
            love: 5, career: 3, health: 4, finance: 3
        },
        leo: {
            content: `<p>The Sun illuminates your natural leadership abilities. Step into the spotlight with confidence. Creative projects and public presentations are highly favored.</p>
            <p>Recognition for past efforts may arrive unexpectedly. Accept praise graciously while remaining humble. Your generosity inspires others.</p>
            <p>Romance sparkles with excitement. Plan something special for loved ones. Your warmth and enthusiasm attract positive attention.</p>`,
            lucky_number: '1',
            lucky_color: 'Gold',
            lucky_time: '12:00 PM - 2:00 PM',
            mood: 'Confident',
            love: 5, career: 5, health: 4, finance: 4
        },
        virgo: {
            content: `<p>Mercury supports analytical thinking and problem-solving. Details that others miss become clear to you. Use this precision in work and planning.</p>
            <p>Health matters benefit from attention. Consider dietary improvements or new wellness routines. Small changes yield significant results over time.</p>
            <p>Service to others brings fulfillment. Your practical assistance makes a real difference. Evening hours favor organizing and decluttering.</p>`,
            lucky_number: '5',
            lucky_color: 'Navy Blue',
            lucky_time: '6:00 AM - 8:00 AM',
            mood: 'Practical',
            love: 3, career: 5, health: 5, finance: 4
        },
        libra: {
            content: `<p>Venus brings harmony to relationships and social interactions. Your diplomatic skills resolve conflicts with grace. Beauty and aesthetics inspire creative expression.</p>
            <p>Partnership matters flourish under today's aspects. Collaborate with others for mutual benefit. Balance giving and receiving in all exchanges.</p>
            <p>Legal or contractual matters favor resolution. Seek fairness and equity in negotiations. Evening brings romantic possibilities.</p>`,
            lucky_number: '6',
            lucky_color: 'Pink',
            lucky_time: '5:00 PM - 7:00 PM',
            mood: 'Harmonious',
            love: 5, career: 4, health: 4, finance: 4
        },
        scorpio: {
            content: `<p>Mars intensifies your focus and determination. Deep transformations are possible today. Dig beneath surface appearances to uncover hidden truths.</p>
            <p>Financial matters involving shared resources require attention. Insurance, investments, or inheritances may need review. Protect your interests wisely.</p>
            <p>Emotional intensity runs high. Channel passion into productive pursuits. Avoid power struggles; choose collaboration over confrontation.</p>`,
            lucky_number: '9',
            lucky_color: 'Maroon',
            lucky_time: '9:00 PM - 11:00 PM',
            mood: 'Intense',
            love: 4, career: 4, health: 3, finance: 5
        },
        sagittarius: {
            content: `<p>Jupiter expands your horizons today. Travel, education, and philosophical pursuits are highly favored. Your optimism inspires those around you.</p>
            <p>Teaching and mentoring opportunities arise. Share your wisdom generously. Your broad perspective helps others see new possibilities.</p>
            <p>Adventure calls—answer with enthusiasm. Step outside comfort zones for growth. Evening brings opportunities for meaningful conversations.</p>`,
            lucky_number: '3',
            lucky_color: 'Purple',
            lucky_time: '3:00 PM - 5:00 PM',
            mood: 'Adventurous',
            love: 4, career: 4, health: 5, finance: 3
        },
        capricorn: {
            content: `<p>Saturn rewards disciplined effort and strategic planning. Career advancement is possible through persistent work. Your reliability earns respect and trust.</p>
            <p>Authority figures favor your initiatives. Present proposals with confidence and supporting data. Long-term projects gain momentum.</p>
            <p>Balance ambition with self-care. Don't neglect health or relationships in pursuit of goals. Evening favors quiet reflection and planning.</p>`,
            lucky_number: '8',
            lucky_color: 'Brown',
            lucky_time: '7:00 AM - 9:00 AM',
            mood: 'Determined',
            love: 3, career: 5, health: 3, finance: 5
        },
        aquarius: {
            content: `<p>Uranus sparks innovative thinking and unexpected breakthroughs. Original ideas flow freely today. Technology and unconventional approaches yield results.</p>
            <p>Community involvement brings fulfillment. Humanitarian causes resonate deeply. Connect with like-minded individuals for collaborative projects.</p>
            <p>Embrace change and uncertainty as opportunities. Your unique perspective offers valuable insights. Evening favors social activities with friends.</p>`,
            lucky_number: '4',
            lucky_color: 'Electric Blue',
            lucky_time: '11:00 AM - 1:00 PM',
            mood: 'Innovative',
            love: 4, career: 4, health: 4, finance: 4
        },
        pisces: {
            content: `<p>Neptune enhances spiritual awareness and creative inspiration. Artistic and musical pursuits flow effortlessly. Trust your imagination and intuitive insights.</p>
            <p>Compassion guides your interactions today. Your sensitivity helps others feel understood. Set healthy boundaries to avoid emotional overwhelm.</p>
            <p>Dreams carry meaningful messages. Keep a journal nearby. Meditation and contemplation bring clarity about life direction.</p>`,
            lucky_number: '7',
            lucky_color: 'Sea Green',
            lucky_time: '6:00 PM - 8:00 PM',
            mood: 'Dreamy',
            love: 5, career: 3, health: 4, finance: 3
        }
    },
    weekly: {
        aries: {
            content: `<p><strong>This Week's Overview:</strong> Mars energizes your sector of communication and short travels. Expect increased activity in your immediate environment with opportunities for learning and networking.</p>
            <p><strong>Career & Finance:</strong> Mid-week brings important discussions about work projects. Your ideas receive positive reception from superiors. Financial planning deserves attention toward the weekend.</p>
            <p><strong>Love & Relationships:</strong> Communication with partners improves significantly. Singles may find attraction through intellectual connections. Weekend favors social gatherings.</p>
            <p><strong>Health:</strong> Mental stimulation is high but may cause restlessness. Balance activity with adequate rest. Short walks and breathing exercises help maintain equilibrium.</p>`,
            lucky_number: '9',
            lucky_color: 'Crimson',
            lucky_time: 'Wednesday Afternoon',
            mood: 'Dynamic',
            love: 4, career: 5, health: 3, finance: 4
        },
        // Add more weekly horoscopes for other signs...
    },
    monthly: {
        aries: {
            content: `<p><strong>Monthly Overview:</strong> This month emphasizes personal growth and self-expression. The planetary alignments favor bold initiatives and leadership opportunities. Your natural courage is amplified, helping you overcome obstacles.</p>
            <p><strong>Career:</strong> Professional advancement is highlighted in the first half of the month. New responsibilities may come your way. The third week brings recognition for past efforts. Avoid conflicts with colleagues around the 18th.</p>
            <p><strong>Finances:</strong> Income potential increases mid-month. Investment opportunities should be evaluated carefully. Avoid impulsive spending during the new moon phase. Long-term financial planning is favored after the 20th.</p>
            <p><strong>Love & Relationships:</strong> Venus transiting your relationship sector brings harmony. Singles have excellent prospects for meeting someone special around the full moon. Existing relationships deepen through honest communication.</p>
            <p><strong>Health:</strong> Energy levels fluctuate throughout the month. Physical exercise is essential for maintaining balance. Pay attention to stress management techniques. The last week favors starting new health routines.</p>`,
            lucky_number: '1, 8, 17',
            lucky_color: 'Red, Orange',
            lucky_time: 'Mid-Month',
            mood: 'Ambitious',
            love: 4, career: 5, health: 3, finance: 4
        },
        // Add more monthly horoscopes for other signs...
    },
    yearly: {
        aries: {
            content: `<p><strong>2025 Overview for Aries:</strong> This year brings transformative opportunities for personal and professional growth. Jupiter's transit through your wealth sector promises financial expansion, while Saturn continues to refine your community connections.</p>
            <p><strong>Key Themes:</strong> Self-discovery, financial growth, relationship evolution, and career advancement define 2025 for Aries natives.</p>
            <p><strong>First Quarter (Jan-Mar):</strong> The year begins with intense energy for new initiatives. Career opportunities emerge rapidly. Romantic relationships require patience and understanding during February.</p>
            <p><strong>Second Quarter (Apr-Jun):</strong> Financial matters take center stage. Property transactions or major investments are favored. Health requires attention in May. Travel opportunities arise in June.</p>
            <p><strong>Third Quarter (Jul-Sep):</strong> Creative expression flourishes. Romantic opportunities abound for singles. Career projects reach important milestones. Family matters require diplomatic handling in August.</p>
            <p><strong>Fourth Quarter (Oct-Dec):</strong> The year concludes with recognition and rewards. Spiritual growth accelerates. Relationships stabilize and deepen. Financial security improves significantly by year-end.</p>
            <p><strong>Key Dates:</strong> March 15, June 21, September 8, November 30</p>`,
            lucky_number: '1, 9, 18',
            lucky_color: 'Red, Gold',
            lucky_time: 'Spring & Autumn',
            mood: 'Transformative',
            love: 4, career: 5, health: 4, finance: 5
        },
        // Add more yearly horoscopes for other signs...
    }
};

// Populate missing horoscopes with generic content
const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const periods = ['weekly', 'monthly', 'yearly'];

signs.forEach(sign => {
    periods.forEach(period => {
        if (!horoscopeData[period][sign]) {
            horoscopeData[period][sign] = {
                content: horoscopeData.daily[sign].content.replace('Today', period === 'weekly' ? 'This week' : period === 'monthly' ? 'This month' : 'This year'),
                lucky_number: horoscopeData.daily[sign].lucky_number,
                lucky_color: horoscopeData.daily[sign].lucky_color,
                lucky_time: horoscopeData.daily[sign].lucky_time,
                mood: horoscopeData.daily[sign].mood,
                love: horoscopeData.daily[sign].love,
                career: horoscopeData.daily[sign].career,
                health: horoscopeData.daily[sign].health,
                finance: horoscopeData.daily[sign].finance
            };
        }
    });
});

// Current state
let currentSign = 'aries';
let currentPeriod = 'daily';

// Sign data
const signData = {
    aries: { symbol: '♈', name: 'Mesha (Aries)' },
    taurus: { symbol: '♉', name: 'Vrishabha (Taurus)' },
    gemini: { symbol: '♊', name: 'Mithuna (Gemini)' },
    cancer: { symbol: '♋', name: 'Karka (Cancer)' },
    leo: { symbol: '♌', name: 'Simha (Leo)' },
    virgo: { symbol: '♍', name: 'Kanya (Virgo)' },
    libra: { symbol: '♎', name: 'Tula (Libra)' },
    scorpio: { symbol: '♏', name: 'Vrishchika (Scorpio)' },
    sagittarius: { symbol: '♐', name: 'Dhanu (Sagittarius)' },
    capricorn: { symbol: '♑', name: 'Makara (Capricorn)' },
    aquarius: { symbol: '♒', name: 'Kumbha (Aquarius)' },
    pisces: { symbol: '♓', name: 'Meena (Pisces)' }
};

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

// Update horoscope display
function updateHoroscope() {
    const data = horoscopeData[currentPeriod][currentSign];
    const sign = signData[currentSign];

    document.getElementById('current-sign-symbol').textContent = sign.symbol;
    document.getElementById('current-sign-name').textContent = sign.name;
    document.getElementById('horoscope-content').innerHTML = data.content;

    // Update date based on period
    const today = new Date();
    let dateText = '';
    if (currentPeriod === 'daily') {
        dateText = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else if (currentPeriod === 'weekly') {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 6);
        dateText = `${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (currentPeriod === 'monthly') {
        dateText = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
        dateText = '2025 Yearly Forecast';
    }
    document.getElementById('horoscope-date').textContent = dateText;

    // Update highlights
    const highlights = document.querySelectorAll('.highlight-item .highlight-value');
    if (highlights.length >= 4) {
        highlights[0].textContent = data.lucky_number;
        highlights[1].textContent = data.lucky_color;
        highlights[2].textContent = data.lucky_time;
        highlights[3].textContent = data.mood;
    }

    // Update ratings
    const ratings = document.querySelectorAll('.rating-item');
    const ratingTypes = ['love', 'career', 'health', 'finance'];
    ratings.forEach((rating, index) => {
        const starsContainer = rating.querySelector('.rating-stars');
        if (starsContainer && ratingTypes[index]) {
            starsContainer.textContent = generateStars(data[ratingTypes[index]]);
        }
    });
}

// Event listeners for zodiac selection
document.querySelectorAll('.zodiac-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.zodiac-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSign = btn.dataset.sign;
        updateHoroscope();
    });
});

// Event listeners for period tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.tab;
        updateHoroscope();
    });
});

// Initialize
updateHoroscope();
