import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Editor from './components/Editor';
import FileExplorer from './components/FileExplorer';
import OutputConsole from './components/OutputConsole';
import Properties from './components/Properties';
import Toolbar from './components/Toolbar';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [projectPath, setProjectPath] = useState(null);
  const [buildOutput, setBuildOutput] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    // Setup IPC listeners
    if (window.electron) {
      window.electron.ipcRenderer.on('file:new-project', handleNewProject);
      window.electron.ipcRenderer.on('file:open-project', handleOpenProject);
      window.electron.ipcRenderer.on('file:new', handleNewFile);
      window.electron.ipcRenderer.on('file:open', handleOpenFile);
      window.electron.ipcRenderer.on('file:save', handleSave);
      window.electron.ipcRenderer.on('view:toggle-files', () => setShowFileExplorer(!showFileExplorer));
      window.electron.ipcRenderer.on('view:toggle-console', () => setShowConsole(!showConsole));
      window.electron.ipcRenderer.on('view:toggle-properties', () => setShowProperties(!showProperties));
      window.electron.ipcRenderer.on('build:compile', handleBuild);
      window.electron.ipcRenderer.on('build:clean', handleClean);
      window.electron.ipcRenderer.on('build:run', handleDeploy);
      window.electron.ipcRenderer.on('tools:settings', handleSettings);
      window.electron.ipcRenderer.on('build:output', (output) => {
        setBuildOutput(prev => [...prev, output]);
      });
    }
  }, [showFileExplorer, showConsole, showProperties]);

  const handleNewProject = async () => {
    const dir = await window.electron.dialogAPI.openDirectory();
    if (dir && dir.length > 0) {
      const projectName = prompt('Enter project name:', 'My3DSApp');
      if (projectName) {
        const result = await window.electron.fileAPI.createProject(dir[0], projectName);
        if (result.success) {
          setProjectPath(result.path);
          loadProjectFiles(result.path);
          setBuildOutput(['✓ Project created: ' + result.path]);
        } else {
          setBuildOutput(['✗ Error creating project: ' + result.error]);
        }
      }
    }
  };

  const handleOpenProject = async () => {
    const dir = await window.electron.dialogAPI.openDirectory();
    if (dir && dir.length > 0) {
      setProjectPath(dir[0]);
      loadProjectFiles(dir[0]);
      setBuildOutput(['✓ Project loaded: ' + dir[0]]);
    }
  };

  const loadProjectFiles = async (dirPath) => {
    const result = await window.electron.fileAPI.listFiles(dirPath);
    if (result.success) {
      const loadedFiles = [];
      for (const file of result.files) {
        if (!file.isDirectory && (file.name.endsWith('.c') || file.name.endsWith('.cpp') || 
            file.name.endsWith('.h') || file.name.endsWith('.s') || file.name.endsWith('.asm'))) {
          const fileResult = await window.electron.fileAPI.readFile(file.path);
          if (fileResult.success) {
            const type = file.name.endsWith('.s') || file.name.endsWith('.asm') ? 'asm' : 
                        file.name.endsWith('.cpp') ? 'cpp' : 
                        file.name.endsWith('.h') ? 'h' : 'c';
            loadedFiles.push({
              id: Date.now() + Math.random(),
              name: file.name,
              path: file.path,
              content: fileResult.content,
              type: type,
              saved: true
            });
          }
        }
      }
      setFiles(loadedFiles);
      if (loadedFiles.length > 0) {
        setCurrentFile(loadedFiles[0].id);
      }
    }
  };

  const handleNewFile = () => {
    const newFile = {
      id: Date.now(),
      name: 'Untitled',
      content: '',
      type: 'c',
      saved: false
    };
    setFiles([...files, newFile]);
    setCurrentFile(newFile.id);
  };

  const handleOpenFile = async () => {
    const filePaths = await window.electron.dialogAPI.openFile();
    if (filePaths && filePaths.length > 0) {
      const filePath = filePaths[0];
      const fileName = filePath.split(/[/\\]/).pop();
      
      const fileResult = await window.electron.fileAPI.readFile(filePath);
      if (fileResult.success) {
        const type = fileName.endsWith('.s') || fileName.endsWith('.asm') ? 'asm' : 
                     fileName.endsWith('.cpp') ? 'cpp' : 
                     fileName.endsWith('.h') ? 'h' : 'c';
        
        const newFile = {
          id: Date.now(),
          name: fileName,
          path: filePath,
          content: fileResult.content,
          type: type,
          saved: true
        };
        setFiles([...files, newFile]);
        setCurrentFile(newFile.id);
        setBuildOutput(['✓ File opened: ' + fileName]);
      } else {
        setBuildOutput(['✗ Error reading file: ' + fileResult.error]);
      }
    }
  };

  const handleSave = async () => {
    if (currentFile && editorRef.current) {
      const content = editorRef.current.getValue();
      const file = files.find(f => f.id === currentFile);
      
      if (file && file.path) {
        const result = await window.electron.fileAPI.writeFile(file.path, content);
        if (result.success) {
          setFiles(files.map(f => f.id === currentFile ? { ...f, content, saved: true } : f));
          setBuildOutput(['✓ File saved: ' + file.name]);
        } else {
          setBuildOutput(['✗ Error saving file: ' + result.error]);
        }
      } else {
        // Save As for new files
        const saveFilePath = await window.electron.dialogAPI.saveFile({
          title: 'Save File',
          defaultPath: file?.name || 'untitled.c',
          filters: [
            { name: 'C Files', extensions: ['c'] },
            { name: 'C++ Files', extensions: ['cpp'] },
            { name: 'Header Files', extensions: ['h'] },
            { name: 'Assembly', extensions: ['s', 'asm'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });
        
        if (saveFilePath) {
          const result = await window.electron.fileAPI.writeFile(saveFilePath, content);
          if (result.success) {
            const fileName = saveFilePath.split(/[/\\]/).pop();
            setFiles(files.map(f => f.id === currentFile ? 
              { ...f, name: fileName, path: saveFilePath, content, saved: true } : f));
            setBuildOutput(['✓ File saved: ' + fileName]);
          } else {
            setBuildOutput(['✗ Error saving file: ' + result.error]);
          }
        }
      }
    }
  };

  const handleBuild = async () => {
    if (!projectPath) {
      setBuildOutput(['✗ No project loaded. Open or create a project first.']);
      return;
    }
    
    setBuildOutput(['> Building project...']);
    
    const result = await window.electron.fileAPI.buildProject(projectPath);
    if (result.success) {
      setBuildOutput([
        '> Building project...',
        result.output,
        '✓ Build complete!'
      ]);
    } else {
      setBuildOutput([
        '> Building project...',
        result.output || '',
        '✗ Build failed: ' + result.error
      ]);
    }
  };

  const handleClean = async () => {
    if (!projectPath) {
      setBuildOutput(['✗ No project loaded.']);
      return;
    }
    
    setBuildOutput(['> Cleaning build directory...']);
    const result = await window.electron.fileAPI.cleanProject(projectPath);
    if (result.success) {
      setBuildOutput(['> Cleaning build directory...', result.output, '✓ Done!']);
    } else {
      setBuildOutput(['✗ Clean failed: ' + result.error]);
    }
  };

  const handleDeploy = async () => {
    if (!projectPath) {
      setBuildOutput(['✗ No project loaded.']);
      return;
    }
    
    const ip = prompt('Enter your 3DS IP address (or leave blank to skip network deploy):', '192.168.1.100');
    
    if (ip === null) return; // User cancelled
    
    setBuildOutput(['> Deploying to 3DS XL...']);
    const result = await window.electron.fileAPI.deployTo3DS(projectPath, ip);
    
    if (result.success) {
      setBuildOutput([
        '> Deploying to 3DS XL...',
        result.output,
        '✓ Deployed successfully!',
        '> Launch the Homebrew Launcher on your 3DS to run the app.'
      ]);
    } else {
      setBuildOutput([
        '> Deployment failed.',
        result.error,
        '> You can manually copy the .3dsx file to your SD card:',
        '  SD:/3ds/[YourAppName]/[YourAppName].3dsx'
      ]);
    }
  };

  const handleSettings = () => {
    alert('Settings dialog not yet implemented');
  };

  return (
    <div className="ide-container">
      <Toolbar 
        projectPath={projectPath}
        onGitHub={() => window.electron.shell?.openExternal('https://github.com')}
      />
      
      <div className="ide-main">
        {showFileExplorer && (
          <div className="panel left-panel">
            <div className="panel-header">Files</div>
            <FileExplorer 
              files={files}
              currentFile={currentFile}
              onSelectFile={setCurrentFile}
              projectPath={projectPath}
            />
          </div>
        )}
        
        <div className="editor-panel">
          <Editor 
            ref={editorRef}
            files={files}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            setFiles={setFiles}
          />
        </div>

        <div className="right-panels">
          {showProperties && (
            <div className="panel properties-panel">
              <div className="panel-header">Properties</div>
              <Properties currentFile={files.find(f => f.id === currentFile)} />
            </div>
          )}
          
          {showConsole && (
            <div className="panel bottom-panel">
              <div className="panel-header">Output</div>
              <OutputConsole messages={buildOutput} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
