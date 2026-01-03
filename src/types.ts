export interface TestCase {
  id: string;
  args: string; // JSON one per line
  expected: string; // Raw text (or JSON depending on checker)
}

export interface TestResult {
  passed: boolean;
  actual: string;
  error?: string; // Traceback
  executionTime?: number;
}

