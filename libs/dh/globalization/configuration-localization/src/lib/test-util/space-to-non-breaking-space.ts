import { nonBreakingSpace } from '../danish-locale/characters';

const singleSpace = ' ';

export function spaceToNonBreakingSpace(value: string): string {
  return value.replace(singleSpace, nonBreakingSpace);
}
