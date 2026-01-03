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
    <div className="app-shell">
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
      <div className="app-main">
        <div className="app-spacer" />

        <div className="card card--editor">
          <div className="card__body">
            <MonacoCodeEditor value={code} onChange={handleCodeChange} vimMode={vimMode} />
          </div>
        </div>

        <div className="card card--panel">
          <TestCasesPanel 
            testCases={testCases} 
            onChange={handleTestCasesChange}
            results={results}
          />
        </div>

        <div className="app-spacer app-spacer--bottom" />
      </div>
    </div>
  );
}

export default App;
