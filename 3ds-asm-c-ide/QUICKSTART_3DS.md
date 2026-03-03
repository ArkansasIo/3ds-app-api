# 3DS IDE - Quick Start

## You can now CREATE, WRITE, ADD, and LOAD 3DS XL programs! 🎮

---

## What's New?

Your IDE now has **FULL FUNCTIONALITY** for 3DS development:

✅ **Create** - Generate new 3DS projects from template  
✅ **Write** - Edit C/C++/Assembly code with syntax highlighting  
✅ **Add** - Create and manage multiple source files  
✅ **Build** - Compile with devkitARM/make  
✅ **Load** - Deploy to 3DS XL via network or SD card  

---

## Quick Start (5 Minutes)

### 1. Create Your First Project

```
1. Launch the IDE
2. Click "📁 New" or press Ctrl+Shift+N
3. Choose a directory
4. Enter project name: "Hello3DS"
5. Project created! ✓
```

### 2. Write Your Code

The editor opens automatically with template files:
- `source/main.c` - Your main program
- `source/api.c` - API functions
- `include/api.h` - API headers

Edit `main.c` to customize your app!

### 3. Build the Project

```
Press Ctrl+B or click "🔨 Build"
Watch the Output Console
✓ Build complete!
```

### 4. Load to 3DS XL

**Option A - Network (Fast):**
```
1. Press Ctrl+F5 or click "📤 Deploy"
2. Enter your 3DS IP (shown in Homebrew Launcher)
3. App auto-launches on your 3DS! 🎉
```

**Option B - SD Card:**
```
1. After building, find YourApp.3dsx in project folder
2. Copy to SD:/3ds/YourApp/
3. Insert SD card, launch from Homebrew Launcher
```

---

## Key Features

### File Operations
- **New Project** - Creates complete project structure
- **Open Project** - Loads existing 3DS projects  
- **Save Files** - Automatic file management
- **Multiple Files** - Edit multiple source files simultaneously

### Building
- **Build** - Compiles your project with devkitARM
- **Clean** - Removes build artifacts
- **Real-time Output** - See compilation progress live

### Deployment
- **Network Deploy** - Send directly to 3DS via 3dslink
- **SD Card Export** - Manual deployment option
- **One-Click Deploy** - Build and run with Ctrl+F5

### Code Editor
- Syntax highlighting for C/C++/Assembly
- Auto-indentation
- File tabs for easy navigation
- Real-time editing

---

## Your Project Template Includes

```
MyProject/
├── source/
│   ├── main.c          # Entry point with basic app loop
│   └── api.c           # API system implementation
├── include/
│   └── api.h           # API definitions
├── Makefile            # Build configuration (auto-configured)
└── README.md           # Project documentation
```

### The API System

Your projects include a ready-to-use API system:

```c
api_init();              // Initialize
api_process(&req, &res); // Send commands
api_shutdown();          // Cleanup
```

**Built-in Commands:**
- Echo test
- Version info
- System info
- Easy to extend with your own commands!

---

## Requirements

Before you start, make sure you have:

### On Your PC:
- [x] devkitARM installed
- [x] DEVKITARM environment variable set
- [x] 3dslink (optional, for network deploy)

### On Your 3DS XL:
- [x] Custom firmware (Luma3DS recommended)
- [x] Homebrew Launcher
- [x] SD card

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Project | `Ctrl+Shift+N` |
| Open Project | `Ctrl+O` |
| Save | `Ctrl+S` |
| Build | `Ctrl+B` |
| Deploy & Run | `Ctrl+F5` |
| Clean Build | `Ctrl+Shift+B` |

---

## Example: Hello World in 30 Seconds

1. **Create Project**: Ctrl+Shift+N → Name: "HelloWorld"

2. **Edit main.c**:
```c
#include <stdio.h>
#include <3ds.h>

int main() {
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    printf("Hello, 3DS World!\n");
    printf("Press START to exit.\n");
    
    while (aptMainLoop()) {
        hidScanInput();
        if (hidKeysDown() & KEY_START) break;
        
        gfxFlushBuffers();
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
    gfxExit();
    return 0;
}
```

3. **Build**: Ctrl+B

4. **Deploy**: Ctrl+F5 → Enter 3DS IP

5. **Enjoy on 3DS!** 🎉

---

## Troubleshooting

### "DEVKITARM not found"
➜ Install devkitPro from https://devkitpro.org/

### "Build failed"
➜ Check Output Console for specific errors  
➜ Verify devkitARM is properly installed

### "Deploy failed"
➜ Verify 3DS IP address  
➜ Ensure 3DS is in Homebrew Launcher  
➜ Try SD card method as backup

### "App crashes on 3DS"
➜ Check for syntax errors  
➜ Verify API initialization  
➜ Look at console output on 3DS

---

## Documentation

- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Complete guide with detailed instructions
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Code examples for the API system
- **Template README** - In each new project you create

---

## What You Can Do Now

### Beginner Projects
- Hello World app
- Button tester
- Simple calculator
- Text display app

### Intermediate Projects
- Image viewer
- Audio player
- Game prototype
- Utility tools

### Advanced Projects  
- Network apps
- Custom APIs
- System integrations
- Full games

---

## Getting Started Right Now

1. **Install devkitARM** (if not already installed)
   - Download: https://devkitpro.org/wiki/Getting_Started
   - Follow installation guide
   - Verify: `echo %DEVKITARM%` (Windows)

2. **Prepare Your 3DS**
   - Install CFW if needed
   - Launch Homebrew Launcher
   - Note your 3DS IP address

3. **Create Your First App**
   - Launch this IDE
   - New Project (Ctrl+Shift+N)
   - Edit code
   - Build (Ctrl+B)
   - Deploy (Ctrl+F5)

4. **Start Coding!**
   - See [API_EXAMPLES.md](API_EXAMPLES.md) for code samples
   - Check 3DBrew wiki for 3DS APIs
   - Experiment and have fun!

---

## Support & Resources

- **3DBrew Wiki**: https://3dbrew.org/
- **devkitPro**: https://devkitpro.org/
- **libctru Docs**: https://libctru.devkitpro.org/

---

## You're Ready! 🚀

Everything is set up for you to:
- Create 3DS projects ✓
- Write code ✓
- Add features ✓  
- Build programs ✓
- Load to 3DS XL ✓

**Start creating your first 3DS homebrew app now!**

Press `Ctrl+Shift+N` to begin! 🎮✨
