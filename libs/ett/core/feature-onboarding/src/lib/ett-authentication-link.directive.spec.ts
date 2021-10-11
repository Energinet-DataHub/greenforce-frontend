import { RouterTestingModule } from '@angular/router/testing';
import { EttBrowserConfigurationModule } from '@energinet-datahub/ett/core/util-browser';
import { LetModule } from '@rx-angular/template';
import { render, screen } from '@testing-library/angular';

import { AuthOidcStubModule } from './auth-oidc-stub.service';
import { EttAuthenticationDirective, EttAuthenticationScam } from './ett-authentication-link.directive';

describe(EttAuthenticationDirective.name, () => {
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
        imports: [
          EttAuthenticationScam,
          EttBrowserConfigurationModule,
          RouterTestingModule,
          LetModule,
          AuthOidcStubModule.withAuthenticationUrl(authenticationUrl),
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
    const actualUrl = new URL(link.href);

    expect(actualUrl.searchParams.get('redirect_uri')).toBe(
      'http://localhost/dashboard'
    );
  });
});
