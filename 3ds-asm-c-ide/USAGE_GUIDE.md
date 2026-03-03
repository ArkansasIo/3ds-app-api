# 3DS IDE - Usage Guide

## Complete Guide for Creating, Writing, and Loading 3DS XL Programs

This IDE now has full support for creating, developing, building, and deploying 3DS homebrew applications to your 3DS XL console.

---

## Prerequisites

Before you can build and deploy 3DS programs, you need:

1. **devkitARM** - ARM toolchain for 3DS development
   - Download from: https://devkitpro.org/wiki/Getting_Started
   - Make sure `DEVKITARM` environment variable is set
   - Verify with: `echo $DEVKITARM` (Linux/Mac) or `echo %DEVKITARM%` (Windows)

2. **3DS Homebrew Tools**
   - libctru (included with devkitARM)
   - 3dsxtool (included with devkitARM)
   - 3dslink (optional, for network deployment)

3. **Custom Firmware on 3DS** (for running homebrew)
   - Luma3DS or similar CFW
   - Homebrew Launcher installed

---

## Creating a New 3DS Project

### Method 1: Using the IDE

1. **Open the IDE**
   - Launch the 3DS IDE application

2. **Create New Project**
   - Click `📁 New` button or press `Ctrl+Shift+N`
   - Select a directory where you want to create the project
   - Enter a project name (e.g., "MyFirstApp")
   - The IDE will create a complete project structure from the template

3. **Project Structure Created**
   ```
   MyFirstApp/
   ├── source/
   │   ├── main.c       # Main entry point
   │   └── api.c        # API implementation
   ├── include/
   │   └── api.h        # API header
   ├── Makefile         # Build configuration
   └── README.md        # Project documentation
   ```

### Method 2: Manual Creation

You can also manually copy the `3ds-homebrew-template` folder and rename it.

---

## Writing Code

### Opening Files

1. **From Project**: Click on any file in the File Explorer panel
2. **Open Existing File**: Click `📂 Open` or press `Ctrl+Alt+O`
3. **Create New File**: Click the new file button or press `Ctrl+N`

### Editing Code

The editor supports:
- **C/C++ Files** (.c, .cpp, .h)
- **Assembly Files** (.s, .asm)
- Syntax highlighting
- Auto-indentation
- Code completion

### Saving Files

- **Save Current File**: Click `💾 Save` or press `Ctrl+S`
- **Save As**: Press `Ctrl+Shift+S` to save with a new name

---

## Building Your Project

### Build Process

1. **Make sure you have a project open**
   - The project indicator should show your project name

2. **Build the Project**
   - Click `🔨 Build` button or press `Ctrl+B`
   - Watch the Output Console for build progress
   - Successful build creates a `.3dsx` file

3. **Build Output**
   ```
   > Building project...
   > Compiling C/C++ sources...
   > Linking...
   ✓ Build complete!
   ```

### Clean Build

To remove all build artifacts:
- Click `🧹 Clean` button or press `Ctrl+Shift+B`

---

## Loading Programs to 3DS XL

### Method 1: Network Deploy (Fastest)

**Setup:**
1. Install 3dslink on your PC
2. Ensure your 3DS and PC are on the same network
3. Launch Homebrew Launcher on your 3DS

**Deploy:**
1. Click `📤 Deploy` or `▶️ Run` button (or press `Ctrl+F5`)
2. Enter your 3DS IP address (shown in Homebrew Launcher)
   - Example: `192.168.1.100`
3. The program will deploy and auto-launch on your 3DS

### Method 2: SD Card (Manual)

**If network deploy fails:**
1. Build your project (creates `.3dsx` file)
2. Copy the `.3dsx` file to your SD card
3. Location: `SD:/3ds/YourAppName/YourAppName.3dsx`
4. Insert SD card into 3DS
5. Launch from Homebrew Launcher

---

## Working with the API

### Using the 3DS API in Your Code

Your project includes a basic API system (`api.h` and `api.c`):

```c
#include "api.h"

// Initialize the API
api_init();

// Create and process requests
api_request_t req = {0};
api_response_t res = {0};

req.cmd = 0x00; // Echo command
strcpy(req.data, "Hello 3DS!");

api_process(&req, &res);
printf("Response: %s\n", res.data);

// Cleanup
api_shutdown();
```

### Available API Commands

