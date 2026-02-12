@echo off
setlocal
REM ============================================================
REM  Fast Deploy — Code-only changes (bypasses SST/Pulumi)
REM  ~30 seconds vs ~3+ minutes with SST
REM
REM  USE THIS FOR: HTML/CSS/JS/TS changes, page updates, styling
REM  DO NOT USE FOR: New Lambda functions, DynamoDB tables, API
REM                  routes, cron jobs, or any infra changes
REM  FOR INFRA CHANGES: Use _deploy.cmd (full SST deploy)
REM ============================================================

set S3_BUCKET=vedic-astro-production-vedicastrositeassetsbucket-vkhkhbnd
set CF_DIST_ID=E1CTOZPIJ1ZUKP
set SITE_URL=https://d3r8o59ewzr723.cloudfront.net
set AWS_PROFILE=cocreate
set PATH=C:\Program Files\nodejs;%PATH%

echo.
echo === FAST DEPLOY (code-only, no SST) ===
echo.

REM --- Step 1: Build Next.js ---
echo [1/3] Building Next.js...
cd /d C:\Projects\Vedic_Astro\vedic-astro-next
call npx next build
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Next.js build failed. Fix errors above and retry.
    exit /b 1
)
echo       Build OK.

REM --- Step 2: Sync to S3 ---
echo [2/3] Uploading to S3...
aws s3 sync out/ s3://%S3_BUCKET%/ --delete --profile %AWS_PROFILE%
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: S3 upload failed. Check AWS credentials.
    exit /b 1
)
echo       Upload OK.

REM --- Step 3: Invalidate CloudFront ---
echo [3/3] Invalidating CloudFront cache...
aws cloudfront create-invalidation --distribution-id %CF_DIST_ID% --paths "/*" --profile %AWS_PROFILE% > nul 2>&1
echo       Invalidation started (propagates in 1-2 min).

echo.
echo === DEPLOY COMPLETE ===
echo Site: %SITE_URL%
echo.
echo Tip: Hard-refresh (Ctrl+Shift+R) to see changes immediately.
endlocal
