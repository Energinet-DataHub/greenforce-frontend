import { DEFAULT_CURRENCY_CODE, StaticProvider } from '@angular/core';

import { danishCurrencyCode } from './danish-locale-code';

export const danishCurrencyProvider: StaticProvider = {
  provide: DEFAULT_CURRENCY_CODE,
  useValue: danishCurrencyCode,
};
