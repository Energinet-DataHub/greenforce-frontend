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
import { Location } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { eoLandingPageRelativeUrl } from '@energinet-datahub/eo/landing-page/routing';
import { lastValueFrom } from 'rxjs';

import {
  EoAuthenticationInterceptor,
  eoAuthenticationInterceptorProvider,
} from './eo-authentication.interceptor';

@Component({
  template: '',
})
class TestAuthComponent {}

describe(EoAuthenticationInterceptor.name, () => {
  function sendRequest(): Promise<unknown> {
    return lastValueFrom(http.get(testEndpoint));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAuthComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: TestAuthComponent },
        ]),
      ],
      providers: [eoAuthenticationInterceptorProvider],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    appLocation = TestBed.inject(Location);
  });

  afterEach(() => {
    httpController.verify();
  });

  let appLocation: Location;
  let http: HttpClient;
  let httpController: HttpTestingController;
  const testEndpoint = '/api/test';

  describe(`
    Given the user has not authenticated
    Or their credentials have expired`, () => {
    function respondWith401Unauthorized(errorMessage: string): void {
      const testRequest = httpController.expectOne(testEndpoint);
      testRequest.flush(errorMessage, {
        status: HttpStatusCode.Unauthorized,
        statusText: 'Unauthorized',
      });
    }

    const dummyResponseErrorMessage = 'Dummy response error';

    it('Then the request is rejected', async () => {
      expect.assertions(2);

      const whenResponse = sendRequest();
      respondWith401Unauthorized(dummyResponseErrorMessage);

      await expect(whenResponse).rejects.toBeInstanceOf(HttpErrorResponse);
      await expect(whenResponse).rejects.toEqual(
        expect.objectContaining<Partial<HttpErrorResponse>>({
          error: dummyResponseErrorMessage,
        })
      );
    });

    it('Then they are redirected to the login page', async () => {
      expect.assertions(1);

      const whenResponse = sendRequest();
      respondWith401Unauthorized(dummyResponseErrorMessage);

      await whenResponse.catch(() =>
        expect(appLocation.path()).toBe(eoLandingPageRelativeUrl)
      );
    });
  });

  describe('Given the user has authenticated', () => {
    function respondWith200Ok(body: string): void {
      const testRequest = httpController.expectOne(testEndpoint);
      testRequest.flush(body);
    }

    it('Then the request passes', async () => {
      expect.assertions(1);
      const dummySuccess = 'Dummy success response value';

      const whenResponse = sendRequest();
      respondWith200Ok(dummySuccess);

      await expect(whenResponse).resolves.toBe(dummySuccess);
    });
  });
});
