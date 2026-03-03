# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Windows
set DEVKITARM=C:\devkitPro\devkitARM
set CTRULIB=%DEVKITARM%\libctru

# macOS/Linux
export DEVKITARM=/opt/devkitpro/devkitARM
export CTRULIB=$DEVKITARM/libctru
```

### Step 3: Launch IDE
```bash
npm start
```

## Your First Project

### 1. Create New Project
- Click **File → New Project**
- Select a folder for your 3DS project
- The folder appears in the IDE

### 2. Create a File
- Click **File → New File**
- A new tab appears in the editor
- Start typing your code

### 3. Write Code

#### C Example:
```c
#include <stdio.h>
#include <3ds.h>

int main() {
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    printf("Hello 3DS!\n");
    
    while (aptMainLoop()) {
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
    gfxExit();
    return 0;
}
```

#### Assembly Example:
```asm
.arm
.section .text
.globl main

main:
    push {lr}
    
    ; Your assembly code here
    
    pop {pc}
```

### 4. Build
- Press **Ctrl+B** or click **Build → Build Project**
- Watch output in the console
- Fix any errors and rebuild

### 5. Test
- Press **Ctrl+F5** to build and run
- Check emulator or Citra

## Common Tasks

### Switch File Types
The IDE auto-detects file type from extension:
- `.c` → C file
- `.cpp` → C++ file
- `.s` → Assembly file

### Save Code
- **Ctrl+S** - Quick save
- **Ctrl+Shift+S** - Save as new file

### Find & Replace
- **Ctrl+F** - Open find dialog
- **Ctrl+H** - Open find & replace

### Clean Build
- **Ctrl+Shift+B** or **Build → Clean Build**
- Removes all compiled objects
- Forces full rebuild

## Troubleshooting

### No Building?
1. Check **Build → Build Configuration**
2. Verify devkitARM path in **Tools → Settings**
3. Check **Output Console** for errors

### File Not Showing?
1. Save the file first
2. Refresh file browser
3. Close and reopen file

### IDE Won't Start?
1. Delete node_modules/: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Try again: `npm start`

## Next Steps

- Read full [README.md](README.md)
- Check [3DBrew Documentation](https://3dbrew.org/)
- Explore [devkitARM Examples](https://github.com/devkitPro/devkitarm-rules)
- Join [GBATemp 3DS Homebrew](https://gbatemp.net/)

---

You're ready to develop for 3DS! 🚀
