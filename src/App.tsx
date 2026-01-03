import { useState, useEffect } from 'react';
import { MonacoCodeEditor } from './components/MonacoCodeEditor';
import { RunnerToolbar } from './components/RunnerToolbar';
import { TestCasesPanel } from './components/TestCasesPanel';
import { workspaceStorage } from './storage/workspaceStorage';
import { TestCase } from './types';

function App() {
  const [code, setCode] = useState(workspaceStorage.loadCode());
  const [methodName, setMethodName] = useState(workspaceStorage.loadMethod());
  const [testCases, setTestCases] = useState<TestCase[]>(workspaceStorage.loadTestCases([]));
  const [isRunning, setIsRunning] = useState(false);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
      workspaceStorage.saveCode(newCode);
    }
  };

  const handleMethodChange = (name: string) => {
    setMethodName(name);
    workspaceStorage.saveMethod(name);
  };

  const handleTestCasesChange = (newCases: TestCase[]) => {
    setTestCases(newCases);
    workspaceStorage.saveTestCases(newCases);
  };

  const handleRun = () => {
    setIsRunning(true);
    // TODO: implement run logic
    setTimeout(() => setIsRunning(false), 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <RunnerToolbar
        methodName={methodName}
        onMethodNameChange={handleMethodChange}
        onRun={handleRun}
        onStop={handleStop}
        isRunning={isRunning}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Editor Section (Left) */}
        <div style={{ flex: 1, borderRight: '1px solid #333' }}>
          <MonacoCodeEditor value={code} onChange={handleCodeChange} />
        </div>

        {/* Sidebar Section (Right) */}
        <div style={{ width: '400px', backgroundColor: '#252526', padding: '10px', display: 'flex', flexDirection: 'column' }}>
          <TestCasesPanel testCases={testCases} onChange={handleTestCasesChange} />
        </div>
      </div>
    </div>
  );
}

export default App;
