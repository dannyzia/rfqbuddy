@echo off
REM Backend Server Startup Script for E2E Testing
REM This script starts the RFQ Buddy backend server on port 3000
REM Usage: start-backend.bat

echo.
echo ========================================
echo RFQ Buddy - Backend Server Startup
echo ========================================
echo.

REM Set environment variables
set NODE_ENV=development
set PORT=3000

echo Configuration:
echo   - Environment: %NODE_ENV%
echo   - Port: %PORT%
echo.

REM Navigate to backend directory
cd backend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        cd ..
        exit /b 1
    )
)

echo.
echo Starting backend server...
echo   Server will be available at http://localhost:3000
echo   Press Ctrl+C to stop the server
echo.

REM Start dev server
call npm run dev

cd ..
