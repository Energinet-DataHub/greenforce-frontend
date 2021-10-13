import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthOidcHttp } from '@energinet-datahub/ett/auth/data-access';
import { setUpTestbed } from '@energinet-datahub/ett/shared/test-util-staging';
import { LetModule } from '@rx-angular/template';
import { render, screen } from '@testing-library/angular';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import {
  EttAuthenticationDirective,
  EttAuthenticationScam,
} from './ett-authentication-link.directive';

describe(EttAuthenticationDirective.name, () => {
  beforeAll(() => {
    setUpTestbed({
      destroyAfterEach: false,
    });
  });

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
                  url: `${authenticationUrl}?redirect_uri=${redirectUri}`,
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

      expect(actualUrl.searchParams.get('redirect_uri')).toBe(
        `${baseHref}dashboard`
      );
    });
  });

  describe('When the Auth API is unavailable', () => {
    beforeEach(async () => {
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
    });

    const expectedErrorMessage = 'Test login fails';

    it('emits an error', async () => {
      const error = await screen.findByTestId('error');

      expect(error.textContent).toContain(expectedErrorMessage);
    });
  });
});
