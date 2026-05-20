$ErrorActionPreference = 'SilentlyContinue'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logsDir = Join-Path $root 'run-logs'
$pidFile = Join-Path $logsDir 'pids.json'

if (Test-Path $pidFile) {
  try {
    $pids = Get-Content $pidFile | ConvertFrom-Json
    foreach ($name in 'ml', 'backend', 'frontend') {
      $pid = $pids.$name
      if ($pid) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
      }
    }
  } catch {
  }

  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

foreach ($port in 3000, 5000, 8008) {
  $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
  $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pid in $pids) {
    if ($pid -match '^\d+$') {
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
  }
}

Write-Host 'Smart Agri background services stopped.'
$global:LASTEXITCODE = 0
