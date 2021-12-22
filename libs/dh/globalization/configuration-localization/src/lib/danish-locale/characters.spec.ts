import { nonBreakingSpace } from './characters';

describe('nonBreakingSpace', () => {
  it('has the character code 160', () => {
    expect(nonBreakingSpace.charCodeAt(0)).toBe(160);
  });

  it('is one character', () => {
    expect(nonBreakingSpace).toHaveLength(1);
  });
});
