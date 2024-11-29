import { DhEmDashFallbackPipe } from './dh-em-dash-fallback.pipe';
import { emDash } from './em-dash';

describe(DhEmDashFallbackPipe, () => {
  const dashFallbackPipe = new DhEmDashFallbackPipe();

  it(`displays ${emDash} when value is \`undefined\``, () => {
    expect(dashFallbackPipe.transform(undefined)).toBe(emDash);
  });

  it(`displays ${emDash} when value is \`null\``, () => {
    expect(dashFallbackPipe.transform(null)).toBe(emDash);
  });

  it(`displays ${emDash} when value is an empty string`, () => {
    expect(dashFallbackPipe.transform('')).toBe(emDash);
  });

  it(`displays value when value is a string`, () => {
    expect(dashFallbackPipe.transform('TEST')).toBe('TEST');
  });

  it(`displays value when value is a number`, () => {
    expect(dashFallbackPipe.transform(4)).toBe(4);
  });
});
