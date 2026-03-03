import React, { useState, useImperativeHandle, forwardRef } from 'react';
import './Editor.css';

const Editor = forwardRef(({ files, currentFile, setCurrentFile, setFiles }, ref) => {
  const [editorContent, setEditorContent] = useState('');
  const activeFile = files.find(f => f.id === currentFile);

  useImperativeHandle(ref, () => ({
    getValue: () => editorContent
  }));

  const handleContentChange = (e) => {
    const content = e.target.value;
    setEditorContent(content);
    
    // Mark file as unsaved
    setFiles(files.map(f => 
      f.id === currentFile ? { ...f, content, saved: false } : f
    ));
  };

  const handleCloseTab = (fileId) => {
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    
    if (currentFile === fileId && newFiles.length > 0) {
      setCurrentFile(newFiles[0].id);
      setEditorContent(newFiles[0].content || '');
    } else if (newFiles.length === 0) {
      setCurrentFile(null);
      setEditorContent('');
    }
  };

  const getFileIcon = (file) => {
    if (file.type === 'asm') return '📋';
    if (file.type === 'cpp') return '⚙️';
    return '📄';
  };

  const getSyntaxClass = (type) => {
    if (type === 'asm') return 'syntax-asm';
    if (type === 'cpp') return 'syntax-cpp';
    return 'syntax-c';
  };

  return (
    <div className="editor-container">
      <div className="editor-tabs">
        {files.map(file => (
          <div 
            key={file.id}
            className={`editor-tab ${currentFile === file.id ? 'active' : ''}`}
            onClick={() => {
              setCurrentFile(file.id);
              setEditorContent(file.content || '');
            }}
          >
            <span className="file-icon">{getFileIcon(file)}</span>
            {file.name}
            {!file.saved && <span>●</span>}
            <span 
              className="editor-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(file.id);
              }}
            >
              ✕
            </span>
          </div>
        ))}
      </div>

      <div className={`code-editor ${getSyntaxClass(activeFile?.type || 'c')}`}>
        {activeFile ? (
          <textarea
            className="editor-textarea"
            value={editorContent}
            onChange={handleContentChange}
            placeholder={`// ${activeFile.type.toUpperCase()} Editor`}
            spellCheck="false"
          />
        ) : (
          <div className="editor-empty">
            <p>Welcome to 3DS ASM/C IDE</p>
            <p>Create or open a file to start coding</p>
          </div>
        )}
      </div>
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
