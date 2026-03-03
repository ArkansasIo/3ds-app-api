import React from 'react';
import './Toolbar.css';

const Toolbar = ({ projectPath, onGitHub }) => {
  
  const handleDeploy = () => {
    if (window.electron) {
      window.electron.ipcRenderer.send('build:run');
    }
  };
  
  return (
    <div className="toolbar">
      <button title="New Project (Ctrl+Shift+N)">📁 New</button>
      <button title="Open Project (Ctrl+O)">📂 Open</button>
      <button title="Save (Ctrl+S)">💾 Save</button>
      
      <div className="toolbar-separator"></div>
      
      <button title="Build (Ctrl+B)">🔨 Build</button>
      <button title="Run (Ctrl+F5)" onClick={handleDeploy}>▶️ Run</button>
      <button title="Deploy to 3DS" onClick={handleDeploy}>📤 Deploy</button>
      <button title="Clean">🧹 Clean</button>
      
      <div className="toolbar-separator"></div>
      
      <button title="Find (Ctrl+F)">🔍 Find</button>
      <button title="Settings (Ctrl+,)">⚙️ Settings</button>
      
      <div className="project-indicator">
        {projectPath ? `📍 ${projectPath.split(/[/\\]/).pop()}` : 'No project'}
      </div>
    </div>
  );
};

export default Toolbar;
