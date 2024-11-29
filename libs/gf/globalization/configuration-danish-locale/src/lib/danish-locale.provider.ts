import { LOCALE_ID, StaticProvider } from '@angular/core';

import { danishLocaleCode } from './danish-locale-code';

export const danishLocaleProvider: StaticProvider = {
  provide: LOCALE_ID,
  useValue: danishLocaleCode,
};
