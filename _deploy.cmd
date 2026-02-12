@echo off
set PATH=C:\Program Files\nodejs;C:\Users\patta\AppData\Roaming\sst\bin;%PATH%
set AWS_PROFILE=cocreate
cd /d C:\Projects\Vedic_Astro
echo === Unlocking SST ===
"C:\Program Files\nodejs\node.exe" node_modules\sst\bin\sst.mjs unlock --stage production --print-logs
echo Unlock exit code: %ERRORLEVEL%
echo.
echo === Starting SST deploy ===
"C:\Program Files\nodejs\node.exe" node_modules\sst\bin\sst.mjs deploy --stage production --print-logs
echo Deploy exit code: %ERRORLEVEL%
