/**
 * HTML email renderers for daily, weekly, and monthly newsletters.
 * All inline CSS, 600px max-width, dark theme matching the site.
 */

import type { DailyEmailData, WeeklyEmailData, MonthlyEmailData } from './types';

// ── Design Tokens ──────────────────────────────────────────────────────

const BG = '#110a04';
const CARD = '#1a1108';
const GOLD = '#F28C1A';
const TEXT = '#e8d5b8';
const MUTED = '#a09080';
const FONT = "Georgia, 'Times New Roman', serif";
const GREEN = '#4ade80';
const RED = '#f87171';

// ── Helpers ──────────────────────────────────────────────────────────

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Shared Components ──────────────────────────────────────────────────

function wrapEmail(body: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vedic_Astro Newsletter</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT};color:${TEXT};">
<div style="max-width:600px;margin:0 auto;padding:20px;">

<!-- Header -->
<div style="text-align:center;padding:24px 0;border-bottom:1px solid ${GOLD}33;">
  <span style="color:${GOLD};font-size:28px;">&#10022;</span>
  <div style="font-size:24px;font-weight:600;color:${GOLD};margin-top:4px;letter-spacing:1px;">Vedic_Astro</div>
</div>

${body}

<!-- Signature -->
<div style="text-align:center;padding:24px 0;border-top:1px solid ${GOLD}22;margin-top:32px;">
  <p style="color:${TEXT};font-size:14px;margin:0 0 8px;">Best of luck.</p>
  <p style="color:${GOLD};font-size:13px;font-style:italic;margin:0 0 4px;">Srimathey Ramanujaya Namaha</p>
  <p style="color:${MUTED};font-size:11px;font-style:italic;margin:0 0 12px;">Aho Viryam Aho Shouryam Aho Baahu Paraakramam<br>Narasimham Param Daivam Ahobilam Ahobalam</p>
  <p style="color:${MUTED};font-size:12px;margin:0;">&mdash; Team Vedic_Astro</p>
</div>

<!-- Footer -->
<div style="text-align:center;padding:16px 0;">
  <a href="${unsubscribeUrl}" style="color:${MUTED};font-size:11px;text-decoration:underline;">Unsubscribe</a>
  <p style="color:${MUTED};font-size:10px;margin:8px 0 0;">Disclaimer: Astrology is for guidance purposes. Major life decisions should be made with professional advice.</p>
</div>

