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
import { RouterTestingModule } from '@angular/router/testing';
import { AuthOidcHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { LetModule } from '@rx-angular/template';
import { render, screen } from '@testing-library/angular';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import {
  EttAuthenticationDirective,
  EttAuthenticationScam,
} from './ett-authentication-link.directive';

describe(EttAuthenticationDirective.name, () => {
  describe('When the Auth API is available', () => {
    beforeEach(async () => {
      await render(
        `
          <ng-container ettAuthenticationLink #link="ettAuthenticationLink">
            <a *rxLet="link.loginUrl$ as loginUrl" [href]="loginUrl">
              Login test
            </a>
          </ng-container>
        `,
        {
          imports: [EttAuthenticationScam, RouterTestingModule, LetModule],
          providers: [
            MockProvider(AuthOidcHttp, {
              login: (redirectUri) =>
                of({
                  url: `${authenticationUrl}?return_url=${redirectUri}`,
                }),
            }),
          ],
        }
      );

      link = await screen.findByRole('link');
    });

    const authenticationUrl = 'https://example.com/test-authentication';
    let link: HTMLAnchorElement;

    it('links to the authentication URL', async () => {
      const actualUrl = new URL(link.href);

      expect(actualUrl.origin + actualUrl.pathname).toBe(authenticationUrl);
    });

    it('returns to dashboard when login is successful', async () => {
      const baseHref = TestBed.inject(APP_BASE_HREF);
      const actualUrl = new URL(link.href);

      expect(actualUrl.searchParams.get('return_url')).toBe(
        `${baseHref}dashboard`
      );
    });
  });

  describe('When the Auth API is unavailable', () => {
    it('emits an error', async () => {
      const expectedErrorMessage = 'Test login fails';

      await render(
        `
          <ng-container ettAuthenticationLink #link="ettAuthenticationLink">
            <a *rxLet="link.loginUrl$ as loginUrl; rxError: loginError" [href]="loginUrl">
              Login test
            </a>

            <ng-template #loginError let-error="$error">
              <p data-testid="error">{{ error }}</p>
            </ng-template>
          </ng-container>
        `,
        {
          imports: [EttAuthenticationScam, RouterTestingModule, LetModule],
          providers: [
            MockProvider(AuthOidcHttp, {
              login: () => throwError(new Error(expectedErrorMessage)),
            }),
          ],
        }
      );

      const error = await screen.findByTestId('error');
      expect(error.textContent).toContain(expectedErrorMessage);
    });
  });
});
