# Setup devkitPro Environment Variables
# Run this script AFTER devkitPro installation completes

Write-Host "`n=== Setting up devkitPro Environment ===" -ForegroundColor Cyan

# Check installation location
$devkitProPath = "D:\devkitPro"
if (-not (Test-Path $devkitProPath)) {
    $devkitProPath = "C:\devkitPro"
    if (-not (Test-Path $devkitProPath)) {
        Write-Host "✗ devkitPro not found! Please install it first." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Found devkitPro at: $devkitProPath" -ForegroundColor Green

# Set environment variables for current session
$env:DEVKITPRO = $devkitProPath
$env:DEVKITARM = "$devkitProPath\devkitARM"
$env:PATH = "$devkitProPath\tools\bin;$devkitProPath\msys2\usr\bin;$env:PATH"

# Set permanent environment variables (requires admin)
try {
    [System.Environment]::SetEnvironmentVariable("DEVKITPRO", $devkitProPath, "User")
    [System.Environment]::SetEnvironmentVariable("DEVKITARM", "$devkitProPath\devkitARM", "User")
    
    $currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$devkitProPath\tools\bin*") {
        $newPath = "$devkitProPath\tools\bin;$devkitProPath\msys2\usr\bin;$currentPath"
        [System.Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    }
    
    Write-Host "✓ Environment variables set successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not set permanent variables. They are set for this session only." -ForegroundColor Yellow
}

# Verify installation
Write-Host "`n=== Verifying Installation ===" -ForegroundColor Cyan

if (Test-Path "$env:DEVKITARM\bin\arm-none-eabi-gcc.exe") {
    Write-Host "✓ arm-none-eabi-gcc found" -ForegroundColor Green
} else {
    Write-Host "✗ arm-none-eabi-gcc not found" -ForegroundColor Red
}

if (Test-Path "$env:DEVKITPRO\msys2\usr\bin\make.exe") {
    Write-Host "✓ make found" -ForegroundColor Green
    $env:PATH = "$env:DEVKITPRO\msys2\usr\bin;$env:PATH"
} else {
    Write-Host "✗ make not found" -ForegroundColor Red
}

Write-Host "`n=== Environment Variables ===" -ForegroundColor Cyan
Write-Host "DEVKITPRO = $env:DEVKITPRO"
Write-Host "DEVKITARM = $env:DEVKITARM"

Write-Host "`n✓ Setup complete! You can now build 3DS programs." -ForegroundColor Green
Write-Host "Note: Restart your terminal/IDE for changes to take effect.`n" -ForegroundColor Yellow
