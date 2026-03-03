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
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { DhMicrosoftClarityService } from './dh-microsoft-clarity.service';
import Clarity from '@microsoft/clarity';

// Mock the Clarity module
vi.mock('@microsoft/clarity', () => ({
  default: {
    init: vi.fn(),
    consent: vi.fn(),
  },
}));

describe('DhMicrosoftClarityService', () => {
  let service: DhMicrosoftClarityService;

  const TEST_PROJECT_ID = 'test-project-id';
  const mockClarity = vi.mocked(Clarity);

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
