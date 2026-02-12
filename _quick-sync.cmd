@echo off
set PATH=C:\Program Files\nodejs;C:\Program Files\Amazon\AWSCLIV2;%PATH%
set AWS_PROFILE=cocreate
set S3_BUCKET=vedic-astro-production-vedicastrositeassetsbucket-vkhkhbnd
set CF_DIST_ID=E1CTOZPIJ1ZUKP
cd /d C:\Projects\Vedic_Astro

echo === FAST DEPLOY (S3 sync + CF invalidation) === > _deploy.log 2>&1
echo [1/3] Building Next.js... >> _deploy.log 2>&1
cd /d C:\Projects\Vedic_Astro\vedic-astro-next
call npx next build >> C:\Projects\Vedic_Astro\_deploy.log 2>&1
echo Build exit code: %ERRORLEVEL% >> C:\Projects\Vedic_Astro\_deploy.log 2>&1

echo [2/3] Uploading to S3... >> C:\Projects\Vedic_Astro\_deploy.log 2>&1
cd /d C:\Projects\Vedic_Astro
aws s3 sync vedic-astro-next\out\ s3://%S3_BUCKET%/ --delete --profile %AWS_PROFILE% >> _deploy.log 2>&1
echo S3 exit code: %ERRORLEVEL% >> _deploy.log 2>&1

echo [3/3] Invalidating CloudFront... >> _deploy.log 2>&1
aws cloudfront create-invalidation --distribution-id %CF_DIST_ID% --paths "/*" --profile %AWS_PROFILE% >> _deploy.log 2>&1
echo CF exit code: %ERRORLEVEL% >> _deploy.log 2>&1
echo === DEPLOY COMPLETE === >> _deploy.log 2>&1
