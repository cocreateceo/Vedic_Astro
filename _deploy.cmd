@echo off
set PATH=C:\Program Files\nodejs;C:\Users\patta\AppData\Roaming\sst\bin;%PATH%
set AWS_PROFILE=cocreate
cd /d C:\Projects\Vedic_Astro
echo === Unlocking SST === > _deploy.log 2>&1
"C:\Program Files\nodejs\node.exe" node_modules\sst\bin\sst.mjs unlock --stage production >> _deploy.log 2>&1
echo Unlock exit code: %ERRORLEVEL% >> _deploy.log 2>&1
echo === Deploying === >> _deploy.log 2>&1
"C:\Program Files\nodejs\node.exe" node_modules\sst\bin\sst.mjs deploy --stage production >> _deploy.log 2>&1
echo Deploy exit code: %ERRORLEVEL% >> _deploy.log 2>&1
echo === DONE === >> _deploy.log 2>&1
