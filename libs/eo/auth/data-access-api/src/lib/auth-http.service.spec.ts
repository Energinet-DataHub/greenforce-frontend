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
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { MockProvider } from 'ng-mocks';
import { lastValueFrom } from 'rxjs';
import { AuthTermsResponse } from './auth-http.service';

import { AuthHttp, AuthLogoutResponse, AuthOidcLoginResponse } from './auth-http.service';
import { AuthOidcQueryParameterName } from './auth-oidc-query-parameter-name';

function setup() {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  });

  const server = TestBed.inject(HttpTestingController);

  return {
    apiEnvironment: TestBed.inject(eoApiEnvironmentToken),
    client: TestBed.inject(AuthHttp),
    server,
    teardown: () => {
      server.verify();
    },
  };
}

describe(AuthHttp.name, () => {
  describe('getOidcLogin', () => {
    it('the redirect URI query parameter is the specified return URL', () => {
      const { apiEnvironment, client, server, teardown } = setup();
      const fakeResponse: AuthOidcLoginResponse = {
        next_url: 'https://example.com/authentication',
      };
      const expectedAuthAppBaseUrl = 'http://example.com/app';
      const expectedReturnUrl = `${expectedAuthAppBaseUrl}/welcome`;

      lastValueFrom(client.getOidcLogin(expectedAuthAppBaseUrl, expectedReturnUrl));
      const response = server.expectOne(
        (request) =>
          request.url === `${apiEnvironment.apiBase}/auth/oidc/login` && request.method === 'GET'
      );
      response.flush(fakeResponse);

      expect(response.request.params.get(AuthOidcQueryParameterName.FeUrl)).toBe(
        expectedAuthAppBaseUrl
      );
      expect(response.request.params.get(AuthOidcQueryParameterName.ReturnUrl)).toBe(
        expectedReturnUrl
      );
      teardown();
    });

    it('emits the API response', async () => {
      const { apiEnvironment, client, server, teardown } = setup();
      const fakeResponse: AuthOidcLoginResponse = {
        next_url: 'https://example.com/authentication',
      };

      const whenResponse = lastValueFrom(
        client.getOidcLogin(apiEnvironment.apiBase, apiEnvironment.apiBase)
      );
      const response = server.expectOne(
        (request) =>
          request.url === `${apiEnvironment.apiBase}/auth/oidc/login` && request.method === 'GET'
      );
      response.flush(fakeResponse);

      expect(await whenResponse).toEqual(fakeResponse);
      teardown();
    });
  });

  describe('postLogout', () => {
    it('forwards the HttpOnly cookie to a remote API', () => {
      TestBed.configureTestingModule({
        providers: [MockProvider(HttpClient)],
      });
      const angularHttp = TestBed.inject(HttpClient);
      const client = TestBed.inject(AuthHttp);

      lastValueFrom(client.postLogout());

      expect(angularHttp.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({}),
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('emits the API response', async () => {
      const { apiEnvironment, client, server, teardown } = setup();
      const fakeResponse: AuthLogoutResponse = {
        success: true,
      };

      const whenResponse = lastValueFrom(client.postLogout());
      const response = server.expectOne(
        (request) =>
          request.url === `${apiEnvironment.apiBase}/auth/logout` && request.method === 'POST'
      );
      response.flush(fakeResponse);

      expect(await whenResponse).toEqual(fakeResponse);
      teardown();
    });
  });

  describe('getTerms', () => {
    it('Triggers a HTTP request to the specified endpoint url and emits the API response', async () => {
      const { client, server, teardown } = setup();
      const endpointUrl = 'api/auth/terms';
      const fakeResponse: AuthTermsResponse = {
        headline: 'Terms headline',
        terms: 'Terms string',
        version: '1.0',
      };

      const whenResponse = lastValueFrom(client.getTerms());
      const response = server.expectOne(
        (request) => request.url.includes(endpointUrl) && request.method === 'GET'
      );
      response.flush(fakeResponse);

      expect(await whenResponse).toEqual(fakeResponse);
      teardown();
    });
  });
});
