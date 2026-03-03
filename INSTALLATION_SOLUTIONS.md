# devkitPro Installation Guide - Disk Space Solutions

## Current Issue
C: drive is full (0 MB free), but devkitPro installer requires ~500MB cache space on C:

## Solutions

### Option 1: Free Space on C: Drive (Recommended)

**Quick Cleanup:**
```powershell
# Clear temp files
Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue

# Empty Recycle Bin  
Clear-RecycleBin -Force

# Run Disk Cleanup
cleanmgr /d C:
```

**Manual Cleanup (to get 500+ MB):**
1. Empty Recycle Bin
2. Delete Windows Update cache: `C:\Windows\SoftwareDistribution\Download`
3. Clear browser caches
4. Remove old Windows versions: Run `cleanmgr` → Clean up system files
5. Uninstall unused programs

### Option 2: Use Pre-built Docker Image (Advanced)

```powershell
# Install Docker Desktop, then:
docker pull devkitpro/devkitarm
docker run -it -v "${PWD}:/src" devkitpro/devkitarm make
```

### Option 3: Manual Installation

1. Download MSYS2: https://www.msys2.org/
   - Install to D:\msys64 (has space)
   
2. Open MSYS2 terminal and run:
```bash
pacman -Syu
pacman -S --needed base-devel devkitpro-pkgbuild-helpers
pacman -S 3ds-dev devkitARM
```

### Option 4: Cloud Build (No Local Install)

Use GitHub Actions or GitLab CI to build your 3DS programs remotely.

**.github/workflows/build.yml:**
```yaml
name: Build 3DS
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    container: devkitpro/devkitarm
    steps:
      - uses: actions/checkout@v2
      - run: make
      - uses: actions/upload-artifact@v2
        with:
          name: 3dsx-file
          path: "*.3dsx"
```

### Option 5: Test IDE Without devkitPro

Use the mock build script to test IDE functionality:

```powershell
# Run this in your project directory
. "d:\New folder (7)\New folder\mock-build.ps1"
```

## After Freeing Space

Once you have 500+ MB free on C:, run:

```powershell
# Relaunch installer
Start-Process "D:\devkitProUpdater.exe"

# Select components:
# ☑ Nintendo 3DS
# ☑ devkitARM  
# ☑ 3ds-dev

# Install location: D:\devkitPro (to save C: space)
```

## Quick Status Check

```powershell
# Check free space
Get-PSDrive C | Select-Object Name, @{Name="Free(GB)";Expression={[math]::Round($_.Free/1GB,2)}}

# Check if devkitPro is installed
Test-Path "D:\devkitPro\devkitARM"
Test-Path "C:\devkitPro\devkitARM"
```

## Need Help?

If you need 500MB urgently, consider:
- Move Documents/Downloads to D: drive
- Compress large folders
- Use Windows Storage Sense
- Delete hibernation file: `powercfg /h off` (frees ~8GB)

---

**Current Automated Cleanup Status:**
- ✓ Temp files cleared
- ✓ Recycle bin emptied  
- ⏳ Disk cleanup running...

After cleanup completes, check free space again and rerun installer.
