import React from 'react';
import './FileExplorer.css';

const FileExplorer = ({ files, currentFile, onSelectFile, projectPath }) => {
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.s') || fileName.endsWith('.asm')) return '📋';
    if (fileName.endsWith('.cpp') || fileName.endsWith('.cc')) return '⚙️';
    if (fileName.endsWith('.c')) return '📄';
    if (fileName.endsWith('.h')) return '📑';
    if (fileName === 'Makefile') return '🔨';
    return '📝';
  };

  return (
    <div className="file-explorer">
      {projectPath && (
        <div className="project-info">
          📁 {projectPath.split('\\').pop()}
        </div>
      )}
      
      <ul className="file-tree">
        {files.length === 0 ? (
          <li className="no-files">No files open</li>
        ) : (
          files.map(file => (
            <li
              key={file.id}
              className={`file-item ${currentFile === file.id ? 'active' : ''}`}
              onClick={() => onSelectFile(file.id)}
            >
              <span className="file-icon">{getFileIcon(file.name)}</span>
              <span className="file-name">{file.name}</span>
              {!file.saved && <span className="unsaved-dot">●</span>}
            </li>
          ))
        )}
      </ul>

      <div className="file-tree-info">
        <p>Supported Files:</p>
        <ul>
          <li>C: *.c</li>
          <li>C++: *.cpp</li>
          <li>ASM: *.s, *.asm</li>
          <li>Headers: *.h</li>
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
