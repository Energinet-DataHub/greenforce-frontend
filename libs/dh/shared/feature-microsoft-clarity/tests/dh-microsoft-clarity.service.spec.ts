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

import Clarity from '@microsoft/clarity';

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

// Mock the Clarity module. Both the service suite and the initializer suite live
// in this single file so there is exactly one mock of '@microsoft/clarity'. The
// shared vite config runs with `isolate: false`, so splitting the suites across
// files would share one module graph and let the real SDK load before this mock
// applies, producing order-dependent failures.
vi.mock('@microsoft/clarity', () => ({
  default: {
    init: vi.fn(),
    consent: vi.fn(),
  },
}));

const TEST_PROJECT_ID = 'test-project-id';
const mockClarity = vi.mocked(Clarity);

describe('DhMicrosoftClarityService', () => {
  let service: DhMicrosoftClarityService;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Create a new instance of the service for each test
    service = new DhMicrosoftClarityService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('init', () => {
    it('should initialize Clarity with project ID', () => {
      const config = { projectId: TEST_PROJECT_ID };
      service.init(config);

      expect(mockClarity.init).toHaveBeenCalledWith(TEST_PROJECT_ID);
    });

    it('should not initialize when config is undefined', () => {
      service.init(undefined);

      expect(mockClarity.init).not.toHaveBeenCalled();
    });

    it('should not initialize when config has no project ID', () => {
      const config = { projectId: '' };
      service.init(config);

      expect(mockClarity.init).not.toHaveBeenCalled();
    });

    it('should handle initialization errors gracefully', () => {
      vi.mocked(mockClarity.init).mockImplementationOnce(() => {
        throw new Error('Clarity init failed');
      });
      const config = { projectId: TEST_PROJECT_ID };

      expect(() => service.init(config)).not.toThrow();
      expect(mockClarity.init).toHaveBeenCalledWith(TEST_PROJECT_ID);
    });

    it('should not initialize twice', () => {
      const config = { projectId: TEST_PROJECT_ID };
      service.init(config);
      vi.clearAllMocks();
      service.init(config);

      expect(mockClarity.init).not.toHaveBeenCalled();
    });
  });

  describe('setCookieConsent', () => {
    beforeEach(() => {
      const config = { projectId: TEST_PROJECT_ID };
      service.init(config);
      vi.clearAllMocks();
    });

    it('should not call consent when not initialized', () => {
      const newService = new DhMicrosoftClarityService();
      newService.setCookieConsent(true);

      expect(mockClarity.consent).not.toHaveBeenCalled();
    });

    it('should call consent with true when consent is granted', () => {
      service.setCookieConsent(true);

      expect(mockClarity.consent).toHaveBeenCalledWith(true);
    });

    it('should call consent with false when consent is revoked', () => {
      service.setCookieConsent(false);

      expect(mockClarity.consent).toHaveBeenCalledWith(false);
    });

    it('should handle consent errors gracefully', () => {
      vi.mocked(mockClarity.consent).mockImplementationOnce(() => {
        throw new Error('Consent failed');
      });

      expect(() => service.setCookieConsent(true)).not.toThrow();
      expect(mockClarity.consent).toHaveBeenCalledWith(true);
    });
  });
});

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

function setupInitializer(overrides: SetupOptions = {}) {
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
    const { clarityService } = setupInitializer({ featureEnabled: false });

    expect(clarityService.init).not.toHaveBeenCalled();
  });

  it('does not load Clarity when no project is configured', () => {
    const { clarityService } = setupInitializer({ config: {} as DhAppEnvironmentConfig });

    expect(clarityService.init).not.toHaveBeenCalled();
  });

  it('does not load Clarity or send anything until statistics consent is granted', () => {
    const { consentGiven$, clarityService, reload } = setupInitializer();

    consentGiven$.next(consentWithStatistics(false));

    expect(clarityService.init).not.toHaveBeenCalled();
    expect(clarityService.setCookieConsent).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it('loads Clarity and grants consent when statistics consent is given', () => {
    const { consentGiven$, clarityService } = setupInitializer();

    consentGiven$.next(consentWithStatistics(true));

    expect(clarityService.init).toHaveBeenCalledWith({ projectId: TEST_PROJECT_ID });
    expect(clarityService.setCookieConsent).toHaveBeenCalledWith(true);
  });

  it('reloads the page when consent is withdrawn after Clarity has loaded', () => {
    const { consentGiven$, reload } = setupInitializer();

    consentGiven$.next(consentWithStatistics(true));
    consentGiven$.next(consentWithStatistics(false));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('never loads or reloads for a user who keeps statistics rejected', () => {
    const { consentGiven$, clarityService, reload } = setupInitializer();

    // Initial default emission followed by the re-broadcast of stored rejection.
    consentGiven$.next(consentWithStatistics(false));
    consentGiven$.next(consentWithStatistics(false));

    expect(clarityService.init).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it('grants consent directly on localhost without waiting for the banner', () => {
    const { clarityService } = setupInitializer({ hostname: 'localhost' });

    expect(clarityService.init).toHaveBeenCalledWith({ projectId: TEST_PROJECT_ID });
    expect(clarityService.setCookieConsent).toHaveBeenCalledWith(true);
  });
});
