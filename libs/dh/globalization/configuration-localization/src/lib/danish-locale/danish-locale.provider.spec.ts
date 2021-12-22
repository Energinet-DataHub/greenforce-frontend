import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { danishLocaleCode } from './danish-locale-code';

import { danishLocaleProvider } from './danish-locale.provider';

describe('danishLocaleProvider', () => {
  it('when not provided, default application locale is used', () => {
    const americanEnglishLocaleCode = 'en-US';

    TestBed.configureTestingModule({});
    const locale = TestBed.inject(LOCALE_ID);

    expect(locale).toBe(americanEnglishLocaleCode);
  });

  it('when provided, Danish is registered as the application locale', () => {
    TestBed.configureTestingModule({
      providers: [danishLocaleProvider],
    });
    const locale = TestBed.inject(LOCALE_ID);

    expect(locale).toBe(danishLocaleCode);
  });
});
