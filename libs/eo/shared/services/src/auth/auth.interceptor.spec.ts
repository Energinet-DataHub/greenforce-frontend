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
import { HttpClient, HttpErrorResponse, HttpStatusCode, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { EoAuthorizationInterceptor, eoAuthorizationInterceptorProvider } from './auth.interceptor';
import { WattToastService } from '@energinet-datahub/watt/toast';

const translocoConfig: TranslocoTestingOptions = {
  langs: { en: {} }, // provide your translations here
};

@Component({
  template: '',
})
class TestDefaultRouteComponent {}

describe(EoAuthorizationInterceptor, () => {
  function sendRequest(): Promise<unknown> {
    return lastValueFrom(http.get(testEndpoint));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDefaultRouteComponent],
      imports: [
        RouterModule.forRoot([
          { path: '', pathMatch: 'full', redirectTo: defaultRoutePath },
          { path: defaultRoutePath, component: TestDefaultRouteComponent },
        ]),
        TranslocoTestingModule.forRoot(translocoConfig),
        MatSnackBarModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        eoAuthorizationInterceptorProvider
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  const defaultRoutePath = 'default';
  let http: HttpClient;
  let httpController: HttpTestingController;
  const testEndpoint = 'https://demo.energytrackandtrace.dk/api';

  describe('Given the user has insufficient permissions', () => {
    function respondWith403Forbidden(errorMessage: string): void {
      const testRequest = httpController.expectOne(testEndpoint);
      testRequest.flush(errorMessage, {
        status: HttpStatusCode.Forbidden,
        statusText: 'Forbidden',
      });
    }

    const dummyResponseErrorMessage = 'Dummy response error';

    it('Then the request is rejected', async () => {
      expect.assertions(2);

      const whenResponse = sendRequest();
      respondWith403Forbidden(dummyResponseErrorMessage);

      await expect(whenResponse).rejects.toBeInstanceOf(HttpErrorResponse);
      await expect(whenResponse).rejects.toEqual(
        expect.objectContaining<Partial<HttpErrorResponse>>({
          error: dummyResponseErrorMessage,
        })
      );
    });

    it('Then an error message is displayed', async () => {
      const snackBar = TestBed.inject(WattToastService);
      jest.spyOn(snackBar, 'open');

      const whenResponse = sendRequest();
      respondWith403Forbidden(dummyResponseErrorMessage);

      await whenResponse.catch(() => {
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Given the user has sufficient permissions', () => {
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
