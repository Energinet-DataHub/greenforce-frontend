import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import {
  WattButtonModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

import { dhMeteringPointPath } from '../routing/dh-metering-point-path';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-not-found',
  templateUrl: './dh-metering-point-not-found.component.html',
})
export class DhMeteringPointNotFoundComponent {
  constructor(private router: Router) {}

  goToSearch(): void {
    const url = this.router.createUrlTree([dhMeteringPointPath, 'search']);

    this.router.navigateByUrl(url);
  }
}

@NgModule({
  declarations: [DhMeteringPointNotFoundComponent],
  exports: [DhMeteringPointNotFoundComponent],
  imports: [TranslocoModule, WattButtonModule, WattEmptyStateModule],
})
export class DhMeteringPointNotFoundScam {}
