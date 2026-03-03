# Monitor and Complete devkitPro Setup
# This script monitors installation and sets up the environment

Write-Host ""
Write-Host "Monitoring devkitPro Installation..." -ForegroundColor Cyan

$maxAttempts = 60
$attempt = 0
$found = $false

while ($attempt -lt $maxAttempts -and -not $found) {
    $attempt++
    
    if (Test-Path "D:\devkitPro\devkitARM") {
        $devkitPath = "D:\devkitPro"
        $found = $true
    } elseif (Test-Path "C:\devkitPro\devkitARM") {
        $devkitPath = "C:\devkitPro"
        $found = $true
    }
    
    if (-not $found) {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 5
    }
}

if (-not $found) {
    Write-Host ""
    Write-Host "Installation not detected. Please run again after installation completes." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host ""
Write-Host "devkitPro Installation Detected!" -ForegroundColor Green
Write-Host "Location: $devkitPath" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
Write-Host "Setting up environment variables..." -ForegroundColor Cyan
$env:DEVKITPRO = $devkitPath
$env:DEVKITARM = "$devkitPath\devkitARM"

# Add to PATH
$toolsPath = "$devkitPath\tools\bin"
$msysPath = "$devkitPath\msys2\usr\bin"
$env:PATH = $msysPath + ";" + $toolsPath + ";" + $env:PATH

# Set permanent variables
try {
    [System.Environment]::SetEnvironmentVariable("DEVKITPRO", $devkitPath, "User")
    [System.Environment]::SetEnvironmentVariable("DEVKITARM", "$devkitPath\devkitARM", "User")
    
    $currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$toolsPath*") {
        $newPath = $msysPath + ";" + $toolsPath + ";" + $currentPath
        [System.Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    }
    Write-Host "Permanent environment variables set" -ForegroundColor Green
} catch {
    Write-Host "Session environment variables set (restart terminal for permanent effect)" -ForegroundColor Yellow
}

# Verify tools
Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Cyan

if (Test-Path "$env:DEVKITARM\bin\arm-none-eabi-gcc.exe") {
    Write-Host "  ARM compiler found" -ForegroundColor Green
    & "$env:DEVKITARM\bin\arm-none-eabi-gcc.exe" --version | Select-Object -First 1
} else {
    Write-Host "  ARM compiler not found" -ForegroundColor Red
}

if (Test-Path "$msysPath\make.exe") {
    Write-Host "  Make utility found" -ForegroundColor Green
} else {
    Write-Host "  Make utility not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Environment Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now build 3DS programs!" -ForegroundColor White
Write-Host ""
Write-Host "To compile the 3DS template, run:" -ForegroundColor Yellow
Write-Host "  cd 'd:\New folder (7)\New folder\3ds-homebrew-template'" -ForegroundColor Cyan
Write-Host "  make" -ForegroundColor Cyan
Write-Host ""
