import React, { useState } from 'react';
import type { TestCase, TestResult } from '../types';

interface TestCasesPanelProps {
  testCases: TestCase[];
  onChange: (cases: TestCase[]) => void;
  results: Record<string, TestResult>;
}

export const TestCasesPanel: React.FC<TestCasesPanelProps> = ({
  testCases,
  onChange,
  results
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const lineCount = (s: string) => Math.max(1, s.split('\n').length);

  const handleAddCase = () => {
    const newCase: TestCase = {
      id: crypto.randomUUID(),
      args: '',
      expected: ''
    };
    onChange([...testCases, newCase]);
    setActiveTab(testCases.length);
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
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
          No test cases
        </div>
        <button onClick={handleAddCase} style={{
          background: '#2a2a2a',
          color: '#ccc',
          border: '1px solid #333',
          padding: '8px 20px',
          fontSize: '13px',
          fontWeight: '500',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#333';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#2a2a2a';
          e.currentTarget.style.color = '#ccc';
        }}
        >
          + Add Test Case
        </button>
      </div>
    );
  }

  const activeCase = testCases[activeTab];
  const result = results[activeCase?.id];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        overflowX: 'auto',
        overflowY: 'visible',
        paddingTop: '10px',
        paddingBottom: '12px',
        borderBottom: '1px solid #2a2a2a'
      }}>
        {testCases.map((tc, index) => {
          const tcResult = results[tc.id];
          const isPassed = tcResult && tcResult.passed && !tcResult.error;
          const isFailed = tcResult && (!tcResult.passed || tcResult.error);
          
          // Determine tab color
          let tabColor = '#888'; // default
          if (isPassed) tabColor = '#4CAF50';
          if (isFailed) tabColor = '#ef5350';
          if (activeTab === index && !isPassed && !isFailed) tabColor = '#fff';
          
          return (
            <div
              key={index}
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setHoveredTab(index)}
              onMouseLeave={() => setHoveredTab((prev) => (prev === index ? null : prev))}
            >
              {/* Floating close icon: top-left, slightly above the tab */}
              <span
                role="button"
                aria-label={`Remove case ${index + 1}`}
                title="Remove"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveCase(index);
                }}
                style={{
                  position: 'absolute',
                  top: '-9px',
                  right: '-7px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  lineHeight: 1,
                  color: '#b8b8b8',
                  background: '#141414',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  zIndex: 2,
                  opacity: hoveredTab === index ? 1 : 0,
                  transform: hoveredTab === index ? 'translateY(0px)' : 'translateY(2px)',
                  pointerEvents: hoveredTab === index ? 'auto' : 'none',
                  cursor: 'pointer',
                  transition:
                    'opacity 140ms ease, transform 140ms ease, color 140ms ease, background 140ms ease, border-color 140ms ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.color = '#ef5350';
                  el.style.background = '#101010';
                  el.style.borderColor = 'rgba(239, 83, 80, 0.55)';
                  el.style.transform = 'translateY(0px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.color = '#b8b8b8';
                  el.style.background = '#141414';
                  el.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                  el.style.transform = 'translateY(0px)';
                }}
              >
                ×
              </span>

              <button
                onClick={() => setActiveTab(index)}
                style={{
                  background: activeTab === index ? '#2a2a2a' : 'transparent',
                  border: 'none',
                  color: tabColor,
                  cursor: 'pointer',
                  padding: '8px 14px',
                  whiteSpace: 'nowrap',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== index && !isPassed && !isFailed) {
                    e.currentTarget.style.background = '#222';
                    e.currentTarget.style.color = '#aaa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== index && !isPassed && !isFailed) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#888';
                  }
                }}
              >
                Case {index + 1}
              </button>
            </div>
          );
        })}
        <button 
          onClick={handleAddCase} 
          style={{ 
            background: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#222';
            e.currentTarget.style.color = '#999';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#666';
          }}
        >
          +
        </button>
      </div>

      {/* Content */}
      {activeCase && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
          {/* Input Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Input</label>
            <textarea
              value={activeCase.args}
              onChange={(e) => updateCase(activeTab, { args: e.target.value })}
              rows={lineCount(activeCase.args)}
              style={textareaStyle}
              placeholder={'[-1, 0, 1, 2, -1, -4]'}
            />
          </div>

          {/* Expected Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Expected</label>
            <textarea
              value={activeCase.expected}
              onChange={(e) => updateCase(activeTab, { expected: e.target.value })}
              rows={lineCount(activeCase.expected)}
              style={textareaStyle}
              placeholder={'[[-1,-1,2],[-1,0,1]]'}
            />
          </div>

          {/* Results Section - Only show after run */}
          {result && (
            <>
              {/* Stdout */}
              {result.output && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Stdout</label>
                  <div style={{
                    ...outputBoxStyle,
                    background: '#0d0d0d',
                    border: '1px solid #2a2a2a',
                  }}>
                    {result.output}
                  </div>
                </div>
              )}

              {/* Output */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={labelStyle}>Output</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {result.executionTime !== undefined && (
                      <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                        {result.executionTime.toFixed(2)}ms
                      </span>
                    )}
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: result.passed && !result.error ? '#4CAF50' : '#ef5350',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: result.passed && !result.error ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                    }}>
                      {result.error ? 'ERROR' : (result.passed ? 'PASS' : 'FAIL')}
                    </span>
                  </div>
                </div>
                <div style={{
                  ...outputBoxStyle,
                  background: result.error ? 'rgba(239, 83, 80, 0.05)' : (result.passed ? 'rgba(76, 175, 80, 0.05)' : 'rgba(239, 83, 80, 0.05)'),
                  border: `1px solid ${result.error ? 'rgba(239, 83, 80, 0.2)' : (result.passed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 83, 80, 0.2)')}`,
                  color: result.error ? '#ef5350' : (result.passed ? '#4CAF50' : '#ef5350')
                }}>
                  {result.error || result.actual || '(empty)'}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#888',
  fontWeight: '500',
  letterSpacing: '0.5px',
  textTransform: 'uppercase'
};

const textareaStyle: React.CSSProperties = {
  background: '#0d0d0d',
  color: '#ccc',
  border: '1px solid #2a2a2a',
  padding: '8px',
  fontFamily: '"SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
  fontSize: '13px',
  resize: 'vertical',
  borderRadius: '6px',
  outline: 'none',
  lineHeight: '1.5',
  transition: 'border-color 0.2s ease'
};

const outputBoxStyle: React.CSSProperties = {
  padding: '8px',
  fontFamily: '"SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
  fontSize: '13px',
  borderRadius: '6px',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  maxHeight: '200px',
  overflowY: 'auto'
};
