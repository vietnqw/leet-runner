export interface TestCase {
  id: string;
  args: string; // JSON one per line
  expected: string; // Raw text (or JSON depending on checker)
}

export interface TestResult {
  passed: boolean; // True if output matches expected (or runtime success if not checked yet)
  actual: string; // The return value rendered
  output?: string; // Stdout/Stderr
  error?: string; // Runtime exception or Traceback
  executionTime?: number;
}
