import type { OutputChecker, CheckResult } from './types';

export const JsonUnorderedListOfListsChecker: OutputChecker = {
  id: 'json_unordered_list_of_lists',
  name: 'Unordered List of Lists',
  description: 'Order of outer list does not matter. Order of inner lists does not matter (e.g. 3Sum).',
  check: (actualStr: string, expectedStr: string): CheckResult => {
    try {
      const actual = JSON.parse(actualStr);
      const expected = JSON.parse(expectedStr);

      if (!Array.isArray(actual) || !Array.isArray(expected)) {
        return { passed: false, diagnostics: 'Both outputs must be arrays.' };
      }

      // Helper to canonicalize a list of lists
      // 1. Sort inner lists
      // 2. Sort outer list based on stringified inner lists
      const canonicalize = (arr: any[]) => {
        const processed = arr.map(item => {
           if (Array.isArray(item)) {
               // Sort inner array. Assumption: inner array items are comparable (e.g. numbers/strings)
               // If inner array contains objects, we'd need deeper canonicalization.
               // For 3Sum, it's numbers.
               // We'll use a safe sort that handles numbers correctly.
               const sortedInner = [...item].sort((a,b) => {
                   if (typeof a === 'number' && typeof b === 'number') return a - b;
                   return String(a).localeCompare(String(b));
               });
               return JSON.stringify(sortedInner);
           }
           return JSON.stringify(item); // Fallback if not a list
        });
        return processed.sort();
      };

      const sortedActual = canonicalize(actual);
      const sortedExpected = canonicalize(expected);

      if (sortedActual.length !== sortedExpected.length) {
         return { passed: false, diagnostics: `Length mismatch: Expected ${sortedExpected.length}, got ${sortedActual.length}` };
      }

      for (let i = 0; i < sortedActual.length; i++) {
        if (sortedActual[i] !== sortedExpected[i]) {
            return { passed: false, diagnostics: 'Elements mismatch' };
        }
      }
      
      return { passed: true };
    } catch (e: any) {
      return { passed: false, diagnostics: `JSON Parse Error: ${e.message}` };
    }
  }
};