</div>
</body>
</html>`;
}

function ratingBar(label: string, value: number): string {
  const barColor = value >= 70 ? GREEN : value >= 50 ? GOLD : RED;
  return `<div style="margin-bottom:8px;">
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
      <span style="color:${MUTED};text-transform:capitalize;">${label}</span>
      <span style="color:${barColor};font-weight:600;">${value}%</span>
    </div>
    <div style="background:${BG};border-radius:4px;height:6px;overflow:hidden;">
      <div style="width:${value}%;height:100%;background:${barColor};border-radius:4px;"></div>
    </div>
  </div>`;
}

function card(content: string, extra = ''): string {
  return `<div style="background:${CARD};border-radius:8px;padding:20px;margin-top:16px;border:1px solid ${GOLD}15;${extra}">${content}</div>`;
}

function ctaButton(text: string, url: string): string {
  return `<div style="text-align:center;margin-top:24px;">
    <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,${GOLD},#c4700f);color:${BG};padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">${text}</a>
  </div>`;
}

// ── Daily Email ────────────────────────────────────────────────────────

export function renderDailyEmail(data: DailyEmailData): { subject: string; html: string } {
  const dateStr = data.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const subject = `${data.name}, Your Vedic Horoscope for ${data.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;

  const panchangHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Panchang &mdash; ${dateStr}</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;color:${MUTED};font-size:12px;width:30%;">Tithi</td>
        <td style="padding:6px 0;color:${TEXT};font-size:13px;">${data.panchang.tithi}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:${MUTED};font-size:12px;">Nakshatra</td>
        <td style="padding:6px 0;color:${TEXT};font-size:13px;">${data.panchang.nakshatra}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:${MUTED};font-size:12px;">Yoga</td>
        <td style="padding:6px 0;color:${TEXT};font-size:13px;">${data.panchang.yoga}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:${MUTED};font-size:12px;">Karana</td>
        <td style="padding:6px 0;color:${TEXT};font-size:13px;">${data.panchang.karana}</td>
      </tr>
    </table>
  `);

  const rahuHtml = card(`
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:20px;">&#9888;</span>
      <div>
        <span style="color:${RED};font-size:13px;font-weight:600;">Rahu Kaal: ${data.rahuKaal.start} &ndash; ${data.rahuKaal.end}</span>
        <p style="color:${MUTED};font-size:11px;margin:2px 0 0;">Avoid starting new work, travel, or interviews during this time.</p>
      </div>
    </div>
  `);

  const predictionsHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 16px;">Your Predictions</h3>
    <div style="margin-bottom:12px;">
      <h4 style="color:${TEXT};font-size:13px;margin:0 0 4px;">General</h4>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.5;">${data.predictions.general}</p>
    </div>
    <div style="margin-bottom:12px;">
      <h4 style="color:${TEXT};font-size:13px;margin:0 0 4px;">Career</h4>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.5;">${data.predictions.career}</p>
    </div>
    <div style="margin-bottom:12px;">
      <h4 style="color:${TEXT};font-size:13px;margin:0 0 4px;">Love</h4>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.5;">${data.predictions.love}</p>
    </div>
    <div>
      <h4 style="color:${TEXT};font-size:13px;margin:0 0 4px;">Health</h4>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.5;">${data.predictions.health}</p>
    </div>
  `);

  const ratingsHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Today's Ratings</h3>
    ${ratingBar('overall', data.ratings.overall)}
    ${ratingBar('career', data.ratings.career)}
    ${ratingBar('love', data.ratings.love)}
    ${ratingBar('health', data.ratings.health)}
    ${ratingBar('finance', data.ratings.finance)}
  `);

  const luckyHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Lucky Today</h3>
    <table style="width:100%;">
      <tr>
        <td style="color:${MUTED};font-size:12px;padding:4px 0;">Number</td>
        <td style="color:${GOLD};font-size:13px;font-weight:600;text-align:right;">${data.lucky.number}</td>
      </tr>
      <tr>
        <td style="color:${MUTED};font-size:12px;padding:4px 0;">Color</td>
        <td style="color:${GOLD};font-size:13px;font-weight:600;text-align:right;">${data.lucky.color}</td>
      </tr>
      <tr>
        <td style="color:${MUTED};font-size:12px;padding:4px 0;">Direction</td>
        <td style="color:${GOLD};font-size:13px;font-weight:600;text-align:right;">${data.lucky.direction}</td>
      </tr>
    </table>
  `);

  const remedyHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 8px;">Remedy &amp; Mantra</h3>
    <p style="color:${TEXT};font-size:13px;margin:0 0 8px;line-height:1.5;">${data.remedy}</p>
    <div style="background:${BG};padding:12px;border-radius:6px;border-left:3px solid ${GOLD};">
      <p style="color:${GOLD};font-size:13px;margin:0;font-style:italic;">${data.mantra}</p>
    </div>
  `);

  const timingsHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Shubh Muhurat</h3>
    <div style="background:${GREEN}10;border:1px solid ${GREEN}30;border-radius:6px;padding:10px;margin-bottom:8px;">
      <span style="color:${GREEN};font-size:12px;font-weight:600;">&#9733; Abhijit Muhurat: ${data.timings.abhijit.start} &ndash; ${data.timings.abhijit.end}</span>
      <p style="color:${MUTED};font-size:11px;margin:2px 0 0;">Most auspicious — ideal for any important activity</p>
    </div>
    ${data.timings.bestHours.map(bh => `
      <div style="padding:6px 0;border-bottom:1px solid ${GOLD}10;">
        <span style="color:${TEXT};font-size:12px;">${bh.activity}</span>
        <span style="color:${GREEN};font-size:12px;float:right;">${bh.start} &ndash; ${bh.end}</span>
      </div>
    `).join('')}
  `);

  const body = `
    ${panchangHtml}
    ${rahuHtml}
    ${predictionsHtml}
    ${ratingsHtml}
    ${luckyHtml}
    ${remedyHtml}
    ${timingsHtml}
    ${ctaButton('View Full Dashboard', data.dashboardUrl)}
  `;

  return { subject, html: wrapEmail(body, data.unsubscribeUrl) };
}

