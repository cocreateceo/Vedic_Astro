# Vedic Astro

A comprehensive Vedic astrology web application providing personalized horoscopes, birth chart generation, compatibility matching, and educational content based on authentic Vedic texts.

## Features

### Core Functionality
- **Personalized Horoscopes**: Daily, Weekly, Monthly, and Yearly predictions based on Moon sign (Rashi)
- **Birth Chart (Kundli)**: North and South Indian style charts with planetary positions
- **Compatibility Matching**: Ashtakoot Guna Milan system (36 points)
- **Panchang**: Daily Hindu calendar with Tithi, Nakshatra, Yoga, and Karana
- **User Accounts**: Signup/Login with birth details and chart storage
- **Educational Content**: Zodiac signs, planets, houses, and Vedic concepts

### Authentic Content
Based on classical Vedic texts:
- Brihat Parashara Hora Shastra (BPHS)
- Phaladeepika by Mantreshwara
- Brihat Jataka by Varahamihira

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with variables, Grid, Flexbox
- **Fonts**: Google Fonts (Cinzel, Poppins)
- **Storage**: localStorage (client-side)
- **Deployment**: SST (Serverless Stack) on AWS
- **Infrastructure**: CloudFront + S3

**No dependencies** - Pure vanilla JavaScript!

## Architecture

**Static Website:**
```
User → CloudFront (HTTPS/CDN) → S3 (Static Files)
```

**Monthly Cost:** ~$0.10 (99% cheaper than traditional hosting!)

## Quick Start

### Local Development

```bash
# Clone the repository
cd "/mnt/c/Shri Hari Hari/Projects/Vedic_Astro"

# Start local server
python3 -m http.server 8080

# Open browser
http://localhost:8080
```

### Deploy to AWS

```bash
# Install dependencies
npm install

# Deploy to production
npm run deploy

# Your site will be live at:
# https://xxxxx.cloudfront.net
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
Vedic_Astro/
├── index.html              # Homepage with hero section
├── login.html              # User authentication
├── dashboard.html          # Personalized user dashboard
├── kundli.html             # Birth chart generator
├── horoscopes.html         # Daily/Weekly/Monthly horoscopes
├── zodiac.html             # 12 zodiac signs information
├── compatibility.html      # Ashtakoot compatibility matching
├── panchang.html           # Hindu calendar
├── articles.html           # Educational content
├── consultation.html       # Astrologer booking (UI only)
├── profile.html            # User profile management
├── css/
│   └── style.css           # Complete styling (1,365 lines)
├── js/
│   ├── main.js             # Core site functionality
│   ├── auth.js             # Authentication system
│   ├── dashboard.js        # Dashboard logic
│   ├── kundli.js           # Birth chart generation
│   ├── compatibility.js    # Compatibility matching
│   ├── horoscopes.js       # Horoscope UI logic
│   └── horoscope-data.js   # Vedic horoscope database
├── images/
│   └── logo.svg            # Site branding
├── sst.config.ts          # AWS infrastructure config
├── package.json           # Dependencies (SST only)
├── DEPLOYMENT.md          # Deployment guide
├── PROJECT_STATUS.md      # Project documentation
└── LEARNING_DOC.md        # Technical learnings
```

## Key Pages

| Page | Purpose |
|------|---------|
| **index.html** | Landing page with overview |
| **login.html** | User signup/login |
| **dashboard.html** | Personalized daily predictions |
| **kundli.html** | Birth chart (North/South Indian) |
| **horoscopes.html** | Tabbed horoscopes by period |
| **zodiac.html** | Information about 12 Rashis |
| **compatibility.html** | Marriage matching calculator |
| **panchang.html** | Today's Hindu calendar |
| **articles.html** | Educational content |
| **consultation.html** | Astrologer booking (UI only) |
| **profile.html** | Edit birth details |

## Features Implemented

- ✅ User signup/login with birth details
- ✅ Vedic chart calculation (Moon sign, Sun sign, Ascendant, Nakshatra)
- ✅ Two chart styles (North & South Indian)
- ✅ Daily horoscope generation
- ✅ Horoscope history (last 7 days)
- ✅ Compatibility matching (36 Gunas)
- ✅ Panchang calculator
- ✅ Inline profile editing
- ✅ Responsive design
- ✅ Smooth animations
- ✅ AWS deployment via SST

## Development Commands

```bash
# Local development
npm run dev              # Start Python HTTP server

# AWS deployment
npm install              # Install SST
npm run deploy           # Deploy to production
npm run deploy:dev       # Deploy to development
npm run remove           # Remove production deployment
```

## Deployment

### Prerequisites
- Node.js 20+
- AWS Account configured
- AWS CLI installed

### Deploy

```bash
npm install
npm run deploy
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## Security Note

**Current implementation** uses localStorage for demo purposes:
- Passwords stored in plaintext (not secure)
- Client-side validation only
- No backend server

**For production use:**
- Add backend server
- Hash passwords (bcrypt)
- Server-side validation
- Real database (not localStorage)

## Future Enhancements

1. Backend integration (move from localStorage to database)
2. Real Swiss Ephemeris for accurate calculations
3. Divisional charts (D-9 Navamsa, D-10 Dasamsa)
4. Dasha timeline visualization
5. Transit reports
6. Multi-language support
7. Push notifications for daily horoscopes
8. PDF report generation
9. Payment integration for consultations
10. Mobile apps (React Native/Flutter)

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - AWS deployment guide
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Project status and features
- **[LEARNING_DOC.md](LEARNING_DOC.md)** - Technical learnings and insights

## License

Proprietary - Vedic Astro

## Support

For issues or questions, refer to the documentation files or PROJECT_STATUS.md.

---

**Version:** 1.0.0
**Status:** Production Ready
**Architecture:** Static Site (SST + AWS)
**Last Updated:** January 3, 2026
