param(
  [switch]$RebuildFrontend
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logsDir = Join-Path $root 'run-logs'
$frontendDist = Join-Path $root 'frontend\dist\index.html'
$pidFile = Join-Path $logsDir 'pids.json'

function Wait-ForUrl {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [int]$TimeoutSeconds = 90
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
        return $true
      }
    } catch {
      Start-Sleep -Milliseconds 750
    }
  }

  return $false
}

New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

if (Test-Path $pidFile) {
  try {
    $existing = Get-Content $pidFile | ConvertFrom-Json
    foreach ($name in 'ml', 'backend', 'frontend') {
      $pid = $existing.$name
      if ($pid) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
      }
    }
  } catch {
  }
}

if ($RebuildFrontend -or -not (Test-Path $frontendDist)) {
  Push-Location (Join-Path $root 'frontend')
  try {
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) {
      if (Test-Path $frontendDist) {
        Write-Warning 'Frontend rebuild failed. Reusing the existing dist bundle.'
      } else {
        throw 'Frontend build failed and no existing dist bundle is available.'
      }
    }
  } finally {
    Pop-Location
  }
}

$mlCommand = "& { Set-Location '$root'; python 'Plant disease dettection\prediction_service.py' *> '$logsDir\ml-service.log' }"
$backendCommand = "& { Set-Location '$root\backend'; npm.cmd start *> '$logsDir\backend.log' }"
$frontendCommand = "& { Set-Location '$root'; python 'frontend_spa_server.py' --host 127.0.0.1 --port 3000 --directory 'frontend/dist' *> '$logsDir\frontend-static.log' }"

$ml = Start-Process -WindowStyle Hidden -FilePath powershell.exe -ArgumentList '-NoProfile', '-Command', $mlCommand -PassThru
$backend = Start-Process -WindowStyle Hidden -FilePath powershell.exe -ArgumentList '-NoProfile', '-Command', $backendCommand -PassThru
$frontend = Start-Process -WindowStyle Hidden -FilePath powershell.exe -ArgumentList '-NoProfile', '-Command', $frontendCommand -PassThru

@{
  ml = $ml.Id
  backend = $backend.Id
  frontend = $frontend.Id
  startedAt = (Get-Date).ToString('o')
} | ConvertTo-Json | Set-Content -Path $pidFile

$servicesReady = @(
  Wait-ForUrl -Url 'http://127.0.0.1:8008/health' -TimeoutSeconds 120
  Wait-ForUrl -Url 'http://127.0.0.1:5000/api/v1/ml/plant-disease/health' -TimeoutSeconds 120
  Wait-ForUrl -Url 'http://127.0.0.1:3000/prediction' -TimeoutSeconds 60
)

if ($servicesReady -contains $false) {
  & (Join-Path $root 'stop-smart-agri.ps1') | Out-Null
  throw "One or more Smart Agri services failed to start. Check logs in $logsDir"
}

Write-Host "ML service: http://127.0.0.1:8008"
Write-Host "Backend API: http://127.0.0.1:5000"
Write-Host "Frontend: http://127.0.0.1:3000"
Write-Host "Logs: $logsDir"
