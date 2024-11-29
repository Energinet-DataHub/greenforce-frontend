import { emDash } from './em-dash';

describe('emDash', () => {
  it('has the character code 8212', () => {
    expect(emDash.charCodeAt(0)).toBe(8212);
  });

  it('is one character', () => {
    expect(emDash).toHaveLength(1);
  });
});
