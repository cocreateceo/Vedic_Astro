@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d C:\Projects\Vedic_Astro\vedic-astro-next
echo === Building Next.js === > C:\Projects\Vedic_Astro\_build.log 2>&1
call npx next build >> C:\Projects\Vedic_Astro\_build.log 2>&1
echo === Build exit code: %ERRORLEVEL% === >> C:\Projects\Vedic_Astro\_build.log 2>&1
