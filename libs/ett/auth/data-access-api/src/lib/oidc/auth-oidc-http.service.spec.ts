/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { lastValueFrom } from 'rxjs';

import { AuthHttp, AuthOidcLoginResponse } from './auth-oidc-http.service';
import { AuthOidcQueryParameterName } from './auth-oidc-query-parameter-name';

describe(AuthHttp.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    apiEnvironment = TestBed.inject(eoApiEnvironmentToken);
    client = TestBed.inject(AuthHttp);
    server = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    server.verify();
  });

  let apiEnvironment: EoApiEnvironment;
  let client: AuthHttp;
  let server: HttpTestingController;

  it('the redirect URI query parameter is the specified return URL', () => {
    const fakeResponse: AuthOidcLoginResponse = {
      url: 'https://example.com/authentication',
    };
    const expectedAuthAppBaseUrl = 'http://example.com/app';
    const expectedReturnUrl = `${expectedAuthAppBaseUrl}/welcome`;

    lastValueFrom(client.getLogin(expectedAuthAppBaseUrl, expectedReturnUrl));
    const response = server.expectOne(
      (request) =>
        request.url === `${apiEnvironment.apiBase}/auth/oidc/login` &&
        request.method === 'GET'
    );
    response.flush(fakeResponse);

    expect(response.request.params.get(AuthOidcQueryParameterName.FeUrl)).toBe(
      expectedAuthAppBaseUrl
    );
    expect(
      response.request.params.get(AuthOidcQueryParameterName.ReturnUrl)
    ).toBe(expectedReturnUrl);
  });
});
