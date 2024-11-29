import { APP_INITIALIZER, FactoryProvider } from '@angular/core';

import { EoLanguageService } from './eo-language.service';

export const eoLanguageServiceInitializer: FactoryProvider = {
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (eoLangaugeService: EoLanguageService) => () => eoLangaugeService.init(),
  deps: [EoLanguageService],
};
