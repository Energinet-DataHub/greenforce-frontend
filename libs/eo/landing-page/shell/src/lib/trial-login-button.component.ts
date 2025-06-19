import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon'; // If you want an icon
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  selector: 'eo-trial-login-button',
  standalone: true, // Assuming you might be using standalone components
  imports: [TranslocoPipe, WattIconComponent], // Add WattButtonComponent if you use <watt-button>
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="button secondary" (click)="onTrialClick()">
      <watt-icon name="login" /> <!-- Or a more specific icon for trial -->
      {{ translations.loginButton.trial | transloco }}
    </button>
  `,
  // If not standalone, remove standalone: true and add to a module's declarations and exports.
})
export class EoTrialLoginButtonComponent {
  private readonly authService = inject(EoAuthService);
  protected readonly translations = translations;

  onTrialClick(): void {
    this.authService.onTrialButtonClick();
  }
}
