import { useState, useEffect, useRef } from 'react';
import { MonacoCodeEditor } from './components/MonacoCodeEditor';
import { RunnerToolbar } from './components/RunnerToolbar';
import { TestCasesPanel } from './components/TestCasesPanel';
import { RunResultsPanel } from './components/RunResultsPanel';
import { workspaceStorage } from './storage/workspaceStorage';
import type { TestCase, TestResult } from './types';
import { PythonRunnerClient } from './runner/python/pythonRunnerClient';
import { getChecker } from './runner/checkers';

function App() {
  const [code, setCode] = useState(workspaceStorage.loadCode());
  const [methodName, setMethodName] = useState(workspaceStorage.loadMethod());
  const [checkerId, setCheckerId] = useState(workspaceStorage.loadChecker());
  const [vimMode, setVimMode] = useState(workspaceStorage.loadVimMode());
  const [testCases, setTestCases] = useState<TestCase[]>(workspaceStorage.loadTestCases([]));
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runnerRef = useRef<PythonRunnerClient | null>(null);

  useEffect(() => {
    try {
      runnerRef.current = new PythonRunnerClient();
    } catch (e) {
      // If the Worker fails to initialize, don't blank the UI.
      console.error('Failed to initialize Python runner', e);
      runnerRef.current = null;
    }
    return () => {
      runnerRef.current?.terminate();
    };
  }, []);

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
  
  const handleCheckerChange = (id: string) => {
    setCheckerId(id);
    workspaceStorage.saveChecker(id);
  };

  const handleVimModeChange = (enabled: boolean) => {
    setVimMode(enabled);
    workspaceStorage.saveVimMode(enabled);
  };

  const handleTestCasesChange = (newCases: TestCase[]) => {
    setTestCases(newCases);
    workspaceStorage.saveTestCases(newCases);
  };

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setResults({});
    
    runnerRef.current?.run({
      code,
      methodName,
      testCases
    }, (event) => {
      if (event.type === 'result') {
        setResults(prev => {
           const { caseId, result } = event;
           const tc = testCases.find(t => t.id === caseId);
           // Calculate pass/fail using checker
           if (tc && !result.error) {
              const checker = getChecker(checkerId);
              const checkRes = checker.check(result.actual, tc.expected);
              result.passed = checkRes.passed;
              if (checkRes.diagnostics) {
                  result.error = (result.error ? result.error + '\n' : '') + `Checker: ${checkRes.diagnostics}`;
              }
           }
           return { ...prev, [caseId]: result };
        });
      } else if (event.type === 'finished') {
        setIsRunning(false);
      } else if (event.type === 'error') {
        alert(`Runtime Error: ${event.error}`);
        setIsRunning(false);
      }
    });
  };

  const handleStop = () => {
    runnerRef.current?.terminate();
    setIsRunning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <RunnerToolbar
        methodName={methodName}
        onMethodNameChange={handleMethodChange}
        checkerId={checkerId}
        onCheckerChange={handleCheckerChange}
        vimMode={vimMode}
        onVimModeChange={handleVimModeChange}
        onRun={handleRun}
        onStop={handleStop}
        isRunning={isRunning}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Editor Section (Left) */}
        <div style={{ flex: 1, borderRight: '1px solid #333' }}>
          <MonacoCodeEditor value={code} onChange={handleCodeChange} vimMode={vimMode} />
        </div>

        {/* Sidebar Section (Right) */}
        <div style={{ width: '400px', backgroundColor: '#252526', padding: '10px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <TestCasesPanel testCases={testCases} onChange={handleTestCasesChange} />
          <RunResultsPanel testCases={testCases} results={results} />
        </div>
      </div>
    </div>
  );
}

export default App;
