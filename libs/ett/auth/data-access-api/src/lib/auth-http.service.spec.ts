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
import {
  AuthTermsAcceptRequest,
  AuthTermsAcceptResponse,
} from './auth-http.service';
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
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { MockProvider } from 'ng-mocks';
import { lastValueFrom } from 'rxjs';
import { AuthTermsResponse } from './auth-http.service';

import {
  AuthHttp,
  AuthLogoutResponse,
  AuthOidcLoginResponse,
} from './auth-http.service';
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

      lastValueFrom(
        client.getOidcLogin(expectedAuthAppBaseUrl, expectedReturnUrl)
      );
      const response = server.expectOne(
        (request) =>
          request.url === `${apiEnvironment.apiBase}/auth/oidc/login` &&
          request.method === 'GET'
      );
      response.flush(fakeResponse);

      expect(
        response.request.params.get(AuthOidcQueryParameterName.FeUrl)
      ).toBe(expectedAuthAppBaseUrl);
      expect(
        response.request.params.get(AuthOidcQueryParameterName.ReturnUrl)
      ).toBe(expectedReturnUrl);
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
          request.url === `${apiEnvironment.apiBase}/auth/oidc/login` &&
          request.method === 'GET'
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
          request.url === `${apiEnvironment.apiBase}/auth/logout` &&
          request.method === 'POST'
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
        (request) =>
          request.url.includes(endpointUrl) && request.method === 'GET'
      );
      response.flush(fakeResponse);

      expect(await whenResponse).toEqual(fakeResponse);
      teardown();
    });
  });

  describe('postAcceptTerms', () => {
    it('Triggers a HTTP request to the specified endpoint url and emits the API response', async () => {
      const { client, server, teardown } = setup();
      const endpointUrl = 'api/auth/terms/accept';
      const state =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmZV91cmwiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAvIiwicmV0dXJuX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMC9kYXNoYm9hcmQiLCJ0ZXJtc19hY2NlcHRlZCI6ZmFsc2UsInRlcm1zX3ZlcnNpb24iOm51bGwsImlkX3Rva2VuIjoiK0hEUGZjUktrS2tnekU1U2FCSXpBanJ1OXhucGVVUXdhVjNOY1QxRlArL1V1QUhkMDNFMEplSGxIZ0hUSjA2QXhtdHFZeUlUZ1IyUHF2ZVhwQXV1cTlJazdIdSs2WFVnU21HZ3pOZVpxcnZEV2RvWnk3S0lONGZJVlczaDBCRS9nV3hZZXo1c1VFWE5XM3J1UENYc3krR0JPQkk4TWFJelB3RXpBQzVqRWVHWGpsczRxZWlIdjFuWWV0QXlGSm9LellNM1ZVN1BlaEtXT0VpN25wQUpodnl5VDlDMU1OcUpoQXN3SHptTDg1Qll3b2ptSkFmaG1aeUpIcU1pdFNSTnNLTTZmNTB6clFpZ3B2NE5BL2xvaVdpY1I4N3V3UHk5RVZjS0pPdk1qbkh1QkN1cFlVSWI0NisreHpwdDlhZVhHR1E4cmx2MlgxY1ppb01DbVZSSGV1d1FOeDdIVW9JRFhaMzVxbUZjVnpkOENxemViblM2SHVUVlk5THB6Y2ZLNVJTV2pFVmlIT3k1dVgzcnFJNW1UaEFOZXlPWnIzVlA5SitCOTRHbU1rQVhRMzBzNmxPRlFvVkZJV2pzZE5DTEwzOTFaU2Q2cFFYK1NGS1ZwNUJOTDRnN0hnNXIxcVQ4R1F0VlNoK2EyM2FJNDViNktTNnNDOEduUnNSYUR2KzFuWS9LcUEzT1U0N29UREJFTkpnVjYwd1hac0JMdC8xOHZyNklOQ0N1TUt5Q1IvaWZwK2dkTlA3NDN4UjU5cVozNmtWTkRjOXFsTU9iRUcxOC9ERWlrbmMyenRoRFZWVGE3SkRQV3Zhb3VNdHk0TVgvY3Y3N2ZOV0JPZk9LNUJkSysweTZhTlVwNVAzTHRnTVJRNUl3bFdPQk5WUFB6SEJEUTBsdnZnbTR4ZnNqdjR5Q2xIYzlRa0dmeWRZcG5QUldlRElUMzdzRUlrem5ObTdtUDRMSXhGV0FEbXc5WWFYdWZNdVVueFR1MEZUY0FRSGRTemxWVUZXY2ZTa1FaVzJLQVExQU4vVU85ayt3azBRdlROZHU5VmFiWUlwWUF0Mm1iY1dPSVRJTXF3MENWaUNOdzJkRTVyMFp3M2NLSVk0YWJLeCs1VWw4bFBtNGpIRFdzckVuclM2WGZvL1lJSXFSWTFDeFAzbmEzSWJLR2lwbGdPY1pKVnFtYXF1SEpDd2VuTVlxVzhtNEJxYmNYemFsYWtKSFhXNzdZYXI5d2xoVE1jS0JXdDNuWTQwQXJ6OUxyWEJhQUM5VFdubHU4MlpYbCszdWFBTFR4MkFJVEZnNHlzZUVQQ0NPSWNKNGJuSVBpSitZT0VjSllQZmUvTEowQlNySzdEK09ndFhyVXBEcU5Zb2FzWTc4ODVUZVJLSEJySGREQS9iMmNDS0J3TlJoa1NYSjdYK3UwRzhoZXF5ay9GaGx1a2Z2MGpTK2s4SDdhWnBWNExkSGNZVnZHTjNyVGg5UktFUDFnaTNNRmJ5RGtvSWIzV1IzbUhKUGx2Z1Bla01hU1cxMUJzaEpVbXVGclVab0xYNDA1K1VOMmNmRXhhejRHaFJicFpLWGsvTURtaGxoK1UwVjM0Y3A5WUxhcnpEMGJlbGpjaWtiWG1xWFdQTjYweVBPcS94cjJYMWFRVmFYN1Y4V2JUd1ljZ2k4ZGhGS0JXZ3pKVC9oais5Wmo3VzNySUZGb3grSGw5dEtxRTBCbFFWUFhZalNxVTllU0lJS3RScVd5bUljREd3dTVCaVdhYzlKdVU1YjB4V3F0OUlyaWFTM0pycy9EWHVucVpXUlY2b1dEUG9qODQ2bGxlOXVQc3o0MGlvamJxTVdXNldkWGNBZ3MyWThKc3RORjljLzJ4R0lRdDNhN2NTSFVBbXhjS1RzOHU5djBTcWhhdmtvL1ZzQVBSM1hxcUVjdDhoVHdza1ViM1JHZDFOKzdaOTdLWnQ5cUhlREdWZTlzYmRucDJhbGduRnpjb2ZsRmFPUEhLTGxXQXJxTmxYUEdXOGU3Qko1ZkNwdFhROE5DeVRNSzVUQlZUYks4cGVBQVV0SlozS0JHOC9HV1krZVM4NkZMdWFVSmU2QkFDOTRNNmY3aUNIVm50az0iLCJ0aW4iOiIzOTMxNTA0MSIsImlkZW50aXR5X3Byb3ZpZGVyIjoibmVtaWQiLCJleHRlcm5hbF9zdWJqZWN0IjoiYTNsMWJhN2ItNjZjMi00YmJiLWExZGYtNzExODgxNGIzOGFjIn0.zYSy1Dom1t0hXY7f3_HgnH9E7V9FZ0dYRolfIKKjeYk';
      const fakeResponse: AuthTermsAcceptResponse = {
        next_url: 'https://energioprindelse.dk/dashboard?success=1',
      };
      const payload: AuthTermsAcceptRequest = {
        accepted: true,
        state,
        version: '1.0',
      };

      const whenResponse = lastValueFrom(client.postAcceptTerms(payload));
      const response = server.expectOne(
        (request) =>
          request.url.includes(endpointUrl) && request.method === 'POST'
      );
      response.flush(fakeResponse);

      expect(await whenResponse).toEqual(fakeResponse);
      teardown();
    });
  });
});
