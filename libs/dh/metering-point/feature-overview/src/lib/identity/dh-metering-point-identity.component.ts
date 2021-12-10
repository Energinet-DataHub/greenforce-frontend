import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';

import { DhMeteringPointPresenter } from '../dh-metering-point-overview.presenter';
import { DhMeteringPointStatusBadgeScam } from '../status-badge/dh-metering-point-status-badge.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-identity',
  styleUrls: ['./dh-metering-point-identity.component.scss'],
  templateUrl: './dh-metering-point-identity.component.html',
})
export class DhMeteringPointIdentityComponent {
  translationKeys$ = this.presenter.translationKeys$;
  emDash = '—';

  @Input() meteringPoint: MeteringPointCimDto | undefined;

  constructor(private presenter: DhMeteringPointPresenter) {}
}

@NgModule({
  declarations: [DhMeteringPointIdentityComponent],
  exports: [DhMeteringPointIdentityComponent],
  imports: [
    DhMeteringPointStatusBadgeScam,
    CommonModule,
    LetModule,
    TranslocoModule,
  ],
})
export class DhMeteringPointIdentityScam {}
