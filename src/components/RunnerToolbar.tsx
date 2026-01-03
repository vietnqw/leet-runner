import React from 'react';

interface RunnerToolbarProps {
  methodName: string;
  onMethodNameChange: (name: string) => void;
  onRun: () => void;
  onStop: () => void;
  isRunning: boolean;
}

export const RunnerToolbar: React.FC<RunnerToolbarProps> = ({
  methodName,
  onMethodNameChange,
  onRun,
  onStop,
  isRunning
}) => {
  return (
    <div style={{
      padding: '8px',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: '#252526'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontSize: '10px', color: '#aaa' }}>Language</label>
        <select disabled style={{ background: '#333', color: '#fff', border: '1px solid #444' }}>
          <option>Python 3</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontSize: '10px', color: '#aaa' }}>Method</label>
        <input
          type="text"
          value={methodName}
          onChange={(e) => onMethodNameChange(e.target.value)}
          placeholder="e.g. solve"
          style={{
            background: '#3c3c3c',
            color: '#fff',
            border: '1px solid #444',
            padding: '2px 4px'
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={isRunning ? onStop : onRun}
        style={{
          background: isRunning ? '#d9534f' : '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '5px 15px',
          cursor: 'pointer',
          borderRadius: '3px'
        }}
      >
        {isRunning ? 'Stop' : 'Run'}
      </button>
    </div>
  );
};

