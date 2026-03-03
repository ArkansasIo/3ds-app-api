# 3DS ASM/C++ IDE

A professional, feature-rich Integrated Development Environment for 3DS homebrew development with support for Assembly (ARM), C, and C++. Designed with an RPG Maker-like layout for intuitive workflow.

## Features

### IDE Capabilities
- **Multi-language Support**: ARM Assembly, C, and C++
- **Project Management**: Create, open, and manage 3DS projects
- **Code Editor**: Syntax-highlighted editor with tab management
- **File Explorer**: Visual file browser for project navigation
- **Output Console**: Real-time build output and error messages
- **Properties Panel**: File and editor configuration
- **Build System**: Integrated devkitARM compilation

### Menu System
```
File                    Edit                View
├─ New Project          ├─ Undo             ├─ File Browser
├─ Open Project         ├─ Redo             ├─ Output Console
├─ New File             ├─ Cut              ├─ Properties
├─ Open File            ├─ Copy             └─ Zoom Controls
├─ Save                 ├─ Paste
├─ Save As              ├─ Find
└─ Exit                 └─ Replace

Build                   Tools               Help
├─ Build Project        ├─ Settings         ├─ Documentation
├─ Clean Build          ├─ devkitARM Config ├─ devkitARM Guide
├─ Build & Run          ├─ ASM Highlighter  └─ About
└─ Build Config         ├─ Code Formatter
                        ├─ Disassembler
                        └─ Memory Inspector
```

## Installation

### Prerequisites
- **Node.js** 14+ 
- **npm** or **yarn**
- **devkitARM** properly configured
- **libctru** installed

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd 3ds-asm-c-ide
```

2. Install dependencies:
```bash
npm install
```

3. Configure devkitARM:
```bash
export DEVKITARM=/path/to/devkitARM
export CTRULIB=$DEVKITARM/libctru
```

4. Start the IDE:
```bash
npm start
```

Or for development with hot reload:
```bash
npm run dev
```

## Usage

### Creating a New Project

1. **File → New Project**
2. Select a directory for your project
3. The IDE loads the project path

### Opening an Existing Project

1. **File → Open Project**
2. Navigate to your 3DS project folder
3. All files in the folder are available for editing

### Creating/Opening Files

- **File → New File** - Create a new blank file
- **File → Open File** - Open existing C, C++, or Assembly files
- Files appear as tabs in the editor

### Building Your Project

1. **Build → Build Project** (Ctrl+B)
   - Compiles all sources using devkitARM
   - Output appears in the console

2. **Build → Build & Run** (Ctrl+F5)
   - Builds and launches in emulator/console

3. **Build → Climate Build**
   - Removes all build artifacts

### Editing Code

- **Syntax highlighting** for C, C++, and Assembly
- **Tab management** for multiple files
- **Line numbers** and word wrap enabled by default
- **Find & Replace** (Ctrl+F / Ctrl+H)

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Project | Ctrl+Shift+N |
| Open Project | Ctrl+O |
| Open File | Ctrl+Alt+O |
| Save | Ctrl+S |
| Save As | Ctrl+Shift+S |
| Build | Ctrl+B |
| Build & Run | Ctrl+F5 |
| Find | Ctrl+F |
| Replace | Ctrl+H |
| Settings | Ctrl+, |
| Cut | Ctrl+X |
| Copy | Ctrl+C |
| Paste | Ctrl+V |
| Undo | Ctrl+Z |
| Redo | Ctrl+Y |

## Project Structure

```
3ds-asm-c-ide/
├── main.js                 # Electron main process
├── preload.js              # IPC communication bridge
├── package.json            # Dependencies
├── public/
│   └── index.html          # HTML entry point
└── src/
    ├── App.js              # Main React component
    ├── App.css             # Styling
    ├── index.js            # React DOM render
    ├── index.css           # Global styles
    └── components/
        ├── Editor.js       # Code editor
        ├── Editor.css
        ├── FileExplorer.js # Project files browser
        ├── FileExplorer.css
        ├── OutputConsole.js# Build output
        ├── OutputConsole.css
        ├── Properties.js   # File properties
        ├── Properties.css
        ├── Toolbar.js      # Top toolbar
        └── Toolbar.css
```

## Supported File Types

| Extension | Type | Description |
|-----------|------|-------------|
| .c | C Source | C language code |
| .cpp, .cc, .cxx | C++ Source | C++ language code |
| .s, .asm | Assembly | ARM assembly code |
| .h | Header | C/C++ header files |
| Makefile | Build | Build configuration |

## Build Configuration

### Debug Build
- Enables debug symbols
- Full error output
- No optimizations

### Release Build
- Optimized code
- Reduced binary size
- Minimal debug info

## devkitARM Integration

The IDE automatically:
- Detects devkitARM installation
- Runs make commands in project directory
- Parses compiler output
- Highlights errors in console
- Supports custom Makefiles

## Advanced Features

### Assembly Tools
- ARM v6K/v7A syntax highlighting
- Register highlighting
- Instruction validation
- Disassembler integration

### Code Tools
- Code formatter
- Syntax checker
- Automatic indentation
- Bracket matching

### Memory Tools
- Memory inspector
- Register viewer
- Stack trace visualization

## Troubleshooting

### devkitARM not found
```bash
# Ensure DEVKITARM is set
echo $DEVKITARM

# If empty, set it:
export DEVKITARM=/path/to/devkitARM
export CTRULIB=$DEVKITARM/libctru
```

### Build fails
1. Check **Output Console** for error messages
2. Verify Makefile syntax
3. Confirm all dependencies installed
4. Check **Tools → devkitARM Configuration**

### Editor not responding
- Reload IDE (Cmd+R / Ctrl+R)
- Check console for JavaScript errors (F12)
- Try closing and reopening file

## Development

### Building for Distribution

```bash
npm run build
npm run dist
```

Generates standalone executables for Windows, macOS, and Linux.

### Adding New Features

1. **Menu Items**: Edit `main.js` in createMenu()
2. **Components**: Create new file in `src/components/`
3. **IPC Handlers**: Add handler in `main.js` ipcMain.handle()
4. **Styling**: Use CSS modules or App.css

## References

- [devkitPro](https://devkitpro.org/)
- [libctru Documentation](https://github.com/devkitPro/libctru)
- [3DBrew](https://3dbrew.org/)
- [ARM Assembly Reference](https://developer.arm.com/documentation/dui0489/latest/)
- [Electron Documentation](https://www.electronjs.org/docs)

## License

MIT License - Free to use and modify

## Contributing

Contributions welcome! Please submit pull requests or open issues for bugs and feature requests.

## Author

3DS Dev Community

---

**Happy coding! 🎮**
