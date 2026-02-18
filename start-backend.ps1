# Backend Server Startup Script for E2E Testing
# This script starts the RFQ Buddy backend server on port 3000
# Usage: .\start-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RFQ Buddy - Backend Server Startup" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment to development
$env:NODE_ENV = "development"
$env:PORT = "3000"

Write-Host "🔧 Configuration:" -ForegroundColor Yellow
Write-Host "  - Environment: $env:NODE_ENV" -ForegroundColor White
Write-Host "  - Port: $env:PORT" -ForegroundColor White
Write-Host ""

# Navigate to backend directory
$backendDir = Join-Path $PSScriptRoot "backend"

if (-not (Test-Path $backendDir)) {
    Write-Host "❌ Error: backend directory not found at $backendDir" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Changing to backend directory..." -ForegroundColor Yellow
Push-Location $backendDir

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host "   Server will be available at http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Start dev server
npm run dev

# Restore original location on exit
Pop-Location
