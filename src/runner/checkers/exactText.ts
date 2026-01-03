import type { OutputChecker, CheckResult } from './types';

export const ExactTextChecker: OutputChecker = {
  id: 'exact_text',
  name: 'Exact Text',
  description: 'Compares output exactly as string (ignores line ending differences)',
  check: (actual: string, expected: string): CheckResult => {
    // Normalize line endings
    const normalize = (s: string) => s.replace(/\r\n/g, '\n').trimEnd();
    const passed = normalize(actual) === normalize(expected);
    return { passed };
  }
};

