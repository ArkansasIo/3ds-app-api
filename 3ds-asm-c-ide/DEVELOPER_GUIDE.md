# Developer Guide - Extending the IDE

This guide explains how to add new features to the 3DS ASM/C IDE.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Electron Main Process           │
│         (main.js)                       │
│  - Menu creation & IPC                  │
│  - File dialogs                         │
│  - App lifecycle                        │
└─────────────────────────────────────────┘
            ↕ (IPC Communication)
┌─────────────────────────────────────────┐
│          Preload Bridge                 │
│         (preload.js)                    │
│  - Safe context isolation               │
│  - API exposure                         │
└─────────────────────────────────────────┘
            ↕
┌─────────────────────────────────────────┐
│        React Renderer Process           │
│       (src/App.js + Components)         │
│  - UI rendering                         │
│  - State management                     │
│  - User interactions                    │
└─────────────────────────────────────────┘
```

## Adding a Menu Item

### 1. Edit `main.js` - createMenu()

```javascript
{
  label: 'My Feature',
  submenu: [
    {
      label: 'Do Something',
      accelerator: 'CmdOrCtrl+Alt+X',
      click: () => mainWindow.webContents.send('feature:do-something')
    }
  ]
}
```

### 2. Handle in React (`src/App.js`)

```javascript
useEffect(() => {
  window.electron.ipcRenderer.on('feature:do-something', handleFeature);
}, []);

const handleFeature = () => {
  console.log('Feature called!');
  setBuildOutput(['Feature executed']);
};
```

## Adding a New Tool

### 1. Create Component

File: `src/components/MyTool.js`

```javascript
import React from 'react';
import './MyTool.css';

const MyTool = ({ data }) => {
  return (
    <div className="my-tool">
      <h3>My Tool</h3>
      {/* Your tool UI */}
    </div>
  );
};

export default MyTool;
```

### 2. Add Styling

File: `src/components/MyTool.css`

```css
.my-tool {
  padding: 12px;
  font-size: 12px;
  color: #d4d4d4;
}
```

### 3. Integrate into App

`src/App.js`:

```javascript
import MyTool from './components/MyTool';

{showMyTool && (
  <div className="panel">
    <div className="panel-header">My Tool</div>
    <MyTool data={toolData} />
  </div>
)}
```

## Adding Language Support

### For Syntax Highlighting

1. Update `Editor.js` to detect file type:
```javascript
const getSyntaxClass = (type) => {
  if (type === 'rust') return 'syntax-rust';
  // ...
};
```

2. Add file type detection in `FileExplorer.js`:
```javascript
const getFileIcon = (fileName) => {
  if (fileName.endsWith('.rs')) return '🦀';
  // ...
};
```

3. Update supported extensions in `main.js`:
```javascript
filters: [
  { name: 'Rust', extensions: ['rs'] },
  // ...
]
```

## Integrating Build Tools

### Using devkitARM Compiler

Create a build handler in `main.js`:

```javascript
ipcMain.handle('build:compile', async () => {
  const { exec } = require('child_process');
  return new Promise((resolve, reject) => {
    exec('make', (error, stdout, stderr) => {
      if (error) reject(stderr);
      else resolve(stdout);
    });
  });
});
```

In `App.js`:

```javascript
const handleBuild = async () => {
  try {
    const output = await window.electron.ipcRenderer.invoke('build:compile');
    setBuildOutput(output.split('\n'));
  } catch (error) {
    setBuildOutput([`Build error: ${error}`]);
  }
};
```

## State Management

Current implementation uses React hooks. For complex state, consider:

### Option 1: Context API
```javascript
import { createContext, useState } from 'react';

const IDEContext = createContext();

export const IDEProvider = ({ children }) => {
  const [state, setState] = useState({});
  
  return (
    <IDEContext.Provider value={{ state, setState }}>
      {children}
    </IDEContext.Provider>
  );
};
```

### Option 2: Redux
```bash
npm install redux react-redux redux-thunk
```

## Adding Keyboard Shortcuts

In `main.js`:

```javascript
{
  label: 'My Command',
  accelerator: 'CmdOrCtrl+Alt+K',
  click: () => mainWindow.webContents.send('my:command')
}
```

In `App.js`:

```javascript
useEffect(() => {
  window.electron.ipcRenderer.on('my:command', handleMyCommand);
}, []);
```

## File I/O Operations

### Reading Files

```javascript
// In preload.js
contextBridge.exposeInMainWorld('electronFS', {
  readFile: (path) => ipcRenderer.invoke('fs:read', path)
});

// In main.js
const fs = require('fs').promises;

ipcMain.handle('fs:read', async (event, filepath) => {
  try {
    return await fs.readFile(filepath, 'utf-8');
  } catch (error) {
    throw error;
  }
});

// In React
const content = await window.electronFS.readFile('/path/to/file');
```

### Writing Files

```javascript
ipcMain.handle('fs:write', async (event, filepath, content) => {
  try {
    await fs.writeFile(filepath, content, 'utf-8');
    return true;
  } catch (error) {
    throw error;
  }
});
```

## Custom Themes

Create `src/themes.css`:

```css
/* Dark Theme (default) */
:root {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d30;
  --text-primary: #d4d4d4;
  --accent: #007acc;
}

/* Light Theme */
body.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f3f3;
  --text-primary: #333333;
  --accent: #0078d4;
}
```

## Debugging

### Enable DevTools
```javascript
// In main.js createWindow()
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

### IPC Debugging
```javascript
// In preload.js
contextBridge.exposeInMainWorld('debugIPC', {
  log: (channel, data) => console.log(`IPC: ${channel}`, data)
});
```

## Performance Tips

1. **Lazy Load Components**: Use React.lazy() for heavy components
2. **Memoize**: Use React.memo() for expensive renders
3. **Debounce**: Debounce file save and search operations
4. **Virtual Scroll**: For large file lists, implement virtual scrolling

## Testing

### Unit Tests
```bash
npm install jest @testing-library/react
```

`src/components/Editor.test.js`:
```javascript
import { render } from '@testing-library/react';
import Editor from './Editor';

test('renders editor tabs', () => {
  const { getByText } = render(<Editor files={[]} />);
  expect(getByText('New File')).toBeInTheDocument();
});
```

### End-to-End Tests
```bash
npm install spectron
```

## Distribution

### Build for Windows
```bash
npm run electron-builder -- --win
```

### Build for macOS
```bash
npm run electron-builder -- --mac
```

### Build for Linux
```bash
npm run electron-builder -- --linux
```

## Common Patterns

### Opening a Dialog
```javascript
const result = await window.electron.dialogAPI.openFile();
if (result && result.length > 0) {
  // Handle selected file
}
```

### Sending Build Output
```javascript
setBuildOutput(prev => [...prev, 'New message']);
```

### Showing File in Explorer
```javascript
const { shell } = require('electron');
shell.showItemInFolder(filePath);
```

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev/)
- [Node.js fs Module](https://nodejs.org/api/fs.html)
- [MDN Web Docs](https://developer.mozilla.org/)

---

Happy hacking! 🚀
