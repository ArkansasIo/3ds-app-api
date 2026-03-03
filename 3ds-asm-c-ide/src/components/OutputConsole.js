import React from 'react';
import './OutputConsole.css';

const OutputConsole = ({ messages = [] }) => {
  const getMessageClass = (message) => {
    if (message.includes('error')) return 'error';
    if (message.includes('warning')) return 'warning';
    if (message.includes('✓') || message.includes('complete')) return 'success';
    if (message.startsWith('>')) return 'command';
    return 'info';
  };

  return (
    <div className="output-console">
      {messages.length === 0 ? (
        <div className="console-empty">Ready</div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`output-line ${getMessageClass(message)}`}
          >
            {message}
          </div>
        ))
      )}
    </div>
  );
};

export default OutputConsole;
