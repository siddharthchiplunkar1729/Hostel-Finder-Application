param(
    [switch]$WithPgAdmin,
    [switch]$WithSeed
)

$ErrorActionPreference = "Stop"

function Get-EnvValue {
    param(
        [string]$Path,
        [string]$Name,
        [string]$DefaultValue
    )

    if (-not (Test-Path $Path)) {
        return $DefaultValue
    }

    $line = Get-Content $Path | Where-Object { $_ -match "^\s*$Name=" } | Select-Object -First 1
    if (-not $line) {
        return $DefaultValue
    }

    $value = ($line -split "=", 2)[1].Trim()
    if ([string]::IsNullOrWhiteSpace($value)) {
        return $DefaultValue
    }

    return $value
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example"
}

docker version | Out-Null

Write-Host "Building and starting HostelHub containers..."
docker compose up -d --build --remove-orphans

if ($WithPgAdmin) {
    Write-Host "Starting pgAdmin profile..."
    docker compose --profile pgadmin up -d
}

if ($WithSeed) {
    Write-Host "Running seed profile..."
    docker compose --profile seed run --rm seed
}

$appPort = Get-EnvValue -Path ".env" -Name "APP_PORT" -DefaultValue "3000"
$dbPort = Get-EnvValue -Path ".env" -Name "DB_PORT" -DefaultValue "5432"
$pgAdminPort = Get-EnvValue -Path ".env" -Name "PGADMIN_PORT" -DefaultValue "5050"

Write-Host "Waiting for app readiness on port $appPort..."
for ($i = 0; $i -lt 30; $i++) {
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:$appPort" -UseBasicParsing -TimeoutSec 3
        if ($res.StatusCode -ge 200 -and $res.StatusCode -lt 500) {
            Write-Host "App is reachable."
            break
        }
    } catch {
        Start-Sleep -Seconds 2
    }

    if ($i -eq 29) {
        throw "App did not become reachable in time."
    }
}

Write-Host ""
Write-Host "Deployment complete."
Write-Host "App:      http://localhost:$appPort"
Write-Host "Postgres: localhost:$dbPort"
if ($WithPgAdmin) {
    Write-Host "pgAdmin:  http://localhost:$pgAdminPort"
}
