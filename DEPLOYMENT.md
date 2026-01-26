# Vedic Astro - AWS Deployment Guide

## Overview

Vedic Astro is a **static website** deployed to AWS using **SST (Serverless Stack)** for infrastructure management.

**Architecture:**
```
User → CloudFront (HTTPS/CDN) → S3 (Static Files)
```

---

## Prerequisites

- ✅ Node.js 20+ installed
- ✅ AWS Account with admin access
- ✅ AWS CLI installed and configured
- ✅ Git installed

---

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
cd "/mnt/c/Shri Hari Hari/Projects/Vedic_Astro"
npm install
```

### 2. Deploy to Production

```bash
npm run deploy
```

That's it! SST will:
- Create S3 bucket for your files
- Upload all HTML/CSS/JS/images
- Create CloudFront distribution (CDN + HTTPS)
- Output your website URL

---

## Detailed Deployment Steps

### Step 1: AWS CLI Configuration

Verify AWS CLI is configured:

```bash
aws sts get-caller-identity
```

If not configured:

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region: us-east-1
# Enter default output format: json
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs SST (Serverless Stack) which manages your AWS infrastructure.

### Step 3: Deploy to Production

```bash
npm run deploy
# or
npx sst deploy --stage production
```

**First deployment takes ~3-5 minutes**. SST will:
1. Create CloudFormation stack
2. Create S3 bucket
3. Upload your files (HTML, CSS, JS, images)
4. Create CloudFront distribution
5. Output your CloudFront URL

**Example Output:**
```
✔ Complete
   VedicAstroSite: https://d1a2b3c4d5e6f7.cloudfront.net
```

### Step 4: Test Your Deployment

Open the CloudFront URL in your browser. You should see your Vedic Astro website!

Test key pages:
- Homepage: `https://your-cloudfront-url.cloudfront.net/`
- Login: `https://your-cloudfront-url.cloudfront.net/login.html`
- Dashboard: `https://your-cloudfront-url.cloudfront.net/dashboard.html`
- Kundli: `https://your-cloudfront-url.cloudfront.net/kundli.html`

---

## Development vs Production

### Deploy to Development

```bash
npm run deploy:dev
```

This creates a separate development environment with its own URL.

### Deploy to Production

```bash
npm run deploy
```

---

## Updating Your Website

After making changes to your code:

```bash
npm run deploy
```

**Updates take ~30 seconds**. SST will:
1. Detect changed files
2. Upload only modified files
3. Invalidate CloudFront cache
4. Your changes are live!

---

## Custom Domain (Optional)

To use your own domain (e.g., `www.vedicastro.com`):

### 1. Update `sst.config.ts`

```typescript
const site = new sst.aws.StaticSite("VedicAstroSite", {
  path: ".",
  build: {
    command: "echo 'No build needed for static site'",
    output: ".",
  },
  indexPage: "index.html",
  errorPage: "index.html",
  domain: "www.vedicastro.com", // Add this line
});
```

### 2. Have Domain in Route 53

Your domain must be hosted in AWS Route 53, or you need to create a hosted zone.

### 3. Deploy

```bash
npm run deploy
```

SST will automatically:
- Create SSL certificate (via ACM)
- Configure CloudFront with your domain
- Set up DNS records in Route 53

---

## Remove Deployment

To completely remove all AWS resources:

```bash
npm run remove
# or
npx sst remove --stage production
```

This deletes:
- S3 bucket
- CloudFront distribution
- All associated resources

**Warning:** This is irreversible!

---

## Project Structure

```
Vedic_Astro/
├── index.html              # Homepage
├── login.html              # User login
├── dashboard.html          # User dashboard
├── kundli.html             # Birth chart generator
├── horoscopes.html         # Daily horoscopes
├── zodiac.html             # Zodiac signs info
├── compatibility.html      # Compatibility matching
├── panchang.html           # Hindu calendar
├── articles.html           # Educational content
├── consultation.html       # Astrologer booking (UI only)
├── profile.html            # User profile
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Core functionality
│   ├── auth.js             # Authentication
│   ├── dashboard.js        # Dashboard logic
│   ├── kundli.js           # Birth chart generation
│   ├── compatibility.js    # Compatibility calculator
│   ├── horoscopes.js       # Horoscope UI
│   └── horoscope-data.js   # Vedic data
├── images/
│   └── logo.svg            # Site logo
├── sst.config.ts          # Infrastructure as Code
├── package.json           # Dependencies
└── .gitignore             # Git exclusions
```

