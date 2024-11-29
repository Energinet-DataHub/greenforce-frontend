import { Component, inject, OnInit } from '@angular/core';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  standalone: true,
  selector: 'eo-login',
  imports: [WattSpinnerComponent],
  styles: [
    `
      .spinner {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  template: `<div class="spinner"><watt-spinner /></div>`,
})
export class EoLoginComponent implements OnInit {
  private readonly authService: EoAuthService = inject(EoAuthService);

  ngOnInit(): void {
    this.authService.login();
  }
}
