import React, { useState } from 'react';
import { TestCase } from '../types';

interface TestCasesPanelProps {
  testCases: TestCase[];
  onChange: (cases: TestCase[]) => void;
}

export const TestCasesPanel: React.FC<TestCasesPanelProps> = ({
  testCases,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleAddCase = () => {
    const newCase: TestCase = {
      id: crypto.randomUUID(),
      args: '',
      expected: ''
    };
    onChange([...testCases, newCase]);
    setActiveTab(testCases.length); // Switch to new tab
  };

  const handleRemoveCase = (index: number) => {
    const newCases = testCases.filter((_, i) => i !== index);
    onChange(newCases);
    if (activeTab >= newCases.length) {
      setActiveTab(Math.max(0, newCases.length - 1));
    }
  };

  const updateCase = (index: number, updates: Partial<TestCase>) => {
    const newCases = [...testCases];
    newCases[index] = { ...newCases[index], ...updates };
    onChange(newCases);
  };

  if (testCases.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button onClick={handleAddCase} style={btnStyle}>+ Add Test Case</button>
      </div>
    );
  }

  const activeCase = testCases[activeTab];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginBottom: '10px' }}>
        {testCases.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              ...tabStyle,
              backgroundColor: activeTab === index ? '#3c3c3c' : '#252526',
              borderBottom: activeTab === index ? '2px solid #007acc' : '2px solid transparent'
            }}
          >
            Case {index + 1}
          </button>
        ))}
        <button onClick={handleAddCase} style={{ ...tabStyle, fontWeight: 'bold' }}>+</button>
      </div>

      {/* Content */}
      {activeCase && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
             <button
                onClick={() => handleRemoveCase(activeTab)}
                style={{ ...btnStyle, background: '#d9534f', fontSize: '12px', padding: '2px 8px' }}
             >
               Delete Case
             </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={labelStyle}>Args (JSON, one per line)</label>
            <textarea
              value={activeCase.args}
              onChange={(e) => updateCase(activeTab, { args: e.target.value })}
              style={textareaStyle}
              placeholder={'[-1, 0, 1]\n3'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={labelStyle}>Expected Output</label>
            <textarea
              value={activeCase.expected}
              onChange={(e) => updateCase(activeTab, { expected: e.target.value })}
              style={textareaStyle}
              placeholder={'[[-1, 0, 1]]'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const tabStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#ccc',
  cursor: 'pointer',
  padding: '5px 10px',
  whiteSpace: 'nowrap'
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#aaa',
  marginBottom: '4px'
};

const textareaStyle: React.CSSProperties = {
  background: '#1e1e1e',
  color: '#d4d4d4',
  border: '1px solid #3c3c3c',
  padding: '8px',
  fontFamily: 'monospace',
  flex: 1,
  resize: 'none'
};

const btnStyle: React.CSSProperties = {
  background: '#3c3c3c',
  color: 'white',
  border: '1px solid #555',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '3px'
};

