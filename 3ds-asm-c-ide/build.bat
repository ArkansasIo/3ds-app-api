@echo off
echo ========================================
echo 3DS ASM/C IDE - Build Script
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    exit /b 1
)
echo [SUCCESS] Dependencies installed

echo.
echo [2/4] Building React application...
call npm run build
if errorlevel 1 (
    echo ERROR: React build failed
    exit /b 1
)
echo [SUCCESS] React build complete

echo.
echo [3/4] Build configuration complete
echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo To start the IDE:
echo   npm start
echo.
echo To run in development mode:
echo   npm run dev
echo.
echo To build Electron app:
echo   npm run build-electron
echo.
pause
