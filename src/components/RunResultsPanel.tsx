import React from 'react';
import type { TestCase, TestResult } from '../types';

interface RunResultsPanelProps {
  testCases: TestCase[];
  results: Record<string, TestResult>;
}

export const RunResultsPanel: React.FC<RunResultsPanelProps> = ({
  testCases,
  results
}) => {
  if (Object.keys(results).length === 0) return null;

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Run Results</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {testCases.map((tc, index) => {
          const result = results[tc.id];
          if (!result) return null;

          const isError = !!result.error;
          const passed = result.passed && !isError;
          const statusColor = passed ? '#4CAF50' : '#d9534f';
          const statusText = isError ? 'Error' : (passed ? 'Accepted' : 'Wrong Answer');

          return (
            <div key={tc.id} style={{ background: '#1e1e1e', padding: '10px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Case {index + 1}</span>
                <span style={{ color: statusColor, fontWeight: 'bold', fontSize: '13px' }}>{statusText}</span>
              </div>
              
              {result.executionTime !== undefined && (
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>
                  Runtime: {result.executionTime.toFixed(2)}ms
                </div>
              )}

              {isError && (
                 <div style={{ color: '#d9534f', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', background: '#2d1f1f', padding: '5px' }}>
                    {result.error}
                 </div>
              )}

              {!passed && !isError && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px' }}>
                    <div>
                        <span style={{ color: '#aaa' }}>Expected:</span>
                        <pre style={{ margin: '2px 0', color: '#ddd', whiteSpace: 'pre-wrap' }}>{tc.expected}</pre>
                    </div>
                    <div>
                        <span style={{ color: '#aaa' }}>Actual:</span>
                        <pre style={{ margin: '2px 0', color: '#d9534f', whiteSpace: 'pre-wrap' }}>{result.actual}</pre>
                    </div>
                </div>
              )}
              
              {passed && !isError && result.output && (
                 <div style={{ marginTop: '5px' }}>
                    <span style={{ color: '#aaa', fontSize: '11px' }}>Output:</span>
                    <pre style={{ margin: '2px 0', color: '#ccc', fontSize: '11px', whiteSpace: 'pre-wrap' }}>{result.output}</pre>
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

