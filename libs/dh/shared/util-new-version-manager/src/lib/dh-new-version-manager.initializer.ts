import { APP_INITIALIZER, FactoryProvider } from '@angular/core';

import { DhNewVersionManager } from './dh-new-version-manager.service';

export const dhNewVersionManagerInitializer: FactoryProvider = {
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (newVersionManager: DhNewVersionManager) => () => newVersionManager.init(),
  deps: [DhNewVersionManager],
};
