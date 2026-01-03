import { PYTHON_HARNESS } from './harness';

type PyodideInterface = any;

let pyodide: PyodideInterface | null = null;
let pyodideReadyPromise: Promise<void> | null = null;
let loadPyodideFn: ((opts: any) => Promise<PyodideInterface>) | null = null;

const initPyodide = async () => {
  if (pyodideReadyPromise) return pyodideReadyPromise;

  pyodideReadyPromise = (async () => {
    try {
      // IMPORTANT:
      // Don't bundle the `pyodide` npm package into Vite. It pulls in node:* shims and can break in-browser.
      // Instead, dynamically import Pyodide's browser module from CDN inside the worker.
      if (!loadPyodideFn) {
        const mod: any = await import('https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.mjs');
        loadPyodideFn = mod.loadPyodide;
      }
      pyodide = await loadPyodideFn!({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
      });
      // Load any packages if needed (e.g. numpy?) - None for MVP
      postMessage({ type: 'loaded' });
    } catch (err) {
      console.error('Failed to load Pyodide', err);
      postMessage({ type: 'error', error: 'Failed to load Python runtime' });
    }
  })();
  return pyodideReadyPromise;
};

// Stdout buffer
let stdoutBuffer: string[] = [];
let stderrBuffer: string[] = [];

const handleStdout = (msg: string) => stdoutBuffer.push(msg);
const handleStderr = (msg: string) => stderrBuffer.push(msg);

self.onmessage = async (e) => {
  const { type, code, methodName, testCases } = e.data;

  if (type === 'init') {
    await initPyodide();
    return;
  }

  if (type === 'run') {
    if (!pyodide) await initPyodide();
    if (!pyodide) return;

    // Reset buffers
    stdoutBuffer = [];
    stderrBuffer = [];
    
    // Set streams
    pyodide.setStdout({ batched: handleStdout });
    pyodide.setStderr({ batched: handleStderr });

    // 1. Exec user code
    let codeExecSuccess = true;
    try {
      await pyodide.runPythonAsync(code);
    } catch (err: any) {
      codeExecSuccess = false;
      // If code fails to compile/exec (syntax error), report it for all cases?
      // Or just fail the first case?
      // Better: Report error as a global error or fail all cases.
      // We will loop through cases and report the error for each.
      const errorMsg = err.toString();
      testCases.forEach((tc: any) => {
        postMessage({
            type: 'result',
            caseId: tc.id,
            result: { passed: false, actual: '', error: errorMsg, executionTime: 0 }
        });
      });
      return;
    }

    // 2. Load harness
    // We run the harness definition once
    try {
        pyodide.runPython(PYTHON_HARNESS);
    } catch (err) {
        console.error("Harness error", err);
    }

    const runCase = pyodide.globals.get('_run_leetcode_case');

    // 3. Run Test Cases
    for (const tc of testCases) {
      stdoutBuffer = [];
      stderrBuffer = [];
      const startTime = performance.now();
      
      let result: any;
      try {
        // We pass: code_exec_success, method_name, args_lines
        // runCase returns a Python dict (Map in JS)
        const pyResult = runCase(codeExecSuccess, methodName, tc.args);
        result = pyResult.toJs();
        pyResult.destroy();
      } catch (err: any) {
        result = { error: err.toString() };
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Combine stdout/stderr
      const output = [...stdoutBuffer, ...stderrBuffer].join('');
      // Wait, where do we put output? In the error or a separate field?
      // The `TestResult` has `actual` and `error`. 
      // I should append stdout to actual or error?
      // Usually stdout is useful for debug.
      // I'll add `output` to `TestResult` in `types.ts` later.
      // For now, I'll append it to error if error, or just ignore?
      // No, user wants stdout.
      // I'll modify TestResult in the next step or assume it exists.
      // I'll append it to the error message or prepend it.
      
      const combinedOutput = output ? `\n--- Output ---\n${output}` : '';

      if (result.error) {
         postMessage({
            type: 'result',
            caseId: tc.id,
            result: { 
                passed: false, 
                actual: '', 
                output: combinedOutput,
                error: result.error, 
                executionTime 
            }
         });
      } else {
         postMessage({
            type: 'result',
            caseId: tc.id,
            result: { 
                passed: true, 
                actual: result.actual, 
                output: combinedOutput,
                executionTime
            }
         });
      }
    }
    
    runCase.destroy();
    postMessage({ type: 'finished' });
  }
};

