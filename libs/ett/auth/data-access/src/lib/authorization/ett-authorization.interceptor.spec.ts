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
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';

import {
  EttAuthorizationInterceptor,
  ettAuthorizationInterceptorProvider,
} from './ett-authorization.interceptor';

@Component({
  template: '',
})
class TestAuthComponent {}

describe(EttAuthorizationInterceptor.name, () => {
  function sendRequest(): Promise<unknown> {
    return http.get(testEndpoint).toPromise();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAuthComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: ettAuthRoutePath, component: TestAuthComponent },
        ]),
      ],
      providers: [ettAuthorizationInterceptorProvider],
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

    it('Then they are redirected to the login page', async () => {
      expect.assertions(1);

      const whenResponse = sendRequest();
      respondWith403Forbidden(dummyResponseErrorMessage);

      await whenResponse.catch(() =>
        expect(appLocation.path()).toBe(`/${ettAuthRoutePath}`)
      );
    });
  });

  describe('Given the user is authenticated', () => {
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
