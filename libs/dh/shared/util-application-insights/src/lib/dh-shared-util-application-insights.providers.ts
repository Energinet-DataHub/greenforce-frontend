import { ErrorHandler, makeEnvironmentProviders } from '@angular/core';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { applicationInsightsInitializer } from './dh-application-insights.initializer';

export const applicationInsightsProviders = makeEnvironmentProviders([
  applicationInsightsInitializer,
  {
    provide: ErrorHandler,
    useClass: ApplicationinsightsAngularpluginErrorService,
  },
]);
