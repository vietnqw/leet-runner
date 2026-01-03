import { OutputChecker, CheckResult } from './types';

// Simple deep equal implementation
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

export const JsonDeepEqualChecker: OutputChecker = {
  id: 'json_deep_equal',
  name: 'JSON Deep Equal',
  description: 'Parses Actual and Expected as JSON and compares structure.',
  check: (actualStr: string, expectedStr: string): CheckResult => {
    try {
      const actual = JSON.parse(actualStr);
      const expected = JSON.parse(expectedStr);
      const passed = deepEqual(actual, expected);
      return { passed };
    } catch (e: any) {
      return { passed: false, diagnostics: `JSON Parse Error: ${e.message}` };
    }
  }
};

