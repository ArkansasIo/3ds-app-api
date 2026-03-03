# Setup D: Drive Development Environment
# This configures your system to build 3DS programs using D: drive

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  D: Drive Development Setup" -ForegroundColor White
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$devkitProPath = "D:\devkitPro"
$devkitARM = "$devkitProPath\devkitARM"
$tools = "$devkitProPath\tools\bin"

# Set environment variables for current session
$env:DEVKITPRO = $devkitProPath
$env:DEVKITARM = $devkitARM
$env:PATH = "$tools;$devkitARM\bin;$env:PATH"

Write-Host "Setting environment variables..." -ForegroundColor Cyan
Write-Host "  DEVKITPRO = $devkitProPath" -ForegroundColor Green
Write-Host "  DEVKITARM = $devkitARM" -ForegroundColor Green
Write-Host ""

# Set permanent user environment variables
try {
    [System.Environment]::SetEnvironmentVariable("DEVKITPRO", $devkitProPath, "User")
    [System.Environment]::SetEnvironmentVariable("DEVKITARM", $devkitARM, "User")
    
    $currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$tools*") {
        $newPath = "$tools;$devkitARM\bin;" + $currentPath
        [System.Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    }
    
    Write-Host "✓ Permanent environment variables set" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not set permanent variables (continue with session-only)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking toolchain..." -ForegroundColor Cyan

if (Test-Path "$devkitARM\bin\arm-none-eabi-gcc.exe") {
    Write-Host "✓ ARM GCC found" -ForegroundColor Green
    $version = & "$devkitARM\bin\arm-none-eabi-gcc.exe" --version 2>&1 | Select-Object -First 1
    Write-Host "  Version: $version" -ForegroundColor Gray
} else {
    Write-Host "⚠ ARM GCC not found yet" -ForegroundColor Yellow
    Write-Host "  Toolchain installation still in progress..." -ForegroundColor Gray
}

if (Test-Path "$tools\make.exe") {
    Write-Host "✓ Make utility found" -ForegroundColor Green
} else {
    Write-Host "⚠ Make utility not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Environment Ready on D: Drive!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Build your project:" -ForegroundColor Yellow
Write-Host "  cd 'd:\New folder (7)\New folder\3ds-homebrew-template'" -ForegroundColor Cyan
Write-Host "  make" -ForegroundColor Cyan
Write-Host ""
