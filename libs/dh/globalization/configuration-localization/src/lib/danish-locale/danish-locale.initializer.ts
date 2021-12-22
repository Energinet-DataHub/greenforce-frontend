import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import danishLocale from '@angular/common/locales/da';

import { danishLocaleCode } from './danish-locale-code';

function registerDanishLocale(): void {
  registerLocaleData(danishLocale, danishLocaleCode);
}

export const danishLocaleInitializer: FactoryProvider = {
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: () => (): void => registerDanishLocale(),
};
