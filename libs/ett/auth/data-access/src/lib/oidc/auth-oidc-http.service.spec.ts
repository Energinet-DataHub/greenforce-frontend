import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthOidcHttp, AuthOidcLoginResponse } from './auth-oidc-http.service';

describe(AuthOidcHttp.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    client = TestBed.inject(AuthOidcHttp);
    server = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    server.verify();
  });

  let client: AuthOidcHttp;
  let server: HttpTestingController;

  it('the redirect URI query parameter is the specified return URL', () => {
    const fakeResponse: AuthOidcLoginResponse = {
      url: 'https://example.com/authentication',
    };
    const expectedReturnUrl = 'http://example.com/app';

    client.login(expectedReturnUrl).toPromise();
    const response = server.expectOne(
      (request) => request.url === '/api/oidc/login' && request.method === 'GET'
    );
    response.flush(fakeResponse);

    expect(response.request.params.get('redirect_uri')).toBe(expectedReturnUrl);
  });
});
