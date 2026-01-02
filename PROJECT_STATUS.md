# Vedic_Astro - Project Documentation

## Project Overview

**Vedic_Astro** is a comprehensive Vedic astrology website providing personalized horoscopes, birth chart generation, compatibility matching, and astrological guidance based on authentic classical Vedic texts.

**Last Updated:** December 29, 2025

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | CSS Custom Properties, Responsive Design |
| Fonts | Google Fonts (Cinzel, Poppins) |
| Storage | localStorage (client-side) |
| Server | Python HTTP Server (development) |

**No backend required** - All calculations and data storage happen client-side.

---

## How to Run

### Start the Application
```bash
cd "/mnt/c/Shri Hari Hari/Projects/Vedic_Astro"
python3 -m http.server 8080
```

### Access
Open browser: **http://localhost:8080**

### Stop Server
Press `Ctrl+C` in terminal

---

## File Structure

```
Vedic_Astro/
├── index.html              # Homepage
├── horoscopes.html         # Daily/Weekly/Monthly/Yearly horoscopes
├── kundli.html             # Birth chart generator (North & South Indian)
├── zodiac.html             # 12 zodiac signs information
├── compatibility.html      # Ashtakoot Guna Milan (36 Gunas)
├── panchang.html           # Hindu calendar
├── articles.html           # Educational articles
├── consultation.html       # Book consultations
├── login.html              # User authentication
├── dashboard.html          # Personalized user dashboard
├── profile.html            # User profile management
│
├── css/
│   └── style.css           # Complete styling (~1400 lines)
│
├── js/
│   ├── main.js             # Core site functionality
│   ├── horoscopes.js       # Horoscope content switching
│   ├── kundli.js           # Birth chart generation
│   ├── compatibility.js    # Guna Milan calculations
│   ├── auth.js             # Authentication & user management
│   ├── dashboard.js        # Dashboard functionality
│   └── horoscope-data.js   # Vedic horoscope database (from classical texts)
│
├── images/
│   └── logo.svg            # Site logo
│
├── LEARNING_DOC.md         # Technical learnings documentation
└── PROJECT_STATUS.md       # This file
```

---

## Features Implemented

### 1. User Authentication System
- **Signup** with birth details (DOB, Time, Place, Timezone)
- **Login** with email/password
- **Profile management** (edit personal info, birth details, password)
- **Logout** functionality
- Data persisted in localStorage

### 2. Birth Chart Generator (Kundli)
- **North Indian Style** - Diamond pattern chart
- **South Indian Style** - Grid-based chart
- **Toggle switch** to switch between styles
- Calculates:
  - Moon Sign (Rashi)
  - Sun Sign
  - Ascendant (Lagna)
  - Nakshatra (Birth Star)
  - Planetary positions
  - Vimshottari Dasha periods

### 3. Personalized Dashboard
- Mini Rashi chart display (top-right)
- **Daily/Weekly/Monthly** report tabs
- Birth details with **inline editing**
- Current Dasha period display
- Lucky elements (number, color, time, direction)
- Daily remedies from Vedic texts
- Rating bars (Overall, Career, Love, Health, Finance)
- Current planetary transits

### 4. Horoscope System
- **Source:** Classical Vedic texts (BPHS, Phaladeepika, Brihat Jataka)
- Personalized based on Moon Sign
- Stored in user profile
- Auto-updates daily
- Maintains 7-day history
- Includes:
  - General predictions
  - Career guidance
  - Love & relationships
  - Health advice
  - Remedies & mantras

### 5. Compatibility Matching
- **Ashtakoot Guna Milan** (36 Gunas system)
- 8 matching categories:
  1. Varna (1 point)
  2. Vashya (2 points)
  3. Tara (3 points)
  4. Yoni (4 points)
  5. Graha Maitri (5 points)
  6. Gana (6 points)
  7. Bhakoot (7 points)
  8. Nadi (8 points)
- Score interpretation and recommendations

### 6. Timezone Support
- Timezone selection during signup
- Editable in dashboard and profile
- Major world timezones grouped by region
- Stored with user data for accurate calculations

### 7. Additional Pages
- **Zodiac Signs** - All 12 signs with characteristics
- **Panchang** - Daily Hindu calendar elements
- **Articles** - Educational content on Vedic astrology
- **Consultation** - Book astrologer sessions (UI only)

---

## Current Status

### Completed Features
- [x] Homepage with hero, zodiac bar, features
- [x] User signup/login system
- [x] Birth chart generator (both styles)
- [x] Personalized dashboard with reports
- [x] Horoscope data from authentic Vedic sources
- [x] Compatibility matching (Guna Milan)
- [x] Profile management
- [x] Timezone tracking
- [x] Inline birth details editing on dashboard
- [x] Responsive design for all devices
- [x] SVG logo created

