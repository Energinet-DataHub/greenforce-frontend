import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Intentionally use full product name prefix for the root component
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'energy-origin-app',
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        min-width: 375px; // Magic UX number
        background: var(--watt-color-neutral-grey-100);
      }
    `,
  ],
  template: `<router-outlet />`,
  standalone: true,
  imports: [
    MatDatepickerModule,
    RouterOutlet,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class EnergyOriginAppComponent {
  constructor(private authService: EoAuthService) {
    this.authService.checkForExistingToken();
  }
}
