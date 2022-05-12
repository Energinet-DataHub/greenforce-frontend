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
import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  AuthHttp,
  AuthOidcQueryParameterName,
} from '@energinet-datahub/eo/auth/data-access-api';
import { MockProvider } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { EoLandingPageStore } from './eo-landing-page.store';

describe(EoLandingPageStore.name, () => {
  describe('Given the Auth API is available', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          EoLandingPageStore,
          MockProvider(AuthHttp, {
            getOidcLogin: (_feUrl, returnUrl) =>
              of({
                next_url: `${authenticationUrl}?${AuthOidcQueryParameterName.ReturnUrl}=${returnUrl}`,
              }),
          }),
        ],
      });

      store = TestBed.inject(EoLandingPageStore);
      actualUrl = new URL(await firstValueFrom(store.authenticationUrl$));
    });

    const authenticationUrl = 'https://example.com/test-authentication';
    let actualUrl: URL;
    let store: EoLandingPageStore;

    it('Then a link to the authentication URL is displayed', async () => {
      expect(actualUrl.origin + actualUrl.pathname).toBe(authenticationUrl);
    });

    it(`Then the specified return url is equal to the dashboard page`, async () => {
      const baseHref = TestBed.inject(APP_BASE_HREF);

      expect(
        actualUrl.searchParams.get(AuthOidcQueryParameterName.ReturnUrl)
      ).toBe(`${baseHref}dashboard`);
    });
  });
});