### Known Issues / Fixes Applied
1. **Birth details not saving** - Fixed by:
   - Reading fresh data from localStorage on page load
   - Using cache-busting reload after save
   - Wrapped form handlers in DOMContentLoaded

2. **UI not reflecting changes** - Fixed by:
   - Force reload with timestamp parameter
   - Direct localStorage read instead of cached variable

---

## Data Storage Structure

### localStorage Keys

**`vedic_astro_user`** - Current logged-in user:
```javascript
{
    id: 1703847600000,
    name: "User Name",
    email: "user@example.com",
    password: "hashedpassword",
    dob: "1990-05-15",
    tob: "14:30",
    pob: "Mumbai, India",
    timezone: "Asia/Kolkata",
    gender: "male",
    vedicChart: {
        moonSign: { name: "Aries", symbol: "♈", index: 0, hindi: "मेष" },
        sunSign: { name: "Taurus", symbol: "♉", index: 1 },
        ascendant: { name: "Cancer", symbol: "♋", index: 3 },
        nakshatra: "Ashwini",
        planets: { /* planetary positions */ },
        birthDetails: { /* original birth data */ }
    },
    horoscope: {
        date: "2025-12-29",
        generatedAt: "2025-12-29T10:00:00.000Z",
        moonSign: { /* detailed sign info */ },
        daily: {
            general: "...",
            career: "...",
            love: "...",
            health: "...",
            ratings: { overall: 75, career: 80, love: 70, health: 85, finance: 65 },
            lucky: { number: 9, color: "Red", day: "Tuesday", direction: "East" },
            remedies: ["..."],
            mantra: "..."
        },
        weekly: { /* weekly themes */ },
        monthly: { /* monthly focus */ }
    },
    horoscopeHistory: [ /* last 7 days */ ],
    createdAt: "2025-12-29T10:00:00.000Z"
}
```

**`vedic_astro_users`** - Array of all registered users

---

## Key Code References

### Authentication (js/auth.js)
```javascript
window.VedicAuth = {
    getCurrentUser(),        // Get logged-in user
    isLoggedIn(),           // Check auth status
    logout(),               // Clear session
    calculateVedicChart(),  // Generate Vedic chart
    generateUserHoroscope(),
    updateUserHoroscope(),
    getUserHoroscope(),
    getHoroscopeHistory()
};
```

### Horoscope Data (js/horoscope-data.js)
```javascript
window.VedicHoroscopeData = {
    rashiDetails: {},       // All 12 signs
    nakshatraDetails: {},   // All 27 nakshatras
    dailyPredictions: {},   // Per-sign predictions
    weeklyThemes: {},
    monthlyFocus: {},
    generatePersonalizedHoroscope(vedicChart, date)
};
```

### Dashboard Fresh Data Load (js/dashboard.js)
```javascript
function getFreshUserData() {
    const userData = localStorage.getItem('vedic_astro_user');
    return userData ? JSON.parse(userData) : null;
}
```

---

## Styling Theme

### CSS Variables (css/style.css)
```css
:root {
    --gold: #D4AF37;
    --gold-light: #F5D77F;
    --primary: #6B3FA0;
    --background: #0D0D1A;
    --background-card: #16213E;
    --background-light: #1A1A2E;
    --text: #E8E8E8;
    --text-muted: #A0A0A0;
    --font-heading: 'Cinzel', serif;
    --font-body: 'Poppins', sans-serif;
}
```

---

## Future Enhancements (Not Started)

1. **Backend Integration** - Move from localStorage to database
2. **Real Ephemeris** - Swiss Ephemeris for accurate planetary positions
3. **Divisional Charts** - D-9 (Navamsa), D-10 (Dasamsa)
4. **Transit Analysis** - Real-time Gochara predictions
5. **Muhurat Calculator** - Auspicious time finder
6. **Multi-language** - Hindi, Sanskrit support
7. **Push Notifications** - Daily horoscope alerts
8. **PDF Reports** - Downloadable birth chart reports
9. **Payment Integration** - For consultations
10. **"Pillars" Section** - User mentioned wanting this on homepage

---

## User Request Notes

The user mentioned wanting a "Pillars" section with "Master your Morning" as the first pillar. This was not found in the existing code and may need to be added as a new homepage section.

---

## Testing Checklist

To verify the application works:

1. [ ] Open http://localhost:8080
2. [ ] Create new account with birth details + timezone
3. [ ] Verify dashboard shows personalized horoscope
4. [ ] Edit birth details from dashboard (click pencil icon)
5. [ ] Verify changes save and UI updates
6. [ ] Check profile page edits work
7. [ ] Test Kundli generator with both chart styles
8. [ ] Test compatibility matching
9. [ ] Verify responsive design on mobile

---

## Contact / Support

Project created for Vedic astrology enthusiasts seeking authentic, personalized astrological guidance based on classical Indian texts.

---

*Documentation last updated: December 29, 2025*
