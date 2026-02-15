/**
 * HTML email templates for auth-related transactional emails.
 * Reuses design tokens from email-templates.ts.
 */

const BG = '#110a04';
const CARD = '#1a1108';
const GOLD = '#F28C1A';
const TEXT = '#e8d5b8';
const MUTED = '#a09080';
const FONT = "Georgia, 'Times New Roman', serif";

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapTransactionalEmail(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vedic Astro</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT};color:${TEXT};">
<div style="max-width:600px;margin:0 auto;padding:20px;">

<!-- Header -->
<div style="text-align:center;padding:24px 0;border-bottom:1px solid ${GOLD}33;">
  <span style="color:${GOLD};font-size:28px;">&#10022;</span>
  <div style="font-size:24px;font-weight:600;color:${GOLD};margin-top:4px;letter-spacing:1px;">Vedic Astro</div>
</div>

${body}

<!-- Signature -->
<div style="text-align:center;padding:24px 0;border-top:1px solid ${GOLD}22;margin-top:32px;">
  <p style="color:${MUTED};font-size:12px;margin:0;">&mdash; Team Vedic Astro</p>
</div>

</div>
</body>
</html>`;
}

function codeBox(code: string): string {
  return `<div style="background:${BG};border:2px solid ${GOLD};border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
  <p style="color:${MUTED};font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your Verification Code</p>
  <div style="font-size:36px;letter-spacing:12px;color:${GOLD};font-weight:700;font-family:monospace;">${esc(code)}</div>
  <p style="color:${MUTED};font-size:11px;margin:8px 0 0;">This code expires in 15 minutes</p>
</div>`;
}

export function renderVerificationEmail(name: string, code: string): { subject: string; html: string } {
  const subject = `${name}, verify your Vedic Astro account`;

  const body = `
<div style="background:${CARD};border-radius:8px;padding:24px;margin-top:20px;border:1px solid ${GOLD}15;">
  <h2 style="color:${GOLD};font-size:20px;margin:0 0 12px;text-align:center;">Verify Your Email</h2>
  <p style="color:${TEXT};font-size:14px;line-height:1.6;margin:0 0 16px;">
    Hello ${esc(name)}, welcome to Vedic Astro! Please enter the code below to verify your email address and activate your account.
  </p>
  ${codeBox(code)}
  <p style="color:${MUTED};font-size:12px;line-height:1.5;margin:16px 0 0;">
    If you didn't create an account, you can safely ignore this email.
  </p>
</div>`;

  return { subject, html: wrapTransactionalEmail(body) };
}

export function renderResetPasswordEmail(name: string, code: string): { subject: string; html: string } {
  const subject = `${name}, reset your Vedic Astro password`;

  const body = `
<div style="background:${CARD};border-radius:8px;padding:24px;margin-top:20px;border:1px solid ${GOLD}15;">
  <h2 style="color:${GOLD};font-size:20px;margin:0 0 12px;text-align:center;">Reset Your Password</h2>
  <p style="color:${TEXT};font-size:14px;line-height:1.6;margin:0 0 16px;">
    Hello ${esc(name)}, we received a request to reset your password. Use the code below to set a new password.
  </p>
  ${codeBox(code)}
  <p style="color:${MUTED};font-size:12px;line-height:1.5;margin:16px 0 0;">
    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
  </p>
</div>`;

  return { subject, html: wrapTransactionalEmail(body) };
}
