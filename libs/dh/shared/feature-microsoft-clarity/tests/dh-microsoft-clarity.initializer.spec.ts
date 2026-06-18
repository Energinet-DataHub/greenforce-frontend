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
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import {
  ConsentStatus,
  CookieInformationService,
  COOKIE_CATEGORIES,
} from '@energinet-datahub/gf/util-cookie-information';
import {
  DhAppEnvironmentConfig,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { WindowService } from '@energinet-datahub/gf/util-browser';

import { DhMicrosoftClarityService } from '../src/dh-microsoft-clarity.service';
import { initMicrosoftClarity } from '../src/dh-microsoft-clarity.initializer';

const TEST_PROJECT_ID = 'test-project-id';

// Builds a full consent object; only the statistics flag varies per scenario.
function consentWithStatistics(granted: boolean): ConsentStatus {
  return {
    [COOKIE_CATEGORIES.NECESSARY]: true,
    [COOKIE_CATEGORIES.FUNCTIONAL]: false,
    [COOKIE_CATEGORIES.STATISTIC]: granted,
    [COOKIE_CATEGORIES.MARKETING]: false,
    [COOKIE_CATEGORIES.UNCLASSIFIED]: false,
  };
}

// Stub of the Clarity service: loading the SDK flips isInitialized, which is
// what the initializer reads to tell "never loaded" from "withdrawn after load".
function createClarityServiceStub() {
  const stub = {
    isInitialized: false,
    init: vi.fn(() => {
      stub.isInitialized = true;
    }),
    setCookieConsent: vi.fn(),
  };
  return stub;
}

type SetupOptions = {
  featureEnabled?: boolean;
  config?: DhAppEnvironmentConfig;
  hostname?: string;
};

function setup(overrides: SetupOptions = {}) {
  const {
    featureEnabled = true,
    config = { microsoftClarity: { projectId: TEST_PROJECT_ID } } as DhAppEnvironmentConfig,
    hostname = 'datahub.example.dk',
  } = overrides;

  const consentGiven$ = new Subject<ConsentStatus>();
  const reload = vi.fn();
  const clarityService = createClarityServiceStub();

  TestBed.configureTestingModule({
    providers: [
      { provide: DhMicrosoftClarityService, useValue: clarityService },
      { provide: CookieInformationService, useValue: { consentGiven$ } },
      { provide: dhAppEnvironmentToken, useValue: config },
      { provide: DhFeatureFlagsService, useValue: { isEnabled: vi.fn(() => featureEnabled) } },
      { provide: WindowService, useValue: { nativeWindow: { location: { hostname, reload } } } },
    ],
  });

  TestBed.runInInjectionContext(() => initMicrosoftClarity());

  return { consentGiven$, reload, clarityService };
}

describe('initMicrosoftClarity', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('does not load Clarity when the feature flag is disabled', () => {
    const { clarityService } = setup({ featureEnabled: false });

    expect(clarityService.init).not.toHaveBeenCalled();
  });

  it('does not load Clarity when no project is configured', () => {
    const { clarityService } = setup({ config: {} as DhAppEnvironmentConfig });

    expect(clarityService.init).not.toHaveBeenCalled();
  });

  it('does not load Clarity or send anything until statistics consent is granted', () => {
    const { consentGiven$, clarityService, reload } = setup();

    consentGiven$.next(consentWithStatistics(false));

    expect(clarityService.init).not.toHaveBeenCalled();
    expect(clarityService.setCookieConsent).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it('loads Clarity and grants consent when statistics consent is given', () => {
    const { consentGiven$, clarityService } = setup();

    consentGiven$.next(consentWithStatistics(true));

    expect(clarityService.init).toHaveBeenCalledWith({ projectId: TEST_PROJECT_ID });
    expect(clarityService.setCookieConsent).toHaveBeenCalledWith(true);
  });

  it('reloads the page when consent is withdrawn after Clarity has loaded', () => {
    const { consentGiven$, reload } = setup();

    consentGiven$.next(consentWithStatistics(true));
    consentGiven$.next(consentWithStatistics(false));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('never loads or reloads for a user who keeps statistics rejected', () => {
    const { consentGiven$, clarityService, reload } = setup();

    // Initial default emission followed by the re-broadcast of stored rejection.
    consentGiven$.next(consentWithStatistics(false));
    consentGiven$.next(consentWithStatistics(false));

    expect(clarityService.init).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it('grants consent directly on localhost without waiting for the banner', () => {
    const { clarityService } = setup({ hostname: 'localhost' });

    expect(clarityService.init).toHaveBeenCalledWith({ projectId: TEST_PROJECT_ID });
    expect(clarityService.setCookieConsent).toHaveBeenCalledWith(true);
  });
});
