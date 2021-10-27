import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EttAuthorizationInterceptor, ettAuthorizationInterceptorProvider } from './ett-authorization.interceptor';

@Component({
  template: '',
})
class TestDefaultRouteComponent {}

describe(EttAuthorizationInterceptor.name, () => {
  function sendRequest(): Promise<unknown> {
    return http.get(testEndpoint).toPromise();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDefaultRouteComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', pathMatch: 'full', redirectTo: defaultRoutePath },
          { path: defaultRoutePath, component: TestDefaultRouteComponent },
        ]),
        NoopAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [ettAuthorizationInterceptorProvider],
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

    it('Then an error message is displayed', async () => {
      const snackBar = TestBed.inject(MatSnackBar);
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
