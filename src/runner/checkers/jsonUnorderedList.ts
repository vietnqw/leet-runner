import type { OutputChecker, CheckResult } from './types';

export const JsonUnorderedListChecker: OutputChecker = {
  id: 'json_unordered_list',
  name: 'Unordered List',
  description: 'Expects a list. Order of elements does not matter.',
  check: (actualStr: string, expectedStr: string): CheckResult => {
    try {
      const actual = JSON.parse(actualStr);
      const expected = JSON.parse(expectedStr);

      if (!Array.isArray(actual) || !Array.isArray(expected)) {
        return { passed: false, diagnostics: 'Both outputs must be arrays.' };
      }

      if (actual.length !== expected.length) {
        return { passed: false, diagnostics: `Length mismatch: Expected ${expected.length}, got ${actual.length}` };
      }

      // Helper to canonicalize elements
      const canonicalize = (arr: any[]) => {
        return arr.map(item => JSON.stringify(item)).sort();
      };

      const sortedActual = canonicalize(actual);
      const sortedExpected = canonicalize(expected);

      for (let i = 0; i < sortedActual.length; i++) {
        if (sortedActual[i] !== sortedExpected[i]) {
            return { passed: false, diagnostics: 'Elements mismatch (ignoring order)' };
        }
      }
      
      return { passed: true };
    } catch (e: any) {
      return { passed: false, diagnostics: `JSON Parse Error: ${e.message}` };
    }
  }
};

