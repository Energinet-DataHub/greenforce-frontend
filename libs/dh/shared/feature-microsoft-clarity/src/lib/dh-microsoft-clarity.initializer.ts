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
import { inject, provideAppInitializer, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DhMicrosoftClarityService } from './dh-microsoft-clarity.service';
import { CookieInformationService } from '@energinet-datahub/gf/util-cookie-information';
import {
  DhAppEnvironmentConfig,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

export const microsoftClarityInitializer = provideAppInitializer(() => {
  const clarityService = inject(DhMicrosoftClarityService);
  const cookieInformationService = inject(CookieInformationService);
  const dhAppConfig = inject<DhAppEnvironmentConfig>(dhAppEnvironmentToken);
  const destroyRef = inject(DestroyRef);
  const featureFlags = inject(DhFeatureFlagsService);

  // Check if Microsoft Clarity feature is enabled
  if (!featureFlags.isEnabled('microsoft-clarity')) {
    console.log('Microsoft Clarity feature flag is disabled');
    return;
  }

  const clarityConfig = dhAppConfig.microsoftClarity;
  if (!clarityConfig) {
    return;
  }

  // Initialize Microsoft Clarity with the project ID from configuration
  clarityService.init(clarityConfig);

  // Check if we're on localhost
  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    // On localhost, automatically grant consent since cookie banner isn't shown
    // This prevents multiple sessions being created on each reload
    console.log('Running on localhost - automatically granting Clarity consent');
    clarityService.setCookieConsent(true);
  } else {
    // For other environments, respect the cookie consent system
    cookieInformationService.consentGiven$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((status) => {
        // Update Microsoft Clarity cookie consent based on statistics cookies
        // Clarity needs consent to store cookies and maintain sessions properly
        clarityService.setCookieConsent(status.cookie_cat_statistic);
      });
  }
});
