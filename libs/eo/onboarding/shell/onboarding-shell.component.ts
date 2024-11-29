import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  standalone: true,
  selector: 'eo-onboarding-shell',
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
export class EoOnboardingShellComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clientId: string | null = null;

  ngOnInit() {
    const thirdPartyClientId = this.route.snapshot.queryParamMap.get('client-id');
    const redirectUrl = this.route.snapshot.queryParamMap.get('redirect-url');

    if (!thirdPartyClientId || !redirectUrl) return;

    this.router.navigate(['/consent'], {
      queryParams: {
        'third-party-client-id': thirdPartyClientId,
        'redirect-url': redirectUrl,
      },
    });
  }
}