// ── Weekly Email ───────────────────────────────────────────────────────

export function renderWeeklyEmail(data: WeeklyEmailData): { subject: string; html: string } {
  const subject = `${data.name}, Your Week Ahead — ${data.dateRange}`;

  const themeHtml = card(`
    <div style="text-align:center;padding:12px 0;">
      <p style="color:${MUTED};font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">This Week's Theme</p>
      <h2 style="color:${GOLD};font-size:22px;margin:0;text-transform:capitalize;">${data.weekTheme}</h2>
    </div>
  `);

  const focusHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Focus Areas</h3>
    <ul style="margin:0;padding:0;list-style:none;">
      ${data.focusAreas.map(f => `
        <li style="padding:6px 0;border-bottom:1px solid ${GOLD}10;color:${TEXT};font-size:13px;">
          <span style="color:${GOLD};margin-right:8px;">&#10022;</span>${f.charAt(0).toUpperCase() + f.slice(1)}
        </li>
      `).join('')}
    </ul>
  `);

  const bestDaysHtml = data.bestDays.length > 0 ? card(`
    <h3 style="color:${GREEN};font-size:14px;margin:0 0 12px;">Best Days</h3>
    ${data.bestDays.map(d => `<p style="color:${TEXT};font-size:13px;margin:0 0 4px;">&#9733; ${d}</p>`).join('')}
  `) : '';

  const challengesHtml = data.challenges.length > 0 ? card(`
    <h3 style="color:${RED};font-size:14px;margin:0 0 12px;">Challenges to Watch</h3>
    ${data.challenges.map(c => `<p style="color:${TEXT};font-size:13px;margin:0 0 4px;">&#9888; ${c}</p>`).join('')}
  `) : '';

  const mantraHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 8px;">Weekly Mantra</h3>
    <div style="background:${BG};padding:12px;border-radius:6px;border-left:3px solid ${GOLD};">
      <p style="color:${GOLD};font-size:13px;margin:0;font-style:italic;">${data.mantra}</p>
    </div>
  `);

  const body = `
    ${themeHtml}
    ${focusHtml}
    ${bestDaysHtml}
    ${challengesHtml}
    ${mantraHtml}
    ${ctaButton('View Full Horoscope', data.dashboardUrl)}
  `;

  return { subject, html: wrapEmail(body, data.unsubscribeUrl) };
}

// ── Monthly Email ──────────────────────────────────────────────────────

export function renderMonthlyEmail(data: MonthlyEmailData): { subject: string; html: string } {
  const subject = `${data.name}, Your ${data.month} Vedic Forecast`;

  const focusHtml = card(`
    <div style="text-align:center;padding:12px 0;">
      <p style="color:${MUTED};font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Monthly Focus</p>
      <h2 style="color:${GOLD};font-size:22px;margin:0;text-transform:capitalize;">${data.monthlyFocus}</h2>
    </div>
  `);

  const themesHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Key Themes for ${data.month}</h3>
    <ul style="margin:0;padding:0;list-style:none;">
      ${data.themes.map(t => `
        <li style="padding:6px 0;border-bottom:1px solid ${GOLD}10;color:${TEXT};font-size:13px;">
          <span style="color:${GOLD};margin-right:8px;">&#10022;</span>${t.charAt(0).toUpperCase() + t.slice(1)}
        </li>
      `).join('')}
    </ul>
  `);

  const datesHtml = data.auspiciousDates.length > 0 ? card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Auspicious Dates</h3>
    <table style="width:100%;border-collapse:collapse;">
      ${data.auspiciousDates.map(d => `
        <tr>
          <td style="padding:6px 0;color:${GOLD};font-size:13px;font-weight:600;width:30%;">${d.date}</td>
          <td style="padding:6px 0;color:${TEXT};font-size:13px;">${d.significance}</td>
        </tr>
      `).join('')}
    </table>
  `) : '';

  const dashaColor = data.currentDasha.isBenefic ? GREEN : RED;
  const dashaHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Current Dasha Period</h3>
    <div style="display:flex;align-items:center;gap:12px;">
      <div>
        <p style="color:${TEXT};font-size:15px;font-weight:600;margin:0;">${data.currentDasha.planet} Mahadasha</p>
        <p style="color:${MUTED};font-size:12px;margin:2px 0 0;">${data.currentDasha.startYear} &ndash; ${data.currentDasha.endYear}</p>
        <p style="color:${dashaColor};font-size:12px;margin:4px 0 0;">${data.currentDasha.isBenefic ? 'Benefic period — favorable for growth' : 'Challenging period — remedies advised'}</p>
      </div>
    </div>
  `);

  const gemHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">Gemstone &amp; Remedy</h3>
    <p style="color:${TEXT};font-size:13px;margin:0 0 8px;">Recommended Gemstone: <span style="color:${GOLD};font-weight:600;">${data.gemstone}</span></p>
    <div style="background:${BG};padding:12px;border-radius:6px;border-left:3px solid ${GOLD};">
      <p style="color:${GOLD};font-size:13px;margin:0;font-style:italic;">${data.remedy}</p>
    </div>
  `);

  const body = `
    ${focusHtml}
    ${themesHtml}
    ${datesHtml}
    ${dashaHtml}
    ${gemHtml}
    ${ctaButton('Download Birth Chart PDF', data.dashboardUrl)}
  `;

  return { subject, html: wrapEmail(body, data.unsubscribeUrl) };
}

