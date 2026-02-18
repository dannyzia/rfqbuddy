#!/usr/bin/env pwsh
# PowerShell Test Runner Script for RFQ Buddy
# Usage: .\run-tests.ps1 [test-type] [options]

param(
    [Parameter(Position=0)]
    [ValidateSet('all', 'unit', 'integration', 'api', 'services', 'controllers', 'middleware', 'routes', 'auth', 'tender', 'bid', 'failing', 'coverage')]
    [string]$TestType = 'all',
    
    [Parameter()]
    [switch]$Watch,
    
    [Parameter()]
    [switch]$Verbose,
    
    [Parameter()]
    [switch]$Coverage,
    
    [Parameter()]
    [string]$Pattern = ''
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  RFQ Buddy Test Runner" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Set location to backend directory
Set-Location -Path "$PSScriptRoot\..\backend"

# Build test command
$testCommand = "npm test --"

# Add test type filter
switch ($TestType) {
    'all' { 
        Write-Host "Running all tests..." -ForegroundColor Green 
    }
    'unit' { 
        Write-Host "Running unit tests only..." -ForegroundColor Green
        $testCommand += " tests/unit"
    }
    'integration' { 
        Write-Host "Running integration tests only..." -ForegroundColor Green
        $testCommand += " tests/integration"
    }
    'api' { 
        Write-Host "Running API integration tests..." -ForegroundColor Green
        $testCommand += " src/tests/integration"
    }
    'services' { 
        Write-Host "Running service tests..." -ForegroundColor Green
        $testCommand += " src/services/__tests__"
    }
    'controllers' { 
        Write-Host "Running controller tests..." -ForegroundColor Green
        $testCommand += " src/controllers/__tests__"
    }
    'middleware' { 
        Write-Host "Running middleware tests..." -ForegroundColor Green
        $testCommand += " src/middleware/__tests__"
    }
    'routes' { 
        Write-Host "Running route tests..." -ForegroundColor Green
        $testCommand += " src/routes/__tests__"
    }
    'auth' { 
        Write-Host "Running authentication tests..." -ForegroundColor Green
        $testCommand += " --testPathPattern=auth"
    }
    'tender' { 
        Write-Host "Running tender tests..." -ForegroundColor Green
        $testCommand += " --testPathPattern=tender"
    }
    'bid' { 
        Write-Host "Running bid tests..." -ForegroundColor Green
        $testCommand += " --testPathPattern=bid"
    }
    'failing' { 
        Write-Host "Running only failing tests..." -ForegroundColor Yellow
        $testCommand += " --onlyFailures"
    }
    'coverage' { 
        Write-Host "Running tests with coverage..." -ForegroundColor Green
        $Coverage = $true
    }
}

# Add pattern if specified
if ($Pattern) {
    Write-Host "Filtering by pattern: $Pattern" -ForegroundColor Cyan
    $testCommand += " --testNamePattern=$Pattern"
}

# Add options
if ($Watch) {
    Write-Host "Running in watch mode..." -ForegroundColor Cyan
    $testCommand += " --watch"
}

if ($Verbose) {
    Write-Host "Running in verbose mode..." -ForegroundColor Cyan
    $testCommand += " --verbose"
}

if ($Coverage) {
    Write-Host "Generating coverage report..." -ForegroundColor Cyan
    $testCommand += " --coverage"
}

Write-Host ""
Write-Host "Executing: $testCommand" -ForegroundColor Gray
Write-Host ""

# Run the tests
Invoke-Expression $testCommand

$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✓ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "✗ Some tests failed (exit code: $exitCode)" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan

exit $exitCode
