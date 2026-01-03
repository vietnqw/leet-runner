import { useState, useEffect, useRef } from 'react';
import { MonacoCodeEditor } from './components/MonacoCodeEditor';
import { RunnerToolbar } from './components/RunnerToolbar';
import { TestCasesPanel } from './components/TestCasesPanel';
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

  // Ctrl/Cmd + Enter => Run from anywhere (editor/testcases/etc)
  const runRef = useRef(handleRun);
  runRef.current = handleRun;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.isComposing) return;
      const isRunCombo =
        (e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.code === 'NumpadEnter');
      if (!isRunCombo) return;

      // Use capture so Monaco (and other widgets) can't swallow the event.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      runRef.current();
    };
    const opts: AddEventListenerOptions = { capture: true };
    window.addEventListener('keydown', onKeyDown, opts);
    return () => window.removeEventListener('keydown', onKeyDown, opts);
  }, []);

  const handleStop = () => {
    runnerRef.current?.terminate();
    setIsRunning(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw',
      background: '#0a0a0a',
    }}>
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
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 0,
        padding: '12px',
        gap: '18px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Top gutter so the editor card never touches the toolbar */}
        <div style={{ flex: '0 0 10px' }} />

        {/* Editor Section */}
        <div style={{ 
          flex: 1.75,
          minHeight: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          background: '#1e1e1e',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '12px',
        }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MonacoCodeEditor value={code} onChange={handleCodeChange} vimMode={vimMode} />
          </div>
        </div>

        {/* Test Cases Section - Unified with Results */}
        <div style={{ 
          flex: 0.75,
          minHeight: 0,
          background: '#141414',
          borderRadius: '8px',
          padding: '14px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflowY: 'auto'
        }}>
          <TestCasesPanel 
            testCases={testCases} 
            onChange={handleTestCasesChange}
            results={results}
          />
        </div>

        {/* Bottom gutter so the test card never touches the viewport bottom */}
        <div style={{ flex: '0 0 18px' }} />
      </div>
    </div>
  );
}

export default App;