// ── Booking Confirmation Email ────────────────────────────────────────

export interface BookingEmailData {
  name: string;
  email: string;
  astrologer: string;
  topic: string;
  tier: string;
  question: string;
}

const TIER_LABELS: Record<string, string> = {
  free: 'Ask a Question (Free)',
  standard: 'Live Consultation ($29)',
  premium: 'Detailed Analysis ($49)',
};

export function renderBookingConfirmationEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `${data.name}, your consultation request has been received`;
  const tierLabel = TIER_LABELS[data.tier] || data.tier;

  const summaryHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">Booking Summary</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;color:${MUTED};font-size:12px;width:35%;">Tier</td>
        <td style="padding:8px 0;color:${TEXT};font-size:13px;">${esc(tierLabel)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:${MUTED};font-size:12px;">Astrologer</td>
        <td style="padding:8px 0;color:${TEXT};font-size:13px;">${esc(data.astrologer)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:${MUTED};font-size:12px;">Topic</td>
        <td style="padding:8px 0;color:${TEXT};font-size:13px;">${esc(data.topic)}</td>
      </tr>
    </table>
  `);

  const questionHtml = data.question ? card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 8px;">Your Question</h3>
    <div style="background:${BG};padding:12px;border-radius:6px;border-left:3px solid ${GOLD};">
      <p style="color:${TEXT};font-size:13px;margin:0;line-height:1.6;">${esc(data.question)}</p>
    </div>
  `) : '';

  const nextStepsHtml = card(`
    <h3 style="color:${GOLD};font-size:14px;margin:0 0 12px;">What Happens Next</h3>
    ${data.tier === 'free' ? `
      <ul style="margin:0;padding:0;list-style:none;">
        <li style="padding:6px 0;color:${TEXT};font-size:13px;border-bottom:1px solid ${GOLD}10;">
          <span style="color:${GOLD};margin-right:8px;">1.</span>Our astrologer will review your question
        </li>
        <li style="padding:6px 0;color:${TEXT};font-size:13px;border-bottom:1px solid ${GOLD}10;">
          <span style="color:${GOLD};margin-right:8px;">2.</span>A detailed response will be emailed to you
        </li>
        <li style="padding:6px 0;color:${TEXT};font-size:13px;">
          <span style="color:${GOLD};margin-right:8px;">3.</span>Expect a reply within 48 hours
        </li>
      </ul>
    ` : `
      <p style="color:${TEXT};font-size:13px;margin:0;line-height:1.6;">
        We will reach out shortly with payment and scheduling details for your ${esc(tierLabel)} session.
      </p>
    `}
  `);

  const body = `
    <div style="text-align:center;padding:24px 0;">
      <span style="font-size:32px;">&#10003;</span>
      <h2 style="color:${GOLD};font-size:20px;margin:8px 0 4px;">Request Received</h2>
      <p style="color:${MUTED};font-size:13px;margin:0;">Thank you, ${esc(data.name)}!</p>
    </div>
    ${summaryHtml}
    ${questionHtml}
    ${nextStepsHtml}
  `;

  // Transactional email — no unsubscribe link needed
  const html = wrapEmail(body, '');

  return { subject, html };
}
