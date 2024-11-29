import { danishLocaleProvider } from './lib/danish-locale.provider';
import { danishCurrencyProvider } from './lib/danish-currency.provider';
import { danishLocaleInitializer } from './lib/danish-locale.initializer';
import { makeEnvironmentProviders } from '@angular/core';

export const danishLocalProviders = makeEnvironmentProviders([
  danishLocaleProvider,
  danishLocaleInitializer,
  danishCurrencyProvider,
]);