---

## Infrastructure Details

### What SST Creates

| Resource | Purpose | Cost |
|----------|---------|------|
| **S3 Bucket** | Stores your static files | ~$0.02/month |
| **CloudFront Distribution** | CDN + HTTPS + caching | ~$0.08/month |
| **Lambda@Edge** (optional) | URL rewrites | Free tier |
| **Route 53** (if custom domain) | DNS | $0.50/month |

**Total: ~$0.15/month** (without custom domain)

### SST vs Manual Setup

**With SST:**
- ✅ One command: `npm run deploy`
- ✅ Infrastructure-as-code (`sst.config.ts`)
- ✅ Automatic HTTPS
- ✅ Easy updates
- ✅ Same workflow as Vedic_Transform

**Manual Setup (S3 CLI):**
- ❌ Multiple AWS CLI commands
- ❌ No infrastructure file
- ❌ Manual CloudFront configuration
- ❌ Manual cache invalidation

---

## Cost Analysis

### Monthly Costs (Estimated)

**Assumptions:**
- 1,000 visitors/month
- 100 MB total site size
- 10 GB data transfer

| Service | Cost |
|---------|------|
| S3 Storage (100 MB) | $0.002 |
| S3 Requests (10k) | $0.005 |
| CloudFront (10 GB) | $0.085 |
| **Total** | **~$0.10/month** |

**With custom domain (+Route 53):** ~$0.60/month

### Comparison

| Method | Monthly Cost |
|--------|--------------|
| EC2 (like old Vedic_Transform) | $17.30 |
| SST Serverless (Vedic_Transform) | $2.00 |
| **SST Static (Vedic_Astro)** | **$0.10** |

**Savings:** 99% cheaper than EC2! 💰

---

## Common Commands

```bash
# Development
npm run dev              # Local dev server (Python)

# Deployment
npm install              # Install SST
npm run deploy           # Deploy to production
npm run deploy:dev       # Deploy to development

# Maintenance
npm run remove           # Remove production deployment
npm run remove:dev       # Remove dev deployment
```

---

## Troubleshooting

### Issue: "AWS credentials not found"

**Solution:**
```bash
aws configure
# Enter your AWS credentials
```

### Issue: "Command not found: sst"

**Solution:**
```bash
npm install
```

### Issue: "Region not specified"

**Solution:** Check `sst.config.ts` has:
```typescript
providers: {
  aws: {
    region: "us-east-1",
  },
},
```

### Issue: CloudFront URL shows 404

**Wait 3-5 minutes** after first deployment. CloudFront distribution is still being created.

### Issue: Changes not showing

**CloudFront caching.** Either:
1. Wait 5-10 minutes for cache to expire
2. Force redeploy: `npm run deploy` (SST invalidates cache)
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Issue: Files not uploading

Check `.gitignore` - ensure your files aren't ignored:
```bash
git status
# Should show your HTML/CSS/JS files
```

---

## GitHub Deployment (Optional)

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/vedic-astro.git
git push -u origin main
```

### 2. Set Up GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for auto-deployment on push:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npx sst deploy --stage production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## Security Considerations

### Current Issues (from analysis)

1. **Passwords in localStorage** (plaintext)
2. **No input sanitization** (XSS risk)
3. **Client-side only** (no server validation)

### Recommendations Before Production

1. **Add backend** for real authentication
2. **Hash passwords** (use bcrypt)
3. **Sanitize inputs** (prevent XSS)
4. **Add HTTPS headers** (via CloudFront)

**For now (demo/portfolio):** Current setup is acceptable.

**For production use:** Implement backend (convert to full-stack).

---

## Next Steps

1. ✅ Deploy to AWS: `npm run deploy`
2. ✅ Test all pages work
3. ✅ Share CloudFront URL
4. 🔜 (Optional) Set up custom domain
5. 🔜 (Optional) Add backend for real user accounts
6. 🔜 (Optional) Integrate payment for consultations

---

## Support

**SST Documentation:** https://sst.dev/docs
**AWS Documentation:** https://docs.aws.amazon.com
**Project Issues:** Check PROJECT_STATUS.md

---

**Deployment Guide Version:** 1.0
**Last Updated:** January 3, 2026
**Architecture:** Static Site (SST)
**Status:** Ready to Deploy
