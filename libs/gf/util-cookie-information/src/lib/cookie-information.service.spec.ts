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
import { WindowService } from '@energinet-datahub/gf/util-browser';
import { CookieInformationService } from './cookie-information.service';
import { CookieInformationCulture } from './supported-cultures';

function setup(config?: {hostname?: string, ssr?: boolean}) {
  const appendChildSpy = jest.fn<Node, [Node]>();
  const removeChildSpy = jest.fn<Node, [Node]>();
  const createElementSpy = jest.fn().mockImplementation(() => ({
    setAttribute: jest.fn(),
  }));
  const loadConsentSpy = jest.fn();

  const mockDocument = {
    body: {
      appendChild: appendChildSpy,
      removeChild: removeChildSpy,
    } as unknown as HTMLElement,
    createElement: createElementSpy,
    getElementById: jest.fn(),
    location: {
      hostname: config?.hostname,
    } as Location,
  };

  const mockWindowService = {
    nativeWindow: config?.ssr ? undefined : {
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
  const service = TestBed.inject(CookieInformationService);

  return({
    service,
    mockDocument,
    createElementSpy,
    appendChildSpy,
    removeChildSpy,
    loadConsentSpy,
  });
}

describe('CookieInformationService', () => {
  it('should not add script when on localhost', () => {
    const {mockDocument, service, createElementSpy} = setup({hostname: 'localhost'});

    mockDocument.location.hostname = 'localhost';
    service.init({ culture: 'en' });

    const createdScript = createElementSpy.mock.results;
    expect(createdScript.length).toBe(0);
  });

  it.each<CookieInformationCulture>(['en', 'da'])(
    'should add script to body with correct attributes for culture %s',
      (culture) => {
        const {service, createElementSpy, appendChildSpy} = setup();

        service.init({ culture });

        expect(createElementSpy).toHaveBeenCalledWith('script');
        expect(appendChildSpy).toHaveBeenCalledTimes(1);

        const createdScript = createElementSpy.mock.results[0].value;
        expect(createdScript.id).toBe('CookieConsent');
        expect(createdScript.src).toBe('https://policy.app.cookieinformation.com/uc.js');
        expect(createdScript.setAttribute).toHaveBeenCalledWith(
          'data-culture',
          culture.toUpperCase()
        );
        expect(createdScript.setAttribute).toHaveBeenCalledWith('data-gcm-version', '2.0');
        expect(createdScript.type).toBe('text/javascript');

        expect(appendChildSpy).toHaveBeenCalledWith(createdScript);
      }
  );

  it('should remove existing script, add new one, and call loadConsent', () => {
    const {service, mockDocument, createElementSpy, appendChildSpy, removeChildSpy, loadConsentSpy} = setup();
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

  it('should not call loadConsent when window is undefined', () => {
    const {service, mockDocument, loadConsentSpy} = setup({ssr: true});
    const mockScript = { id: 'CookieConsent' } as HTMLElement;
    mockDocument.getElementById.mockReturnValue(mockScript);

    service.reInit({ culture: 'da' });

    expect(loadConsentSpy).not.toHaveBeenCalled();
  });
});
