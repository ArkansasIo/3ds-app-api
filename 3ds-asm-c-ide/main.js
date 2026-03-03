const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');

try {
  const tempBase = process.env.TEMP || process.env.TMP || __dirname;
  const customUserData = path.join(tempBase, '3ds-asm-c-ide-userdata');
  fs.mkdirSync(customUserData, { recursive: true });
  app.setPath('userData', customUserData);
  app.commandLine.appendSwitch('user-data-dir', customUserData);
} catch (e) {
}

// Check if running in development
const isDev = require('electron-is-dev');

// Use Store for configuration management
let Store;
try {
  Store = require('electron-store');
} catch (e) {
  // Fallback if electron-store not available
  Store = class { 
    get(key) { return undefined; } 
    set(key, val) {} 
  };
}

const store = new Store();
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  const devServerUrl = process.env.ELECTRON_START_URL;
  const startURL = devServerUrl || `file://${path.join(__dirname, 'build/index.html')}`;

  mainWindow.loadURL(startURL);

  if (isDev && devServerUrl) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => mainWindow.webContents.send('file:new-project')
        },
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('file:open-project')
        },
        { type: 'separator' },
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('file:new')
        },
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+Alt+O',
          click: () => mainWindow.webContents.send('file:open')
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('file:save')
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('file:save-as')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => mainWindow.webContents.send('edit:undo')
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Y',
          click: () => mainWindow.webContents.send('edit:redo')
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          click: () => mainWindow.webContents.send('edit:cut')
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          click: () => mainWindow.webContents.send('edit:copy')
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          click: () => mainWindow.webContents.send('edit:paste')
        },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => mainWindow.webContents.send('edit:find')
        },
        {
          label: 'Replace',
          accelerator: 'CmdOrCtrl+H',
          click: () => mainWindow.webContents.send('edit:replace')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'File Browser',
          click: () => mainWindow.webContents.send('view:toggle-files')
        },
        {
          label: 'Output Console',
          click: () => mainWindow.webContents.send('view:toggle-console')
        },
        {
          label: 'Properties',
          click: () => mainWindow.webContents.send('view:toggle-properties')
        },
        { type: 'separator' },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => mainWindow.webContents.send('view:zoom-in')
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+Minus',
          click: () => mainWindow.webContents.send('view:zoom-out')
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.send('view:zoom-reset')
        }
      ]
    },
    {
      label: 'Build',
      submenu: [
        {
          label: 'Build Project',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow.webContents.send('build:compile')
        },
        {
          label: 'Clean Build',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => mainWindow.webContents.send('build:clean')
        },
        {
          label: 'Build & Run',
          accelerator: 'CmdOrCtrl+F5',
          click: () => mainWindow.webContents.send('build:run')
        },
        { type: 'separator' },
        {
          label: 'Set Build Configuration',
          submenu: [
            {
              label: 'Debug',
              click: () => mainWindow.webContents.send('build:config', 'debug')
            },
            {
              label: 'Release',
              click: () => mainWindow.webContents.send('build:config', 'release')
            }
          ]
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow.webContents.send('tools:settings')
        },
        {
          label: 'devkitARM Configuration',
          click: () => mainWindow.webContents.send('tools:devkit-config')
        },
        { type: 'separator' },
        {
          label: 'Assembly Syntax Highlighter',
          click: () => mainWindow.webContents.send('tools:asm-highlighter')
        },
        {
          label: 'Code Formatter',
          click: () => mainWindow.webContents.send('tools:formatter')
        },
        {
          label: 'Disassembler',
          click: () => mainWindow.webContents.send('tools:disasm')
        },
        {
          label: 'Memory Inspector',
          click: () => mainWindow.webContents.send('tools:memory')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://3dbrew.org/')
        },
        {
          label: 'devkitARM Guide',
          click: () => shell.openExternal('https://devkitpro.org/')
        },
        {
          label: 'About',
          click: () => mainWindow.webContents.send('help:about')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Assembly', extensions: ['s', 'asm'] },
      { name: 'C Files', extensions: ['c'] },
      { name: 'C++ Files', extensions: ['cpp', 'cc', 'cxx'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePaths;
});

ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths;
});

// File operations
ipcMain.handle('file:read', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file:write', async (event, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file:list', async (event, dirPath) => {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = items.map(item => ({
      name: item.name,
      isDirectory: item.isDirectory(),
      path: path.join(dirPath, item.name)
    }));
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('dialog:saveFile', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result.filePath;
});

// Project operations
ipcMain.handle('project:create', async (event, { projectPath, projectName }) => {
  try {
    const templatePath = path.join(__dirname, '..', '3ds-homebrew-template');
    const newProjectPath = path.join(projectPath, projectName);
    
    // Create project directory
    fs.mkdirSync(newProjectPath, { recursive: true });
    
    // Copy template files
    copyDir(templatePath, newProjectPath);
    
    // Update Makefile with project name
    const makefilePath = path.join(newProjectPath, 'Makefile');
    if (fs.existsSync(makefilePath)) {
      let makefileContent = fs.readFileSync(makefilePath, 'utf-8');
      makefileContent = makefileContent.replace(/TARGET\s*:=.*/, `TARGET\t\t:=\t${projectName}`);
      fs.writeFileSync(makefilePath, makefileContent, 'utf-8');
    }
    
    return { success: true, path: newProjectPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project:build', async (event, projectPath) => {
  try {
    const output = [];
    
    return new Promise((resolve) => {
      const makeProcess = spawn('make', [], {
        cwd: projectPath,
        shell: true
      });
      
      makeProcess.stdout.on('data', (data) => {
        output.push(data.toString());
        mainWindow.webContents.send('build:output', data.toString());
      });
      
      makeProcess.stderr.on('data', (data) => {
        output.push(data.toString());
        mainWindow.webContents.send('build:output', data.toString());
      });
      
      makeProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output: output.join('') });
        } else {
          resolve({ success: false, error: 'Build failed with code ' + code, output: output.join('') });
        }
      });
      
      makeProcess.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project:clean', async (event, projectPath) => {
  try {
    const { stdout, stderr } = await execPromise('make clean', { cwd: projectPath });
    return { success: true, output: stdout + stderr };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project:deploy', async (event, { projectPath, ip }) => {
  try {
    // Find the .3dsx file
    const files = fs.readdirSync(projectPath);
    const dsxFile = files.find(f => f.endsWith('.3dsx'));
    
    if (!dsxFile) {
      return { success: false, error: 'No .3dsx file found. Build the project first.' };
    }
    
    const filePath = path.join(projectPath, dsxFile);
    
    // Deploy using 3dslink if available
    if (ip) {
      const { stdout, stderr } = await execPromise(`3dslink "${filePath}" -a ${ip}`, { cwd: projectPath });
      return { success: true, output: stdout + stderr };
    } else {
      return { 
        success: false, 
        error: 'Please provide 3DS IP address. Or copy ' + dsxFile + ' to SD card manually.' 
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('shell:openExternal', async (event, url) => {
  await shell.openExternal(url);
  return { success: true };
});

// Helper function to copy directories recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
