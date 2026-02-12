$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
$env:AWS_PROFILE = "cocreate"
Set-Location "C:\Projects\Vedic_Astro"
npx sst unlock --stage production 2>&1
npx sst deploy --stage production 2>&1
