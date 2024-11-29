import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

interface State {
  thirdPartyClientId: string;
  redirectUrl: string;
}

@Component({
  standalone: true,
  selector: 'eo-signin-callback',
  imports: [WattSpinnerComponent],
  styles: `
    :host {
      height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  template: ` <watt-spinner /> `,
})
export class EoSigninCallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService: EoAuthService = inject(EoAuthService);
  private readonly transloco = inject(TranslocoService);

  ngOnInit() {
    this.authService
      .signinCallback()
      .then((user) => {
        if (!user) return;
        if (!user.id_token) return;

        const thirdPartyClientId = (user.state as State)?.thirdPartyClientId;
        const redirectUrl = (user.state as State)?.redirectUrl;

        // Redirect to the on-boarding flow, redirect URL or fallback to the dashboard
        if (thirdPartyClientId) {
          this.router.navigate(['/consent'], {
            queryParams: {
              'third-party-client-id': thirdPartyClientId,
              'redirect-url': redirectUrl,
            },
          });
        } else if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigate([this.transloco.getActiveLang(), 'dashboard']);
        }
      })
      .catch((error) => {
        this.authService.login(error.state);
      });
  }
}
