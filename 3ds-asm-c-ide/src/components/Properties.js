import React from 'react';
import './Properties.css';

const Properties = ({ currentFile }) => {
  if (!currentFile) {
    return (
      <div className="properties-panel-content">
        <div className="no-properties">No file selected</div>
      </div>
    );
  }

  const getFileType = (type) => {
    const types = {
      'c': 'C Source File',
      'cpp': 'C++ Source File',
      'asm': 'ARM Assembly',
      'h': 'Header File'
    };
    return types[type] || type;
  };

  return (
    <div className="properties-panel-content">
      <div className="property-group">
        <div className="property-label">File Name</div>
        <div className="property-value">{currentFile.name}</div>
      </div>

      <div className="property-group">
        <div className="property-label">File Type</div>
        <div className="property-value">{getFileType(currentFile.type)}</div>
      </div>

      <div className="property-group">
        <div className="property-label">Status</div>
        <div className="property-value">
          {currentFile.saved ? '✓ Saved' : '◉ Modified'}
        </div>
      </div>

      {currentFile.path && (
        <div className="property-group">
          <div className="property-label">Path</div>
          <div className="property-value property-path">{currentFile.path}</div>
        </div>
      )}

      <div className="property-group">
        <div className="property-label">Editor Settings</div>
        <div className="property-options">
          <label>
            <input type="checkbox" defaultChecked /> Line Numbers
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Word Wrap
          </label>
          <label>
            <input type="checkbox" defaultChecked /> Syntax Highlight
          </label>
        </div>
      </div>

      {currentFile.type === 'asm' && (
        <div className="property-group">
          <div className="property-label">Assembly</div>
          <div className="property-options">
            <label>
              <input type="radio" name="asm-arch" defaultChecked /> ARM v6K
            </label>
            <label>
              <input type="radio" name="asm-arch" /> ARM v7A
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
