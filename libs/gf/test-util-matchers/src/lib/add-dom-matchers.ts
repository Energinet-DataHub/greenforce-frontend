/**
 * Add Jest matchers for DOM elements.
 */
export function addDomMatchers(): void {
  beforeAll(async () => {
    // Issue: node_modules/@types/testing-library__jest-dom/index.d.ts' is not a module.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import('@testing-library/jest-dom');
  });
}
