const STORAGE_KEYS = {
  CODE: 'leetcode-runner-code',
  METHOD: 'leetcode-runner-method',
  CHECKER: 'leetcode-runner-checker',
  TEST_CASES: 'leetcode-runner-testcases',
  VIM_MODE: 'leetcode-runner-vim-mode',
};

const DEFAULT_CODE = `class Solution:
    def solve(self, nums: List[int]) -> int:
        return sum(nums)
`;

export const workspaceStorage = {
  saveCode: (code: string) => {
    localStorage.setItem(STORAGE_KEYS.CODE, code);
  },

  loadCode: (): string => {
    return localStorage.getItem(STORAGE_KEYS.CODE) || DEFAULT_CODE;
  },

  saveMethod: (method: string) => {
    localStorage.setItem(STORAGE_KEYS.METHOD, method);
  },

  loadMethod: (): string => {
    return localStorage.getItem(STORAGE_KEYS.METHOD) || 'solve';
  },

  saveChecker: (checker: string) => {
    localStorage.setItem(STORAGE_KEYS.CHECKER, checker);
  },

  loadChecker: (): string => {
    return localStorage.getItem(STORAGE_KEYS.CHECKER) || 'exact_text';
  },

  saveTestCases: (testCases: unknown[]) => {
    localStorage.setItem(STORAGE_KEYS.TEST_CASES, JSON.stringify(testCases));
  },

  loadTestCases: <T>(defaultValue: T[]): T[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_CASES);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  },

  saveVimMode: (enabled: boolean) => {
    localStorage.setItem(STORAGE_KEYS.VIM_MODE, String(enabled));
  },

  loadVimMode: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.VIM_MODE) === 'true';
  }
};

