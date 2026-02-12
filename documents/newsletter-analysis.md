# Newsletter & Email System — Analysis & Implementation Plan

## 1. Source Document Analysis

### A. Clickastro Invoice Email (`CI85388742EBrd`)

**Sender:** `support@clickastro.com` via Netcore Cloud (pepipost) delivery infra
**To:** `pattangi@gmail.com`
**Subject pattern:** `{Full Name}, Invoice for Clickastro Report [{OrderID}]`

**Email Infrastructure:**
- Delivery: Netcore Cloud (formerly Pepipost) — `mta-253.144.ncdelivery08.com`
- Authentication: DKIM (custom domain `clickastro.com` + `env.etransmail.com`), SPF, DMARC
- Return-path: `{msgid}@delivery.clickastro.com`
- Unsubscribe: `List-Unsubscribe` header (one-click + mailto)
- Tracking: Open pixel via `delivery.clickastro.com/DRTYBSE` + click tracking on all links
- Images hosted on AWS S3: `ca-img.s3.ap-south-1.amazonaws.com`

**HTML Email Template Structure (600px max-width):**
```
1. Brand banner image (full-width)
2. Personal greeting: "Dear {Full Name},"
3. Payment confirmation + amount (INR 1178.00)
4. Order Details card:
   - Product name, Order ID, Date, Total, Transaction ID
   - Company CIN and GSTN numbers
5. PDF Download section:
   - Mobile-optimized PDF link
   - Printable PDF link
   - Green CTA button: "Download Mobile Version"
   - Text link: "Download Printable Version"
6. "What's Available?" section explaining the two formats
7. Important notice: "Links active for 30 days only"
8. Thank you message from "Team Clickastro"
9. Review CTA image + General consultation promo banner
10. Support section: Phone (+91 6366920680), two email addresses
11. Mobile app download: Google Play + App Store badges
12. Footer: Privacy Policy | Terms of Use | Copyright
```

**Key Design Patterns:**
- Inline CSS only (no `<style>` tag) — maximum email client compatibility
- `font-family: Arial, Helvetica, sans-serif`
- Background: `#f9f9f9` container on `#ffffff` page
- Accent color: `#1e879d` (teal headings), `#3f9b08` (green CTAs)
- Section headers: `#eaeaea` background bars with emoji prefixes
- Text: `#484848` body, `12px` font, `20px` line-height
- All links tracked through redirect domain

### B. Clickastro In-Depth Horoscope Report (`87205877_MukundanPa_pnr.pdf`)

- **205 pages**, 5.3 MB (printable version)
- Title: "Clickastro In-Depth Report"
- Generated via GPL Ghostscript 10.02.1 (server-side PDF generation)
- Comprehensive Vedic horoscope covering birth chart, dashas, transits, predictions

### C. Second Report (`Mukundan_September1969.pdf`)

- **42 pages**, 325 KB (compact/mobile version)
- Lighter format — likely the mobile-optimized version
- Birth data: September 1969

---

## 2. Key Takeaways for Our Newsletter System

| Clickastro Pattern | Our Adaptation |
|---|---|
| Netcore Cloud delivery | AWS SES (already in our AWS account) |
| DKIM + SPF + DMARC | Configure for our domain |
| Personalized subject line | `{Name}, Your Monthly Vedic Insights for {Month}` |
| PDF report attachment/link | Generate personalized PDF per user (we already have `downloadBirthChartPdf`) |
| Inline CSS HTML email | Same approach — inline styles, 600px template |
| Open tracking pixel | SES provides open/click tracking natively |
| List-Unsubscribe header | SES supports this; also add in-email unsubscribe link |
| 30-day link expiry | S3 pre-signed URLs with 30-day TTL |
| Mobile + Printable versions | Single responsive PDF (our existing PDF generator) |

---

## 3. Monthly Newsletter Content Structure

### Per-User Personalized Content:

```
1. Header: Vedic_Astro branded banner (sign-theme-aware)
2. Greeting: "Namaste {Name},"
3. Monthly Overview:
   - Current Dasha period + what it means
   - Key planetary transits this month
4. Monthly Horoscope:
   - General prediction
   - Career focus
   - Love & relationships
   - Health advice
5. Auspicious Dates:
   - Top 3-5 muhurat windows for the month
   - Festivals / special tithis
6. Lucky Section:
   - Lucky numbers, colors, days for the month
   - Recommended gemstone reminder
7. Remedies:
   - Monthly mantra
   - Suggested rituals
8. CTA: "View Full Dashboard" button → /dashboard
9. CTA: "Download Your Birth Chart PDF" → pre-signed S3 URL
10. Footer: Unsubscribe | Privacy | Vedic_Astro copyright
```

