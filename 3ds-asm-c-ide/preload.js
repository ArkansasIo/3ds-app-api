const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    once: (channel, func) => {
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    },
    invoke: (channel, data) => {
      return ipcRenderer.invoke(channel, data);
    }
  },
  dialogAPI: {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options)
  },
  fileAPI: {
    readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('file:write', { filePath, content }),
    listFiles: (dirPath) => ipcRenderer.invoke('file:list', dirPath),
    createProject: (projectPath, projectName) => ipcRenderer.invoke('project:create', { projectPath, projectName }),
    buildProject: (projectPath) => ipcRenderer.invoke('project:build', projectPath),
    cleanProject: (projectPath) => ipcRenderer.invoke('project:clean', projectPath),
    deployTo3DS: (projectPath, ip) => ipcRenderer.invoke('project:deploy', { projectPath, ip })
  },
  shell: {
    openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url)
  }
});
