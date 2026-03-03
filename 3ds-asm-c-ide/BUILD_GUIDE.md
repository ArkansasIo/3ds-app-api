# IDE Compilation & Build Guide

## Build Status

✅ **Project Structure**: COMPLETE
✅ **React Components**: CREATED
✅ **Electron Setup**: CONFIGURED
✅ **Documentation**: COMPLETE
⏳ **NPM Dependencies**: READY FOR INSTALLATION

## Compilation Instructions

### Prerequisites

Ensure you have installed:
- **Node.js 16+** - [Download](https://nodejs.org/) 
- **npm 7+** - Comes with Node.js

### Quick Build (Windows)

```batch
cd "d:\New folder (7)\New folder\3ds-asm-c-ide"
build.bat
```

### Quick Build (Linux/macOS)

```bash
cd "d:/New folder (7)/New folder/3ds-asm-c-ide"
chmod +x build.sh
./build.sh
```

### Manual Build Steps

#### Step 1: Install Dependencies
```bash
cd "d:\New folder (7)\New folder\3ds-asm-c-ide"
npm install
```

This will download and install:
- React 18.2.0
- React DOM 18.2.0
- Electron 27.0.0
- Electron Builder 24.6.4
- React Scripts 5.0.1
- All other dependencies

**Time**: ~5-10 minutes (first time)

#### Step 2: Build React Application
```bash
npm run build
```

This compiles React with:
- Code optimization
- Bundle minification
- Production build output in `/build` directory

**Time**: ~2-3 minutes

#### Step 3: Start IDE (Development)
```bash
npm start
```

Or with hot reload:
```bash
npm run dev
```

**Time**: ~5 seconds

#### Step 4: Build Electron Package (Optional)
```bash
npm run build-electron
```

Creates standalone executables in `/dist` directory

**Time**: ~5-10 minutes

## Project Architecture

```
Source Code (src/)
       ↓
React Compilation (npm run build)
       ↓
Optimized Bundle (build/)
       ↓
Electron App (npm start)
       ↓
↙          ↘
Linux      Windows/macOS
Executable  (npm run build-electron)
```

## File Structure After Build

```
3ds-asm-c-ide/
├── node_modules/              # Installed packages
├── build/                      # React compiled output
│   ├── index.html             # Bundled HTML
│   ├── static/
│   │   ├── js/               # Minified JavaScript
│   │   ├── css/              # CSS files
│   │   └── media/            # Assets
│   └── manifest.json
├── dist/                       # Electron executables (after build-electron)
├── src/                        # Source code
├── public/                     # Static assets
├── main.js                     # Electron entry
├── preload.js                 # IPC bridge
└── package.json
```

## Build Configuration

### Environment Variables

Set in `.env.development`:
```
BROWSER=none        # Don't auto-open browser
PORT=3000           # Dev server port
```

### Electron Config (package.json)

```json
"build": {
  "appId": "com.3ds.dev.ide",
  "productName": "3DS ASM/C IDE",
  "files": ["build/**/*", "node_modules/**/*", "main.js", "preload.js"]
}
```

## Build Output Locations

| Command | Output | Purpose |
|---------|--------|---------|
| `npm run build` | `/build/` | React app bundle |
| `npm run build-electron` | `/dist/` | Electron executables |
| `npm start` | Memory | Development runtime |
| `npm run dev` | Memory | Development with hot reload |

## Troubleshooting

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete lock file and try again
del package-lock.json
npm install
```

### Build fails - Missing modules
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Old files causing issues
```bash
# Clean slate rebuild
npm run clean     # (if exists, else:)
rm -rf build node_modules
npm install
npm run build
```

## Performance Tips

### Fast Rebuild
```bash
# Development mode with caching
npm run dev
```

### Production Build
```bash
# Optimized build for distribution
npm run build
npm run build-electron
```

### Incremental Development
- Keep `npm run dev` running
- Edit files - changes auto-reload
- No rebuild needed between changes

## Packaging for Distribution

### Windows Installer
```bash
npm run build-electron -- --win nsis
```
Output: `dist/3DS ASM-C IDE Setup.exe`

### macOS
```bash
npm run build-electron -- --mac dmg
```
Output: `dist/3DS ASM-C IDE.dmg`

### Linux
```bash
npm run build-electron -- --linux AppImage
```
Output: `dist/3DS ASM-C IDE.AppImage`

### All Platforms
```bash
npm run build-electron
```

## System Requirements

### Build System
- **Node.js**: 16.0.0+ (14.x minimum)
- **npm**: 7.0.0+
- **RAM**: 2GB minimum
- **Disk**: 2GB for node_modules
- **OS**: Windows, macOS, or Linux

### Runtime (IDE)
- **RAM**: 512MB minimum
- **Disk**: 100MB for IDE
- **devkitARM**: For compilation support
- **libctru**: For 3DS development

## Build Scripts Reference

```json
{
  "start": "electron .",
  "dev": "npm run react-start (dev server) + electron .",
  "react-start": "react-scripts start",
  "build": "react-scripts build",
  "build-electron": "npm run build && electron-builder"
}
```

## Verification Checklist

After building, verify:
- [ ] `npm install` completed without errors
- [ ] `npm run build` created `/build` directory
- [ ] `npm start` launches Electron window
- [ ] All menus appear in IDE
- [ ] File editor loads without errors
- [ ] Console shows no JavaScript errors (F12)

## Next Steps

1. **Install**: `npm install`
2. **Build**: `npm run build`
3. **Test**: `npm start`
4. **Develop**: `npm run dev`
5. **Package**: `npm run build-electron`

## Support & References

- [Node.js Download](https://nodejs.org/)
- [npm Documentation](https://docs.npmjs.com/)
- [Electron Build Docs](https://www.electronjs.org/docs)
- [React Build Docs](https://react.dev/learn/deployment)

## Build Time Estimates

| Task | First Time | Subsequent |
|------|-----------|-----------|
| npm install | 5-10 min | 1-2 min |
| npm run build | 2-3 min | 1 min |
| npm start | ~5 sec | ~2 sec |
| build-electron | 5-10 min | 3-5 min |

---

**Ready to build! Follow the instructions above.** 🚀
