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
import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  AuthOidcHttp,
  AuthOidcQueryParameterName,
} from '@energinet-datahub/ett/auth/data-access-api';
import { render, screen } from '@testing-library/angular';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import {
  EttAuthenticationLinkComponent,
  EttAuthenticationLinkScam,
} from './ett-authentication-link.component';

describe(EttAuthenticationLinkComponent.name, () => {
  describe('Given the Auth API is available', () => {
    beforeEach(async () => {
      await render(EttAuthenticationLinkComponent, {
        imports: [EttAuthenticationLinkScam],
        providers: [
          MockProvider(AuthOidcHttp, {
            login: (returnUrl) =>
              of({
                url: `${authenticationUrl}?${AuthOidcQueryParameterName.ReturnUrl}=${returnUrl}`,
              }),
          }),
        ],
      });

      link = await screen.findByRole('link');
    });

    const authenticationUrl = 'https://example.com/test-authentication';
    let link: HTMLAnchorElement;

    it('Then a link to the authentication URL is displayed', async () => {
      const actualUrl = new URL(link.href);

      expect(actualUrl.origin + actualUrl.pathname).toBe(authenticationUrl);
    });

    it(`
      When user authentiaction is successful
      Then the user is redirected to the dashboard`, async () => {
      const baseHref = TestBed.inject(APP_BASE_HREF);
      const actualUrl = new URL(link.href);

      expect(
        actualUrl.searchParams.get(AuthOidcQueryParameterName.ReturnUrl)
      ).toBe(`${baseHref}dashboard`);
    });
  });

  describe('Given the Auth API is unavailable', () => {
    it('Then an error message is displayed', async () => {
      await render(EttAuthenticationLinkComponent, {
        imports: [EttAuthenticationLinkScam],
        providers: [
          MockProvider(AuthOidcHttp, {
            login: () => throwError(new Error('Dummy error message')),
          }),
        ],
      });

      const error = await screen.findByText(/unavailable/i);
      expect(error).toHaveTextContent(/please try again later/i);
    });
  });
});
