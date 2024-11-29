import { nonBreakingSpace } from './characters';

const singleSpace = ' ';

export function spaceToNonBreakingSpace(value: string): string {
  return value.replace(singleSpace, nonBreakingSpace);
}
