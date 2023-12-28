import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Intentionally use full product name prefix for the root component
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'energy-overview-app',
  styles: [
    ``,
  ],
  template: `<router-outlet />`,
  standalone: true,
  imports: [
    RouterOutlet,
  ],
})
export class EnergyOverviewAppComponent {
  // constructor(private authService: EoAuthService) {
  //   this.authService.checkForExistingToken();
  // }
}
