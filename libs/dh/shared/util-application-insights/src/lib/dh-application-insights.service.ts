import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import {
  DhAppEnvironmentConfig,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';

@Injectable({ providedIn: 'root' })
export class DhApplicationInsights {
  private angularPlugin = new AngularPlugin();
  private appInsights = new ApplicationInsights({
    config: {
      instrumentationKey:
        this.dhAppConfig.applicationInsights.instrumentationKey,
      extensions: [this.angularPlugin],
      extensionConfig: {
        [this.angularPlugin.identifier]: {
          router: this.router,
        },
      },
    },
  });

  constructor(
    private router: Router,
    @Inject(dhAppEnvironmentToken)
    private dhAppConfig: DhAppEnvironmentConfig
  ) {}

  /**
   * Initialize Application Insights
   */
  init(): void {
    if (this.appInsights.appInsights.isInitialized()) {
      return;
    }

    this.appInsights.loadAppInsights();
  }

  trackEvent(name: string): void {
    this.appInsights.trackEvent({ name });
  }

  trackTrace(message: string): void {
    this.appInsights.trackTrace({ message });
  }
}