- `0x00` - Echo command (test)
- `0x01` - Get version info
- `0x02` - Get system info

### Adding Your Own Commands

Edit `source/api.c` and add new cases in the `api_process()` function:

```c
case 0x10: // Your custom command
    // Your implementation here
    res->status = API_SUCCESS;
    break;
```

---

## Example: Creating Your First App

Let's create a simple "Hello World" app:

### Step 1: Create Project
```
1. New Project → Select directory → Name: "HelloWorld"
2. IDE creates project structure
```

### Step 2: Edit main.c
```c
#include <stdio.h>
#include <3ds.h>

int main(int argc, char* argv[])
{
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    printf("Hello, 3DS World!\n");
    printf("Press START to exit.\n");
    
    while (aptMainLoop())
    {
        hidScanInput();
        u32 kDown = hidKeysDown();
        
        if (kDown & KEY_START)
            break;
        
        gfxFlushBuffers();
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
    gfxExit();
    return 0;
}
```

### Step 3: Build
```
Press Ctrl+B or click Build button
```

### Step 4: Deploy
```
Press Ctrl+F5 or click Deploy button
Enter 3DS IP: 192.168.1.100
```

### Step 5: Run on 3DS
```
- App auto-launches (network deploy), or
- Select from Homebrew Launcher (SD card method)
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Project | `Ctrl+Shift+N` |
| Open Project | `Ctrl+O` |
| New File | `Ctrl+N` |
| Open File | `Ctrl+Alt+O` |
| Save | `Ctrl+S` |
| Save As | `Ctrl+Shift+S` |
| Build | `Ctrl+B` |
| Build & Deploy | `Ctrl+F5` |
| Clean | `Ctrl+Shift+B` |
| Find | `Ctrl+F` |
| Settings | `Ctrl+,` |

---

## Troubleshooting

### Build Fails

**Problem:** "DEVKITARM not found"
- **Solution:** Install devkitARM and set the environment variable

**Problem:** "make: command not found"
- **Solution:** Install make (included with devkitPro on Windows)

### Deploy Fails

**Problem:** "No .3dsx file found"
- **Solution:** Build the project first (Ctrl+B)

**Problem:** "Connection refused"
- **Solution:** 
  - Verify 3DS IP address
  - Ensure 3DS is in Homebrew Launcher
  - Check network connectivity
  - Use SD card method as alternative

### Runtime Issues

**Problem:** App crashes on 3DS
- **Solution:**
  - Check console output for error messages
  - Verify API initialization
  - Check for memory leaks

---

## Advanced Features

### Multiple Files

- Add new `.c` files to `source/` directory
- Add new `.h` files to `include/` directory
- Makefile automatically includes them

### Assembly Files

- Create `.s` or `.asm` files in `source/` directory
- Use ARM assembly syntax
- Automatically compiled with the project

### Custom Build Configuration

Edit `Makefile` to:
- Change optimization level (`-O2`)
- Add compiler flags
- Link additional libraries

### Using Libraries

Add libraries to `LIBS` in Makefile:
```makefile
LIBS := -lctru -lm -lcitro3d
```

---

## Resources

- **3DBrew Wiki**: https://3dbrew.org/
- **devkitPro**: https://devkitpro.org/
- **libctru Documentation**: https://libctru.devkitpro.org/
- **Homebrew Development**: https://www.3dbrew.org/wiki/Homebrew_Development

---

## Quick Reference

### File Structure
```
project/
├── source/           # Your C/C++/ASM source files
├── include/          # Your header files
├── build/            # Compiled objects (auto-generated)
├── Makefile          # Build configuration
└── YourApp.3dsx     # Final executable (after build)
```

### Workflow
```
1. Create Project → 2. Write Code → 3. Save → 4. Build → 5. Deploy → 6. Test
```

### Deployment Checklist
- ✓ Project built successfully
- ✓ .3dsx file exists
- ✓ 3DS has CFW installed
- ✓ Homebrew Launcher running (network) or SD card ready (manual)
- ✓ Network: Same network, correct IP
- ✓ Manual: Correct SD card location

---

## Need Help?

If you encounter issues:
1. Check the Output Console for error messages
2. Verify devkitARM installation
3. Ensure your 3DS has proper CFW
4. Check the troubleshooting section above
5. Consult 3DBrew wiki for 3DS-specific issues

Happy coding! 🎮✨
