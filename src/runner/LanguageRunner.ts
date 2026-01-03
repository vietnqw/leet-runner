import { TestCase, TestResult } from '../types';

export interface RunRequest {
  code: string;
  methodName: string;
  testCases: TestCase[];
}

export type RunnerEvent = 
  | { type: 'result'; caseId: string; result: TestResult }
  | { type: 'error'; error: string }
  | { type: 'loaded' }
  | { type: 'finished' };

export interface LanguageRunner {
  run(request: RunRequest, onEvent: (event: RunnerEvent) => void): void;
  terminate(): void;
}
