$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$localJdk = Get-ChildItem -LiteralPath (Join-Path $projectRoot '.tools') -Directory -Filter 'jdk-17*' -ErrorAction SilentlyContinue | Select-Object -First 1

if ($localJdk) {
    $env:JAVA_HOME = $localJdk.FullName
    $env:Path = "$($localJdk.FullName)\bin;$env:Path"
}

if (-not $env:JAVA_HOME) {
    throw 'JDK 17 is required. Set JAVA_HOME or place a jdk-17* folder in .tools.'
}

Push-Location (Join-Path $projectRoot 'android')
try {
    & .\gradlew.bat bundleRelease --no-daemon
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Pop-Location
}
