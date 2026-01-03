import { ExactTextChecker } from './exactText';
import { JsonDeepEqualChecker } from './jsonDeepEqual';
import { JsonUnorderedListChecker } from './jsonUnorderedList';
import { JsonUnorderedListOfListsChecker } from './jsonUnorderedListOfLists';
import type { OutputChecker } from './types';

export const CHECKERS: OutputChecker[] = [
  ExactTextChecker,
  JsonDeepEqualChecker,
  JsonUnorderedListChecker,
  JsonUnorderedListOfListsChecker
];

export const getChecker = (id: string): OutputChecker => {
  return CHECKERS.find(c => c.id === id) || ExactTextChecker;
};

