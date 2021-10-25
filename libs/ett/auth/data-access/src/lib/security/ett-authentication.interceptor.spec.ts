import { Location } from '@angular/common';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';

import { authenticationInterceptorProvider, EttAuthenticationInterceptor } from './ett-authentication.interceptor';

@Component({
  template: '',
})
class TestAuthComponent {}

describe(EttAuthenticationInterceptor.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAuthComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: ettAuthRoutePath, component: TestAuthComponent },
        ]),
      ],
      providers: [authenticationInterceptorProvider],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    appLocation = TestBed.inject(Location);
  });

  let appLocation: Location;
  let http: HttpClient;
  let httpController: HttpTestingController;

  it('redirects to the login page when the user has not authenticated', async () => {
    const testEndpoint = '/api/test';

    const whenResponse = http.get(testEndpoint).toPromise();
    const response = httpController.expectOne(testEndpoint);
    response.flush(null, {
      status: HttpStatusCode.Unauthorized,
      statusText: 'Unauthorized',
    });
    await whenResponse;

    expect(appLocation.path()).toBe(`/${ettAuthRoutePath}`);
  });
});
