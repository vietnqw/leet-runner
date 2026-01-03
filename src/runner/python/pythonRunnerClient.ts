import { LanguageRunner, RunRequest, RunnerEvent } from '../LanguageRunner';

export class PythonRunnerClient implements LanguageRunner {
  private worker: Worker | null = null;
  private onEvent: ((event: RunnerEvent) => void) | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (this.worker) return;
    this.worker = new Worker(new URL('./pythonRunner.worker.ts', import.meta.url), {
      type: 'module'
    });
    
    this.worker.onmessage = (e) => {
      const { type, caseId, result, error } = e.data;
      if (this.onEvent) {
        if (type === 'result') {
          this.onEvent({ type: 'result', caseId, result });
        } else if (type === 'error') {
          this.onEvent({ type: 'error', error });
        } else if (type === 'loaded') {
            this.onEvent({ type: 'loaded' });
        }
      }
    };

    // Preload
    this.worker.postMessage({ type: 'init' });
  }

  run(request: RunRequest, onEvent: (event: RunnerEvent) => void): void {
    if (!this.worker) this.initWorker();
    this.onEvent = onEvent;
    
    this.worker?.postMessage({
      type: 'run',
      code: request.code,
      methodName: request.methodName,
      testCases: request.testCases
    });
  }

  terminate(): void {
    this.worker?.terminate();
    this.worker = null;
    // Immediately restart to warm up? 
    // Plan says "Force kill + warm restart". 
    // I'll leave that for the timeout todo or add it here.
    // I'll add initWorker() call if I want to restart immediately.
    this.initWorker();
  }
}

