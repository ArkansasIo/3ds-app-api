@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 3DS ASM/C IDE - Installation Validator
echo ========================================
echo.

REM Check Node.js
echo [1/3] Checking Node.js...
where node >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo     [OK] Node.js !NODE_VERSION! found
) else (
    echo     [ERROR] Node.js not found in PATH
    echo     Download from: https://nodejs.org/
    goto :error
)

REM Check npm
echo [2/3] Checking npm...
where npm >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo     [OK] npm !NPM_VERSION! found
) else (
    echo     [ERROR] npm not found in PATH
    echo     npm should come with Node.js
    goto :error
)

REM Check disk space
echo [3/3] Checking disk space...
for /f "tokens=2" %%i in ('fsutil volume diskfree %cd:~0,2% ^| find /v "display"') do (
    set /A DISK_MB=%%i/1048576
)
if !DISK_MB! geq 2000 (
    echo     [OK] !DISK_MB! MB free (need 2000 MB)
) else (
    echo     [WARN] Only !DISK_MB! MB free (need 2000 MB minimum)
)

echo.
echo ========================================
echo Installation Check Complete!
echo ========================================
echo.
echo Your system is ready to build the IDE.
echo.
echo Next steps:
echo   1. npm install
echo   2. npm run build
echo   3. npm start
echo.
goto :end

:error
echo.
echo Please install the missing dependencies and try again.
echo.
exit /b 1

:end
exit /b 0