### Data Sources (all already in our codebase):

| Content | Source Module |
|---|---|
| User birth data, moon sign, ascendant | `useAuth()` → `user.vedicChart` |
| Monthly horoscope text | `lib/horoscope-data.ts` → `monthlyFocus[]` |
| Dasha calculation | `lib/kundli-calc.ts` → `calculateDasha()` |
| Planetary positions | `lib/kundli-calc.ts` → `calculatePlanetaryPositions()` |
| Muhurat/timings | `lib/horoscope-data.ts` → `calculateDailyTimings()` |
| Lucky numbers/colors | `lib/horoscope-data.ts` → `rashiDetails[]` |
| Remedies/mantras | `lib/horoscope-data.ts` → `dailyPredictions[].remedies` |
| PDF generation | `lib/pdf-download.ts` → `downloadBirthChartPdf()` |

---

## 4. Technical Architecture

### Email Sending Pipeline:

```
┌──────────────────────────────────────────────┐
│              Monthly Cron Trigger             │
│  (AWS EventBridge rule: 1st of each month)   │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         Lambda: newsletter-generator         │
│  1. Query DynamoDB for all opted-in users    │
│  2. For each user:                           │
│     a. Calculate current chart/horoscope     │
│     b. Render HTML email from template       │
│     c. Generate PDF, upload to S3 (presigned)│
│     d. Queue SES send via SQS               │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│    SQS Queue (rate-limit to SES limits)      │
│    → Lambda: newsletter-sender               │
│    → AWS SES sendEmail()                     │
└──────────────────────────────────────────────┘
```

### AWS Services Required:

| Service | Purpose | Cost Estimate |
|---|---|---|
| **SES** | Email delivery | $0.10/1000 emails |
| **S3** | PDF storage + pre-signed URLs | Minimal (existing bucket) |
| **EventBridge** | Monthly cron trigger | Free tier |
| **Lambda** | Generate + send | Free tier (< 1M invocations) |
| **DynamoDB** | User data + newsletter prefs | Minimal (existing or new table) |
| **SQS** | Rate-limiting queue | Free tier |

### Current Limitation:
Our app uses **localStorage** for user data (no server-side database). To send emails, we need:
1. A backend user store (DynamoDB table)
2. User email collection during signup
3. Newsletter opt-in preference

---

## 5. Email Template Design

Matching our site's Vedic_Astro brand but using email-safe inline CSS:

- **Width:** 600px centered
- **Background:** Dark cosmic (`#110a04`) — matches our default theme
- **Primary accent:** Sign-primary gold (`#F28C1A`)
- **Font:** Arial fallback (email-safe; web fonts don't work in email)
- **Header:** Vedic_Astro logo + Om symbol
- **Sections:** Dark card backgrounds with gold borders (inline glass-card equivalent)
- **CTAs:** Gold gradient buttons (inline `background: linear-gradient(...)`)
- **Footer:** Unsubscribe + copyright + disclaimer

---

## 6. User Signature / Closing

Every newsletter ends with:

```
Best of luck.

Srimathey Ramanujaya Namaha
--
Aho Viryam Aho Shouryam Aho Baahu Paraakramaha
Naarasimham Param Devam Ahobilam Ahobalam

— Team Vedic_Astro
```

---

## 7. Implementation Phases

### Phase A: Database & User Store
- Create DynamoDB `vedic-users` table
- Migrate signup/login from localStorage to DynamoDB
- Add `emailOptIn`, `newsletterFrequency` fields

### Phase B: Email Template
- Create HTML email template with inline CSS
- Personalization tokens: `{{name}}`, `{{moonSign}}`, `{{monthlyHoroscope}}`, etc.
- Test across Gmail, Outlook, Apple Mail

### Phase C: PDF Generation (Server-side)
- Adapt existing `pdf-download.ts` to run in Lambda (headless)
- Upload generated PDF to S3 with 30-day presigned URL

### Phase D: Lambda + EventBridge
- Create `newsletter-generator` Lambda
- Create EventBridge rule: `cron(0 6 1 * ? *)` (1st of month, 6 AM UTC)
- SES domain verification + DKIM setup

### Phase E: Opt-in & Preferences
- Add newsletter toggle in dashboard
- Add unsubscribe endpoint (Lambda + API Gateway)
- Honor unsubscribe within 24 hours (CAN-SPAM compliance)
