import { APP_INITIALIZER, FactoryProvider } from '@angular/core';

import { DhApplicationInsights } from './dh-application-insights.service';

export const applicationInsightsInitializer: FactoryProvider = {
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (applicationInsights: DhApplicationInsights) => async () =>
    applicationInsights.init(),
  deps: [DhApplicationInsights],
};
