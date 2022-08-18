/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import {
  ApplicationInsights,
  DistributedTracingModes,
  SeverityLevel,
} from '@microsoft/applicationinsights-web';

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
      enableCorsCorrelation: true,
      distributedTracingMode: DistributedTracingModes.W3C,
      extensions: [this.angularPlugin],
      extensionConfig: {
        [this.angularPlugin.identifier]: {
          router: this.router,
          errorServices: [new ErrorHandler()],
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

  /**
   * Log a user action or other occurrence.
   * @param name
   */
  trackEvent(name: string): void {
    this.appInsights.trackEvent({ name });
  }

  /**
   * Log a diagnostic scenario such entering or leaving a function.
   * @param message
   */
  trackTrace(message: string): void {
    this.appInsights.trackTrace({ message });
  }

  /**
   * Logs that a page, or similar container was displayed to the user.
   * @param name
   */
  trackPageView(name: string): void {
    this.appInsights.trackPageView({ name });
  }

  /**
   * Log an exception that you have caught.
   * @param exception
   */
  trackException(exception: Error, severityLevel: SeverityLevel): void {
    this.appInsights.trackException({ exception, severityLevel });
  }
}
