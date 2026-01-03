export interface CheckResult {
  passed: boolean;
  diagnostics?: string; // Details on why it failed
}

export interface OutputChecker {
  id: string;
  name: string;
  description: string;
  check(actual: string, expected: string): CheckResult;
}

