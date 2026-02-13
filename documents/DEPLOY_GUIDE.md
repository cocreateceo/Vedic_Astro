# Vedic Astro — Commit & Deploy Guide

## Prerequisites

- **Node.js** installed at `C:\Program Files\nodejs\`
- **AWS CLI** installed and accessible from PowerShell
- **Git** configured with remote `origin` pointing to GitHub

---

## Step 1: Build the Next.js App

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cd C:\Projects\Vedic_Astro\vedic-astro-next
npm run build
```

This generates static files in `vedic-astro-next\out\`.

Verify the build succeeds with all routes listed (17 pages).

---

## Step 2: Commit Changes

```powershell
cd C:\Projects\Vedic_Astro

# Check what changed
git status
git diff --stat

# Stage specific files (never use git add -A blindly)
git add vedic-astro-next/app/somepage/page.tsx
git add vedic-astro-next/components/somecomponent.tsx

# Commit
git commit -m "Your commit message here"
```

---

## Step 3: Push to GitHub

```powershell
git push
```

Remote: `https://github.com/cocreateceo/Vedic_Astro.git`
Branch: `main`

---

## Step 4: Deploy to AWS (S3 + CloudFront)

### Option A: Run the deploy script

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Projects\Vedic_Astro\_deploy-now.ps1"
```

This script:
1. Sets AWS credentials as environment variables
2. Syncs `vedic-astro-next\out\` to S3 bucket
3. Creates a CloudFront cache invalidation

### Option B: Manual deploy commands

```powershell
$env:AWS_ACCESS_KEY_ID = "<your-key>"
$env:AWS_SECRET_ACCESS_KEY = "<your-secret>"
$env:AWS_DEFAULT_REGION = "us-east-1"

$bucket = "vedic-astro-production-vedicastrositeassetsbucket-vkhkhbnd"
$distId = "E1CTOZPIJ1ZUKP"
$outDir = "C:\Projects\Vedic_Astro\vedic-astro-next\out"

# Sync to S3
aws s3 sync $outDir "s3://$bucket/" --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $distId --paths "/*"
```

---

## Step 5: Verify Deployment

Check the deploy log:

```powershell
Get-Content C:\Projects\Vedic_Astro\_deploy.log -Tail 20
```

Look for:
- `S3 sync done` — files uploaded
- `"Status": "InProgress"` — CloudFront invalidation started
- `DEPLOY COMPLETE` — all done

Then visit: **https://d3r8o59ewzr723.cloudfront.net**

CloudFront cache takes **1-2 minutes** to clear after invalidation.

---

## Quick Reference (Full Flow)

```powershell
# 1. Build
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cd C:\Projects\Vedic_Astro\vedic-astro-next
npm run build

# 2. Commit & Push
cd C:\Projects\Vedic_Astro
git add <files>
git commit -m "your message"
git push

# 3. Deploy
powershell -ExecutionPolicy Bypass -File "C:\Projects\Vedic_Astro\_deploy-now.ps1"

# 4. Verify
Get-Content C:\Projects\Vedic_Astro\_deploy.log -Tail 10
```

---

## AWS Details

| Resource     | Value                                                                  |
|-------------|------------------------------------------------------------------------|
| S3 Bucket   | `vedic-astro-production-vedicastrositeassetsbucket-vkhkhbnd`          |
| CloudFront  | Distribution ID `E1CTOZPIJ1ZUKP`                                      |
| Live URL    | https://d3r8o59ewzr723.cloudfront.net                                  |
| Region      | us-east-1                                                              |

## Important Notes

- Always **build before deploying** — the deploy script only syncs the `out/` folder
- The `--delete` flag in S3 sync removes files from S3 that no longer exist locally
- CloudFront invalidation on `/*` clears the entire cache
- AWS credentials are set in `_deploy-now.ps1` — do not commit this file to Git
