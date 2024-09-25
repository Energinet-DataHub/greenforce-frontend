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
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { CookieInformationService } from './cookie-information.service';
import { WindowService } from '@energinet-datahub/gf/util-browser';
import { CookieInformationConfig } from './cookie-information.types';
import { COOKIE_CATEGORIES } from './cookie-information.constants';

describe('CookieInformationService', () => {
  let service: CookieInformationService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDocument: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWindow: any;
  let eventListeners: { [key: string]: ((event: Event) => void)[] };

  const setupTest = (isLocalhost = false) => {
    eventListeners = {};

    mockDocument = {
      location: { hostname: isLocalhost ? 'localhost' : 'example.com' } as unknown as Location,
      createElement: jest.fn().mockReturnValue({ setAttribute: jest.fn() }),
      body: { appendChild: jest.fn() } as unknown as HTMLElement,
      getElementById: jest.fn(),
    };

    mockWindow = {
      CookieInformation: {
        loadConsent: jest.fn(),
        renew: jest.fn(),
        getConsentGivenFor: jest.fn(),
      },
      addEventListener: jest.fn((event, callback) => {
        if (!eventListeners[event]) {
          eventListeners[event] = [];
        }
        eventListeners[event].push(callback);
      }),
      dispatchEvent: jest.fn((event) => {
        const listeners = eventListeners[event.type] || [];
        listeners.forEach((listener) => listener(event));
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        CookieInformationService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: WindowService, useValue: { nativeWindow: mockWindow } },
      ],
    });

    service = TestBed.inject(CookieInformationService);
    TestBed.inject(WindowService);
  };

  it('should be created', () => {
    setupTest();
    expect(service).toBeTruthy();
  });

  it('should return consent status of all cookie categories', () => {
    setupTest();

    const status = service.getConsentStatus();

    expect(status[COOKIE_CATEGORIES.NECESSARY]).toBe(true);
    expect(status[COOKIE_CATEGORIES.FUNCTIONAL]).toBe(false);
    expect(status[COOKIE_CATEGORIES.STATISTIC]).toBe(false);
    expect(status[COOKIE_CATEGORIES.MARKETING]).toBe(false);
    expect(status[COOKIE_CATEGORIES.UNCLASSIFIED]).toBe(false);
  });

  describe('init', () => {
    it('should not load script on localhost', () => {
      setupTest(true);
      const config: CookieInformationConfig = { culture: 'en' };
      service.init(config);
      expect(mockDocument.createElement).not.toHaveBeenCalled();
    });

    it('should add script to body when not on localhost', () => {
      setupTest();
      const config: CookieInformationConfig = { culture: 'en' };
      service.init(config);
      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
      expect(mockDocument.body.appendChild).toHaveBeenCalled();
    });

    it('should only add script once, and if already added set the culture', () => {
      setupTest();
      const config: CookieInformationConfig = { culture: 'en' };
      const mockedScript = {setAttribute: jest.fn()};
      service.init(config);
      mockDocument.getElementById.mockReturnValue(mockedScript);

      service.init({ culture: 'da' });

      expect(mockedScript.setAttribute).toHaveBeenCalledWith('data-culture', 'DA');
      expect(mockDocument.body.appendChild).toHaveBeenCalledTimes(1);
    });
  });

  describe('reInit', () => {
    it('should set culture when not on localhost', () => {
      setupTest();
      const config: CookieInformationConfig = { culture: 'en' };
      const mockedScript = {setAttribute: jest.fn()};
      mockDocument.getElementById.mockReturnValue(mockedScript);

      service.reInit(config);

      expect(mockedScript.setAttribute).toHaveBeenCalledWith('data-culture', 'EN');
    });

    it('should reload consent when not on localhost', () => {
      setupTest();
      const config: CookieInformationConfig = { culture: 'en' };
      service.reInit(config);
      expect(mockWindow.CookieInformation.loadConsent).toHaveBeenCalledTimes(1);
    });
  });

  describe('isConsentGiven', () => {
    it('should return correct consent default status', () => {
      setupTest();

      expect(service.isConsentGiven(COOKIE_CATEGORIES.NECESSARY)).toBe(true);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.FUNCTIONAL)).toBe(false);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.STATISTIC)).toBe(false);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.MARKETING)).toBe(false);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.UNCLASSIFIED)).toBe(false);
    });

    it('should return correct consent status, after changed', () => {
      setupTest();
      service.init({ culture: 'en' });

      const mockEvent = new CustomEvent('CookieInformationConsentGiven', {
        detail: {
          consents: {
            [COOKIE_CATEGORIES.NECESSARY]: true,
            [COOKIE_CATEGORIES.FUNCTIONAL]: false,
            [COOKIE_CATEGORIES.STATISTIC]: false,
            [COOKIE_CATEGORIES.MARKETING]: true,
            [COOKIE_CATEGORIES.UNCLASSIFIED]: false,
          },
        },
      });
      mockWindow.dispatchEvent(mockEvent);

      expect(service.isConsentGiven(COOKIE_CATEGORIES.NECESSARY)).toBe(true);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.FUNCTIONAL)).toBe(false);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.STATISTIC)).toBe(false);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.MARKETING)).toBe(true);
      expect(service.isConsentGiven(COOKIE_CATEGORIES.UNCLASSIFIED)).toBe(false);
    });
  });

  describe('openDialog', () => {
    it('should call CookieInformation.renew, when not localhost', () => {
      setupTest();
      service.openDialog();
      expect(mockWindow.CookieInformation.renew).toHaveBeenCalled();
    });

    it('should NOT call CookieInformation.renew, when localhost', () => {
      setupTest(true);
      service.openDialog();
      expect(mockWindow.CookieInformation.renew).toHaveBeenCalled();
    });
  });

  describe('consentGiven$', () => {
    it('should emit updated consent status', (done) => {
      setupTest();
      service.init({ culture: 'en' });
      const mockEvent = new CustomEvent('CookieInformationConsentGiven', {
        detail: {
          consents: {
            [COOKIE_CATEGORIES.NECESSARY]: true,
            [COOKIE_CATEGORIES.FUNCTIONAL]: true,
            [COOKIE_CATEGORIES.STATISTIC]: true,
            [COOKIE_CATEGORIES.MARKETING]: true,
            [COOKIE_CATEGORIES.UNCLASSIFIED]: true,
          },
        },
      });

      mockWindow.dispatchEvent(mockEvent);

      service.consentGiven$.subscribe((status) => {
        expect(status[COOKIE_CATEGORIES.NECESSARY]).toBe(true);
        expect(status[COOKIE_CATEGORIES.FUNCTIONAL]).toBe(true);
        expect(status[COOKIE_CATEGORIES.STATISTIC]).toBe(true);
        expect(status[COOKIE_CATEGORIES.MARKETING]).toBe(true);
        expect(status[COOKIE_CATEGORIES.UNCLASSIFIED]).toBe(true);
        done();
      });
    });
  });
});
