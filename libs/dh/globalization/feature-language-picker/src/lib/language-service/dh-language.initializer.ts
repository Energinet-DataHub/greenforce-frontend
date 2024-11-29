import { APP_INITIALIZER, FactoryProvider } from '@angular/core';

import { DhLanguageService } from './dh-language.service';

export const dhLanguageServiceInitializer: FactoryProvider = {
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (dhLangaugeService: DhLanguageService) => () => dhLangaugeService.init(),
  deps: [DhLanguageService],
};
