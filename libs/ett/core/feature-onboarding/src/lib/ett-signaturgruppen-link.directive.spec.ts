import { RouterTestingModule } from '@angular/router/testing';
import { render, screen } from '@testing-library/angular';

import { EttSignaturgruppenLinkDirective, EttSignaturGruppenLinkScam } from './ett-signaturgruppen-link.directive';

describe(EttSignaturgruppenLinkDirective.name, () => {
  beforeEach(async () => {
    await render('<a ettSignaturgruppenLink>Signaturgruppen</a>', {
      imports: [EttSignaturGruppenLinkScam, RouterTestingModule],
    });

    link = await screen.findByRole('link');
  });

  let link: HTMLAnchorElement;

  it('the endpoint is OpenID Connect login', () => {
    const actualUrl = new URL(link.href);
    expect(actualUrl.origin + actualUrl.pathname).toBe(
      'http://localhost/api/oidc/login'
    );
  });

  it('the return URL is the current URL', () => {
    const currentUrl = location.href;

    const actualUrl = new URL(link.href);
    expect(actualUrl.searchParams.get('redirect_uri')).toBe(currentUrl);
  });
});
