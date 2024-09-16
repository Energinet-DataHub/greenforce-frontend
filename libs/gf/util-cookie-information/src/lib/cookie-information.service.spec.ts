import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { WindowService } from '@energinet-datahub/gf/util-browser';
import { CookieInformationService } from './cookie-information.service';
import { CookieInformationCulture } from './supported-cultures';

describe('CookieInformationService', () => {
  let mockDocument: jest.Mocked<Pick<Document, 'body' | 'createElement' | 'getElementById' | 'location'>>;
  let appendChildSpy: jest.Mock<Node, [Node]>;
  let removeChildSpy: jest.Mock<Node, [Node]>;
  let createElementSpy: jest.Mock;
  let loadConsentSpy: jest.Mock;

  beforeEach(() => {
    appendChildSpy = jest.fn<Node, [Node]>();
    removeChildSpy = jest.fn<Node, [Node]>();
    createElementSpy = jest.fn().mockImplementation(() => ({
      setAttribute: jest.fn(),
    }));
    loadConsentSpy = jest.fn();

    mockDocument = {
      body: {
        appendChild: appendChildSpy,
        removeChild: removeChildSpy,
      } as unknown as HTMLElement,
      createElement: createElementSpy,
      getElementById: jest.fn(),
      location: {
        hostname: 'example.com',
      } as Location,
    };
  });

  describe('with defined window (Client)', () => {
    let service: CookieInformationService;
    let mockWindowService: { nativeWindow: Window };

    beforeEach(() => {
      mockWindowService = {
        nativeWindow: {
          CookieInformation: {
            loadConsent: loadConsentSpy,
          },
        } as unknown as Window,
      };

      TestBed.configureTestingModule({
        providers: [
          CookieInformationService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: WindowService, useValue: mockWindowService },
        ],
      });

      service = TestBed.inject(CookieInformationService);
    });

    describe('init', () => {
      it('should not add script when on localhost', () => {
        mockDocument.location.hostname = 'localhost';
        service.init({ culture: 'en' });
        expect(createElementSpy).not.toHaveBeenCalled();
        expect(appendChildSpy).not.toHaveBeenCalled();
      });

      it.each<CookieInformationCulture>(['en', 'da'])(
        'should add script to body with correct attributes for culture %s',
        (culture) => {
          service.init({ culture });

          expect(createElementSpy).toHaveBeenCalledWith('script');
          expect(appendChildSpy).toHaveBeenCalledTimes(1);

          const createdScript = createElementSpy.mock.results[0].value;
          expect(createdScript.id).toBe('CookieConsent');
          expect(createdScript.src).toBe('https://policy.app.cookieinformation.com/uc.js');
          expect(createdScript.setAttribute).toHaveBeenCalledWith('data-culture', culture.toUpperCase());
          expect(createdScript.setAttribute).toHaveBeenCalledWith('data-gcm-version', '2.0');
          expect(createdScript.type).toBe('text/javascript');

          expect(appendChildSpy).toHaveBeenCalledWith(createdScript);
        }
      );
    });

    describe('reInit', () => {
      it('should remove existing script, add new one, and call loadConsent', () => {
        const mockScript = { id: 'CookieConsent' } as HTMLElement;
        mockDocument.getElementById.mockReturnValue(mockScript);

        service.reInit({ culture: 'da' });

        expect(removeChildSpy).toHaveBeenCalledWith(mockScript);
        expect(createElementSpy).toHaveBeenCalledWith('script');
        expect(appendChildSpy).toHaveBeenCalledTimes(1);
        expect(loadConsentSpy).toHaveBeenCalled();

        const createdScript = createElementSpy.mock.results[0].value;
        expect(createdScript.setAttribute).toHaveBeenCalledWith('data-culture', 'DA');
      });
    });
  });

  describe('with undefined window (SSR)', () => {
    let service: CookieInformationService;
    let mockWindowService: { nativeWindow: undefined };

    beforeEach(() => {
      mockWindowService = {
        nativeWindow: undefined,
      };

      TestBed.configureTestingModule({
        providers: [
          CookieInformationService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: WindowService, useValue: mockWindowService },
        ],
      });

      service = TestBed.inject(CookieInformationService);
    });

    describe('reInit', () => {
      it('should not call loadConsent when window is undefined', () => {
        const mockScript = { id: 'CookieConsent' } as HTMLElement;
        mockDocument.getElementById.mockReturnValue(mockScript);

        service.reInit({ culture: 'da' });

        expect(loadConsentSpy).not.toHaveBeenCalled();
      });
    });
  });
});
