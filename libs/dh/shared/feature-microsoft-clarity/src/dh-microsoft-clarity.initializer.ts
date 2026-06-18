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

import {
  COOKIE_CATEGORIES,
  CookieInformationService,
} from '@energinet-datahub/gf/util-cookie-information';
import { WindowService } from '@energinet-datahub/gf/util-browser';
import {
  DhAppEnvironmentConfig,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

import { DhMicrosoftClarityService } from './dh-microsoft-clarity.service';

// Loads and gates Microsoft Clarity. Clarity is only loaded once the user has
// actively consented to statistics cookies, so a user who rejects (or has not
// answered) never loads the tag and nothing is sent. Withdrawal teardown is
// handled centrally by CookieInformationService, which reloads the page.
export function initMicrosoftClarity(): void {
  const clarityService = inject(DhMicrosoftClarityService);
  const cookieInformationService = inject(CookieInformationService);
  const dhAppConfig = inject<DhAppEnvironmentConfig>(dhAppEnvironmentToken);
  const destroyRef = inject(DestroyRef);
  const featureFlags = inject(DhFeatureFlagsService);
  const nativeWindow = inject(WindowService).nativeWindow;

  if (!featureFlags.isEnabled('microsoft-clarity')) {
    return;
  }

  const clarityConfig = dhAppConfig.microsoftClarity;
  if (!clarityConfig) {
    return;
  }

  const isLocalhost =
    nativeWindow?.location.hostname === 'localhost' ||
    nativeWindow?.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    // On localhost the cookie banner isn't shown, so grant consent directly to
    // avoid creating a new session on every reload.
    clarityService.init(clarityConfig);
    clarityService.setCookieConsent(true);
    return;
  }

  cookieInformationService.consentGiven$
    .pipe(takeUntilDestroyed(destroyRef))
    .subscribe((status) => {
      if (status[COOKIE_CATEGORIES.STATISTIC]) {
        // Idempotent: init() guards against loading more than once.
        clarityService.init(clarityConfig);
        clarityService.setCookieConsent(true);
      }
    });
}

export const microsoftClarityInitializer = provideAppInitializer(initMicrosoftClarity);
