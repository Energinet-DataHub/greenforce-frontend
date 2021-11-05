import { DisplayLanguage, toDisplayLanguage } from './display-language';

describe('Display language', () => {
  it(`
    When an unknown language is specified
    Then an error is thrown`, () => {
    expect(() => {
      toDisplayLanguage('test');
    }).toThrowError(/unknown display language/i);
  });

  it(`
    When a supported language is specified
    Then it is accepted`, () => {
    const expectedDisplayLanguage = 'da';

    const actualDisplayLanguage: DisplayLanguage = toDisplayLanguage(
      expectedDisplayLanguage
    );

    expect(actualDisplayLanguage).toBe(expectedDisplayLanguage);
  });
});
