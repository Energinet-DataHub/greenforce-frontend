//#region License
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
//#endregion
import { ErrorHandler, inject, provideAppInitializer } from '@angular/core';

import { DhApplicationInsights } from './dh-application-insights.service';
import { DhApplicationInsightsErrorHandler } from './dh-application-insights-error-handler';

export const applicationInsightsInitializer = provideAppInitializer(async () => {
  const appInsights = inject(DhApplicationInsights);
  const errorHandler = inject(DhApplicationInsightsErrorHandler);

  try {
    await appInsights.init();
    const { ApplicationinsightsAngularpluginErrorService } = await import(
      '@microsoft/applicationinsights-angularplugin-js'
    );
    errorHandler.adopt(new ApplicationinsightsAngularpluginErrorService());
  } catch (error) {
    // If loading the SDK fails, fall back to Angular's default ErrorHandler so
    // buffered bootstrap errors still reach the console instead of getting lost.
    console.error('Failed to initialize Application Insights', error);
    errorHandler.adopt(new ErrorHandler());
  }
});
